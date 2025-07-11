import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // CommonModule importieren
import { AuthService } from '../services/auth.service'; // AuthService importieren
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive, CommonModule], // CommonModule hinzufügen
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // AuthService öffentlich machen, damit das Template darauf zugreifen kann
  constructor(
    public authService: AuthService,
    private router: Router
  ) { }
  // Logout-Funktion für den Button im Template
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
