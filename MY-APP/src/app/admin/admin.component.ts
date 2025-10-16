import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AdminProductService } from '../services/admin-product.service';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../Modules/Product';
import { User } from '../Modules/User';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [NgIf, NgFor, FormsModule]
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  products: Product[] = [];

  showUserForm = false;
  showProductForm = false;

  newUser: { email: string; password: string } = { email: '', password: '' };
  newProduct: Product = {
    id: undefined,
    name: '',
    price: 0,
    description: '',
    stock: 0,
    imgURL: ''
  };

  editingUser: User | null = null;
  editingProduct: Product | null = null;

  userPage = 1;
  usersPerPage = 5;
  productPage = 1;
  productsPerPage = 5;

  constructor(
    private userService: UserService,
    private adminProductService: AdminProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.getProducts();
  }

  // === USERS ===
  getUsers() {
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  editUser(user: User) {
    this.editingUser = user;
    this.newUser = { email: user.email, password: '' };
    this.showUserForm = true;
  }

  createUser() {
    if (!this.newUser.email || !this.newUser.password) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const userPayload = {
      email: this.newUser.email,
      password: this.newUser.password
    };

    const action = this.editingUser
      ? this.userService.updateUser({ ...this.editingUser, ...userPayload })
      : this.userService.createUser(userPayload);

    action.pipe(
      catchError(err => {
        console.error(err);
        alert('Erreur serveur.');
        return throwError(() => err);
      })
    ).subscribe(() => {
      this.getUsers();
      this.resetUserForm();
    });
  }

  deleteUser(userId: number) {
    if (confirm('Supprimer cet utilisateur ?')) {
      this.userService.deleteUser(userId).pipe(
        catchError(err => {
          console.error(err);
          alert('Erreur serveur.');
          return throwError(() => err);
        })
      ).subscribe(() => this.getUsers());
    }
  }

  resetUserForm() {
    this.newUser = { email: '', password: '' };
    this.editingUser = null;
    this.showUserForm = false;
  }

  get paginatedUsers() {
    const start = (this.userPage - 1) * this.usersPerPage;
    return this.users.slice(start, start + this.usersPerPage);
  }

  get userTotalPages() {
    return Math.ceil(this.users.length / this.usersPerPage);
  }

  changeUserPage(page: number) {
    if (page >= 1 && page <= this.userTotalPages) {
      this.userPage = page;
    }
  }

  // === PRODUCTS ===
  getProducts() {
    this.adminProductService.getProducts().subscribe(products => this.products = products);
  }

  editProduct(product: Product) {
    this.editingProduct = product;
    this.newProduct = { ...product };
    this.showProductForm = true;
  }

  createProduct() {
    if (!this.newProduct.name || !this.newProduct.price) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const action = this.editingProduct
      ? this.adminProductService.updateProduct(this.editingProduct.id!.toString(), this.newProduct)
      : this.adminProductService.createProduct(this.newProduct);
  
    action.pipe(
      catchError(err => {
        console.error(err);
        alert('Erreur serveur.');
        return throwError(() => err);
      })
    ).subscribe(() => {
      this.getProducts();
      this.resetProductForm();
    });
  }

  deleteProduct(productId?: number) {
    if (productId === undefined) return;

    if (confirm('Supprimer ce produit ?')) {
      this.adminProductService.deleteProduct(productId.toString()).pipe(
        catchError(err => {
          console.error(err);
          alert('Erreur serveur.');
          return throwError(() => err);
        })
      ).subscribe(() => this.getProducts());
    }
  }

  resetProductForm() {
    this.newProduct = {
      id: undefined,
      name: '',
      price: 0,
      description: '',
      stock: 0,
      imgURL: ''
    };
    this.editingProduct = null;
    this.showProductForm = false;
  }

  get paginatedProducts() {
    const start = (this.productPage - 1) * this.productsPerPage;
    return this.products.slice(start, start + this.productsPerPage);
  }

  get productTotalPages() {
    return Math.ceil(this.products.length / this.productsPerPage);
  }

  changeProductPage(page: number) {
    if (page >= 1 && page <= this.productTotalPages) {
      this.productPage = page;
    }
  }
}
