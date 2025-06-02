import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-reset-password',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  constructor(private http:HttpClient, private authService:AuthService){

  }

  buttonClick(): void{

    this.authService.getCheckData().subscribe(
      data => {
        console.log(data);
      }
    );
    console.log(this.authService.getData());
  }
}
