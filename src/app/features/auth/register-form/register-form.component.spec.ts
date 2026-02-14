import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterFormComponent } from './register-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AuthService } from 'src/app/core/services/auth.service';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['createUser']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RegisterFormComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: MatSnackBar, useValue: snackBar }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // 🔹 helper: evento falso
  function fakeEvent(): Event {
    return {
      preventDefault: jasmine.createSpy('preventDefault')
    } as unknown as Event;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prevent default submit event', () => {
    const event = fakeEvent();

    component.register(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should not call service if form is invalid', () => {
    const event = fakeEvent();

    component.form.reset();
    component.register(event);

    expect(authService.createUser).not.toHaveBeenCalled();
  });

  it('should call createUser when form is valid', () => {
    const event = fakeEvent();

    component.form.setValue({
      email: 'test@test.com',
      password: '12345678',
      confirmPassword: '12345678'
    });

    authService.createUser.and.returnValue(of('ok'));

    component.register(event);

    expect(authService.createUser).toHaveBeenCalledOnceWith({
      email: 'test@test.com',
      password: '12345678'
    });
  });

  it('should show snackbar and navigate on success', () => {
    const event = fakeEvent();

    component.form.setValue({
      email: 'test@test.com',
      password: '12345678',
      confirmPassword: '12345678'
    });

    authService.createUser.and.returnValue(of('ok'));

    component.register(event);

    expect(snackBar.open).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should set backend errors on 400 response', () => {
    const event = fakeEvent();

    component.form.setValue({
      email: 'bad@test.com',
      password: '12345678',
      confirmPassword: '12345678'
    });

    authService.createUser.and.returnValue(
      throwError(() => ({
        status: 400,
        error: {
          email: ['Email already exists']
        }
      }))
    );

    component.register(event);

    expect(component.form.get('email')?.errors?.['backend']).toBeDefined();
  });
});
