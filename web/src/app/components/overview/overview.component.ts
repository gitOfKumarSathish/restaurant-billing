import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, DashboardStats } from '../../services/order.service';
import { PdfService } from '../../services/pdf.service';

@Component({
    selector: 'app-overview',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
    stats: DashboardStats | null = null;
    selectedDate: string = new Date().toISOString().split('T')[0]; // Default to today
    isLoading: boolean = false;
    printOrderId: string = '';
    printError: string = '';
    printLoading: boolean = false;

    constructor(
        private orderService: OrderService,
        private pdfService: PdfService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.fetchStats();
    }

    fetchStats(): void {
        this.isLoading = true;

        this.orderService.getDashboardStats(this.selectedDate).subscribe({
            next: (res) => {
                this.stats = res.data;
                this.isLoading = false;
                this.cd.detectChanges();
            },
            error: (err) => {
                console.error('Failed to fetch stats', err);
                this.isLoading = false;
                this.cd.detectChanges();
            }
        });
    }

    onDateChange(): void {
        this.fetchStats();
    }

    printInvoice(): void {
        if (!this.printOrderId.trim()) return;

        this.printLoading = true;
        this.printError = '';

        this.orderService.getOrderById(this.printOrderId).subscribe({
            next: (res) => {
                this.pdfService.generateReceipt(res.data);
                this.printLoading = false;
                this.printOrderId = ''; // Clear input on success
            },
            error: (err) => {
                console.error('Print failed', err);
                this.printError = 'Order not found';
                this.printLoading = false;
            }
        });
    }
}
