import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderRequest, OrderResponse } from '../models/order.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = '/orders';

    constructor(private http: HttpClient) { }

    createOrder(order: OrderRequest): Observable<{ message: string, data: OrderResponse }> {
        return this.http.post<{ message: string, data: OrderResponse }>(this.apiUrl, order);
    }

    getOrderById(id: string): Observable<{ message: string, data: OrderResponse }> {
        return this.http.get<{ message: string, data: OrderResponse }>(`${this.apiUrl}/${id}`);
    }
}
