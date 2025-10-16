import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../services/cart.service';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, NgFor, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.product.stock) {
      // Ensure product.id is not undefined by using nullish coalescing
      this.cartService.updateQuantity(item.product.id ?? 0, item.quantity + 1);
      this.calculateTotal();
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      // Ensure product.id is not undefined by using nullish coalescing
      this.cartService.updateQuantity(item.product.id ?? 0, item.quantity - 1);
      this.calculateTotal();
    } else {
      // Ensure product.id is not undefined by using nullish coalescing
      this.removeItem(item.product.id ?? 0);
    }
  }

  removeItem(productId: number): void {
    // Ensure productId is not undefined by using nullish coalescing
    this.cartService.removeFromCart(productId ?? 0);
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
    this.totalPrice = 0;
  }
}
