import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Korrekter Importname 'routes'

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Korrekte Variable verwenden
    provideHttpClient()
  ]
}).catch(err => console.error(err));
