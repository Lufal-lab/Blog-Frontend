

import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private alert: AlertService,
    private injector: Injector
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const authService = this.injector.get(AuthService);

        console.error('Error detectado por el interceptor:', error.status);

        const isLoginUrl = request.url.includes('/api/users/login/');
        const isCheckSessionUrl = request.url.includes('/api/users/me/');
        const isLogoutUrl = request.url.includes('/api/users/logout/');

        if (isCheckSessionUrl) {
          return throwError(() => error);
        }

        if (isLogoutUrl) {
          if (error.status === 401) {
            authService.completeLogoutCleanup();
            return throwError(() => error);
          }
          // Nota: El 403 de Logout ahora caerá en la lógica de abajo
        }

        // 1. Caso 0: Servidor apagado
        if (error.status === 0) {
          this.alert.error('Cannot connect to the server. Is the backend running?');
          return throwError(() => error);
        }

        // 2. Error en Login
        if ((error.status === 401 || error.status === 400) && isLoginUrl) {
          return throwError(() => error);
        }

        // 3. Lógica Inteligente para 403 (Diferenciar CSRF de Permisos)
        if (error.status === 403 && !isCheckSessionUrl) {
          // Revisamos si el error es de CSRF buscando en el cuerpo de la respuesta
          const errorBody = JSON.stringify(error.error).toLowerCase();

          const isAuthCredentialsMissing =
            errorBody.includes('authentication credentials were not provided');

          if (isAuthCredentialsMissing) {
            this.alert.warning('Session expired. Please login again.');
            authService.completeLogoutCleanup();
            this.router.navigate(['/posts']); // o ['/login'] si prefieres
            return throwError(() => error);
          }

          const isCsrfError = errorBody.includes('csrf') || errorBody.includes('cookie');

          if (isCsrfError) {
            const isWriteOperation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);
            if (isWriteOperation) {
              authService.refreshSession();
              this.alert.warning('Security token issue. Please try your action again.');
              return throwError(() => error); // Cortamos aquí para el caso de CSRF
            }
          }
          // Si NO es error de CSRF, permitimos que siga al 'switch' para mostrar
          // el error de permisos real (ej: "You do not have permission")
        }

        // 4. Manejo general de otros estados
        switch (error.status) {
          case 401:
            if (!isLoginUrl && !isCheckSessionUrl) {
              this.alert.warning('Session expired. Please login again.');
              authService.completeLogoutCleanup();
              this.router.navigate(['/posts']);
            }
            break;

          case 500:
            this.alert.error('Internal server error on the backend.');
            break;

          case 504:
            this.alert.error('Gateway Timeout. The server is not responding.');
            break;

          default:
            // --- AQUÍ SE MOSTRARÁ TU MENSAJE DE PERMISOS ("You do not have permission") ---
            if (error.error && typeof error.error === 'object') {
              const errors = error.error;
              const extractedMessages = Object.keys(errors).map(key => {
                const value = errors[key];
                const cleanValue = Array.isArray(value) ? value.join(' ') : value;
                const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
                return `${formattedKey}: ${cleanValue}`;
              });

              if (extractedMessages.length > 0) {
                this.alert.error(extractedMessages.join(' | '));
              }
            } else if (typeof error.error === 'string') {
              this.alert.error(error.error);
            }
            break;
        }

        return throwError(() => error);
      })
    );
  }
}
