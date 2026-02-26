// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { Router } from '@angular/router';
// import { AuthService } from './auth.service';
// import { AlertService } from './alert.service';
// import { User } from '../models/user.model';

// describe('AuthService', () => {
//   let service: AuthService;
//   let httpMock: HttpTestingController;
//   let alertSpy: jasmine.SpyObj<AlertService>;
//   let router: Router;

//   beforeEach(() => {
//     const spy = jasmine.createSpyObj('AlertService', ['success', 'error', 'warning']);

//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule,
//         RouterTestingModule.withRoutes([
//           { path: 'posts', redirectTo: '' } // Para que router.navigate(['/posts']) no falle
//         ])
//       ],
//       providers: [
//         AuthService,
//         { provide: AlertService, useValue: spy }
//       ]
//     });

//     router = TestBed.inject(Router);
//     spyOn(router, 'navigate');

//     service = TestBed.inject(AuthService);
//     httpMock = TestBed.inject(HttpTestingController);
//     alertSpy = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;


//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it('should be created and check session', () => {
//     // Al crearse, el constructor llama a checkSession()
//     const req = httpMock.expectOne('/api/users/me/');
//     expect(req.request.method).toBe('GET');
//     req.flush(null); // Simulamos sesión inválida

//     expect(service).toBeTruthy();
//   });

//   it('should set user and loggedIn true when session is valid', (done) => {
//     const mockUser: User = {
//   id: 1,
//   email: 'a@a.com',
//   team: 'Engineering', // o el nombre de algún equipo
//   is_superuser: false,
//   is_staff: false
// };

//     // 1. Capturamos la llamada del constructor
//     const req = httpMock.expectOne('/api/users/me/');
//     req.flush(mockUser);

//     // 2. Verificamos el estado
//     service.authStatus().subscribe(status => {
//       expect(status).toBeTrue();
//       done();
//     });
//   });

//   it('should navigate to /posts when session is invalid', () => {
//     const navigateSpy = spyOn(router, 'navigate');

//     // Capturamos la llamada del constructor
//     const req = httpMock.expectOne('/api/users/me/');
//     req.flush(null); // Usuario null

//     expect(navigateSpy).toHaveBeenCalledWith(['/posts']);
//   });

//   it('should call login and then check session again', () => {
//     const credentials = { email: 'user', password: '123' };
//     const mockUser = { id: 1, username: 'user' };

//     // 1. Limpiar la llamada inicial del constructor
//     httpMock.expectOne('/api/users/me/').flush(null);

//     // 2. Ejecutar login
//     service.login(credentials).subscribe();

//     // 3. Verificar llamada a login
//     const loginReq = httpMock.expectOne('/api/users/login/');
//     expect(loginReq.request.method).toBe('POST');
//     loginReq.flush(mockUser);

//     // 4. El pipe(tap) dispara OTRA VEZ checkSession()
//     const secondCheck = httpMock.expectOne('/api/users/me/');
//     expect(secondCheck.request.method).toBe('GET');
//     secondCheck.flush(mockUser);
//   });

//   it('should call logout and cleanup', () => {
//     const navigateSpy = spyOn(router, 'navigate');

//     // Limpiar llamada inicial
//     httpMock.expectOne('/api/users/me/').flush({ id: 1 });

//     service.logout();

//     const logoutReq = httpMock.expectOne('/api/users/logout/');
//     logoutReq.flush({}); // 200 OK

//     expect(alertSpy.success).toHaveBeenCalledWith('Successfully logged out.');
//     // completeLogoutCleanup se llama internamente
//   });
// });
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';
import { User, AuthCredentials } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let alertSpy: jasmine.SpyObj<AlertService>;
  let router: Router;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AlertService', ['success', 'error', 'warning']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        AuthService,
        { provide: AlertService, useValue: spy }
      ]
    });

    router = TestBed.inject(Router);
    // 1. ESPÍA GLOBAL: Ya no lo repitas dentro de los 'it'
    spyOn(router, 'navigate');

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    alertSpy = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
  });

  afterEach(() => {
    // 2. VERIFICACIÓN: Se asegura de que no queden peticiones colgadas
    httpMock.verify();
  });

  it('should be created and handle initial session check', () => {
    // Siempre atrapamos la petición del constructor
    const req = httpMock.expectOne('/api/users/me/');
    req.flush(null);

    expect(service).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should set user and loggedIn true when session is valid', (done) => {
    const mockUser: User = {
      id: 1,
      email: 'a@a.com',
      team: 'Dev',
      is_superuser: false,
      is_staff: false
    };

    // Atrapamos la del constructor
    const req = httpMock.expectOne('/api/users/me/');
    req.flush(mockUser);

    service.authStatus().subscribe(status => {
      expect(status).toBeTrue();
      done();
    });
  });

  it('should navigate to /posts when session is invalid', () => {
    // YA NO USES spyOn(router, 'navigate') AQUÍ, ya está en el beforeEach

    const req = httpMock.expectOne('/api/users/me/');
    req.flush(null);

    expect(router.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should call login and then check session again', () => {
    const credentials: AuthCredentials = { email: 'user@test.com', password: '123' };
    const mockUser: User = { id: 1, email: 'user@test.com', team: 'Dev', is_superuser: false, is_staff: false };

    // 1. Limpiar constructor
    httpMock.expectOne('/api/users/me/').flush(null);

    // 2. Login
    service.login(credentials).subscribe();
    const loginReq = httpMock.expectOne('/api/users/login/');
    loginReq.flush(mockUser);

    // 3. El tap() dispara el segundo checkSession
    const secondCheck = httpMock.expectOne('/api/users/me/');
    secondCheck.flush(mockUser);

    expect(secondCheck.request.method).toBe('GET');
  });

  it('should call logout and cleanup', () => {
    // 1. Limpiar constructor
    httpMock.expectOne('/api/users/me/').flush({ id: 1 } as User);

    // 2. Logout
    service.logout();
    const logoutReq = httpMock.expectOne('/api/users/logout/');
    logoutReq.flush({});

    expect(alertSpy.success).toHaveBeenCalledWith('Successfully logged out.');
    // 3. Ya no falla porque el espía es global
    // Nota: completeLogoutCleanup NO navega según tu código actual (está comentado)
    // Pero si lo descomentas, este expect pasaría:
    // expect(router.navigate).toHaveBeenCalledWith(['/posts']);
  });
});
