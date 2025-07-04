import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  //standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent], // Bereinigt
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Databased_Web_App';
}
