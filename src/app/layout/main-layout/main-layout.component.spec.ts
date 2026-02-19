import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing'; // <-- IMPORTAR

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  @Component({ selector: 'app-header', template: '' })
  class MockHeaderComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule], // <-- IMPORTAR AQUÍ
      declarations: [
        MainLayoutComponent,
        MockHeaderComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-header', () => {
    const headerEl = fixture.nativeElement.querySelector('app-header');
    expect(headerEl).toBeTruthy();
  });

  it('should have a router-outlet', () => {
    const routerOutletEl = fixture.nativeElement.querySelector('router-outlet');
    expect(routerOutletEl).toBeTruthy();
  });
});
