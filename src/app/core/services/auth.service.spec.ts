import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { AuthCredentials } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const apiUrl = '/api/users/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login endpoint with POST and credentials', () => {
    const credentials: AuthCredentials = {
      email: 'test@test.com',
      password: '123456'
    };

    service.login(credentials).subscribe();

    const req = httpMock.expectOne(`${apiUrl}login/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    expect(req.request.withCredentials).toBeTrue();

    req.flush({ email: credentials.email });
  });

  it('should set isAuthenticated to true after login', () => {
    const credentials: AuthCredentials = {
      email: 'test@test.com',
      password: '123456'
    };

    service.login(credentials).subscribe();

    const req = httpMock.expectOne(`${apiUrl}login/`);
    req.flush({ email: credentials.email });

    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should update currentUser after login', () => {
    const credentials: AuthCredentials = {
      email: 'test@test.com',
      password: '123456'
    };

    let userValue: { email: string } | null = null;
    service.currentUser().subscribe(user => userValue = user);

    service.login(credentials).subscribe();

    const req = httpMock.expectOne(`${apiUrl}login/`);
    req.flush({ email: credentials.email });

    expect(userValue).toEqual(jasmine.objectContaining({ email: credentials.email }));
  });

  it('should call logout endpoint with POST', () => {
    service.logout().subscribe();

    const req = httpMock.expectOne(`${apiUrl}logout/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();

    req.flush({});
  });

  it('should set isAuthenticated to false after logout', () => {
    (service as any).isLoggedIn$.next(true);

    service.logout().subscribe();

    const req = httpMock.expectOne(`${apiUrl}logout/`);
    req.flush({});

    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should reset currentUser after logout', () => {
    (service as any).currentUser$.next('test@test.com');

    let userValue: { email: string } | null = { email: 'initial@test.com' };
    service.currentUser().subscribe(user => userValue = user);

    service.logout().subscribe();

    const req = httpMock.expectOne(`${apiUrl}logout/`);
    req.flush({});

    expect(userValue).toBeNull();
  });

  it('should emit auth status changes', () => {
    const values: boolean[] = [];

    service.authStatus().subscribe(status => values.push(status));

    (service as any).isLoggedIn$.next(true);

    expect(values).toEqual([false, true]);
  });

  it('should call register endpoint with POST and user data', () => {
    const userData = {
      email: 'new@test.com',
      password: '123456'
    };

    service.createUser(userData).subscribe();

    const req = httpMock.expectOne(`${apiUrl}register/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userData);
    expect(req.request.withCredentials).toBeTrue();

    req.flush('ok');
  });
});
