import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private alert: AlertService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // IMPORTANTE: Aquí solo dejamos pasar la petición
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Log para que veas qué error llega
        console.error('Error detectado por el interceptor:', error.status);

        let errorMessage = 'An error occurred';
        const isLoginUrl = request.url.includes('/api/users/login/');
        const isCheckSessionUrl = request.url.includes('/api/users/me/');
        const isLogoutUrl = request.url.includes('/api/users/logout/');

        // Caso 0: Servidor apagado o error de red
        if (error.status === 0) {
          errorMessage = 'Cannot connect to the server. Is the backend running?';
          this.alert.error(errorMessage);
        }

        if (isLogoutUrl && (error.status === 401 || error.status === 403)) {
          this.router.navigate(['/auth/login']);
          return throwError(() => error);
        }

        if ((error.status === 401 || error.status === 400) && isLoginUrl) {
          // Devolvemos el error al componente para que él lo maneje con su mensaje local
          return throwError(() => error);
        }

        if (error.status === 403 && isCheckSessionUrl) {
          // Silenciamos el error de "no logueado" al cargar la app
          return throwError(() => error);
        }
        else {
          // Manejo de otros estados
          switch (error.status) {
            case 0:
            case 504: // Gateway Timeout (Proxy fallando)
              this.alert.error('Cannot connect to the server. Is the backend running?');
              break;
            case 401:
              this.alert.warning('Session expired. Please login again.');
              this.router.navigate(['/auth/login']);
              break;
            case 403:
              this.alert.error('You do not have permission.');
              break;
            case 500:
              this.alert.error('Internal server error.');
              break;
            default:
            let backMsg = 'Unexpected error';


            if (error.error && typeof error.error === 'object') {
              const errors = error.error;

              // Extraemos las llaves y sus mensajes
              const extractedMessages = Object.keys(errors).map(key => {
                const value = errors[key];
                const cleanValue = Array.isArray(value) ? value.join(' ') : value;

                // Formateamos para que diga "Campo: Mensaje"
                // Capitalizamos la primera letra de la key (ej: title -> Title)
                const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
                return `${formattedKey}: ${cleanValue}`;
              });

              if (extractedMessages.length > 0) {
                // Si hay varios campos con error, los separamos con un salto de línea o un pipe
                backMsg = extractedMessages.join(' | ');
              }
            } else if (typeof error.error === 'string') {
              backMsg = error.error;
            }

            this.alert.error(backMsg);
            break;
          }
        }

        // ¡ESTO ES VITAL! Retornamos el error para que el componente no se quede esperando
        return throwError(() => error);
      })
    );
  }
}
