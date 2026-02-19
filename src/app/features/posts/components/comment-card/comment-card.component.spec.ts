import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentCardComponent } from './comment-card.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Comment } from 'src/app/core/models/comment.model';

describe('CommentCardComponent', () => {
  let component: CommentCardComponent;
  let fixture: ComponentFixture<CommentCardComponent>;

  const mockComment: Comment = {
    id: 1,
    content: 'Test comment',
    created_at: '2024-01-01',
    user_email: 'test@example.com'
  } as Comment;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentCardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // por si usas Material en el HTML
    }).compileComponents();

    fixture = TestBed.createComponent(CommentCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept comment input', () => {
    component.comment = mockComment;
    expect(component.comment).toEqual(mockComment);
  });

  it('should render content, user email and formatted date', () => {
    component.comment = mockComment;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Test comment');
    expect(compiled.textContent).toContain('test@example.com');

    // Solo validamos que contenga el año o parte visible
    expect(compiled.textContent).toContain('2024');
  });
});
