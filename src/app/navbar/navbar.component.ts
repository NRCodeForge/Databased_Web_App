import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

import {NgIf} from "@angular/common";

import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegistrationComponent } from '../registration/registration.component';
import { NewsComponent } from '../news/news.component';
import { TermineComponent } from '../termine/termine.component';
import { ForumComponent } from '../forum/forum.component';


@Component({
  selector: 'app-navbar',
  imports: [NgIf, RouterOutlet, RouterLink, RouterLinkActive, LoginComponent, RegistrationComponent, NewsComponent, TermineComponent, ForumComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
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
