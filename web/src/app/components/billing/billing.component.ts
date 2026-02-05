import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { OrderService } from '../../services/order.service';
import { PdfService } from '../../services/pdf.service';
import { Menu } from '../../models/menu.model';
import { OrderItemRequest } from '../../models/order.model';

interface CartItem extends Menu {
    quantity: number;
}

@Component({
    selector: 'app-billing',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
    menuItems: Menu[] = [];
    cart: CartItem[] = [];
    discountPercentage: number = 0;
    discountAvailable: boolean = false;
    isLoading: boolean = false;
    error: string = '';

    constructor(
        private menuService: MenuService,
        private orderService: OrderService,
        private pdfService: PdfService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadMenu();
    }

    loadMenu(): void {
        this.isLoading = true;
        this.error = '';

        this.menuService.getAllMenuItems().subscribe({
            next: (items) => {
                this.menuItems = items || [];
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to load menu:', err);
                this.error = 'Unable to load menu items. Please check your connection or try again.';
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    addToCart(item: Menu): void {
        const existing = this.cart.find(i => i._id === item._id);
        if (existing) {
            existing.quantity++;
        } else {
            this.cart.push({ ...item, quantity: 1 });
        }
    }

    removeFromCart(index: number): void {
        this.cart.splice(index, 1);
    }

    updateQuantity(index: number, change: number): void {
        const item = this.cart[index];
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            this.removeFromCart(index);
        }
    }

    get totalAmount(): number {
        return this.cart.reduce((acc, item) => acc + (item.itemPrice * item.quantity), 0);
    }

    get grandTotal(): number {
        if (this.discountAvailable && this.discountPercentage > 0) {
            return this.totalAmount - (this.totalAmount * (this.discountPercentage / 100));
        }
        return this.totalAmount;
    }

    placeOrder(): void {
        if (this.cart.length === 0) return;
        this.isLoading = true;

        const orderItems: OrderItemRequest[] = this.cart.map(i => ({
            id: i._id,
            quantity: i.quantity
        }));

        const orderRequest = {
            items: orderItems,
            discounts: {
                available: this.discountAvailable,
                percentage: this.discountPercentage
            }
        };

        this.orderService.createOrder(orderRequest).subscribe({
            next: (res) => {
                this.isLoading = false;
                this.cart = [];
                this.discountPercentage = 0;
                this.discountAvailable = false;
                // Generate Receipt
                this.pdfService.generateReceipt(res.data);

                this.cdr.detectChanges();
                alert('Order placed successfully! Order ID: ' + res.data.orderId);
            },
            error: (err) => {
                console.error('Order failed', err);
                this.isLoading = false;
                this.cdr.detectChanges();
                alert('Failed to place order.');
            }
        });
    }
}
