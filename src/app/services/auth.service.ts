// Dieser Code wurde mithilfe von Gemini erstellt

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

/**
 * Service zur Verwaltung der Authentifizierung, inklusive Login, Logout und Nutzerinformationen.
 *
 * @export
 * @class AuthService
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * BehaviorSubject zur Verwaltung des Login-Status.
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof AuthService
   */
  private loggedIn: BehaviorSubject<boolean>;

  /**
   * Erstellt eine Instanz des AuthService.
   * 
   * @param {HttpClient} http HTTP-Client zur Kommunikation mit dem Backend
   * @param {*} platformId Kennzeichnet die Ausführungsumgebung (Browser oder Server)
   * @memberof AuthService
   */
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialisiert den Login-Status basierend auf Verfügbarkeit des Tokens
    this.loggedIn = new BehaviorSubject<boolean>(this.isTokenAvailable());
  }

  /**
   * Prüft sicher, ob ein Token im localStorage vorhanden ist, nur im Browser.
   *
   * @private
   * @returns {boolean} True wenn Token vorhanden, sonst false
   * @memberof AuthService
   */
  private isTokenAvailable(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  /**
   * Gibt den aktuellen Login-Status als Observable zurück.
   *
   * @returns {Observable<boolean>} Observable mit dem Login-Status
   * @memberof AuthService
   */
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  /**
   * Führt einen Login durch, speichert das Token (nur im Browser) und aktualisiert den Login-Status.
   *
   * @param {*} credentials Login-Daten (z.B. Email und Passwort)
   * @returns {Observable<any>} Observable mit der Serverantwort
   * @memberof AuthService
   */
  login(credentials: any): Observable<any> {
    return this.http.post<any>('/api/login', credentials).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId) && response?.token) {
          localStorage.setItem('token', response.token);
          this.loggedIn.next(true);
        }
      })
    );
  }

  /**
   * Registriert einen neuen Benutzer auf dem Server.
   *
   * @param {*} userData Benutzerdaten für die Registrierung
   * @returns {Observable<any>} Observable mit der Serverantwort
   * @memberof AuthService
   */
  register(userData: any): Observable<any> {
    return this.http.post<any>('/api/register', userData);
  }

  /**
   * Führt Logout durch, entfernt das Token (nur im Browser) und aktualisiert den Login-Status.
   *
   * @memberof AuthService
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      this.loggedIn.next(false);
    }
  }

  /**
   * Dekodiert sicher das JWT-Token und gibt die Rolle des Nutzers zurück (nur im Browser).
   *
   * @returns {(number | null)} Die Rollen-ID des Nutzers oder null bei Fehlern
   * @memberof AuthService
   */
  getUserRole(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken: { id: number, role: number } = jwtDecode(token);
          return decodedToken.role;
        } catch (error) {
          console.error('Invalid token, logging out:', error);
          this.logout();
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Dekodiert sicher das JWT-Token und gibt die ID des angemeldeten Nutzers zurück (nur im Browser).
   *
   * @returns {(number | null)} Die Nutzer-ID oder null bei Fehlern
   * @memberof AuthService
   */
  getUserID(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken: { id: number, role: number } = jwtDecode(token);
          return decodedToken.id;
        } catch (error) {
          console.error('Invalid token, logging out:', error);
          this.logout();
          return null;
        }
      }
    }
    return null;
  }
}
