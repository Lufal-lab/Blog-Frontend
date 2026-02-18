import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

describe('AuthGuard', () => {

  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertSpy: jasmine.SpyObj<AlertService>;

  beforeEach(() => {

    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    alertSpy = jasmine.createSpyObj('AlertService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AlertService, useValue: alertSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should allow access when user is authenticated', () => {

    authServiceSpy.isAuthenticated.and.returnValue(true);

    const result = guard.canActivate({} as any, {} as any);

    expect(result).toBeTrue();
    expect(alertSpy.error).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should deny access, show alert and redirect when user is NOT authenticated', () => {

    authServiceSpy.isAuthenticated.and.returnValue(false);

    const result = guard.canActivate({} as any, {} as any);

    expect(result).toBeFalse();
    expect(alertSpy.error).toHaveBeenCalledWith(
      'You must be logged in to access this page.'
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

});
