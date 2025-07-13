import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // für Pipes und Direktiven
import { HttpClientModule, HttpClient } from '@angular/common/http';

/**
 * Schnittstelle für einen Beitrag.
 *
 * @interface Beitrag
 */
interface Beitrag {
  /** Eindeutige ID des Beitrags */
  id: number;
  /** Titel des Beitrags */
  titel: string;
  /** Inhalt des Beitrags */
  inhalt: string;
  /** Veröffentlichungsdatum des Beitrags */
  datum: string;
  /** Kategorie-ID des Beitrags */
  kategorie_id: number;
}

/**
 * Schnittstelle für einen Vereinstab.
 *
 * @interface DerVerein
 */
interface DerVerein {
  /** Name des Tabs */
  name: string;
  /** Kategorie-ID, die diesem Tab zugeordnet ist */
  kategorieid: number;
}

/**
 * Komponente zur Darstellung und Verwaltung der Vereinsinformationen.
 * Enthält Tabs für verschiedene Kategorien und lädt Beiträge entsprechend der Auswahl.
 * 
 * @export
 * @class DerVereinComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-der-Verein',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './der-Verein.component.html',
  styleUrls: ['./der-verein.component.css'],
})
export class DerVereinComponent implements OnInit {
  
  /**
   * Array mit Tabs für verschiedene Vereinskategorien.
   * @type {DerVerein[]}
   */
  tabs: DerVerein[] = [ 
    { name: 'Verein Infos', kategorieid: 8 },
    { name: 'Geschichte', kategorieid: 9 },
    { name: 'Vorstand', kategorieid: 10 },
    { name: 'Beiträge', kategorieid: 11 },
    { name: 'Einrichtung', kategorieid: 12 },
    { name: 'Kontakt und Anfahrt', kategorieid: 13 }
  ];

  /**
   * Der aktuell aktive Tab.
   * Initialisiert mit dem ersten Tab im Array.
   * @type {DerVerein}
   */
  aktiverTab: DerVerein;

  /**
   * Array der geladenen Beiträge.
   * Wird immer als Array initialisiert, nie null.
   * @type {Beitrag[]}
   */
  beitraege: Beitrag[] = [];

  /**
   * Erstellt eine Instanz von DerVereinComponent.
   * Initialisiert den aktiven Tab.
   * 
   * @param {HttpClient} http HttpClient zum Laden von Beiträgen.
   */
  constructor(private http: HttpClient) {
    this.aktiverTab = this.tabs[0];
  }

  /**
   * Lifecycle-Hook: Wird nach der Initialisierung der Komponente aufgerufen.
   * Lädt die Beiträge für den initial aktiven Tab.
   */
  ngOnInit() {
    this.loadBeitraege(this.aktiverTab.kategorieid);
  }

  /**
   * Wechselt den aktiven Tab und lädt die Beiträge für die ausgewählte Kategorie.
   * 
   * @param {DerVerein} tab Der ausgewählte Tab.
   */
  selectTab(tab: DerVerein) {
    this.aktiverTab = tab;
    this.loadBeitraege(tab.kategorieid);
  }

  /**
   * Lädt Beiträge anhand der angegebenen Kategorie-ID vom Server.
   * Setzt die Beiträge-Liste oder ein leeres Array bei Fehlern.
   * 
   * @param {number} kategorieId Kategorie-ID zur Filterung der Beiträge.
   */
  loadBeitraege(kategorieId: number) {
    this.http
      .get<Beitrag[]>(`/api/beitraege?kategorieId=${kategorieId}`)
      .subscribe(
        (data) => {
          this.beitraege = data ?? [];
        },
        (error) => {
          console.error('Fehler beim Laden der Beiträge', error);
          this.beitraege = [];
        }
      );
  }
}
