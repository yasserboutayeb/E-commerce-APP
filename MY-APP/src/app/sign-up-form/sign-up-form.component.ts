import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../Modules/User';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-signup',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css'],
  imports: [CommonModule, FormsModule, RouterLink]
})
export class SignupComponent {
  user: User = {
    email: '',
    password: '',
    role: 'user',
  };

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.register(this.user).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert(response.message || 'Account created successfully!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Signup error:', err);
        this.errorMessage = err.error?.message || 'Registration failed. Try again.';
      }
    });
  }
}
