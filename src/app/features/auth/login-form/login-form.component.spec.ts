// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { of, throwError } from 'rxjs';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// import { LoginFormComponent } from './login-form.component';
// import { AuthService } from 'src/app/core/services/auth.service';
// import { HttpErrorResponse } from '@angular/common/http';

// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatDialogModule } from '@angular/material/dialog';

// describe('LoginFormComponent', () => {
//   let component: LoginFormComponent;
//   let fixture: ComponentFixture<LoginFormComponent>;
//   let authService: jasmine.SpyObj<AuthService>;
//   let router: jasmine.SpyObj<Router>;

//   const fakeUser = {
//     id: 1,
//     email: 'test@example.com',
//     team: 'A',
//     is_superuser: false,
//     is_staff: false
//   };

//   const alertSpy = jasmine.createSpyObj('AlertService', ['error', 'success']);

//   beforeEach(async () => {
//     const authSpy = jasmine.createSpyObj('AuthService', ['login']);
//     const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

//     await TestBed.configureTestingModule({
//       imports: [ReactiveFormsModule,
//         MatSnackBarModule,
//         MatDialogModule
//       ],
//       declarations: [LoginFormComponent],
//       providers: [
//         { provide: AuthService, useValue: authSpy },
//         { provide: Router, useValue: routerSpy },
//       ],
//       schemas: [NO_ERRORS_SCHEMA]
//     }).compileComponents();

//     fixture = TestBed.createComponent(LoginFormComponent);
//     component = fixture.componentInstance;
//     authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
//     router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   // it('should call login and navigate on success', () => {

//   //   authService.login.and.returnValue(of(fakeUser));

//   //   component.form.setValue({ email: 'test@example.com', password: '12345678' });
//   //   const event = new Event('submit');
//   //   component.login(event);

//   //   expect(authService.login).toHaveBeenCalledWith({
//   //     email: 'test@example.com',
//   //     password: '12345678'
//   //   });
//   //   expect(router.navigate).toHaveBeenCalledWith(['/posts']);
//   //   expect(component.error).toBeNull();
//   // });

//   it('should call login and navigate on success', () => {

//   const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
//   const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
//   const alertSpy = jasmine.createSpyObj('AlertService', ['success']);

//     authServiceSpy.login.and.returnValue(of({}));

//     component.form.setValue({
//       email: 'test@test.com',
//       password: '123456'
//     });

//     const fakeEvent = new Event('submit');
//     spyOn(fakeEvent, 'preventDefault');

//     component.login(fakeEvent);

//     expect(authServiceSpy.login).toHaveBeenCalled();
//     expect(routerSpy.navigate).toHaveBeenCalledWith(['/posts']);
//   });

//   it('should set error on 400 response', () => {
//     const httpError = new HttpErrorResponse({ status: 400, statusText: 'Bad Request' });
//     authService.login.and.returnValue(throwError(() => httpError));

//     component.form.setValue({ email: 'test@example.com', password: 'wrong' });
//     component.login(new Event('submit'));

//     expect(component.error).toBe('User or password incorrect. Please try again.');
//   });

//   it('should set error on 401 response', () => {
//     const httpError = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
//     authService.login.and.returnValue(throwError(() => httpError));

//     component.form.setValue({ email: 'test@example.com', password: 'wrong' });
//     component.login(new Event('submit'));

//     expect(component.error).toBe('User or password incorrect. Please try again.');
//   });

//   it('should reset error on other server errors', () => {
//     const httpError = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
//     authService.login.and.returnValue(throwError(() => httpError));

//     component.form.setValue({ email: 'test@example.com', password: '12345678' });
//     component.login(new Event('submit'));

//     expect(component.error).toBeNull();
//   });

//   it('should mark all fields as touched if form is invalid', () => {
//     component.form.setValue({ email: '', password: '' });
//     component.login(new Event('submit'));

//     expect(component.form.touched || component.form.get('email')?.touched).toBeTrue();
//     expect(component.error).toBeNull();
//     expect(authService.login).not.toHaveBeenCalled();
//   });

//   it('should navigate home on cancel', () => {
//     component.cancel();
//     expect(router.navigate).toHaveBeenCalledWith(['/']);
//   });
// });


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { LoginFormComponent } from './login-form.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { AlertService } from 'src/app/core/services/alert.service';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  // Estas referencias son las que usaremos para configurar las respuestas
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    // Creamos los Spies
    const authMock = jasmine.createSpyObj('AuthService', ['login']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const alertMock = jasmine.createSpyObj('AlertService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginFormComponent],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: routerMock },
        { provide: AlertService, useValue: alertMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;

    // Recuperamos las instancias inyectadas
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alertServiceSpy = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;

    fixture.detectChanges();
  });

it('should call login and navigate on success (auth via cookies)', () => {
    // Usamos 'as any' para evitar el error de tipo con User
    authServiceSpy.login.and.returnValue(of({} as any));

    component.form.setValue({
      email: 'usuario@prueba.com',
      password: 'password123'
    });

    const fakeEvent = new Event('submit');
    component.login(fakeEvent);

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(alertServiceSpy.success).toHaveBeenCalledWith('Successful login');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/posts']);
  });

    it('should handle unauthorized error (401)', () => {
      const errorResponse = new HttpErrorResponse({ status: 401 });
      authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

      component.form.setValue({ email: 'mal@test.com', password: 'wrong' });
      component.login(new Event('submit'));

      expect(component.error).toBe('User or password incorrect. Please try again.');
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });
