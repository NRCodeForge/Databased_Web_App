import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-format',
  standalone: true,
  templateUrl: './section-format.component.html',
  styleUrls: ['./section-format.component.css']
})
export class SectionFormatComponent {
  @Input() mode: 1 | 2 | 3 | 4 = 1;
  @Input() text: string = '';
  @Input() imgsource: string = '';
}
