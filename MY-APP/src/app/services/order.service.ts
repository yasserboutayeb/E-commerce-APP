import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order } from '../Modules/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8090/orders'; 

  constructor(private http: HttpClient) {}

  createOrder(order: Order): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }

  getOrdersByUser(email: string): Observable<Order[]> {
    return this.http.get<Order[]>(
        `${this.apiUrl}/user/${encodeURIComponent(email)}`,
        { withCredentials: true }  // Important for sending cookies/auth tokens
    ).pipe(
        catchError(error => {
            console.error('Order fetch error:', error);
            return throwError(() => new Error(
                error.status === 403 
                    ? 'Access denied' 
                    : 'Failed to fetch orders'
            ));
        })
    );
}
}