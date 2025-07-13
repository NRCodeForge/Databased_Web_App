import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importiert CommonModule für gängige Angular-Direktiven

/**
 * Komponente zur Darstellung von Text- und Bildabschnitten in verschiedenen Layout-Modi.
 *
 * @export
 * @class SectionFormatComponent
 */
@Component({
  selector: 'app-section-format',
  standalone: true,
  imports: [CommonModule], // Fügt CommonModule für die Nutzung in der Komponente hinzu
  templateUrl: './section-format.component.html',
  styleUrls: ['./section-format.component.css']
})
export class SectionFormatComponent {
  /**
   * Layout-Modus für die Darstellung.
   * Werte:
   * - 1: Text über Bild
   * - 2, 3, 4: weitere Layoutvarianten
   *
   * @type {1 | 2 | 3 | 4}
   * @memberof SectionFormatComponent
   */
  @Input() mode: 1 | 2 | 3 | 4 = 1;

  /**
   * Textinhalt, der im Abschnitt angezeigt wird.
   *
   * @type {string}
   * @memberof SectionFormatComponent
   */
  @Input() text = "";

  /**
   * Pfad oder URL des Bildes, das angezeigt werden soll.
   *
   * @type {string}
   * @memberof SectionFormatComponent
   */
  @Input() imgsource = "";
}
