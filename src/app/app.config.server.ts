import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

/**
 * Server-spezifische Angular Application-Konfiguration.
 *
 * @remarks
 * Fügt Server-Rendering-Unterstützung hinzu durch `provideServerRendering`.
 */
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

/**
 * Kombinierte Application-Konfiguration für den Server.
 *
 * @remarks
 * Verbindet die allgemeine `appConfig` mit der server-spezifischen `serverConfig`.
 */
export const config = mergeApplicationConfig(appConfig, serverConfig);
