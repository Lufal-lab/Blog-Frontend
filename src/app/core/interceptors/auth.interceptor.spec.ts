import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the interceptor', () => {
    const interceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should always send requests with credentials', () => {
    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.withCredentials).toBeTrue();

    req.flush({});
  });

  it('should add X-CSRFToken header on POST if token exists', () => {
    spyOnProperty(document, 'cookie', 'get')
      .and.returnValue('csrftoken=test-token');

    http.post('/api/test', {}).subscribe();

    const req = httpMock.expectOne('/api/test');

    expect(req.request.headers.get('X-CSRFToken')).toBe('test-token');
    expect(req.request.withCredentials).toBeTrue();

    req.flush({});
  });

  it('should NOT add X-CSRFToken header if token does not exist', () => {
    spyOnProperty(document, 'cookie', 'get')
      .and.returnValue('');

    http.post('/api/test', {}).subscribe();

    const req = httpMock.expectOne('/api/test');

    expect(req.request.headers.has('X-CSRFToken')).toBeFalse();
    expect(req.request.withCredentials).toBeTrue();

    req.flush({});
  });

  it('should not add X-CSRFToken header on GET requests', () => {
    spyOnProperty(document, 'cookie', 'get')
      .and.returnValue('csrftoken=test-token');

    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');

    expect(req.request.headers.has('X-CSRFToken')).toBeFalse();
    expect(req.request.withCredentials).toBeTrue();

    req.flush({});
  });
});
