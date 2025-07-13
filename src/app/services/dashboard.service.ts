import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Schnittstelle zur Beschreibung der Statistikdaten für das Dashboard.
 *
 * @export
 * @interface DashboardStats
 */
export interface DashboardStats {
  /** Gesamtanzahl der Benutzer */
  totalUsers: number;
  /** Gesamtanzahl der Beiträge */
  totalPosts: number;
  /** Gesamtanzahl der Abteilungen */
  totalDepartments: number;
}

/**
 * Service zur Abfrage von Dashboard-Statistiken vom Backend.
 *
 * @export
 * @class DashboardService
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  /**
   * Basis-URL für die Statistik-API.
   *
   * @private
   * @type {string}
   * @memberof DashboardService
   */
  private apiUrl = 'http://localhost:3000/api/stats';

  /**
   * Erstellt eine Instanz des DashboardService.
   *
   * @param {HttpClient} http HTTP-Client für API-Anfragen
   * @memberof DashboardService
   */
  constructor(private http: HttpClient) { }

  /**
   * Holt die Statistikdaten für das Dashboard.
   *
   * @returns {Observable<DashboardStats>} Observable mit den Statistikdaten
   * @memberof DashboardService
   */
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl);
  }
}
