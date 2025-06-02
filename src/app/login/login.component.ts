import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  emailOrUsername = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login({ emailOrUsername: this.emailOrUsername, password: this.password })
      .subscribe({
        next: (res: any) => {
          this.authService.setSession(res.token, res.userId, res.role);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = 'Login fehlgeschlagen. Bitte überprüfe deine Eingaben.';
          console.error(err);
        }
      });
  }
}
