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
import { DownloadsComponent } from './downloads/downloads.component';
import { LinkManagerComponent } from './admin-dashboard/link-manager/link-manager.component';
import { authGuard } from "./guards/auth.guard";
import { KalenderComponent } from './kalender/kalender.component';

/**
 * Definiert alle Routen der Angular-Anwendung inklusive der zugeordneten Komponenten und Guards.
 *
 * @remarks
 * - Öffentliche Seiten wie Startseite, Login, News, Abteilungen etc.
 * - Geschützte Admin- und Leiter-Dashboards mit rollenbasiertem Zugriffsschutz.
 * - Nested Routes für Unterseiten der Abteilungen und Dashboards.
 *
 * @example
 * ```typescript
 * // Beispiel einer Route für die Startseite
 * { path: '', component: StartseiteComponent }
 * ```
 */
export const routes: Routes = [
  { path: '', component: StartseiteComponent },

  { path: 'schuetzenfest', component: SvFestComponent },
  { path: "login", component: LoginComponent },
  { path: "navbar", component: NavbarComponent },
  { path: "registration", component: RegistrationComponent },
  { path: "reset", component: ResetPasswordComponent },
  { path: "news", component: NewsComponent },
  { path: "kalender", component: KalenderComponent},

  {
    path: "abteilung",
    component: AbteilungenComponent,
    children: [
      { path: 'bogen', component: BogenComponent },
      { path: 'jugendundschueler', component: JugendundschuelerComponent },
      { path: 'pistolensport', component: PistolensportComponent },
      { path: 'senioren', component: SeniorenComponent },
    ]
  },

  { path: "termin", component: TermineComponent },
  { path: "der-verein", component: DerVereinComponent },
  { path: "downloads", component: DownloadsComponent },

  {
    path: "dashboard/admin",
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { role: 3 }, // Nur Admins dürfen die Dashboard-Routen nutzen
    children: [
      {
        path: 'content',
        component: ContentManagerComponent,
        canActivate: [authGuard],
        data: { role: 3 }
      },
      {
        path: 'events',
        component: EventManagerComponent,
        canActivate: [authGuard],
        data: { role: 3 }
      },
      {
        path: 'categories',
        component: CategoryManagerComponent,
        canActivate: [authGuard],
        data: { role: 3 }
      },
      {
        path: 'users',
        component: UserManagementComponent,
        canActivate: [authGuard],
        data: { role: 3 }
      },
      {
        path: 'link-manager',
        component: LinkManagerComponent,
        canActivate: [authGuard],
        data: { role: 3 }
      }
    ]
  },

  {
    path: "dashboard/leiter",
    component: LeiterDashboardComponent,
    canActivate: [authGuard],
    data: { role: 2 }, // Nur Abteilungsleiter mit Rolle 2 dürfen hier rein
    children: [
      {
        path: 'content',
        component: ContentManagerComponent,
        canActivate: [authGuard],
        data: { role: 2 }
      },
      {
        path: 'events',
        component: EventManagerComponent,
        canActivate: [authGuard],
        data: { role: 2 }
      }
    ]
  },
];
