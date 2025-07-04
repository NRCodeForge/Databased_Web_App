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
// Die RegistrationComponent wird hier NICHT mehr importiert oder deklariert
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
    // RegistrationComponent wurde hier entfernt
    NewsComponent,
    ResetPasswordComponent,
    StartseiteComponent
  ],
  imports: [
    // ... andere Module
    // Standalone-Komponenten müssen hier importiert werden,
    // wenn sie in den Templates der deklarierten Komponenten verwendet werden.
    TermineComponent,
    ForumComponent
  ],
  // ...
})
export class AppModule { }
