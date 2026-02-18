import { TestBed } from '@angular/core/testing';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { of } from 'rxjs';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {

  let interceptor: AuthInterceptor;
  let httpHandlerSpy: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {

    httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [AuthInterceptor]
    });

    interceptor = TestBed.inject(AuthInterceptor);
  });

  afterEach(() => {
    // Limpiar cookies después de cada test
    document.cookie = 'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });

  it('should add X-CSRFToken header for POST when cookie exists', () => {

    document.cookie = 'csrftoken=test-token';

    const request = new HttpRequest('POST', '/test', {});

    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<unknown>));

    interceptor.intercept(request, httpHandlerSpy);

    const handledRequest = httpHandlerSpy.handle.calls.mostRecent().args[0];

    expect(handledRequest.headers.get('X-CSRFToken')).toBe('test-token');
    expect(handledRequest.withCredentials).toBeTrue();
  });

  it('should not add X-CSRFToken header if cookie does not exist', () => {

    const request = new HttpRequest('POST', '/test', {});

    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<unknown>));

    interceptor.intercept(request, httpHandlerSpy);

    const handledRequest = httpHandlerSpy.handle.calls.mostRecent().args[0];

    expect(handledRequest.headers.has('X-CSRFToken')).toBeFalse();
    expect(handledRequest.withCredentials).toBeTrue();
  });

  it('should not add X-CSRFToken header for GET requests', () => {

    document.cookie = 'csrftoken=test-token';

    const request = new HttpRequest('GET', '/test');

    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<unknown>));

    interceptor.intercept(request, httpHandlerSpy);

    const handledRequest = httpHandlerSpy.handle.calls.mostRecent().args[0];

    expect(handledRequest.headers.has('X-CSRFToken')).toBeFalse();
    expect(handledRequest.withCredentials).toBeTrue();
  });

  it('should always call next.handle', () => {

    const request = new HttpRequest('GET', '/test');

    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<unknown>));

    interceptor.intercept(request, httpHandlerSpy);

    expect(httpHandlerSpy.handle).toHaveBeenCalled();
  });

});
