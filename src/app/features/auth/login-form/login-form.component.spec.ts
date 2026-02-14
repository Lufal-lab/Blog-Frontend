import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { LoginFormComponent } from './login-form.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('LoginComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['login']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginFormComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: MatSnackBar, useValue: snackBar }
      ],
      schemas: [NO_ERRORS_SCHEMA] // 👈 CLAVE
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call login if form is invalid', () => {
    const event = new Event('submit');

    component.form.setValue({
      email: '',
      password: ''
    });

    component.login(event);

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should call login when form is valid', () => {
    authService.login.and.returnValue(of({}));

    const event = new Event('submit');

    component.form.setValue({
      email: 'test@test.com',
      password: '12345678'
    });

    component.login(event);

    expect(authService.login).toHaveBeenCalled();
  });

  it('should navigate on successful login', () => {
    authService.login.and.returnValue(of({}));

    const event = new Event('submit');

    component.form.setValue({
      email: 'test@test.com',
      password: '12345678'
    });

    component.login(event);

    expect(router.navigate).toHaveBeenCalled();
  });

  it('should set error message when login fails', () => {
    authService.login.and.returnValue(
      throwError(() => ({ status: 401 }))
    );

    const event = new Event('submit');

    component.form.setValue({
      email: 'test@test.com',
      password: 'wrongpass'
    });

    component.login(event);

    expect(component.error).toBe(
      'Authentication Error: Wrong username or password'
    );
  });
});
