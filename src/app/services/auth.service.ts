import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Import this
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean>;

  // Inject PLATFORM_ID to determine the execution environment
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize loggedIn state safely
    this.loggedIn = new BehaviorSubject<boolean>(this.isTokenAvailable());
  }

  /**
   * Safely checks if a token is available in localStorage, only if running in a browser.
   */
  private isTokenAvailable(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  /**
   * Returns the current login status as an Observable.
   */
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  /**
   * Sends login data, saves the token only if in a browser, and updates login status.
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
   * Sends registration data to the server.
   */
  register(userData: any): Observable<any> {
    return this.http.post<any>('/api/register', userData);
  }

  /**
   * Safely removes the token from localStorage and updates login status.
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      this.loggedIn.next(false);
    }
  }

  /**
   * Safely decodes the JWT and returns the user's role, only if in a browser.
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
}
