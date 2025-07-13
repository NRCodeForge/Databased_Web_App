// src/app/services/download.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Download } from '../models/download';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private apiUrl = '/api/downloads';

  constructor(private http: HttpClient) { }

  getDownloads(): Observable<Download[]> {
    return this.http.get<Download[]>(this.apiUrl);
  }

  // Methode zum Erstellen eines Downloads mit Dateiupload
  createDownloadWithFiles(formData: FormData): Observable<Download> {
    return this.http.post<Download>(this.apiUrl, formData);
  }

  // Methode zum Aktualisieren eines Downloads mit optionalem Dateiupload
  updateDownloadWithFiles(id: number, formData: FormData): Observable<Download> {
    return this.http.put<Download>(`${this.apiUrl}/${id}`, formData);
  }

  // Bestehende Methoden
  createDownload(download: Partial<Download>): Observable<Download> {
    // Diese Methode wird eventuell nicht mehr direkt verwendet, wenn immer mit Files hochgeladen wird
    // Behalten Sie sie vorerst bei, falls sie noch an anderer Stelle im Code genutzt wird
    return this.http.post<Download>(this.apiUrl, download);
  }

  updateDownload(id: number, download: Partial<Download>): Observable<Download> {
    // Diese Methode wird eventuell nicht mehr direkt verwendet
    return this.http.put<Download>(`${this.apiUrl}/${id}`, download);
  }

  deleteDownload(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  reorderDownloads(orderUpdates: { id: number; order: number }[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/reorder`, { orderUpdates });
  }
}
