import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importieren
import { FormsModule } from '@angular/forms'; // Importieren
import { SectionFormatComponent } from '../section-format/section-format.component'; // Importieren

@Component({
  selector: 'app-news-builder',
  standalone: true,
  // Alle benötigten Module und Komponenten hier importieren:
  imports: [CommonModule, FormsModule, SectionFormatComponent],
  templateUrl: './news-builder.component.html',
  styleUrls: ['./news-builder.component.css']
})
export class NewsBuilderComponent {
  sections: { mode: 1 | 2 | 3 | 4, text: string, imgsource: string }[] = [];
  currentSection: { mode: 1 | 2 | 3 | 4, text: string, imgsource: string } = {
    mode: 1,
    text: '',
    imgsource: ''
  };

  addSection() {
    this.sections.push({ ...this.currentSection });
    this.currentSection = { mode: 1, text: '', imgsource: '' };
  }

  saveArticle() {
    console.log('Artikel gespeichert:', this.sections);
    this.sections = [];
  }
}
