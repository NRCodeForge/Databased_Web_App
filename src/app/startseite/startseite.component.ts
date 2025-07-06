import { Component } from '@angular/core';
import { SectionFormatComponent } from '../section-format/section-format.component'; // Unsere kleine Helfer-Komponente für die Abschnitte
import { CommonModule } from '@angular/common';       // Brauchen wir für allgemeine Angular-Sachen
import { RouterModule } from "@angular/router";       // Damit wir unsere Links benutzen können
import { ReactiveFormsModule } from "@angular/forms"; // Für Formulare, falls wir die mal brauchen

// Das hier ist unsere Startseiten-Komponente, die alles zusammenhält.
@Component({
  selector: 'app-startseite',                     // So finden wir die Komponente in unserem HTML
  standalone: true,                               // Das bedeutet, sie kann alleine stehen
  imports: [CommonModule, SectionFormatComponent, ReactiveFormsModule, RouterModule ], // Diese anderen Sachen braucht unsere Komponente
  templateUrl: './startseite.component.html',     // Hier liegt unser HTML-Code dafür
  styleUrls: ['./startseite.component.css']       // Und hier das Design
})
export class StartseiteComponent {
  // Im Moment ist hier noch nichts Besonderes drin, aber das kann sich ja noch ändern!
}