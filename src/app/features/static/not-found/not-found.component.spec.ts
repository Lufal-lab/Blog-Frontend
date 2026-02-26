import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotFoundComponent ],
      imports: [
        MatCardModule,
        MatButtonModule,
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // 1. Prueba para el código de error (el span con clase .code)
  it('should display the 404 error code', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const errorCode = compiled.querySelector('.code')?.textContent;
    expect(errorCode).toContain('404');
  });

  // 2. Prueba para el título (el mat-card-title)
  it('should display "Page Not Found" as title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('mat-card-title')?.textContent;
    expect(title).toContain('Page Not Found');
  });

  // 3. Prueba para el botón de redirección
  it('should have a link to /posts', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    // Verificamos que el botón existe y tiene el texto correcto
    expect(button?.textContent).toContain('Back to posts');
    // Verificamos que tiene el atributo routerLink hacia /posts
    expect(button?.getAttribute('routerLink')).toBe('/posts');
  });
});
