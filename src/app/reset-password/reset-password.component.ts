import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Router importieren

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  // Den Router im Konstruktor injizieren
  constructor(private router: Router) {}

  // Methode zum Navigieren
  goToLogin(): void {
    this.router.navigate(['/login-component']);
  }
}
