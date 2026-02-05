import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderRequest, OrderResponse } from '../models/order.model';


export interface DashboardStats {
    date: string;
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    totalDiscountGiven: number;
    topSellingItems: Array<{
        itemName: string;
        quantity: number;
        revenue: number;
    }>;
    peakHours: Array<{
        hour: string; // e.g., "13:00"
        orderCount: number;
    }>;
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = '/api/orders';

    constructor(private http: HttpClient) { }

    createOrder(order: OrderRequest): Observable<{ message: string, data: OrderResponse }> {
        return this.http.post<{ message: string, data: OrderResponse }>(this.apiUrl, order);
    }

    getOrderById(id: string): Observable<{ message: string, data: OrderResponse }> {
        return this.http.get<{ message: string, data: OrderResponse }>(`${this.apiUrl}/${id}`);
    }

    getDashboardStats(date?: string): Observable<{ message: string, data: DashboardStats }> {
        const url = date ? `${this.apiUrl}/stats?date=${date}` : `${this.apiUrl}/stats`;
        return this.http.get<{ message: string, data: DashboardStats }>(url);
    }

    getAllOrders(): Observable<{ message: string, data: OrderResponse[] }> {
        return this.http.get<{ message: string, data: OrderResponse[] }>(`${this.apiUrl}/all`);
    }
}
