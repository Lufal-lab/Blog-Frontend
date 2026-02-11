import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginFormComponent } from './pages/login-form/login-form.component';
import { RegisterFormComponent } from './pages/register-form/register-form.component';
import { PostsComponent } from './pages/posts/posts.component';
import { PostIdComponent } from './pages/post-id/post-id.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    LoginFormComponent,
    RegisterFormComponent,
    PostsComponent,
    PostIdComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
