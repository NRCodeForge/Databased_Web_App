import { Component } from '@angular/core';
import { SectionFormatComponent } from '../section-format/section-format.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-startseite',
  standalone: true,
  imports: [CommonModule, SectionFormatComponent, ReactiveFormsModule, RouterModule ],
  templateUrl: './startseite.component.html',
  styleUrls: ['./startseite.component.css']
})
export class StartseiteComponent {}