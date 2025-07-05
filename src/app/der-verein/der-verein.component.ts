// src/app/der-verein/der-verein.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common'; // ViewportScroller hinzufügen
import { RouterLink, RouterLinkActive } from '@angular/router'; // Falls es Links zu anderen Seiten gibt

@Component({
  selector: 'app-der-verein',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './der-verein.component.html',
  styleUrls: ['./der-verein.component.css']
})
export class DerVereinComponent implements OnInit {

  // Injiziere den ViewportScroller im Konstruktor
  constructor(private scroller: ViewportScroller) { }

  ngOnInit(): void {
    // Optional: Wenn die Seite mit einem Fragment in der URL geladen wird (z.B. /der-verein#geschichte),
    // kann man hier manuell zum Anker scrollen. Dies ist aber für die In-Page-Navigation durch Klicks nicht zwingend.
  }

  /**
   * Scrollt zu einem Element mit der angegebenen ID auf der Seite.
   * @param elementId Die ID des Ziel-Elements (z.B. 'intro', 'geschichte').
   * @param event Das Klick-Event, um das Standardverhalten des Links zu verhindern.
   */
  scrollToElement(elementId: string, event: Event): void {
    event.preventDefault(); // Verhindert, dass der Browser zur Startseite navigiert oder die URL ändert
    this.scroller.scrollToAnchor(elementId); // Scrollt zum Element mit der angegebenen ID
  }
}