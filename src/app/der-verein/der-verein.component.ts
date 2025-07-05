// src/app/der-verein/der-verein.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-der-verein',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './der-verein.component.html',
  styleUrls: ['./der-verein.component.css']
})
export class DerVereinComponent implements OnInit {

  constructor(private scroller: ViewportScroller /*, private router: Router (falls du den Router brauchst) */) { }

  ngOnInit(): void {}

  scrollToElement(elementId: string, event: Event): void {
    event.preventDefault();                   // Verhindert, dass der Browser zur Startseite navigiert oder die URL ändert
    //Wurde nur eingeführt um das AutoScrollProblem auf "Der_Verein"-Seite zu beheben!
    this.scroller.scrollToAnchor(elementId); // Scrollt zum Element mit der dazu geschriebenen ID
  }
}