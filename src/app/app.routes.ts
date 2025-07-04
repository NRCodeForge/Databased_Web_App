import { Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NewsComponent } from './news/news.component';
import { TermineComponent } from './termine/termine.component';
import { ForumComponent } from './forum/forum.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LeiterDashboardComponent } from './leiter-dashboard/leiter-dashboard.component';
import { StartseiteComponent } from './startseite/startseite.component';
import { ContentManagerComponent } from './admin-dashboard/content-manager/content-manager.component';
import { DepartmentManagerComponent } from './admin-dashboard/department-manager/department-manager.component';
import { EventManagerComponent } from './admin-dashboard/event-manager/event-manager.component';
import { CategoryManagerComponent } from './admin-dashboard/category-manager/category-manager.component';

export const routes: Routes = [
  {path: '', component: StartseiteComponent},
  {path:"login-component", component:LoginComponent},
  {path:"navbar-component", component:NavbarComponent},
  {path:"registration-component", component:RegistrationComponent},
  {path:"reset-password-component", component:ResetPasswordComponent},
  {path:"news-component", component:NewsComponent},
  {path:"termine-component", component:TermineComponent},
  {path:"forum-component", component:ForumComponent},
  {path:"dashboard/admin", component:AdminDashboardComponent, children: [
      { path: 'content', component: ContentManagerComponent },
      { path: 'departments', component: DepartmentManagerComponent },
      { path: 'events', component: EventManagerComponent },
      { path: 'categories', component: CategoryManagerComponent },
    ]},
  {path:"dashboard/leiter", component:LeiterDashboardComponent}
];
