
import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { ErrorInterceptor } from './error.interceptor';

describe('HttpErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let alertService: jasmine.SpyObj<AlertService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    alertService = jasmine.createSpyObj('AlertService', ['error', 'warning']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AlertService, useValue: alertService },
        { provide: Router, useValue: router },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle 401 Unauthorized', () => {
    http.get('/test').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(alertService.warning).toHaveBeenCalledWith(
      'Your session has expired. Please log in again.'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should handle 403 Forbidden', () => {
    http.get('/test').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 403, statusText: 'Forbidden' });

    expect(alertService.error).toHaveBeenCalledWith(
      'You do not have permission to perform this action.'
    );
    expect(router.navigate).toHaveBeenCalledWith(['/forbidden']);
  });

  it('should handle 500 Internal Server Error', () => {
    http.get('/test').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });

    expect(alertService.error).toHaveBeenCalledWith(
      'Internal server error. Please try again later.'
    );
  });

  it('should rethrow the error', () => {
    let caughtError: HttpErrorResponse | undefined;

    http.get('/test').subscribe({ error: (err) => (caughtError = err) });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });

    expect(caughtError).toBeTruthy();
    expect(caughtError!.status).toBe(500);
  });

  it('should handle network error (status 0)', () => {
    http.get('/test').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/test');
    req.error(new ProgressEvent('error'));

    expect(alertService.error).toHaveBeenCalledWith(
      'Cannot connect to the server. Please try again later.'
    );
  });
});
