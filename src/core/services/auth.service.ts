import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Import this

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Inject PLATFORM_ID to check if we are on the browser or server
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  isLoggedIn(): boolean {
    // Only access localStorage if the platform is the browser
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    // On the server, always return false
    return false;
  }

  // You can apply the same logic to other methods that use localStorage
  login(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }
}
