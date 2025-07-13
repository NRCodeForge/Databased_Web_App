import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

/**
 * Repräsentiert einen einzelnen Beitrag, der einer bestimmten Abteilung zugeordnet ist.
 */
interface Beitrag {
  /** Eindeutige ID des Beitrags */
  id: number;
  /** Titel des Beitrags */
  titel: string;
  /** Inhalt des Beitrags */
  inhalt: string;
  /** Veröffentlichungsdatum als ISO-String */
  datum: string;
  /** Zugehörige Kategorie-ID (Abteilung) */
  kategorie_id: number;
}

/**
 * Repräsentiert eine Abteilung mit Namen und zugehöriger Kategorie-ID.
 */
interface Abteilung {
  /** Anzeigename der Abteilung */
  name: string;
  /** ID zur Zuordnung in der Datenbank/API */
  kategorieid: number;
}

/**
 * Komponente zur Darstellung und Auswahl von Abteilungen.
 * 
 * Lädt und zeigt Beiträge abhängig von der gewählten Abteilung.
 * Verwendet HTTP, um Beiträge von einem API-Endpunkt abzurufen.
 */
@Component({
  selector: 'app-abteilungen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './abteilungen.component.html',
  styleUrls: ['./abteilungen.component.css'],
})
export class AbteilungenComponent implements OnInit {
  /**
   * Liste aller verfügbaren Abteilungen.
   * Wird zur Anzeige und Auswahl im Template verwendet.
   */
  abteilungen: Abteilung[] = [
    { name: 'Bogenschießen', kategorieid: 2 },
    { name: 'Jugend & Schüler', kategorieid: 3 },
    { name: 'Pistolensport', kategorieid: 4 },
    { name: 'Senioren', kategorieid: 5 },
    { name: 'Damen', kategorieid: 6 },
    { name: 'Tradition', kategorieid: 7 }
  ];

  /**
   * Aktuell ausgewählte Abteilung.
   * Initial auf die erste Abteilung gesetzt.
   */
  aktiveAbteilung: Abteilung;

  /**
   * Liste der Beiträge der aktuell ausgewählten Abteilung.
   * Wird dynamisch über die API geladen.
   */
  beitraege: Beitrag[] = [];

  /**
   * Konstruktor der Komponente.
   * 
   * @param http Instanz von HttpClient zum Abrufen der Beiträge.
   */
  constructor(private http: HttpClient) {
    this.aktiveAbteilung = this.abteilungen[0];
  }

  /**
   * Initialisierung der Komponente.
   * Lädt Beiträge für die voreingestellte Abteilung beim Start.
   */
  ngOnInit() {
    this.loadBeitraege(this.aktiveAbteilung.kategorieid);
  }

  /**
   * Setzt die aktuell ausgewählte Abteilung und lädt entsprechende Beiträge.
   * 
   * @param abteilung Die neu gewählte Abteilung.
   */
  selectAbteilung(abteilung: Abteilung) {
    this.aktiveAbteilung = abteilung;
    this.loadBeitraege(abteilung.kategorieid);
  }

  /**
   * Lädt Beiträge für eine bestimmte Kategorie-ID von der API.
   * 
   * @param kategorieId Die ID der Kategorie (Abteilung), für die Beiträge geladen werden sollen.
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
