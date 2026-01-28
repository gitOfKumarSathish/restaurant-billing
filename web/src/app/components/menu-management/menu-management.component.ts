import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import { Menu } from '../../models/menu.model';

@Component({
    selector: 'app-menu-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './menu-management.component.html',
    styleUrls: ['./menu-management.component.css']
})
export class MenuManagementComponent implements OnInit {
    menuItems: Menu[] = [];
    isModalOpen: boolean = false;
    isEditing: boolean = false;
    isLoading: boolean = false;
    currentMenuItem: Partial<Menu> = {
        itemName: '',
        itemPrice: 0,
        availabilityStatus: true,
        description: ''
    };

    constructor(
        private menuService: MenuService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        console.log('MenuManagementComponent initialized');
        this.loadMenu();
    }

    loadMenu(): void {
        console.log('MenuManagement calling loadMenu...');
        this.menuService.getAllMenuItems().subscribe({
            next: (items) => {
                console.log('MenuManagement items:', items);
                this.menuItems = items;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Failed to load menu', err)
        });
    }

    openModal(item?: Menu): void {
        this.isModalOpen = true;
        if (item) {
            this.isEditing = true;
            this.currentMenuItem = { ...item };
        } else {
            this.isEditing = false;
            this.currentMenuItem = {
                itemName: '',
                itemPrice: 0,
                availabilityStatus: true,
                description: ''
            };
        }
    }

    closeModal(): void {
        this.isModalOpen = false;
    }

    saveMenuItem(): void {
        this.isLoading = true;
        if (this.isEditing && this.currentMenuItem._id) {
            this.menuService.updateMenuItem(this.currentMenuItem._id, this.currentMenuItem).subscribe({
                next: () => {
                    this.loadMenu();
                    this.closeModal();
                    this.isLoading = false;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    alert('Failed to update item');
                    this.isLoading = false;
                    this.cdr.detectChanges();
                }
            });
        } else {
            this.menuService.createMenuItem(this.currentMenuItem as Omit<Menu, '_id'>).subscribe({
                next: () => {
                    this.loadMenu();
                    this.closeModal();
                    this.isLoading = false;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    alert('Failed to create item');
                    this.isLoading = false;
                    this.cdr.detectChanges();
                }
            });
        }
    }

    deleteMenuItem(id: string): void {
        if (confirm('Are you sure you want to delete this item?')) {
            this.menuService.deleteMenuItem(id).subscribe({
                next: () => this.loadMenu(),
                error: (err) => alert('Failed to delete item')
            });
        }
    }
}
