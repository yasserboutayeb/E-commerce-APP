import { Injectable } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpErrorResponse, 
  HttpEvent
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip intercepting auth requests to avoid circular dependencies
    if (req.url.includes('/auth/')) {
      return next.handle(req);
    }

    // Retrieve token from AuthService
    const token = this.authService.getToken();
    let modifiedReq = req;

    // Add Authorization header if token is present
    if (token) {
      modifiedReq = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true // Important for CORS with credentials
      });
    } else {
      console.warn('No token found. Proceeding without Authorization header.');
    }

    // Handle request and response, catch errors
    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle specific HTTP error responses
        switch (error.status) {
          case 401: // Unauthorized
            console.error('Unauthorized request - token might be expired or invalid.');
            this.authService.logout();
            this.router.navigate(['/login']);
            break;
          case 403: // Forbidden
            console.error('Access denied - insufficient permissions.');
            this.router.navigate(['/access-denied']); // Route to access-denied page
            break;
          case 0: // Network or CORS error
            console.error('Network or CORS issue - check backend configuration.');
            break;
          default:
            console.error(`Unexpected error occurred: ${error.message}`);
        }
        // Return an observable with the error
        return throwError(() => error);
      })
    );
  }
}
