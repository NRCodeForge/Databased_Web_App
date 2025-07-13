import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Komponente für die Login-Seite.
 * Stellt ein Formular bereit zur Eingabe von E-Mail und Passwort.
 * Validiert Eingaben und führt Login über den AuthService durch.
 * 
 * @export
 * @class LoginComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /**
   * Reaktives Formular zur Eingabe von Login-Daten.
   * @type {FormGroup}
   */
  loginForm: FormGroup;

  /**
   * Fehlermeldung, die bei fehlerhaftem Login angezeigt wird.
   * @type {(string | null)}
   */
  error: string | null = null;

  /**
   * Erstellt eine Instanz von LoginComponent.
   * Initialisiert das Login-Formular mit Validierungsregeln.
   * 
   * @param {FormBuilder} fb FormBuilder zur Formularerstellung.
   * @param {AuthService} authService Service zur Authentifizierung.
   * @param {Router} router Router für Navigation nach erfolgreichem Login.
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  /**
   * Lifecycle-Hook: Initialisierung der Komponente.
   */
  ngOnInit(): void {}

  /**
   * Verarbeitet das Absenden des Login-Formulars.
   * Führt die Authentifizierung durch und navigiert bei Erfolg zur Startseite.
   * Bei Fehler wird eine Fehlermeldung gesetzt.
   */
  onSubmit(): void {
    this.error = null;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.error?.message || 'Login fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.';
          console.error(err);
        }
      });
    }
  }
}
