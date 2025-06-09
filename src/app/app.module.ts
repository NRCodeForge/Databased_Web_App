import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// WICHTIG: Diese beiden Module müssen importiert werden, um Formulare und *ngIf zu ermöglichen
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { routes } from './app.routes';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { NewsComponent } from './news/news.component';
import { TermineComponent } from './termine/termine.component';
import { ForumComponent } from './forum/forum.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SectionFormatComponent } from './section-format/section-format.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegistrationComponent,
    NewsComponent,
    TermineComponent,
    ForumComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),

    // Durch den Import hier werden die Module für alle oben deklarierten Komponenten verfügbar gemacht
    CommonModule,
    FormsModule,

    // Standalone-Komponenten müssen separat importiert werden
    SectionFormatComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
