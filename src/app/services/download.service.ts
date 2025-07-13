import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Download } from '../models/download';

/**
 * Service zur Verwaltung von Downloads.
 * 
 * Bietet Methoden zum Abrufen, Erstellen, Aktualisieren und Löschen von Downloads.
 * Unterstützt sowohl einfache Daten als auch Dateiuploads über FormData.
 */
@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  /** Basis-URL für die Download-API */
  private apiUrl = '/api/downloads';

  /**
   * Konstruktor zur Injektion des HttpClient
   * @param http Angular HttpClient für HTTP-Anfragen
   */
  constructor(private http: HttpClient) { }

  /**
   * Holt alle Downloads vom Server.
   * @returns Observable mit einem Array von Downloads
   */
  getDownloads(): Observable<Download[]> {
    return this.http.get<Download[]>(this.apiUrl);
  }

  /**
   * Erstellt einen neuen Download mit Datei-Upload.
   * @param formData FormData mit Download-Daten und Datei(en)
   * @returns Observable des neu erstellten Downloads
   */
  createDownloadWithFiles(formData: FormData): Observable<Download> {
    return this.http.post<Download>(this.apiUrl, formData);
  }

  /**
   * Aktualisiert einen bestehenden Download inklusive optionalem Datei-Upload.
   * @param id ID des zu aktualisierenden Downloads
   * @param formData FormData mit den aktualisierten Daten und optionalen Dateien
   * @returns Observable des aktualisierten Downloads
   */
  updateDownloadWithFiles(id: number, formData: FormData): Observable<Download> {
    return this.http.put<Download>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Erstellt einen neuen Download ohne Datei-Upload.
   * Kann noch verwendet werden, falls Dateien nicht hochgeladen werden.
   * @param download Partial<Download> mit den Download-Daten
   * @returns Observable des neu erstellten Downloads
   */
  createDownload(download: Partial<Download>): Observable<Download> {
    return this.http.post<Download>(this.apiUrl, download);
  }

  /**
   * Aktualisiert einen bestehenden Download ohne Datei-Upload.
   * @param id ID des zu aktualisierenden Downloads
   * @param download Partial<Download> mit den aktualisierten Daten
   * @returns Observable des aktualisierten Downloads
   */
  updateDownload(id: number, download: Partial<Download>): Observable<Download> {
    return this.http.put<Download>(`${this.apiUrl}/${id}`, download);
  }

  /**
   * Löscht einen Download anhand seiner ID.
   * @param id ID des zu löschenden Downloads
   * @returns Observable mit void bei erfolgreichem Löschvorgang
   */
  deleteDownload(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
