import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Menu } from '../models/menu.model';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private apiUrl = '/menu'; // Proxy handles the domain

    constructor(private http: HttpClient) { }

    getAllMenuItems(): Observable<Menu[]> {
        return this.http.get<{ message: string, data: Menu[] }>(this.apiUrl)
            .pipe(
                tap(res => console.log('Raw API Response:', res)),
                map(response => response.data || [])
            );
    }

    getMenuItemById(id: string): Observable<Menu> {
        return this.http.get<Menu>(`${this.apiUrl}/${id}`);
    }

    createMenuItem(item: Omit<Menu, '_id'>): Observable<Menu> {
        return this.http.post<Menu>(this.apiUrl, item);
    }

    updateMenuItem(id: string, item: Partial<Menu>): Observable<Menu> {
        return this.http.put<Menu>(`${this.apiUrl}/${id}`, item);
    }

    deleteMenuItem(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
