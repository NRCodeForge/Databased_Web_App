import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importieren

@Component({
  selector: 'app-section-format',
  standalone: true,
  imports: [CommonModule], // Hier hinzufügen
  templateUrl: './section-format.component.html',
  styleUrls: ['./section-format.component.css']
})
export class SectionFormatComponent {
  @Input() mode: 1 | 2 | 3 | 4 = 1; // Text über Bild
  @Input() text = "";
  @Input() imgsource = "";
}
