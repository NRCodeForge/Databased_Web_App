import { Component } from '@angular/core';
import {NewsBuilderComponent} from "../news-builder/news-builder.component";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  imports: [
    NewsBuilderComponent
  ],
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

}
