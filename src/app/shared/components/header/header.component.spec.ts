import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { AuthService } from 'src/app/core/services/auth.service';


import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    authServiceMock = jasmine.createSpyObj('AuthService', [
      'authStatus',
      'currentUser',
      'logout'
    ]);

    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    authServiceMock.authStatus.and.returnValue(of(false));
    authServiceMock.currentUser.and.returnValue(of(null));
    authServiceMock.logout.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        MatToolbarModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose authStatus observable', (done) => {
    component.isLoggedIn$.subscribe(value => {
      expect(value).toBeFalse();
      done();
    });
  });

  it('should expose currentUser observable', (done) => {
    component.userEmail$.subscribe(user => {
      expect(user).toBeNull();
      done();
    });
  });

  it('should call logout and navigate to login', () => {
    component.logout();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

});
