import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importieren
import { FormsModule } from '@angular/forms'; // Importieren
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true, // Als standalone markieren
  imports: [CommonModule, FormsModule], // Module importieren
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  // ... Rest des Codes bleibt unverändert
  username = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http.post('/api/register', { username: this.username, password: this.password })
      .subscribe({
        next: (response) => {
          this.successMessage = 'Registrierung erfolgreich! Sie werden zum Login weitergeleitet.';
          setTimeout(() => this.router.navigate(['/login-component']), 2000);
        },
        error: (error) => {
          this.errorMessage = 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.';
        }
      });
  }
}
