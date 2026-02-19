import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      authStatus: jasmine.createSpy('authStatus').and.returnValue(of(true)),
      currentUser: jasmine.createSpy('currentUser').and.returnValue(of({
        id: 1,
        email: 'test@example.com',
        team: 'team1',
        is_superuser: false,
        is_staff: false
      } as User)),
      logout: jasmine.createSpy('logout').and.returnValue(of(null))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,   // <- CORRECTO
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // <- opcional si hay otros elementos desconocidos
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have isLoggedIn$ observable from AuthService', (done) => {
    component.isLoggedIn$.subscribe(value => {
      expect(value).toBe(true);
      done();
    });
  });

  it('should have userEmail$ observable from AuthService', (done) => {
    component.userEmail$.subscribe(user => {
      expect(user).toEqual({
        id: 1,
        email: 'test@example.com',
        team: 'team1',
        is_superuser: false,
        is_staff: false
      });
      done();
    });
  });

  it('logout() should call authService.logout and navigate to ""', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
});
