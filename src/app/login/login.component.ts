import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Wichtig für reaktive Formulare
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null; // Eigenschaft für Fehlermeldungen

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      // Die Namen hier müssen mit 'formControlName' im HTML übereinstimmen
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.error = null; // Fehler zurücksetzen
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          console.log('Login erfolgreich!');
          const role = this.authService.getUserRole();
          // Zum passenden Dashboard weiterleiten
          if (role === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else if (role === 'leader') {
            this.router.navigate(['/leiter-dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          console.error('Login fehlgeschlagen', err);
          this.error = 'Login fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.'; // Fehlermeldung setzen
        }
      });
    }
  }
}
