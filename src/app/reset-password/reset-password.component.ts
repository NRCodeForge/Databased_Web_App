import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from '@angular/common/http';

/**
 * Komponente zum Zurücksetzen des Passworts.
 * Stellt ein Formular bereit, um per E-Mail eine Passwortzurücksetzung anzufordern.
 *
 * @export
 * @class ResetPasswordComponent
 */
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'] // Optional, falls Styles vorhanden sind
})
export class ResetPasswordComponent {
  /**
   * Reaktive Formulargruppe für die E-Mail Eingabe.
   */
  resetPasswordForm: FormGroup;

  /**
   * Fehlernachricht, falls beim Zurücksetzen ein Fehler auftritt.
   */
  error: string | null = null;

  /**
   * Erfolgsmeldung, wenn die Anfrage erfolgreich war.
   */
  success: string | null = null;

  /**
   * Erstellt eine Instanz von ResetPasswordComponent.
   * Initialisiert das Formular mit Validators.
   *
   * @param fb FormBuilder zum Erstellen der Formulargruppe
   * @param http HttpClient für HTTP-Anfragen
   * @param router Router für Navigation
   */
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Wird beim Absenden des Formulars ausgeführt.
   * Sendet eine Anfrage zur Passwortzurücksetzung, wenn die E-Mail gültig ist.
   */
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

  /**
   * Navigiert zur Login-Seite.
   */
  goToLogin(): void {
    this.router.navigate(['./login.component.html']);
  }
}
