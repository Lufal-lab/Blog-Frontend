// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor
// } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {

//   constructor() {}

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {

//       const csrfToken = this.getCookie('csrftoken');

//       if (csrfToken) {
//         const cloned = request.clone({
//           headers: request.headers.set('X-CSRFToken', csrfToken),
//           withCredentials: true
//         });
//         return next.handle(cloned);
//       }
//     }

//     return next.handle(request.clone({ withCredentials: true }));
//   }

//   private getCookie(name: string): string | null {
//     const match = document.cookie.match(
//       new RegExp('(^| )' + name + '=([^;]+)')
//     );
//     return match ? decodeURIComponent(match[2]) : null;
//   }
// }


import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 1. Siempre usamos withCredentials para que el navegador maneje las cookies de sesión
    let authReq = request.clone({ withCredentials: true });

    // 2. Solo inyectamos el header X-CSRFToken en métodos de escritura
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      const csrfToken = this.getCookie('csrftoken');

      if (csrfToken) {
        authReq = authReq.clone({
          headers: authReq.headers.set('X-CSRFToken', csrfToken)
        });
      } else {
        // Log opcional para debug: aquí es donde el ErrorInterceptor entrará al rescate
        // si el backend rechaza la petición por falta de este token.
        console.warn('CSRF token no encontrado en cookies para petición:', request.method);
      }
    }

    return next.handle(authReq);
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? decodeURIComponent(match[2]) : null;
  }
}
