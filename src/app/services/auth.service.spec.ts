import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sent POST request on login', () => { //Regla que debe cuplirse
    
    //Datos de prueba es un mock
    const credentials = {
      email: 'testuser@mail.com',
      password: '12345678',
    };

    // Llamada al Servicio , exige que login 
    // (HttpClient.post())devuelva un observable
    // .subscribe() dispara la accion
    service.login(credentials).subscribe();

    // Que es lo que se espera que se haga
    const req = httpMock.expectOne('/api/users/login/');

    // Espero que sea un post
    expect(req.request.method).toBe('POST');
    // Los datos enviados deben ser EXACTAMENTE los que recibí
    expect(req.request.body).toEqual(credentials);
  });

  it('should send login request with credentials', () => {
    const credentials = {
      username: 'testuser',
      password: '123456',
    };

    service.login(credentials).subscribe();

    const req = httpMock.expectOne('/api/users/login/');

    expect(req.request.withCredentials).toBeTrue();
  });

  it('should propagate error when login fails', () => {
    const credentials = {
      username: 'wrong',
      password: 'wrong',
    };

    service.login(credentials).subscribe({
      next: () => fail('should not succeed'),
      error: (error) => {
        expect(service.getCurrentUser()).toBeNull();
        expect(error.status).toBe(401);
      },
    });

    const req = httpMock.expectOne('/api/users/login/');

    req.flush(
      { message: 'Invalid credentials' },
      { status: 401, statusText: 'Unauthorized' }
    );
  });

  it('should store current user after successful login', () => {
    const credentials = { username: 'alice', password: '123456' };
    const mockUser = { id: 1, username: 'alice', role: 'blogger' };

    // Llamamos login
    service.login(credentials).subscribe(user => {
      // Cuando la llamada es exitosa, el observable devuelve el usuario
      service.setCurrentUser(user); // lo veremos en el siguiente paso
      expect(service.getCurrentUser()).toEqual(mockUser);
    });

    // Interceptamos la request
    const req = httpMock.expectOne('/api/users/login/');
    req.flush(mockUser, { status: 200, statusText: 'OK' });
  });

  it('should clear current user on logout', () => {
  // Primero simulamos un usuario logueado
    const mockUser = { id: 1, username: 'alice', role: 'blogger' };
    service.setCurrentUser(mockUser);

    // Comprobamos que isLoggedIn es true antes de logout
    expect(service.isLoggedIn()).toBeTrue();

    // Ejecutamos logout
    service.logout();

    // Ahora currentUser debe ser null
    expect(service.getCurrentUser()).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });

});
