// src/app/abteilungen/abteilungen.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Für *ngIf und *ngFor

interface Abteilung {
  name: string;
  infoText: string;
}

@Component({
  selector: 'app-abteilungen',
  standalone: true,
  imports: [CommonModule], // CommonModule ist hier wichtig für die Direktiven
  templateUrl: './abteilungen.component.html',
  styleUrls: ['./abteilungen.component.css']
})
export class AbteilungenComponent implements OnInit {

  abteilungen: Abteilung[] = [
    {
      name: 'Bogenschießen',
      infoText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        \nNullam eu eros vel lectus congue lacinia. Maecenas tristique orci ac sem consectetur, eu dapibus quam tincidunt. Proin at magna eu nunc auctor malesuada. Vestibulum in finibus mi.`
    },
    {
      name: 'Jugend & Schüler',
      infoText: `Pellentesque in ipsum id orci porta dapibus. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Cras ultricies ligula sed magna dictum porta. Donec rutrum congue leo eget malesuada. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.
        \nWir legen großen Wert auf die Nachwuchsförderung. Unsere Jugendabteilung bietet spezielle Trainingsprogramme und Betreuung für junge Schützen ab 10 Jahren.`
    },
    {
      name: 'Pistolensport',
      infoText: `Nulla quis lorem ut libero malesuada feugiat. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Nulla porttitor accumsan tincidunt. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.
        \nVon der Luftpistole bis zu Großkaliberwaffen – unser Verein bietet vielfältige Möglichkeiten im Pistolensport für Anfänger und Fortgeschrittene.`
    },
    {
      name: 'Senioren',
      infoText: `Donec sollicitudin molestie malesuada. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Nulla quis lorem ut libero malesuada feugiat. Sed porttitor lectus nibh. Quisque velit nisi, pretium ut lacinia in, elementum id enim.
        \nUnsere Senioren sind ein aktiver Teil des Vereinslebens. Regelmäßige Treffen und angepasste Trainingszeiten fördern Gemeinschaft und sportliche Aktivität bis ins hohe Alter.`
    },
    {
      name: 'Damen',
      infoText: `Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Donec rutrum congue leo eget malesuada. Proin eget tortor risus. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.
        \nDie Damenabteilung des Schützenvereins bietet eine einladende Atmosphäre für alle Schützinnen. Gemeinsame Trainings und Veranstaltungen stärken den Zusammenhalt und die sportliche Leistung.`
    },
    {
      name: 'Tradition',
      infoText: `Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Donec sollicitudin molestie malesuada. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.
        \nDie Traditionspflege ist ein Kernbestandteil unseres Vereins. Wir bewahren althergebrachte Bräuche und Techniken des Schützenwesens und geben sie an neue Generationen weiter.`
    }
  ];

  activeAbteilung: Abteilung | null = null; // Speichert die aktuell ausgewählte Abteilung

  constructor() { }

  ngOnInit(): void {
    // Optional: Beim Laden der Seite die erste Abteilung als aktiv setzen
    if (this.abteilungen.length > 0) {
      this.activeAbteilung = this.abteilungen[0];
    }
  }

  /**
   * Setzt die übergebene Abteilung als aktiv, um deren Infotext anzuzeigen.
   * @param abteilung Die Abteilung, die ausgewählt wurde.
   */
  selectAbteilung(abteilung: Abteilung): void {
    this.activeAbteilung = abteilung;
  }
}