import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/department.model'; // Sie müssen dieses Modell erstellen

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = '/api/departments';

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }
}

// Erstellen Sie auch das Department-Modell
// models/department.model.ts
export interface Department {
  AbteilungsID: number;
  Abteilungsname: string;
  Beschreibung: string;
  Bilder: string[]; // Angenommen, Bilder werden als Array von URLs gespeichert
}
