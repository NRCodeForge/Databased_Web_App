import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

/**
 * Startet die Angular-Anwendung mit dem Hauptkomponenten `AppComponent`
 * und der Server-spezifischen Konfiguration `config`.
 *
 * @returns Ein Promise, das auf die erfolgreiche Bootstrap-Ausführung wartet.
 */
const bootstrap = () => bootstrapApplication(AppComponent, config);

/**
 * Exportiert die Bootstrap-Funktion als Standard-Export,
 * sodass sie beim Server-Start importiert und ausgeführt werden kann.
 */
export default bootstrap;
