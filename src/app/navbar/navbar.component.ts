import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Notwendig für *ngIf, *ngFor etc.
import { Router, RouterModule } from '@angular/router'; // Notwendig für routerLink
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true, // Als Standalone-Komponente markieren
  imports: [CommonModule, RouterModule], // Benötigte Module importieren
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private authService: AuthService, private router: Router) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    // HINWEIS: Dies ist eine temporäre Lösung.
    // In einer echten Anwendung würden Sie das JWT decodieren, um die Rolle zu erhalten.
    return this.authService.getUserRole() === 'admin';
  }

  get isLeader(): boolean {
    // HINWEIS: Dies ist eine temporäre Lösung.
    return this.authService.getUserRole() === 'leader';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
