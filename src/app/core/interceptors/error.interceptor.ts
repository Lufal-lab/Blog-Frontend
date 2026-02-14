import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private alert: AlertService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {

          // 🌐 Network / server unreachable
          if (error.status === 0) {
            this.alert.error('Cannot connect to the server. Please try again later.');
            return throwError(() => error);
          }

          switch (error.status) {

            // 🔐 Unauthorized / session expired
            case 401:
              this.authService.logout();
              this.alert.warning('Your session has expired. Please log in again.');
              this.router.navigate(['/auth/login']);
              break;

            // ⛔ Forbidden / no permissions
            case 403:
              this.alert.error('You do not have permission to perform this action.');
              this.router.navigate(['/forbidden']);
              break;

            // 💥 Internal Server Error
            case 500:
              this.alert.error('Internal server error. Please try again later.');
              break;

            // ⚠️ Other unhandled errors
            default:
              this.alert.error('An unexpected error occurred.');
          }

          return throwError(() => error);
        })
      );
  }
}
