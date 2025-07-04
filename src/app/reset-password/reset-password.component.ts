import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  template: `
    <div class="form-container">
      <h2>Passwort zurücksetzen</h2>
      <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email-Adresse</label>
          <input type="email" id="email" formControlName="email" required>
          <div *ngIf="resetPasswordForm.get('email')?.invalid && resetPasswordForm.get('email')?.touched" class="error-message">
            Bitte eine gültige Email-Adresse eingeben.
          </div>
        </div>

        <div *ngIf="error" class="error-message">{{ error }}</div>
        <div *ngIf="success" class="success-message">{{ success }}</div>

        <button type="submit" [disabled]="resetPasswordForm.invalid">Email senden</button>
      </form>
      <div>
        <button (click)="goToLogin()">Zurück zum Login</button>
      </div>
    </div>
  `,
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
    this.router.navigate(['login/login.component.html']);
  }
}
