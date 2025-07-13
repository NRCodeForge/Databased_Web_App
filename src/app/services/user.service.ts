import { Injectable, PLATFORM_ID, inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { isPlatformServer } from '@angular/common';
import { Request } from 'express';
// Import the new token
import { REQUEST } from '../ssr.tokens';

/**
 * Service zur Verwaltung von Benutzerdaten.
 * 
 * Unterstützt server- und clientseitigen Zugriff auf die API mit
 * korrekten Basis-URLs abhängig von der Ausführungsumgebung (SSR vs Browser).
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  /** HttpClient zum Durchführen von HTTP-Anfragen */
  private http = inject(HttpClient);

  /** Plattform-ID zur Unterscheidung zwischen Server und Browser */
  private platformId = inject(PLATFORM_ID);

  /** Request-Objekt vom Server, optional da nur im SSR verfügbar */
  private request = inject(REQUEST, { optional: true });

  /** Basis-URL der API, abhängig von der Ausführungsumgebung */
  private apiBaseUrl: string;

  constructor() {
    if (isPlatformServer(this.platformId) && this.request) {
      // Serverseitige Ausführung: Absolute URL mit Protokoll und Host erstellen
      const protocol = this.request.protocol;
      const host = this.request.get('host');
      this.apiBaseUrl = `${protocol}://${host}`;
    } else {
      // Browserseitige Ausführung: relative URL reicht aus
      this.apiBaseUrl = '';
    }
  }

  /**
   * Holt alle Benutzer vom Server.
   * 
   * @returns Observable mit einem Array von User-Objekten
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiBaseUrl}/api/users`);
  }

  /**
   * Erstellt einen neuen Benutzer.
   * 
   * @param user Partial<User> mit den Benutzer-Daten
   * @returns Observable mit dem erstellten User-Objekt
   */
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiBaseUrl}/api/users`, user);
  }

  /**
   * Aktualisiert einen bestehenden Benutzer.
   * 
   * @param userId ID des zu aktualisierenden Benutzers
   * @param user Partial<User> mit den zu aktualisierenden Daten
   * @returns Observable mit dem aktualisierten User-Objekt
   */
  updateUser(userId: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiBaseUrl}/api/users/${userId}`, user);
  }

  /**
   * Löscht einen Benutzer anhand seiner ID.
   * 
   * @param userId ID des zu löschenden Benutzers
   * @returns Observable<void> für den Abschluss der Löschoperation
   */
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/users/${userId}`);
  }
}
