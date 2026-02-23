import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentCardComponent } from './comment-card.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Comment } from 'src/app/core/models/comment.model';

describe('CommentCardComponent', () => {
  let component: CommentCardComponent;
  let fixture: ComponentFixture<CommentCardComponent>;

  // Mock de un comentario
  const mockComment: Comment = {
    id: 1,
    content: 'Test comment',
    created_at: '2024-01-01T12:00:00Z',
    user_email: 'test@example.com'
  } as Comment;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentCardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // evita errores si usas Material en HTML
    }).compileComponents();

    fixture = TestBed.createComponent(CommentCardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Limpiar inputs entre tests
    component.comment = undefined!;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Input binding', () => {
    it('should accept comment input', () => {
      component.comment = mockComment;
      expect(component.comment).toEqual(mockComment);
    });
  });

  describe('Template rendering', () => {
    it('should render comment content, user email, and date', () => {
      component.comment = mockComment;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      // Contenido del comentario
      expect(compiled.textContent).toContain(mockComment.content);

      // Email del usuario
      expect(compiled.textContent).toContain(mockComment.user_email);

      // Fecha: validamos que contenga el año o parte visible
      expect(compiled.textContent).toContain('2024');
    });
  });
});
