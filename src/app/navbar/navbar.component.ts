import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';

/**
 * Komponente für die Navigationsleiste (Navbar).
 * Zeigt Navigationselemente an und verwaltet die Benutzer-Authentifizierung (Logout).
 *
 * @export
 * @class NavbarComponent
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  /**
   * Erstellt eine neue Instanz von NavbarComponent.
   * 
   * @param authService Authentifizierungsservice für Zugriffsstatus und Logout
   * @param router Router zur Navigation nach Logout
   */
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  /**
   * Führt den Logout durch und leitet anschließend zur Login-Seite weiter.
   *
   * @returns {void}
   */
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
