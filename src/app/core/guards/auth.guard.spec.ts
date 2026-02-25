// import { TestBed } from '@angular/core/testing';
// import { Router } from '@angular/router';

// import { AuthGuard } from './auth.guard';
// import { AuthService } from '../services/auth.service';
// import { AlertService } from '../services/alert.service';

// describe('AuthGuard', () => {

//   let guard: AuthGuard;
//   let authServiceSpy: jasmine.SpyObj<AuthService>;
//   let routerSpy: jasmine.SpyObj<Router>;
//   let alertSpy: jasmine.SpyObj<AlertService>;

//   beforeEach(() => {

//     authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
//     routerSpy = jasmine.createSpyObj('Router', ['navigate']);
//     alertSpy = jasmine.createSpyObj('AlertService', ['error']);

//     TestBed.configureTestingModule({
//       providers: [
//         AuthGuard,
//         { provide: AuthService, useValue: authServiceSpy },
//         { provide: Router, useValue: routerSpy },
//         { provide: AlertService, useValue: alertSpy }
//       ]
//     });

//     guard = TestBed.inject(AuthGuard);
//   });

//   it('should allow access when user is authenticated', () => {

//     authServiceSpy.isAuthenticated.and.returnValue(true);

//     const result = guard.canActivate({} as any, {} as any);

//     expect(result).toBeTrue();
//     expect(alertSpy.error).not.toHaveBeenCalled();
//     expect(routerSpy.navigate).not.toHaveBeenCalled();
//   });

//   it('should deny access, show alert and redirect when user is NOT authenticated', () => {

//     authServiceSpy.isAuthenticated.and.returnValue(false);

//     const result = guard.canActivate({} as any, {} as any);

//     expect(result).toBeFalse();
//     expect(alertSpy.error).toHaveBeenCalledWith(
//       'You must be logged in to access this page.'
//     );
//     expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
//   });

// });


import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { of } from 'rxjs';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

describe('AuthGuard', () => {

  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertSpy: jasmine.SpyObj<AlertService>;

  beforeEach(() => {

    authServiceSpy = jasmine.createSpyObj('AuthService', ['authStatus']);
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
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

  it('should allow access when user is authenticated', (done) => {

    authServiceSpy.authStatus.and.returnValue(of(true));

    const result$ = guard.canActivate({} as any, {} as any) as any;

    result$.subscribe((result: boolean | UrlTree) => {
      expect(result).toBeTrue();
      expect(alertSpy.error).not.toHaveBeenCalled();
      expect(routerSpy.createUrlTree).not.toHaveBeenCalled();
      done();
    });

  });

  it('should deny access, show alert and return UrlTree when NOT authenticated', (done) => {

    const fakeUrlTree = {} as UrlTree;

    authServiceSpy.authStatus.and.returnValue(of(false));
    routerSpy.createUrlTree.and.returnValue(fakeUrlTree);

    const result$ = guard.canActivate({} as any, {} as any) as any;

    result$.subscribe((result: boolean | UrlTree) => {

      expect(alertSpy.error).toHaveBeenCalledWith('You must be logged in.');
      expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
      expect(result).toBe(fakeUrlTree);

      done();
    });

  });

});
