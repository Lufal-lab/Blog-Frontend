import { take } from 'rxjs/operators';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
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
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // 🔹 IMPORTANTE: El constructor dispara checkSession() -> GET /api/users/me/
    // Consumimos esa petición inicial para que no interfiera con los tests
    const initialReq = httpMock.expectOne(`${apiUrl}me/`);
    initialReq.flush(null); // Simulamos que no hay sesión al arrancar
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit true and set user when session is valid', (done) => {
    // Forzamos una nueva llamada a checkSession
    (service as any).checkSession();

    const req = httpMock.expectOne(`${apiUrl}me/`);
    req.flush(mockUser);

    service.authStatus().subscribe(status => {
      expect(status).toBeTrue();
      service.currentUser().subscribe(user => {
        expect(user).toEqual(mockUser);
        done();
      });
    });
  });

  it('should call login endpoint and then checkSession', () => {
    const credentials: AuthCredentials = { email: 'test@test.com', password: '123456' };

    service.login(credentials).subscribe();

    // 1. Verificamos el POST de login
    const loginReq = httpMock.expectOne(`${apiUrl}login/`);
    expect(loginReq.request.method).toBe('POST');
    loginReq.flush(mockUser);

    // 2. El tap() del login dispara checkSession(), así que esperamos un GET a /me/
    const checkReq = httpMock.expectOne(`${apiUrl}me/`);
    expect(checkReq.request.method).toBe('GET');
    checkReq.flush(mockUser);
  });

  // it('should not emit true if login fails', (done) => {
  //   const credentials: AuthCredentials = { email: 'test@test.com', password: 'wrong' };

  //   service.login(credentials).subscribe({
  //     next: () => {
  //       fail('Debería haber fallado el login');
  //       done();
  //     },
  //     error: (error) => {
  //       expect(error.status).toBe(401);

  //       // En lugar de abrir otra suscripción interna que causa el timeout,
  //       // verificamos el estado actual una sola vez.
  //       service.authStatus().subscribe(status => {
  //         expect(status).toBeFalse();
  //         done(); // <--- Ahora sí se llama siempre
  //       });
  //     }
  //   });

  //   const loginReq = httpMock.expectOne(`${apiUrl}login/`);
  //   loginReq.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  // });

  it('should call logout endpoint and clear session', (done) => {
    service.logout();

    const req = httpMock.expectOne(`${apiUrl}logout/`);
    expect(req.request.method).toBe('POST');
    req.flush({});

    service.authStatus().subscribe(status => {
      expect(status).toBeFalse();
      service.currentUser().subscribe(user => {
        expect(user).toBeNull();
        done();
      });
    });
  });

  it('should call register endpoint with POST and user data', () => {
    const userData: AuthCredentials = { email: 'new@test.com', password: '123456' };

    service.createUser(userData).subscribe();

    const req = httpMock.expectOne(`${apiUrl}register/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userData);
    req.flush(mockUser);
  });
});
