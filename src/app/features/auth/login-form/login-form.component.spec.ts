import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LoginFormComponent } from './login-form.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const fakeUser = {
    id: 1,
    email: 'test@example.com',
    team: 'A',
    is_superuser: false,
    is_staff: false
  };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginFormComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and navigate on success', () => {
    authService.login.and.returnValue(of(fakeUser));

    component.form.setValue({ email: 'test@example.com', password: '12345678' });
    const event = new Event('submit');
    component.login(event);

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: '12345678'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/posts']);
    expect(component.error).toBeNull();
  });

  it('should set error on 400 response', () => {
    const httpError = new HttpErrorResponse({ status: 400, statusText: 'Bad Request' });
    authService.login.and.returnValue(throwError(() => httpError));

    component.form.setValue({ email: 'test@example.com', password: 'wrong' });
    component.login(new Event('submit'));

    expect(component.error).toBe('User or password incorrect. Please try again.');
  });

  it('should set error on 401 response', () => {
    const httpError = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    authService.login.and.returnValue(throwError(() => httpError));

    component.form.setValue({ email: 'test@example.com', password: 'wrong' });
    component.login(new Event('submit'));

    expect(component.error).toBe('User or password incorrect. Please try again.');
  });

  it('should reset error on other server errors', () => {
    const httpError = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
    authService.login.and.returnValue(throwError(() => httpError));

    component.form.setValue({ email: 'test@example.com', password: '12345678' });
    component.login(new Event('submit'));

    expect(component.error).toBeNull();
  });

  it('should mark all fields as touched if form is invalid', () => {
    component.form.setValue({ email: '', password: '' });
    component.login(new Event('submit'));

    expect(component.form.touched || component.form.get('email')?.touched).toBeTrue();
    expect(component.error).toBeNull();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should navigate home on cancel', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
