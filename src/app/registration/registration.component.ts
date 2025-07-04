import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '..//services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  // This is the property for error messages
  errorMessage: string | null = null;
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
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.registrationForm.markAllAsTouched();

    if (this.registrationForm.valid) {
      this.authService.register(this.registrationForm.value).subscribe({
        next: (response: any) => {
          this.successMessage = 'Registrierung erfolgreich! Sie werden zum Login weitergeleitet.';
          setTimeout(() => {
            this.router.navigate(['/login-component']);
          }, 2000);
        },
        error: (err: HttpErrorResponse) => {
          // Ensure the errorMessage property is set here
          this.errorMessage = err.error?.message || 'Ein unbekannter Fehler ist aufgetreten.';
        }
      });
    } else {
      this.errorMessage = 'Bitte füllen Sie alle erforderlichen Felder korrekt aus.';
    }
  }
}
