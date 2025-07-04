import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import {NgIf} from "@angular/common";
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navbar',
  // KEIN 'imports'-Array hier!
  templateUrl: './navbar.component.html',
  imports: [
    NgIf, RouterLink, RouterLinkActive, RouterOutlet, LoginComponent
  ],
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'Admin';
  }

  get isLeader(): boolean {
    return this.authService.getUserRole() === 'Abteilungsleiter';
  }

  logout(): void {
    this.authService.logout();
  }
}
