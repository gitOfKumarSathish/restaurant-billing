import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { PdfService } from '../../services/pdf.service';
import { OrderResponse } from '../../models/order.model';

@Component({
    selector: 'app-order-history',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {
    orders: OrderResponse[] = [];
    filteredOrders: OrderResponse[] = [];
    searchId: string = '';

    selectedOrder: OrderResponse | null = null;
    isModalOpen: boolean = false;

    isLoading: boolean = false;
    error: string = '';

    constructor(
        private orderService: OrderService,
        private pdfService: PdfService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.fetchAllOrders();
    }

    fetchAllOrders(): void {
        this.isLoading = true;
        this.orderService.getAllOrders().subscribe({
            next: (res) => {
                this.orders = res.data || [];
                this.filteredOrders = this.orders;
                this.isLoading = false;
                this.cd.detectChanges();
            },
            error: (err) => {
                console.error('Failed to fetch orders', err);
                this.error = 'Failed to load order history.';
                this.isLoading = false;
                this.cd.detectChanges();
            }
        });
    }

    filterOrders(): void {
        if (!this.searchId.trim()) {
            this.filteredOrders = this.orders;
        } else {
            const query = this.searchId.toLowerCase().trim();
            this.filteredOrders = this.orders.filter(order =>
                order.orderId.toLowerCase().includes(query)
            );
        }
    }

    viewOrder(order: OrderResponse): void {
        this.selectedOrder = order;
        this.isModalOpen = true;
    }

    closeModal(): void {
        this.isModalOpen = false;
        this.selectedOrder = null;
    }

    downloadReceipt(order: OrderResponse): void {
        this.pdfService.generateReceipt(order);
    }
}
