import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
// RegistrationComponent wird nicht mehr importiert
import { NewsComponent } from './news/news.component';
import { TermineComponent } from './termine/termine.component';
import { ForumComponent } from './forum/forum.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SectionFormatComponent } from './section-format/section-format.component';
import { StartseiteComponent } from './startseite/startseite.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    // RegistrationComponent entfernt
    NewsComponent,
    ResetPasswordComponent,
    StartseiteComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    CommonModule,
    FormsModule,
    SectionFormatComponent,
    // Standalone-Komponenten werden hier importiert, wenn sie in Templates von Nicht-Standalone-Komponenten verwendet werden
    TermineComponent,
    ForumComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
