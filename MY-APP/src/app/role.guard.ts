import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const roleGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.userRole$.pipe(
    map((role) => {
      if (role === 'admin') {
        return true;  // Allow access for admin
      }
      // Redirect non-admins to shopping
      router.navigate(['/shopping']);
      return false;
    }),
    catchError((error) => {
      console.error('Error in roleGuard:', error);
      router.navigate(['/shopping']);
      return of(false); // Redirect in case of an error
    })
  );
};
