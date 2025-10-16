import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '../Modules/Product';
import { ProdsService } from '../services/prods.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {
  products: Product[] = [];
  cartItems: { product: Product; quantity: number }[] = [];

  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 6;

  constructor(
    public cartService: CartService,
    private prodsService: ProdsService
  ) {}

  ngOnInit(): void {
    this.loadProducts(this.currentPage);
    this.cartItems = this.cartService.getCartItems();
  }

  loadProducts(page: number): void {
    this.prodsService.getProducts(page, this.pageSize).subscribe({
      next: (data: Product[]) => {
        this.products = data;
        if (data.length < this.pageSize) {
          this.totalPages = page;
        } else if (this.totalPages < page + 1) {
          this.totalPages = page + 1;
        }
      },
      error: (err: any) => {
        console.error('Error loading products:', err);
      }
    });
  }
  

  get paginatedProducts(): Product[] {
    return this.products;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts(this.currentPage);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts(this.currentPage);
    }
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts(page);
    }
  }

  addToCart(product: Product): void {
    if (product.stock > 0) {
      this.cartService.addToCart(product);
      this.cartItems = this.cartService.getCartItems();
    } else {
      console.warn('Product is out of stock.');
    }
  }

  isAddToCartDisabled(product: Product): boolean {
    const cartItem = this.cartItems.find(item => item.product.id === product.id);
    return product.stock === 0 || (cartItem?.quantity || 0) >= product.stock;
  }
}
