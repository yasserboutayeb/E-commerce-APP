import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map, switchMap } from 'rxjs/operators';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('authGuard triggered'); // Log when the guard is triggered

  return authService.isAuthenticated$.pipe(
    switchMap((isAuthenticated) => {
      console.log('isAuthenticated:', isAuthenticated); // Log authentication status

      if (isAuthenticated) {
        // Allow access to cart and checkout for authenticated users
        if (router.url.includes('cart') || router.url.includes('checkout')) {
          console.log('Authenticated user allowed to access cart or checkout');
          return [true];
        }

        // Default case (authenticated users can access any route)
        console.log('Authenticated user allowed to access the route');
        return [true];
      } else {
        console.log('User not authenticated, redirecting to login');
        router.navigate(['/login']); // Redirect unauthenticated users to login
        return [false];
      }
    })
  );
};
