import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentsService } from './comments.service';
import { Comment } from 'src/app/core/models/comment.model';
import { Paginated } from 'src/app/core/models/paginated.model';

describe('CommentsService', () => {
  let service: CommentsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentsService]
    });

    service = TestBed.inject(CommentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ✅ GET comentarios con postId number
  it('should fetch paginated comments by post (number id)', () => {
    const mockResponse: Paginated<Comment> = {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          content: 'First comment',
          created_at: '2024-01-01T10:00:00Z',
          author: 'user1'
        } as any
      ]
    };

    service.getCommentsByPost(1).subscribe(response => {
      expect(response.count).toBe(1);
      expect(response.results.length).toBe(1);
      expect(response.results[0].content).toBe('First comment');
    });

    const req = httpMock.expectOne('/api/posts/1/comments/');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // ✅ GET comentarios con postId string
  it('should fetch paginated comments by post (string id)', () => {
    const mockResponse: Paginated<Comment> = {
      count: 0,
      next: null,
      previous: null,
      results: []
    };

    service.getCommentsByPost('abc').subscribe(response => {
      expect(response.count).toBe(0);
      expect(response.results).toEqual([]);
    });

    const req = httpMock.expectOne('/api/posts/abc/comments/');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // ✅ GET por URL completa (paginación siguiente)
  it('should fetch comments by full URL', () => {
    const mockResponse: Paginated<Comment> = {
      count: 0,
      next: null,
      previous: null,
      results: []
    };

    const url = '/api/posts/1/comments/?page=2';

    service.getByUrl(url).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // ✅ Crear comentario (number id)
  it('should create a new comment', () => {
    const createdComment: Comment = {
      id: 3,
      content: 'New comment',
      created_at: '2024-01-03T12:00:00Z',
      author: 'user3'
    } as any;

    service.createComment(1, 'New comment').subscribe(comment => {
      expect(comment.id).toBe(3);
      expect(comment.content).toBe('New comment');
    });

    const req = httpMock.expectOne('/api/posts/1/comments/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ content: 'New comment' });

    req.flush(createdComment);
  });

  // ✅ Manejo de errores
  it('should handle errors properly', () => {
    service.getCommentsByPost(1).subscribe({
      next: () => fail('Expected an error'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('/api/posts/1/comments/');
    req.flush('Server error', { status: 500, statusText: 'Server Error' });
  });
});
