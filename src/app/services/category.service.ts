import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category'; // Sie müssen dieses Modell erstellen

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = '/api/categories';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }
}

// Erstellen Sie auch das Category-Modell
// models/category.ts.ts
export interface Category {
  KategorieID: number;
  Name: string;
}
