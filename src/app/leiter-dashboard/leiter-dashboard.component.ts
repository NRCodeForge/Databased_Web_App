// src/app/leiter-dashboard/leiter-dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router'; // Import RouterOutlet and RouterModule
import { PageViewsChartComponent } from '../admin-dashboard/page-view-chart/page-view-chart.component';

@Component({
  selector: 'app-leiter-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, // Add RouterOutlet to imports
    RouterModule, // Add RouterModule to imports for routerLink
    PageViewsChartComponent
  ],
  templateUrl: './leiter-dashboard.component.html',
  styleUrls: ['./leiter-dashboard.component.css']
})
export class LeiterDashboardComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}
}
