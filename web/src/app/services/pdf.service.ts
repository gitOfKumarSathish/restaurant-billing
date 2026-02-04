import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OrderResponse } from '../models/order.model';

@Injectable({
    providedIn: 'root'
})
export class PdfService {

    constructor() { }

    generateReceipt(order: OrderResponse): void {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        // Header
        doc.setFontSize(22);
        doc.text('GourmetPOS', pageWidth / 2, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Restaurant & Grill', pageWidth / 2, 28, { align: 'center' });
        doc.text('123 Food Street, Tasty City', pageWidth / 2, 34, { align: 'center' });

        // Line Separator
        doc.setLineWidth(0.5);
        doc.line(10, 40, pageWidth - 10, 40);

        // Order Info
        doc.setFontSize(10);
        doc.text(`Order ID: ${order.orderId}`, 14, 50);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 56);

        // Items Table
        const tableBody = order.items.map(item => [
            item.itemName,
            item.quantity,
            `INR ${item.price.toFixed(2)}`,
            `INR ${item.total.toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: 65,
            head: [['Item Name', 'Qty', 'Price', 'Total']],
            body: tableBody,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
        });

        // Totals
        // @ts-ignore
        const finalY = doc.lastAutoTable.finalY + 10;

        doc.text(`Total Price:`, 140, finalY);
        doc.text(`INR ${order.totalPrice.toFixed(2)}`, 195, finalY, { align: 'right' });

        if (order.discounts && order.discounts.available) {
            doc.text(`Discount (${order.discounts.percentage}%):`, 140, finalY + 6);
            const discountAmount = order.totalPrice - order.grandTotal;
            doc.text(`INR ${discountAmount.toFixed(2)}`, 195, finalY + 6, { align: 'right' });
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Grand Total:`, 140, finalY + 14);
        doc.text(`INR ${order.grandTotal.toFixed(2)}`, 195, finalY + 14, { align: 'right' });

        // Footer
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Thank you for dining with us!', pageWidth / 2, finalY + 30, { align: 'center' });

        // Save
        doc.save(`Receipt_${order.orderId}.pdf`);
    }
}
