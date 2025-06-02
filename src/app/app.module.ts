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

import { routes } from './app.routes';

@NgModule({
  declarations: [
    TermineComponent,
    LoginComponent,
    NavbarComponent,
    RegistrationComponent,
    ResetPasswordComponent,
    SectionFormatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {}
