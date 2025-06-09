import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { TermineComponent } from './termine/termine.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegistrationComponent } from './registration/registration.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SectionFormatComponent } from './section-format/section-format.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LeiterDashboardComponent } from './leiter-dashboard/leiter-dashboard.component';
import { NewsBuilderComponent } from './news-builder/news-builder.component';

import { routes } from './app.routes';

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    TermineComponent,
    NavbarComponent,
    LoginComponent,
    RegistrationComponent,
    ResetPasswordComponent,
    SectionFormatComponent,
    AdminDashboardComponent,
    LeiterDashboardComponent,
    NewsBuilderComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {}
