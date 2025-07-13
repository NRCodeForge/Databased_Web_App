import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

/**
 * Interface zur Beschreibung eines Beitrags.
 */
interface Beitrag {
  id: number;
  titel: string;
  inhalt: string;
  datum: string;
  kategorie_id: number;
}

/**
 * Komponente zur Darstellung und Verwaltung von Beiträgen
 * für das SV-Fest mit einer bestimmten Kategorie.
 *
 * @remarks
 * Lädt Beiträge der Kategorie mit der ID 14 beim Initialisieren.
 */
@Component({
  selector: 'app-sv-fest',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sv-fest.component.html',
  styleUrls: ['./sv-fest.component.css']
})
export class SvFestComponent {

  /**
   * Array aller geladenen Beiträge.
   * Wird niemals `null` sein, mindestens ein leeres Array.
   */
  beitraege: Beitrag[] = [];

  /**
   * Konstruktor mit HTTP-Client Injection.
   * @param http Angular HttpClient für HTTP-Anfragen
   */
  constructor(private http: HttpClient) {}

  /**
   * Lifecycle-Hook: Lädt Beiträge für Kategorie 14 beim Start der Komponente.
   */
  ngOnInit() {
    this.loadBeitraege(14);
  }

  /**
   * Lädt Beiträge von der API anhand der Kategorie-ID.
   *
   * @param kategorieId Die ID der Kategorie, deren Beiträge geladen werden sollen.
   */
  loadBeitraege(kategorieId: number): void {
    this.http
      .get<Beitrag[]>(`/api/beitraege?kategorieId=${kategorieId}`)
      .subscribe(
        (data) => {
          this.beitraege = data ?? []; // Fallback auf leeres Array, falls null vom Server zurückkommt
        },
        (error) => {
          console.error('Fehler beim Laden der Beiträge', error);
          this.beitraege = []; // Bei Fehler ein leeres Array setzen
        }
      );
  }
}
