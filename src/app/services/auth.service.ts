import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.isTokenAvailable());

  constructor(private http: HttpClient) { }

  /**
   * Prüft, ob ein Token im Local Storage vorhanden ist.
   * @returns boolean
   */
  private isTokenAvailable(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Gibt den aktuellen Login-Status als Observable zurück.
   * @returns Observable<boolean>
   */
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  /**
   * Sendet Login-Daten an den Server, speichert das Token und aktualisiert den Login-Status.
   * @param credentials - Die Anmeldeinformationen (z. B. Email und Passwort).
   * @returns Observable mit der Server-Antwort.
   */
  login(credentials: any): Observable<any> {
    return this.http.post<any>('/api/login', credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.loggedIn.next(true);
        }
      })
    );
  }

  /**
   * Sendet Registrierungsdaten an den Server.
   * @param userData - Die Benutzerdaten für die Registrierung.
   * @returns Observable mit der Server-Antwort.
   */
  register(userData: any): Observable<any> {
    return this.http.post<any>('/api/register', userData);
  }

  /**
   * Entfernt das Token aus dem Local Storage und aktualisiert den Login-Status.
   */
  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  /**
   * Entschlüsselt das JWT und gibt die Rolle des Benutzers zurück.
   * @returns Die Rollen-ID (z.B. 1, 2, 3) oder null, wenn kein gültiges Token vorhanden ist.
   */
  getUserRole(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Definiere eine Struktur für das erwartete Token-Payload
        const decodedToken: { id: number, role: number, iat: number, exp: number } = jwtDecode(token);
        return decodedToken.role;
      } catch (error) {
        console.error('Ungültiges Token, Logout wird durchgeführt:', error);
        this.logout(); // Bei ungültigem Token wird der Benutzer sicherheitshalber ausgeloggt.
        return null;
      }
    }
    return null;
  }
}
