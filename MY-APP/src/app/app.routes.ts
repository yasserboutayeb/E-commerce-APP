import { Routes } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupComponent } from './sign-up-form/sign-up-form.component';
import { ShoppingComponent } from './shopping/shopping.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { authGuard } from './auth.guard';      
import { roleGuard } from './role.guard';      
import { AdminComponent } from './admin/admin.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'shopping', pathMatch: 'full' },
  { path: 'login', component: LoginFormComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'shopping', component: ShoppingComponent },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },           
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },   
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard]  
  },
  {
    path: 'orders',
    loadComponent: () => import('./order-history/order-history.component')
      .then(m => m.OrderHistoryComponent),
    canActivate: [authGuard]  
  },
  { path: '**', redirectTo: 'shopping' }
];
