import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { AuthCredentials, User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const apiUrl = '/api/users/';

  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    team: 'A',
    is_superuser: false,
    is_staff: false
  };

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

  // ============================
  // CREATION + INITIAL SESSION
  // ============================

  it('should be created and call checkSession on init', () => {
    expect(service).toBeTruthy();

    const req = httpMock.expectOne(`${apiUrl}me/`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();

    req.flush(null);
  });

  it('should set authenticated false if initial session fails', () => {
    const req = httpMock.expectOne(`${apiUrl}me/`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should set user and authenticated true when session is valid', () => {
    const req = httpMock.expectOne(`${apiUrl}me/`);
    req.flush(mockUser);

    expect(service.isAuthenticated()).toBeTrue();

    service.currentUser().subscribe(user => {
      expect(user).toEqual(jasmine.objectContaining(mockUser));
    });
  });

  // ============================
  // LOGIN
  // ============================

  it('should call login endpoint with POST and credentials', () => {
    httpMock.expectOne(`${apiUrl}me/`).flush(null);

    const credentials: AuthCredentials = {
      email: 'test@test.com',
      password: '123456'
    };

    service.login(credentials).subscribe();

    const loginReq = httpMock.expectOne(`${apiUrl}login/`);
    expect(loginReq.request.method).toBe('POST');
    expect(loginReq.request.body).toEqual(credentials);
    expect(loginReq.request.withCredentials).toBeTrue();

    loginReq.flush({});

    const meReq = httpMock.expectOne(`${apiUrl}me/`);
    meReq.flush(mockUser);
  });

  it('should set authenticated true after successful login', () => {
    httpMock.expectOne(`${apiUrl}me/`).flush(null);

    const credentials: AuthCredentials = {
      email: 'test@test.com',
      password: '123456'
    };

    service.login(credentials).subscribe();

    httpMock.expectOne(`${apiUrl}login/`).flush({});
    httpMock.expectOne(`${apiUrl}me/`).flush(mockUser);

    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should not authenticate if login fails', () => {
    httpMock.expectOne(`${apiUrl}me/`).flush(null);

    const credentials: AuthCredentials = {
      email: 'test@test.com',
      password: 'wrong'
    };

    service.login(credentials).subscribe({
      error: () => {}
    });

    const loginReq = httpMock.expectOne(`${apiUrl}login/`);
    loginReq.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(service.isAuthenticated()).toBeFalse();
  });

  // ============================
  // LOGOUT
  // ============================

  it('should call logout endpoint with POST', () => {
    httpMock.expectOne(`${apiUrl}me/`).flush(null);

    service.logout().subscribe();

    const req = httpMock.expectOne(`${apiUrl}logout/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();

    req.flush({});
  });

  it('should reset authentication state after logout', () => {
    httpMock.expectOne(`${apiUrl}me/`).flush(null);

    (service as any).isLoggedIn$.next(true);
    (service as any).currentUser$.next(mockUser);

    service.logout().subscribe();
    httpMock.expectOne(`${apiUrl}logout/`).flush({});

    expect(service.isAuthenticated()).toBeFalse();

    let currentUser: User | null = undefined as any;
    service.currentUser().subscribe(u => currentUser = u);

    expect(currentUser).toBeNull();
  });

  // ============================
  // REGISTER
  // ============================

  it('should call register endpoint with POST and user data', () => {
    httpMock.expectOne(`${apiUrl}me/`).flush(null);

    const userData = {
      email: 'new@test.com',
      password: '123456'
    };

    service.createUser(userData).subscribe();

    const req = httpMock.expectOne(`${apiUrl}register/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userData);
    expect(req.request.withCredentials).toBeTrue();

    req.flush({});
  });

  it('should handle register error properly', () => {
    httpMock.expectOne(`${apiUrl}me/`).flush(null);

    const userData = {
      email: 'new@test.com',
      password: '123456'
    };

    service.createUser(userData).subscribe({
      error: (err) => {
        expect(err.status).toBe(400);
      }
    });

    const req = httpMock.expectOne(`${apiUrl}register/`);
    req.flush(
      { email: ['Already exists'] },
      { status: 400, statusText: 'Bad Request' }
    );
  });

  // ============================
  // AUTH STATUS OBSERVABLE
  // ============================

  it('should emit auth status changes', () => {
    httpMock.expectOne(`${apiUrl}me/`).flush(null);

    const values: boolean[] = [];
    service.authStatus().subscribe(status => values.push(status));

    (service as any).isLoggedIn$.next(true);

    expect(values).toEqual([false, true]);
  });

});
