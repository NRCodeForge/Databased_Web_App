import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importieren
import { FormsModule } from '@angular/forms'; // Importieren
import { SectionFormatComponent } from '../section-format/section-format.component'; // Importieren

/**
 * Komponente zum Erstellen von News-Artikeln mit verschiedenen Abschnitten.
 * Ermöglicht das Hinzufügen von Abschnitten mit Modus, Text und Bildquelle.
 *
 * @export
 * @class NewsBuilderComponent
 */
@Component({
  selector: 'app-news-builder',
  standalone: true,
  // Alle benötigten Module und Komponenten hier importieren:
  imports: [CommonModule, FormsModule, SectionFormatComponent],
  templateUrl: './news-builder.component.html',
  styleUrls: ['./news-builder.component.css']
})
export class NewsBuilderComponent {
  /**
   * Array der aktuell erstellten Abschnitte des Artikels.
   */
  sections: { mode: 1 | 2 | 3 | 4, text: string, imgsource: string }[] = [];

  /**
   * Der aktuell bearbeitete Abschnitt, welcher hinzugefügt werden kann.
   */
  currentSection: { mode: 1 | 2 | 3 | 4, text: string, imgsource: string } = {
    mode: 1,
    text: '',
    imgsource: ''
  };

  /**
   * Fügt den aktuellen Abschnitt dem Artikel hinzu und setzt die Eingabefelder zurück.
   */
  addSection() {
    this.sections.push({ ...this.currentSection });
    this.currentSection = { mode: 1, text: '', imgsource: '' };
  }

  /**
   * Speichert den Artikel (hier als Konsolenausgabe simuliert) und leert die Abschnitte.
   */
  saveArticle() {
    console.log('Artikel gespeichert:', this.sections);
    this.sections = [];
  }
}
