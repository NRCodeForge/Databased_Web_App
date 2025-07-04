import { Component } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [ReactiveFormsModule ,RouterModule], // Empty this array
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {

}
