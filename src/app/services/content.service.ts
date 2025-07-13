import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post'; // Behalten Sie diesen Import
import { Text } from '@angular/compiler';

/**
 * Service zur Verwaltung von Beiträgen (Posts) über HTTP-Requests.
 *
 * @export
 * @class ContentService
 */
@Injectable({
  providedIn: 'root'
})
export class ContentService {
  /**
   * Basis-URL für API-Endpunkte der Beiträge.
   *
   * @private
   * @type {string}
   * @memberof ContentService
   */
  private apiUrl = '/api/posts';

  /**
   * Erstellt eine Instanz des ContentService.
   *
   * @param {HttpClient} http HTTP-Client für API-Kommunikation
   * @memberof ContentService
   */
  constructor(private http: HttpClient) { }

  /**
   * Holt alle Beiträge vom Backend.
   *
   * @returns {Observable<Post[]>} Observable mit dem Array von Beiträgen
   * @memberof ContentService
   */
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  /**
   * Erstellt einen neuen Beitrag.
   *
   * @param {Post} post Der zu erstellende Beitrag
   * @returns {Observable<Post>} Observable mit dem erstellten Beitrag
   * @memberof ContentService
   */
  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  /**
   * Aktualisiert einen vorhandenen Beitrag teilweise.
   *
   * @param {number} id Die ID des zu aktualisierenden Beitrags
   * @param {Partial<Post>} post Die Teil-Daten, die aktualisiert werden sollen
   * @returns {Observable<Post>} Observable mit dem aktualisierten Beitrag
   * @memberof ContentService
   */
  updatePost(id: number, post: Partial<Post>): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, post);
  }

  /**
   * Löscht einen Beitrag anhand seiner ID.
   *
   * @param {number} id Die ID des zu löschenden Beitrags
   * @returns {Observable<void>} Observable, das den Löschvorgang bestätigt
   * @memberof ContentService
   */
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
