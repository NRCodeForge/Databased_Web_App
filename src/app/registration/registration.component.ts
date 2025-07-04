import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Wichtig für reaktive Formulare
    RouterModule
  ],
  templateUrl: './registration.component.html',
  // styleUrls: ['./registration.component.css'] // Ggf. wieder einkommentieren
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // Optional: Fügen Sie eine E-Mail-Validierung hinzu, wenn das Feld existiert
      // email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    this.error = null;
    this.successMessage = null;

    if (this.registrationForm.valid) {
      this.authService.register(this.registrationForm.value).subscribe({
        next: (response) => {
          this.successMessage = 'Registrierung erfolgreich! Sie werden zum Login weitergeleitet.';
          console.log(response);
          // Nach einer kurzen Verzögerung zum Login weiterleiten
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          console.error('Registrierung fehlgeschlagen', err);
          if (err.status === 409) {
            this.error = 'Dieser Benutzername ist bereits vergeben.';
          } else {
            this.error = 'Ein unerwarteter Fehler ist aufgetreten.';
          }
        }
      });
    }
  }
}
