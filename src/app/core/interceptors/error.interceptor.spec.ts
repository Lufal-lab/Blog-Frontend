import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { ErrorInterceptor } from './error.interceptor';
import { AlertService } from '../services/alert.service';

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    alertService = jasmine.createSpyObj('AlertService', ['error', 'warning']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        ErrorInterceptor,
        { provide: AlertService, useValue: alertService },
        { provide: Router, useValue: router }
      ]
    });

    interceptor = TestBed.inject(ErrorInterceptor);
  });

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
      error: err => {
        expect(err).toBe(error);
        expect(alertService.error).toHaveBeenCalledWith('Cannot connect to the server. Is the backend running?');
      }
    });
  });

  it('should pass 401/400 on login without alerts', () => {
    const req = new HttpRequest('POST' as any, '/api/users/login/');
    const error = new HttpErrorResponse({ status: 401 });

    const next = createNext(throwError(() => error));

    interceptor.intercept(req, next).subscribe({
      error: err => {
        expect(err).toBe(error);
        expect(alertService.error).not.toHaveBeenCalled();
        expect(alertService.warning).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
      }
    });
  });

  it('should pass 403 on /me without alerts', () => {
    const req = new HttpRequest('GET', '/api/users/me/');
    const error = new HttpErrorResponse({ status: 403 });

    const next = createNext(throwError(() => error));

    interceptor.intercept(req, next).subscribe({
      error: err => {
        expect(err).toBe(error);
        expect(alertService.error).not.toHaveBeenCalled();
        expect(alertService.warning).not.toHaveBeenCalled();
      }
    });
  });

  it('should alert and navigate on 401 general', () => {
    const req = new HttpRequest('GET', '/api/test');
    const error = new HttpErrorResponse({ status: 401 });

    const next = createNext(throwError(() => error));

    interceptor.intercept(req, next).subscribe({
      error: err => {
        expect(err).toBe(error);
        expect(alertService.warning).toHaveBeenCalledWith('Session expired. Please login again.');
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
      }
    });
  });

  it('should alert on 403 general', () => {
    const req = new HttpRequest('GET', '/api/test');
    const error = new HttpErrorResponse({ status: 403 });

    const next = createNext(throwError(() => error));

    interceptor.intercept(req, next).subscribe({
      error: err => {
        expect(err).toBe(error);
        expect(alertService.error).toHaveBeenCalledWith('You do not have permission.');
      }
    });
  });

  it('should alert on 500', () => {
    const req = new HttpRequest('GET', '/api/test');
    const error = new HttpErrorResponse({ status: 500 });

    const next = createNext(throwError(() => error));

    interceptor.intercept(req, next).subscribe({
      error: err => {
        expect(err).toBe(error);
        expect(alertService.error).toHaveBeenCalledWith('Internal server error.');
      }
    });
  });

  it('should alert on 504', () => {
    const req = new HttpRequest('GET', '/api/test');
    const error = new HttpErrorResponse({ status: 504 });

    const next = createNext(throwError(() => error));

    interceptor.intercept(req, next).subscribe({
      error: err => {
        expect(err).toBe(error);
        expect(alertService.error).toHaveBeenCalledWith('Cannot connect to the server. Is the backend running?');
      }
    });
  });

  it('should alert with backend message for other errors', () => {
    const req = new HttpRequest('GET', '/api/test');
    const error = new HttpErrorResponse({
      status: 400,
      error: { message: 'Invalid input' }
    });

    const next = createNext(throwError(() => error));

    interceptor.intercept(req, next).subscribe({
      error: err => {
        expect(err).toBe(error);
        expect(alertService.error).toHaveBeenCalledWith('Invalid input');
      }
    });
  });

});
