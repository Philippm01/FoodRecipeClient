import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showAuth = false;
  constructor(public authService: AuthService) {}

  onLoginRegisterClick() {
    console.log('Login/Register button clicked');
    this.showAuth = true;
  }

  logout() {
    this.authService.logout();
  }
}
