import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/department'; // Behalten Sie diesen Import

/**
 * Service zur Verwaltung und Abfrage von Abteilungsdaten.
 *
 * @export
 * @class DepartmentService
 */
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  /**
   * Basis-URL für die Abteilungs-API.
   *
   * @private
   * @memberof DepartmentService
   */
  private apiUrl = '/api/departments';

  /**
   * Erstellt eine Instanz des DepartmentService.
   *
   * @param {HttpClient} http HTTP-Client zur Kommunikation mit der API
   * @memberof DepartmentService
   */
  constructor(private http: HttpClient) { }

  /**
   * Holt die Liste aller Abteilungen vom Server.
   *
   * @returns {Observable<Department[]>} Observable mit dem Array von Abteilungen
   * @memberof DepartmentService
   */
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }
}
