// import { TestBed } from '@angular/core/testing';
// import { Router } from '@angular/router';
// import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
// import { of, throwError } from 'rxjs';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { RouterTestingModule } from '@angular/router/testing';


// import { ErrorInterceptor } from './error.interceptor';
// import { AlertService } from '../services/alert.service';

// describe('ErrorInterceptor', () => {
//   let interceptor: ErrorInterceptor;
//   let alertService: jasmine.SpyObj<AlertService>;
//   let router: jasmine.SpyObj<Router>;

//   beforeEach(() => {
//     alertService = jasmine.createSpyObj('AlertService', ['error', 'warning']);
//     router = jasmine.createSpyObj('Router', ['navigate']);

//     TestBed.configureTestingModule({
//       imports: [
//       HttpClientTestingModule, // Provee el HttpClient simulado
//       RouterTestingModule,
//     ],
//       providers: [
//         ErrorInterceptor,
//         { provide: AlertService, useValue: alertService },
//         { provide: Router, useValue: router }
//       ]
//     });

//     interceptor = TestBed.inject(ErrorInterceptor);
//   });

//   function createNext(handleReturn: any): HttpHandler {
//     return {
//       handle: jasmine.createSpy('handle').and.returnValue(handleReturn)
//     } as any;
//   }

//   it('should alert and throw for network/server down (status 0)', () => {
//     const req = new HttpRequest('GET', '/api/test');
//     const error = new HttpErrorResponse({ status: 0 });

//     const next = createNext(throwError(() => error));

//     interceptor.intercept(req, next).subscribe({
//       error: err => {
//         expect(err).toBe(error);
//         expect(alertService.error).toHaveBeenCalledWith('Cannot connect to the server. Is the backend running?');
//       }
//     });
//   });

//   it('should pass 401/400 on login without alerts', () => {
//     const req = new HttpRequest('POST' as any, '/api/users/login/');
//     const error = new HttpErrorResponse({ status: 401 });

//     const next = createNext(throwError(() => error));

//     interceptor.intercept(req, next).subscribe({
//       error: err => {
//         expect(err).toBe(error);
//         expect(alertService.error).not.toHaveBeenCalled();
//         expect(alertService.warning).not.toHaveBeenCalled();
//         expect(router.navigate).not.toHaveBeenCalled();
//       }
//     });
//   });

//   it('should pass 403 on /me without alerts', () => {
//     const req = new HttpRequest('GET', '/api/users/me/');
//     const error = new HttpErrorResponse({ status: 403 });

//     const next = createNext(throwError(() => error));

//     interceptor.intercept(req, next).subscribe({
//       error: err => {
//         expect(err).toBe(error);
//         expect(alertService.error).not.toHaveBeenCalled();
//         expect(alertService.warning).not.toHaveBeenCalled();
//       }
//     });
//   });

//   it('should alert and navigate on 401 general', () => {
//     const req = new HttpRequest('GET', '/api/test');
//     const error = new HttpErrorResponse({ status: 401 });

//     const next = createNext(throwError(() => error));

//     interceptor.intercept(req, next).subscribe({
//       error: err => {
//         expect(err).toBe(error);
//         expect(alertService.warning).toHaveBeenCalledWith('Session expired. Please login again.');
//         expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
//       }
//     });
//   });

//   it('should alert on 403 general', () => {
//     const req = new HttpRequest('GET', '/api/test');
//     const error = new HttpErrorResponse({ status: 403 });

//     const next = createNext(throwError(() => error));

//     interceptor.intercept(req, next).subscribe({
//       error: err => {
//         expect(err).toBe(error);
//         expect(alertService.error).toHaveBeenCalledWith('You do not have permission.');
//       }
//     });
//   });

//   it('should alert on 500', () => {
//     const req = new HttpRequest('GET', '/api/test');
//     const error = new HttpErrorResponse({ status: 500 });

//     const next = createNext(throwError(() => error));

//     interceptor.intercept(req, next).subscribe({
//       error: err => {
//         expect(err).toBe(error);
//         expect(alertService.error).toHaveBeenCalledWith('Internal server error.');
//       }
//     });
//   });

//   it('should alert on 504', () => {
//     const req = new HttpRequest('GET', '/api/test');
//     const error = new HttpErrorResponse({ status: 504 });

//     const next = createNext(throwError(() => error));

//     interceptor.intercept(req, next).subscribe({
//       error: err => {
//         expect(err).toBe(error);
//         expect(alertService.error).toHaveBeenCalledWith('Cannot connect to the server. Is the backend running?');
//       }
//     });
//   });

