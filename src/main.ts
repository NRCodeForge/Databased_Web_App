import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Korrekter Importname 'routes'

/**
 * Startet die Angular-Anwendung mit der Hauptkomponente `AppComponent`.
 * 
 * Dabei werden folgende Provider registriert:
 * - Routing-Konfiguration über `provideRouter` mit den definierten Routen.
 * - HTTP-Client für HTTP-Anfragen über `provideHttpClient`.
 *
 * Fehler während des Bootstrappings werden in der Konsole ausgegeben.
 */
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Korrekte Variable verwenden
    provideHttpClient()
  ]
}).catch(err => console.error(err));
