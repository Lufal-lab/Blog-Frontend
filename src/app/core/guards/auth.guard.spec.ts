import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let alertService: jasmine.SpyObj<AlertService>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AlertService, useValue: alertServiceSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
  });

  it('should allow access when user is authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = guard.canActivate({} as any, {} as any);

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(alertService.error).not.toHaveBeenCalled();
  });

  it('should redirect to /login and show alert when user is NOT authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = guard.canActivate({} as any, {} as any);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(alertService.error).toHaveBeenCalledWith('You must be logged in to access this page.');
  });
});
