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
    searchId: string = '';
    order: OrderResponse | null = null;
    isLoading: boolean = false;
    error: string = '';

    constructor(
        private orderService: OrderService,
        private pdfService: PdfService,
        private cd: ChangeDetectorRef
    ) { }

    searchOrder(): void {
        if (!this.searchId.trim()) return;

        this.isLoading = true;
        this.error = '';
        this.order = null;

        this.orderService.getOrderById(this.searchId).subscribe({
            next: (res) => {
                this.order = res.data;
                console.log("order", this.order);
                this.isLoading = false;
                this.cd.detectChanges();
            },
            error: (err) => {
                console.error('Search failed', err);
                this.error = 'Order not found. Please check the ID.';
                this.isLoading = false;
                this.cd.detectChanges();
            }
        });
    }

    downloadReceipt(): void {
        if (this.order) {
            this.pdfService.generateReceipt(this.order);
        }
    }
}
