// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NewsComponent } from './news/news.component';
import { TermineComponent } from './termine/termine.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LeiterDashboardComponent } from './leiter-dashboard/leiter-dashboard.component';
import { StartseiteComponent } from './startseite/startseite.component';
import { ContentManagerComponent } from './admin-dashboard/content-manager/content-manager.component';
import { DepartmentManagerComponent } from './admin-dashboard/department-manager/department-manager.component';
import { EventManagerComponent } from './admin-dashboard/event-manager/event-manager.component';
import { CategoryManagerComponent } from './admin-dashboard/category-manager/category-manager.component';
import { AbteilungenComponent } from './abteilungen/abteilungen.component';
import { DerVereinComponent } from './der-verein/der-verein.component';
import { BogenComponent } from './abteilungen/bogen/bogen.component';
import { JugendundschuelerComponent } from './abteilungen/jugendundschueler/jugendundschueler.component';
import { PistolensportComponent } from './abteilungen/pistolensport/pistolensport.component';
import { SeniorenComponent } from './abteilungen/senioren/senioren.component';
import { UserManagementComponent } from './admin-dashboard/user-management/user-management.component';
import { SvFestComponent } from './sv-fest/sv-fest.component';
import { DownloadsComponent } from './downloads/downloads.component'; // Already imported
import { LinkManagerComponent } from './admin-dashboard/link-manager/link-manager.component'; // Importiere LinkManagerComponent
import {authGuard} from "./guards/auth.guard";


export const routes: Routes = [
  {path: '', component: StartseiteComponent},
  {path: 'schuetzenfest', component: SvFestComponent },
  {path: "login", component:LoginComponent},
  {path: "navbar", component:NavbarComponent},
  {path: "registration", component:RegistrationComponent},
  {path: "reset", component:ResetPasswordComponent},
  {path: "news", component:NewsComponent},
  {path: "abteilung", component:AbteilungenComponent, children: [
      { path: 'bogen', component:BogenComponent},
      { path: 'jugendundschueler', component:JugendundschuelerComponent},
      { path: 'pistolensport', component:PistolensportComponent},
      { path: 'senioren', component:SeniorenComponent},
    ]},
  {path: "termin", component:TermineComponent},
  {path: "der-verein", component:DerVereinComponent},
  {path: "downloads", component: DownloadsComponent}, // Route for the public downloads page
  {path: "dashboard/admin",
    component: AdminDashboardComponent,
    children: [
      { path: 'content', component: ContentManagerComponent ,
        canActivate: [authGuard], // Schützt diese Route
        data: { role: 3 } // Nur Benutzer mit Rolle '3' (Admin) dürfen hier rein
      },
      { path: 'departments', component: DepartmentManagerComponent,
        canActivate: [authGuard], // Schützt diese Route
        data: { role: 3 } // Nur Benutzer mit Rolle '3' (Admin) dürfen hier rein
      },
      { path: 'events', component: EventManagerComponent ,
        canActivate: [authGuard], // Schützt diese Route
        data: { role: 3 } // Nur Benutzer mit Rolle '3' (Admin) dürfen hier rein
      },
      { path: 'categories', component: CategoryManagerComponent ,
        canActivate: [authGuard], // Schützt diese Route
        data: { role: 3 } // Nur Benutzer mit Rolle '3' (Admin) dürfen hier rein
      },
      { path: 'users', component: UserManagementComponent ,
        canActivate: [authGuard], // Schützt diese Route
        data: { role: 3 } // Nur Benutzer mit Rolle '3' (Admin) dürfen hier rein
      },
      { path: 'link-manager', component: LinkManagerComponent, // Neue Route für den Link-Manager
        canActivate: [authGuard], // Schützt diese Route
        data: { role: 3 } // Nur Benutzer mit Rolle '3' (Admin) dürfen hier rein
      }
    ],
    canActivate: [authGuard], // Schützt diese Route
    data: { role: 3 } // Nur Benutzer mit Rolle '3' (Admin) dürfen hier rein
  },
  {
    path: "dashboard/leiter",
    component: LeiterDashboardComponent,
    canActivate: [authGuard], // Schützt diese Route
    data: { role: 2 } // Nur Benutzer mit Rolle '2' (Leiter) dürfen hier rein
  },

];
