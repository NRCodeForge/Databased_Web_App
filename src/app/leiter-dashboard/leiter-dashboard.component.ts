import { Component } from '@angular/core';
import {NewsBuilderComponent} from "../news-builder/news-builder.component";

@Component({
  selector: 'app-leiter-dashboard',
  templateUrl: './leiter-dashboard.component.html',
  imports: [
    NewsBuilderComponent
  ],
  styleUrls: ['./leiter-dashboard.component.css']
})
export class LeiterDashboardComponent {

}