//   it('should alert with backend message for other errors', () => {
//     const req = new HttpRequest('GET', '/api/test');
//     const error = new HttpErrorResponse({
//       status: 400,
//       error: { message: 'Invalid input' }
//     });

//     const next = createNext(throwError(() => error));

//     interceptor.intercept(req, next).subscribe({
//       error: err => {
//         expect(err).toBe(error);
//         expect(alertService.error).toHaveBeenCalledWith('Message: Invalid input');
//       }
//     });
//   });

// });


import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { ErrorInterceptor } from './error.interceptor';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Creamos los mocks para las dependencias
    const aSpy = jasmine.createSpyObj('AlertService', ['error', 'warning']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authSpy = jasmine.createSpyObj('AuthService', ['refreshSession', 'completeLogoutCleanup']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        ErrorInterceptor,
        { provide: AlertService, useValue: aSpy },
        { provide: Router, useValue: rSpy },
        // Proveemos el AuthService simulado para evitar inyecciones reales
        { provide: AuthService, useValue: authSpy }
      ]
    });

    interceptor = TestBed.inject(ErrorInterceptor);
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  // Función auxiliar para simular el siguiente manejador en la cadena
  function createNext(handleReturn: any): HttpHandler {
    return {
      handle: jasmine.createSpy('handle').and.returnValue(handleReturn)
    } as any;
  }

  it('should alert and throw for network/server down (status 0)', () => {
    const req = new HttpRequest('GET', '/api/test');
    const error = new HttpErrorResponse({ status: 0 });
    const next = createNext(throwError(() => error));

    interceptor.intercept(req, next).subscribe({
      error: (err) => {
        expect(err).toBe(error);
        expect(alertService.error).toHaveBeenCalledWith('Cannot connect to the server. Is the backend running?');
      }
    });
  });

  it('should alert and navigate to /posts on 401 general', () => {
    const req = new HttpRequest('GET', '/api/test');
    const error = new HttpErrorResponse({ status: 401 });
    const next = createNext(throwError(() => error));

    interceptor.intercept(req, next).subscribe({
      error: () => {
        expect(alertService.warning).toHaveBeenCalledWith('Session expired. Please login again.');
        expect(authServiceSpy.completeLogoutCleanup).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/posts']);
      }
    });
  });

  it('should alert and refresh session on 403 (Forbidden) during POST', () => {
    // Debe ser POST para que tu interceptor dispare la alerta de CSRF/Security
    const req = new HttpRequest('POST', '/api/posts', {});
    const error = new HttpErrorResponse({ status: 403 });
    const next = createNext(throwError(() => error));

    interceptor.intercept(req, next).subscribe({
      error: () => {
        expect(authServiceSpy.refreshSession).toHaveBeenCalled();
        expect(alertService.warning).toHaveBeenCalledWith('Security token issue. Please try your action again.');
      }
    });
  });

  it('should alert on 500 Internal Server Error', () => {
    const req = new HttpRequest('GET', '/api/test');
    const error = new HttpErrorResponse({ status: 500 });
    const next = createNext(throwError(() => error));

    interceptor.intercept(req, next).subscribe({
      error: () => {
        expect(alertService.error).toHaveBeenCalledWith('Internal server error on the backend.');
      }
    });
  });

  it('should alert on 504 Gateway Timeout', () => {
    const req = new HttpRequest('GET', '/api/test');
    const error = new HttpErrorResponse({ status: 504 });
    const next = createNext(throwError(() => error));

    interceptor.intercept(req, next).subscribe({
      error: () => {
        expect(alertService.error).toHaveBeenCalledWith('Gateway Timeout. The server is not responding.');
      }
    });
  });

  it('should format and show backend validation errors (Object)', () => {
    const req = new HttpRequest('POST' as any, '/api/register');
    const errorResponse = new HttpErrorResponse({
      status: 400,
      error: { username: ['This field is required.'], email: ['Invalid format.'] }
    });
    const next = createNext(throwError(() => errorResponse));

    interceptor.intercept(req, next).subscribe({
      error: () => {
        // Tu código transforma las keys a Mayúsculas y concatena
        expect(alertService.error).toHaveBeenCalledWith('Username: This field is required. | Email: Invalid format.');
      }
    });
  });

  it('should pass 401/400 on login URL without side effects', () => {
    const req = new HttpRequest('POST', '/api/users/login/', {});
    const error = new HttpErrorResponse({ status: 401 });
    const next = createNext(throwError(() => error));

    interceptor.intercept(req, next).subscribe({
      error: () => {
        expect(alertService.error).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
      }
    });
  });
});
