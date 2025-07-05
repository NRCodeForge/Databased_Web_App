import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component'; // Importieren der Standalone-Navbar


@Component({
  selector: 'app-root',
  standalone: true, // Als Standalone-Komponente markieren
  imports: [ RouterOutlet, NavbarComponent ], // Benötigte Komponenten und Direktiven importieren
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'schuetzenverein-digital';
}
