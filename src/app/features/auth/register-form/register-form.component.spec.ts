import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { RegisterFormComponent } from './register-form.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { AlertService } from 'src/app/core/services/alert.service';

describe('RegisterFormComponent', () => {

  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {

    authServiceSpy = jasmine.createSpyObj('AuthService', ['createUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    alertSpy = jasmine.createSpyObj('AlertService', ['success']);

    await TestBed.configureTestingModule({
      declarations: [RegisterFormComponent],
      imports: [
        ReactiveFormsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AlertService, useValue: alertSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function fillValidForm() {
    component.form.setValue({
      email: 'test@test.com',
      password: '12345678',
      confirmPassword: '12345678'
    });
  }

  it('should mark all fields as touched if form is invalid', () => {

    spyOn(component.form, 'markAllAsTouched');

    const event = new Event('submit');
    component.register(event);

    expect(component.form.markAllAsTouched).toHaveBeenCalled();
    expect(authServiceSpy.createUser).not.toHaveBeenCalled();
  });

  it('should call createUser and navigate on success', () => {

    fillValidForm();

    authServiceSpy.createUser.and.returnValue(of({} as any));

    const event = new Event('submit');
    component.register(event);

    expect(authServiceSpy.createUser).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '12345678'
    });

    expect(alertSpy.success).toHaveBeenCalledWith(
      'Account created successfully. Please log in.'
    );

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should set backend email error on 400', () => {

    fillValidForm();

    const backendError = {
      status: 400,
      error: {
        email: ['Email already exists']
      }
    };

    authServiceSpy.createUser.and.returnValue(
      throwError(() => backendError)
    );

    const event = new Event('submit');
    component.register(event);

    expect(component.form.get('email')?.errors).toEqual({
      backend: ['Email already exists']
    });
  });

  it('should set backend password error on 400', () => {

    fillValidForm();

    const backendError = {
      status: 400,
      error: {
        password: ['Password too weak']
      }
    };

    authServiceSpy.createUser.and.returnValue(
      throwError(() => backendError)
    );

    const event = new Event('submit');
    component.register(event);

    expect(component.form.get('password')?.errors).toEqual({
      backend: ['Password too weak']
    });
  });

  it('should navigate home on cancel', () => {

    component.cancel();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

});
