import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router'; // RouterOutlet und RouterLink importieren

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink], // Imports aktualisieren
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

}
