import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
// import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
// import { LoginFormComponent } from './features/auth/login-form/login-form.component';
// import { RegisterFormComponent } from './features/auth/register-form/register-form.component';
// import { PostIdComponent } from './features/pages/post-id/post-id.component';
// import { PaginationComponent } from './shared/components/pagination/pagination.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
// import { HeaderComponent } from './shared/components/header/header.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    // HeaderComponent,
    MainLayoutComponent,
    // LoginFormComponent,
    // RegisterFormComponent,
    // PostIdComponent,
    // PaginationComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    // ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
