import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  // Das 'model'-Objekt für das Formular hinzufügen
  model: any = {};

  // Die 'error'-Variable für Fehlermeldungen hinzufügen
  error = '';
  successMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  // Die Methode so umbenennen, dass sie zum Template passt
  onSubmit() {
    this.http.post('/api/register', this.model)
      .subscribe({
        next: (response) => {
          this.successMessage = 'Registrierung erfolgreich! Sie werden zum Login weitergeleitet.';
          setTimeout(() => this.router.navigate(['/login-component']), 2000);
        },
        error: (err) => {
          // Die 'error'-Variable setzen
          this.error = 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.';
        }
      });
  }
}
