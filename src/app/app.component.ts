import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  //standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive], // Bereinigt
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Databased_Web_App';
}
