import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { PageViewsChartComponent } from '../admin-dashboard/page-view-chart/page-view-chart.component';

/**
 * Komponente für das Leiter-Dashboard.
 * Zeigt Übersichtsinhalte und integriert Routing sowie die PageViewsChart-Komponente.
 * 
 * @export
 * @class LeiterDashboardComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-leiter-dashboard',
  standalone: true,
  /**
   * Importierte Module und Komponenten, die in der Vorlage verwendet werden.
   */
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    PageViewsChartComponent
  ],
  templateUrl: './leiter-dashboard.component.html',
  styleUrls: ['./leiter-dashboard.component.css']
})
export class LeiterDashboardComponent implements OnInit {

  /**
   * Erstellt eine Instanz von LeiterDashboardComponent.
   */
  constructor() {}

  /**
   * Lifecycle-Hook: Initialisierung der Komponente.
   */
  ngOnInit(): void {}
}
