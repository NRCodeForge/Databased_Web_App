import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'] // Optional, falls du Styles hast
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    this.error = null;
    this.success = null;

    if (this.resetPasswordForm.valid) {
      const email = this.resetPasswordForm.value.email;
      this.http.post('/api/request-password-reset', { email }).subscribe({
        next: () => {
          this.success = 'Wenn die Email existiert, wurde eine Nachricht verschickt.';
        },
        error: (err) => {
          console.error('Fehler beim Anfordern der Passwortzurücksetzung', err);
          this.error = 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.';
        }
      });
    }
  }

  goToLogin() {
    this.router.navigate(['./login.component.html']);
  }
}
