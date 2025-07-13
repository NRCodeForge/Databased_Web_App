import { Injectable, PLATFORM_ID, inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { isPlatformServer } from '@angular/common';
import { Request } from 'express';
// Import the new token
import { REQUEST } from '../ssr.tokens';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  // Inject using the token
  private request = inject(REQUEST, { optional: true });

  private apiBaseUrl: string;

  constructor() {
    if (isPlatformServer(this.platformId) && this.request) {
      // We are on the server, build the absolute URL
      const protocol = this.request.protocol;
      const host = this.request.get('host');
      this.apiBaseUrl = `${protocol}://${host}`;
    } else {
      // We are in the browser, a relative URL is fine
      this.apiBaseUrl = '';
    }
  }

  // Alle Benutzer abrufen
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiBaseUrl}/api/users`);
  }

  // Einen neuen Benutzer erstellen
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiBaseUrl}/api/users`, user);
  }

  // Einen Benutzer aktualisieren
  updateUser(userId: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiBaseUrl}/api/users/${userId}`, user);
  }

  // Einen Benutzer löschen
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/users/${userId}`);
  }
}
