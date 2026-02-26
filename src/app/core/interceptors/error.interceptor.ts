
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
        // Obtenemos el AuthService a través del injector para evitar la dependencia circular
        const authService = this.injector.get(AuthService);

        console.error('Error detectado por el interceptor:', error.status);

        const isLoginUrl = request.url.includes('/api/users/login/');
        const isCheckSessionUrl = request.url.includes('/api/users/me/');
        const isLogoutUrl = request.url.includes('/api/users/logout/');

        // 1. Gestionar errores de Logout
        // if (isLogoutUrl && (error.status === 401 || error.status === 403)) {
        //   this.router.navigate(['/auth/login']);
        //   return throwError(() => error);
        // }

        if (isCheckSessionUrl) {
        return throwError(() => error);
      }

        if (isLogoutUrl) {
          if (error.status === 403) {
              // Si es 403, permitimos que el flujo siga al punto 4 (el de CSRF)
              // No redirigimos todavía para que el refreshSession haga su trabajo.
          } else if (error.status === 401) {
              authService.completeLogoutCleanup();
              return throwError(() => error);
          }
        }

        // 2. Caso 0: Servidor apagado o error de red (CORS o Proxy fallando)
        if (error.status === 0) {
          this.alert.error('Cannot connect to the server. Is the backend running?');
          return throwError(() => error);
        }

        // 3. Error en Login (Credenciales inválidas)
        if ((error.status === 401 || error.status === 400) && isLoginUrl) {
          return throwError(() => error);
        }

        // // 4. Error 403: Problema de CSRF (Tu error actual)
        // if (error.status === 403 && !isCheckSessionUrl) {
        //   // Si no tenemos token, refrescamos la sesión para que el backend nos envíe la cookie
        //   authService.refreshSession();
        //   this.alert.warning('Security token issue. Please try your action again.');
        //   return throwError(() => error);
        // }

        if (error.status === 403 && !isCheckSessionUrl) {

          // 🟢 CAMBIO: Solo alertar y refrescar si es una operación de escritura
          const isWriteOperation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);

          if (isWriteOperation) {
            authService.refreshSession();
            this.alert.warning('Security token issue. Please try your action again.');
          }

          // Si es un GET (como posts), simplemente devolvemos el error en silencio
          return throwError(() => error);
        }

        // 5. Manejo general de otros estados
        switch (error.status) {
          case 401:
            if (!isLoginUrl && !isCheckSessionUrl) {
              this.alert.warning('Session expired. Please login again.');
              // authService.logout();
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
            // Si el error tiene un objeto con mensajes detallados (típico de Django Rest Framework)
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
