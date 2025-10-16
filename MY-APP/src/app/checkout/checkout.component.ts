import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Product } from '../Modules/Product';
import { Order } from '../Modules/Order';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CommonModule, NgIf, NgFor],
  standalone: true,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: { product: Product; quantity: number }[] = [];
  totalPrice: number = 0;

  name: string = '';
  address: string = '';
  phone: string = '';
  submitted: boolean = false;

  constructor(private cartService: CartService, private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartService.getTotal();
  }

  placeOrder(): void {
    this.submitted = true;
  
    if (this.name && this.address && this.phone) {
      const loggedInUser = localStorage.getItem('loggedInUser');
      const userEmail = loggedInUser ? JSON.parse(loggedInUser).email : '';
  
      const order: Order = {
        userEmail: userEmail,
        items: JSON.stringify(this.cartItems),
        total: this.totalPrice
      };
  
      this.orderService.createOrder(order).subscribe(
        (response) => {
          alert('Order placed successfully!');
          this.cartService.clearCart();
          this.router.navigate(['/shopping']);
        },
        (error) => {
          alert('Failed to place order. Please try again.');
        }
      );
    }
  }
}