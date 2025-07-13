import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from "@angular/common/http";

/**
 * Grundlegende Application-Konfiguration für die Angular-App.
 *
 * @remarks
 * Diese Konfiguration definiert die benötigten Provider für den Client:
 * - HTTP-Client für API-Anfragen
 * - Zonen-basierte Change Detection mit Event Coalescing zur Performance-Optimierung
 * - Router mit den definierten Routen
 * - Client Hydration mit Event-Replay zur Verbesserung der Benutzererfahrung beim Hydrieren von SSR-Seiten
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay())
  ]
};
