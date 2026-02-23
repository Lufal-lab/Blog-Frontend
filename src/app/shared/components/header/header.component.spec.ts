import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
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
  let mockAlertService: any;

  beforeEach(async () => {
    mockAuthService = {
      authStatus: jasmine.createSpy().and.returnValue(of(true)),
      currentUser: jasmine.createSpy().and.returnValue(of({
        id: 1,
        email: 'test@example.com',
        team: 'team1',
        is_superuser: false,
        is_staff: false
      } as User)),
      logout: jasmine.createSpy().and.returnValue(of(null))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockAlertService = {
      confirm: jasmine.createSpy().and.returnValue(Promise.resolve(true)),
      success: jasmine.createSpy('success')
    };

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: AlertService, useValue: mockAlertService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout and navigate when confirmed', async () => {
    await component.onLogout();

    expect(mockAlertService.confirm).toHaveBeenCalled();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
    expect(mockAlertService.success).toHaveBeenCalledWith('Successfully logged out!');
  });
});
