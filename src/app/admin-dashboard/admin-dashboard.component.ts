import { Component } from '@angular/core';
import { NewsBuilderComponent } from "../news-builder/news-builder.component";
import { ContentManagerComponent } from './content-manager/content-manager.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  imports: [
    NewsBuilderComponent,
    ContentManagerComponent
  ],
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

}
