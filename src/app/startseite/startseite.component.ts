import { Component } from '@angular/core';
import { SectionFormatComponent } from '../section-format/section-format.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-startseite',
  standalone: true,
  imports: [CommonModule, SectionFormatComponent],
  templateUrl: './startseite.component.html',
  styleUrls: ['./startseite.component.css']
})
export class StartseiteComponent {

}
