import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../Modules/User';
import { Product } from '../Modules/Product';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8090/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<string | null>(this.getStoredRole());
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.apiUrl}/login`, { email, password }).subscribe({
        next: (response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('email', response.email);
            localStorage.setItem('expiresAt', response.expiresAt.toString());
            localStorage.setItem('role', response.role);
            this.isAuthenticatedSubject.next(true);
            this.userRoleSubject.next(response.role);
          }
          observer.next(response);
          observer.complete();
        },
        error: (err) => {
          const errorMessage = this.handleError(err);
          observer.error({ message: errorMessage });
        }
      });
    });
  }

  logout(): Observable<void> {
    return new Observable((observer) => {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('role');
      this.isAuthenticatedSubject.next(false);
      this.userRoleSubject.next(null);
      this.router.navigate(['/login']).then(() => {
        observer.next();
        observer.complete();
      });
    });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const expiresAt = parseInt(localStorage.getItem('expiresAt') || '0', 10);
    return !!token && Date.now() < expiresAt;
  }

  getCurrentUserEmail(): string | null {
    return localStorage.getItem('email');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:8090/products');
  }

  private getStoredRole(): string | null {
    return localStorage.getItem('role');
  }

  private handleError(err: any): string {
    let errorMessage = 'Login failed. Please try again.';
    if (err.status === 401) {
      errorMessage = 'Invalid email or password';
    } else if (err.status === 0) {
      errorMessage = 'Server unavailable. Please try again later.';
    }
    return errorMessage;
  }
}
