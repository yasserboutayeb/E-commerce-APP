import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';
import { Router, RouterLink } from '@angular/router';
import { catchError, of, finalize } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
  imports: [NgIf, NgFor, CommonModule, RouterLink]
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  isLoading = true;
  error: string | null = null;
  currentUserEmail: string | null = null;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  private checkAuthentication(): void {
    if (!this.authService.isAuthenticated()) {
      this.handleNotAuthenticated();
      return;
    }
    this.currentUserEmail = this.authService.getCurrentUserEmail();
    this.loadOrders();
  }

  loadOrders(): void {
    if (!this.currentUserEmail) {
      this.error = 'User email not available';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.orderService.getOrdersByUser(this.currentUserEmail)
      .pipe(
        catchError(err => {
          this.handleError(err);
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(orders => {
        this.orders = orders;
      });
  }

  private handleNotAuthenticated(): void {
    this.error = 'Please login to view your orders';
    this.isLoading = false;
    // Redirect after 2 seconds
    setTimeout(() => {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/orders' }
      });
    }, 2000);
  }

  private handleError(error: any): void {
    console.error('Order history error:', error);
    this.error = this.getErrorMessage(error);
  }

  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Session expired. Please login again.';
    } else if (error.status === 404) {
      return 'No orders found for your account.';
    } else if (error.status === 0) {
      return 'Server unavailable. Please try again later.';
    }
    return 'Failed to load orders. Please try again.';
  }

  refresh(): void {
    this.loadOrders();
  }

  safeParseItems(items: string): any[] {
    try {
      return items ? JSON.parse(items) : [];
    } catch (e) {
      console.error('Error parsing items:', e);
      return [{
        product: { name: 'Unknown Item', price: 0, sku: 'N/A' },
        quantity: 1
      }];
    }
  }
}