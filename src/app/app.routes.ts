
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


export const routes: Routes = [
    {path:"login-component", component:LoginComponent},
    {path:"navbar-component", component:NavbarComponent},
    {path:"registration-component", component:RegistrationComponent},
    {path:"reset-password-component", component:ResetPasswordComponent},
    {path:"news-component", component:NewsComponent},
    {path:"termine-component", component:TermineComponent},
    {path:"forum-component", component:ForumComponent},
    {path:"dashboard/admin", component:AdminDashboardComponent},
    {path:"dashboard/leiter", component:LeiterDashboardComponent}
];
