import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-registration',
  // KEIN 'imports'-Array hier!
  templateUrl: './registration.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  model: any = {};
  error = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.error = '';
    this.successMessage = '';

    this.authService.register(this.model).subscribe({
      next: (response) => {
        this.successMessage = 'Registrierung erfolgreich! Sie werden zum Login weitergeleitet...';
        console.log(response);
        setTimeout(() => {
          this.router.navigate(['/login-component']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
        console.error(err);
      }
    });
  }
}
