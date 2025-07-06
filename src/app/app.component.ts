import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { filter } from 'rxjs/operators';
import { TrackingService } from './services/tracking.service'; // Importieren

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, RouterOutlet, NavbarComponent]
})
export class AppComponent implements OnInit {
  title = 'Schützenverein Huchting';
  private router = inject(Router);
  private trackingService = inject(TrackingService); // Injizieren

  ngOnInit() {
    this.router.events.pipe(
      // Filtern, um nur erfolgreiche Navigationen zu bekommen
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Senden des URL-Pfades an den Tracking-Service
      this.trackingService.trackPageView(event.urlAfterRedirects);
    });
  }
}
