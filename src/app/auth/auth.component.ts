import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
    async loginWithGoogle() {
      console.log('Google login button clicked');
      this.loading = true;
      this.errorMsg = '';
      try {
        const user = await this.authService.googleLogin();
        console.log('Google login result:', user);
        this.loading = false;
        if (user) {
          this.close.emit();
        } else {
          this.errorMsg = 'Google login failed: No user returned.';
          console.error('Google login failed: No user returned.', user);
        }
      } catch (err) {
        this.loading = false;
        this.errorMsg = 'Google login failed';
        console.error('Google login error:', err);
      }
    }
  @Output() close = new EventEmitter<void>();
  email = '';
  password = '';
  isLoginMode = true;
  errorMsg = '';
  loading = false;

  constructor(public authService: AuthService) {}

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMsg = '';
  }

  onSubmit() {
    this.loading = true;
    this.errorMsg = '';
    if (this.isLoginMode) {
      this.authService.login(this.email, this.password).subscribe({
        next: () => {
          this.loading = false;
          this.close.emit();
        },
        error: err => {
          this.loading = false;
          this.errorMsg = err.error?.error?.message || 'Login failed';
        }
      });
    } else {
      this.authService.register(this.email, this.password).subscribe({
        next: () => {
          this.loading = false;
          this.isLoginMode = true;
        },
        error: err => {
          this.loading = false;
          this.errorMsg = err.error?.error?.message || 'Registration failed';
        }
      });
    }
  }
  onClose() {
    this.close.emit();
  }
}
