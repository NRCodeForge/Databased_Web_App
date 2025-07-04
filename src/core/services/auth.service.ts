import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Wichtig für die Plattform-Prüfung
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode'; // Importieren Sie jwt-decode

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private token: string | null = null;

  // PLATFORM_ID injizieren, um die Ausführungsumgebung zu erkennen
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadToken(); // Token beim Initialisieren laden
  }

  // Lädt den Token nur, wenn wir im Browser sind
  private loadToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token');
    }
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          // Speichert den Token nur, wenn wir im Browser sind
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.token);
          }
          this.token = response.token;
        }
      })
    );
  }

  logout(): void {
    // Entfernt den Token nur, wenn wir im Browser sind
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.token = null;
  }

  isLoggedIn(): boolean {
    // Prüft nur im Browser auf den Token
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return !!localStorage.getItem('token');
  }

  // Diese Methode decodiert das JWT, um die Rolle zu erhalten
  getUserRole(): 'user' | 'admin' | 'leader' | null {
    if (!this.token) {
      this.loadToken(); // Sicherstellen, dass der Token geladen ist
    }

    if (!this.token) {
      return null;
    }

    try {
      const decodedToken: { id: number, role: 'user' | 'admin' | 'leader' } = jwtDecode(this.token);
      return decodedToken.role;
    } catch (error) {
      console.error("Ungültiger Token", error);
      return null;
    }
  }
}
