import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
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
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
          setTimeout(() => this.router.navigate(['/login-component']), 2000);
        },
        error: (err) => {
          console.error('Registrierung fehlgeschlagen', err);
          if (err.status === 409) {
            this.error = 'Diese E-Mail-Adresse ist bereits registriert.';
          } else {
            this.error = 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
          }
        }
      });
    }
  }
}
