import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { PageViewsChartComponent } from './page-view-chart/page-view-chart.component';

/**
 * Hauptkomponente für das Admin-Dashboard.
 * Integriert Routing-Funktionen sowie die PageViewsChart-Komponente.
 * 
 * @export
 * @class AdminDashboardComponent
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  /**
   * Importierte Module und Komponenten, die innerhalb dieser Komponente verwendet werden.
   */
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PageViewsChartComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {}
