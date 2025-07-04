import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nutzer } from '../user-management/user-management.component'; // Pfad anpassen!

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<Nutzer[]> {
    return this.http.get<Nutzer[]>(this.apiUrl);
  }

  updateUserRole(userId: number, roleId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/role`, { roleId });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }
}
