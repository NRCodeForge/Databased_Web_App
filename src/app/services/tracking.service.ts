import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  trackPageView(path: string): void {
    // Wir tracken nur im Browser, nicht während des serverseitigen Renderns
    if (isPlatformBrowser(this.platformId)) {
      this.http.post('/api/track-view', { path }).subscribe({
        next: () => { /* Erfolgreich, nichts zu tun */ },
        error: (err) => console.error('Fehler beim Tracken des Seitenaufrufs:', err)
      });
    }
  }
}
