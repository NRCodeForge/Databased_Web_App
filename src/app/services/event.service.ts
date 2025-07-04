import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Event } from '../models/event.model'; // Modell bei Bedarf erstellen

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = '/api/events';

  constructor(private http: HttpClient) { }

  // Beispielmethoden, die Sie später implementieren können
  // getEvents(): Observable<Event[]> {
  //   return this.http.get<Event[]>(this.apiUrl);
  // }
}
