import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model'; // Sie müssen dieses Modell erstellen

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = '/api/posts';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  updatePost(id: number, post: Partial<Post>): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, post);
  }
}

// Erstellen Sie auch das Post-Modell
// models/post.model.ts
export interface Post {
  BeitragsID: number;
  Titel: string;
  Inhalt: string;
  KategorieID: number;
  Kategorie: string; // Optional, je nach API-Antwort
  Erstellungsdatum: string;
  Aenderungsdatum?: string;
}
