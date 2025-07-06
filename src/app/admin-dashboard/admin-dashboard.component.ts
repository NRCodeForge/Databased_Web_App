import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
// Importieren Sie die neue Komponente
import { PageViewsChartComponent } from './page-view-chart/page-view-chart.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  // Fügen Sie die Komponente zu den Imports hinzu
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PageViewsChartComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {}
