import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let httpHandlerSpy: jasmine.SpyObj<HttpHandler>;

  // Función para limpiar cookies
  function clearCookies() {
    document.cookie.split(';').forEach(c => {
      const name = c.split('=')[0].trim();
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
    });
  }

  beforeEach(() => {
    // Crear spy de HttpHandler
    httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

    // Configurar módulo de testing
    TestBed.configureTestingModule({
      providers: [AuthInterceptor]
    });

    interceptor = TestBed.inject(AuthInterceptor);

    // Limpiar cookies antes de cada test
    clearCookies();
  });

  afterEach(() => {
    // Limpiar cookies después de cada test
    clearCookies();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('CSRF header', () => {

    it('should add X-CSRFToken for POST if cookie exists', () => {
      document.cookie = 'csrftoken=test-token';

      const req = new HttpRequest<any>('POST' as any, '/test');

      httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<unknown>));

      interceptor.intercept(req, httpHandlerSpy);

      const handledReq = httpHandlerSpy.handle.calls.mostRecent().args[0];
      expect(handledReq.headers.get('X-CSRFToken')).toBe('test-token');
      expect(handledReq.withCredentials).toBeTrue();
    });

    it('should not add X-CSRFToken if cookie missing', () => {
      const req = new HttpRequest<any>('POST' as any, '/test');

      httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<unknown>));

      interceptor.intercept(req, httpHandlerSpy);

      const handledReq = httpHandlerSpy.handle.calls.mostRecent().args[0];
      expect(handledReq.headers.get('X-CSRFToken')).toBeNull();
      expect(handledReq.withCredentials).toBeTrue();
    });

    it('should not add X-CSRFToken for GET requests', () => {
      document.cookie = 'csrftoken=test-token';

      const req = new HttpRequest<any>('GET', '/test');

      httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<unknown>));

      interceptor.intercept(req, httpHandlerSpy);

      const handledReq = httpHandlerSpy.handle.calls.mostRecent().args[0];
      expect(handledReq.headers.get('X-CSRFToken')).toBeNull();
      expect(handledReq.withCredentials).toBeTrue();
    });
  });

  describe('Next handler', () => {
    it('should always call next.handle', () => {
      const req = new HttpRequest<any>('GET', '/test');

      httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<unknown>));

      interceptor.intercept(req, httpHandlerSpy);

      expect(httpHandlerSpy.handle).toHaveBeenCalled();
    });
  });

});
