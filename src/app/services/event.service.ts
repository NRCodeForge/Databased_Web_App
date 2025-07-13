import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Event } from '../models/event.model'; // Modell bei Bedarf erstellen

/**
 * Service für die Verwaltung von Events.
 * 
 * Dieser Service stellt Methoden bereit, um Event-Daten vom Backend abzurufen und zu verwalten.
 */
@Injectable({
  providedIn: 'root'
})
export class EventService {
  /** Basis-URL der Event-API */
  private apiUrl = '/api/events';

  /**
   * Konstruktor zum Injizieren des HttpClient.
   * @param http HttpClient für HTTP-Anfragen
   */
  constructor(private http: HttpClient) { }

  /**
   * Beispielmethode zum Abrufen aller Events vom Backend.
   * Diese Methode ist aktuell auskommentiert und kann bei Bedarf implementiert werden.
   * 
   * @returns Observable mit einer Liste von Events
   */
  // getEvents(): Observable<Event[]> {
  //   return this.http.get<Event[]>(this.apiUrl);
  // }
}
