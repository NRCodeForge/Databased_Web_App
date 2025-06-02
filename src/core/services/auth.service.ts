import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { emailOrUsername: string, password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  setSession(token: string, userId: number, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('role', role);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
<<<<<<< Updated upstream
<<<<<<< Updated upstream

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setSession(token: string, role: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  isLeader(): boolean {
    return this.getUserRole() === 'Abteilungsleiter';
  }

  getData()
  {
    return "Antwort";
  }
  
  getCheckData()
  {
    return this.http.get("api/user");
  }
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
}
