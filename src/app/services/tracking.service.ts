import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

/**
 * Service zur Verfolgung von Seitenaufrufen (Tracking).
 * 
 * Dieser Service sendet Informationen über Seitenaufrufe an das Backend,
 * jedoch nur, wenn die Anwendung im Browser ausgeführt wird (kein SSR-Tracking).
 */
@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  /** HttpClient zum Senden der Tracking-Daten */
  private http = inject(HttpClient);

  /** Plattform-ID zur Erkennung der Ausführungsumgebung */
  private platformId = inject(PLATFORM_ID);

  /**
   * Sendet einen Seitenaufruf an das Backend zur Analyse.
   * 
   * @param path Der Pfad der aufgerufenen Seite, der getrackt werden soll
   */
  trackPageView(path: string): void {
    // Nur im Browser tracken, nicht beim Server-Side-Rendering
    if (isPlatformBrowser(this.platformId)) {
      this.http.post('/api/track-view', { path }).subscribe({
        next: () => { /* Erfolgreich, keine weitere Aktion erforderlich */ },
        error: (err) => console.error('Fehler beim Tracken des Seitenaufrufs:', err)
      });
    }
  }
}
