import { Component } from '@angular/core';
import { SectionFormatComponent } from '../section-format/section-format.component'; // Unsere kleine Helfer-Komponente für die Abschnitte
import { CommonModule } from '@angular/common';       // Brauchen wir für allgemeine Angular-Sachen
import { RouterModule } from "@angular/router";       // Damit wir unsere Links benutzen können
import { ReactiveFormsModule } from "@angular/forms"; // Für Formulare, falls wir die mal brauchen

/**
 * Startseiten-Komponente der Anwendung.
 *
 * Diese Komponente dient als Einstiegspunkt der Applikation und
 * bindet verschiedene Module und Unterkomponenten ein, um die
 * Startseite aufzubauen.
 *
 * @remarks
 * - `standalone: true` ermöglicht die Nutzung ohne Angular-Modul.
 * - Importiert notwendige Module für Routing, Formulare und allgemeine Angular-Funktionalität.
 */
@Component({
  selector: 'app-startseite',                     // CSS-Selektor zur Einbindung der Komponente im HTML
  standalone: true,                               // Steht als eigenständige Komponente ohne Modul
  imports: [CommonModule, SectionFormatComponent, ReactiveFormsModule, RouterModule], // Eingebundene Module und Komponenten
  templateUrl: './startseite.component.html',    // Pfad zur HTML-Vorlage der Komponente
  styleUrls: ['./startseite.component.css']      // Pfad zu den CSS-Styles der Komponente
})
export class StartseiteComponent {
  // Aktuell keine Logik implementiert – Platz für zukünftige Erweiterungen
}
