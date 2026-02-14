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
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {

      const csrfToken = this.getCookie('csrftoken');

      if (csrfToken) {
        const cloned = request.clone({
          headers: request.headers.set('X-CSRFToken', csrfToken),
          withCredentials: true
        });
        return next.handle(cloned);
      }
    }

    return next.handle(request.clone({ withCredentials: true }));
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? decodeURIComponent(match[2]) : null;
  }
}
