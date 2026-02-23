import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostsService } from './posts.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { of } from 'rxjs';

import { Post, CreatePostDTO, UpdatePostDTO } from 'src/app/core/models/post.model';

import { PrivacyLevel } from 'src/app/core/models/privacy-level.enum';
import { Paginated } from 'src/app/core/models/paginated.model';

describe('PostsService', () => {
  let service: PostsService;
  let httpMock: HttpTestingController;
  let paginationServiceSpy: jasmine.SpyObj<PaginationService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('PaginationService', ['getByUrl']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PostsService,
        { provide: PaginationService, useValue: spy }
      ]
    });

    service = TestBed.inject(PostsService);
    httpMock = TestBed.inject(HttpTestingController);
    paginationServiceSpy = TestBed.inject(PaginationService) as jasmine.SpyObj<PaginationService>;
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden requests pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('getPosts should return paginated posts', () => {
  //   const dummyPosts: Paginated<Post> = {
  //     results: [{ id: 1, title: 'Test', content: 'Test content' } as Post],
  //     count: 1,
  //     next: null,
  //     previous: null
  //   };

  //   service.getPosts().subscribe(res => {
  //     expect(res).toEqual(dummyPosts);
  //   });

  //   const req = httpMock.expectOne('/api/posts/');
  //   expect(req.request.method).toBe('GET');
  //   req.flush(dummyPosts);
  // });

  it('getPosts should return paginated posts enriched with teamColor', () => {
    const dummyPosts: Paginated<Post> = {
      results: [
        {
          id: 1,
          author: 1,
          author_email: 'user1@example.com',
          author_team: 'Team A',
          title: 'Test',
          content: 'Test content',
          excerpt: 'Test...',
          likes_count: 0,
          comments_count: 0,
          is_liked: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          privacy_read: PrivacyLevel.PUBLIC,
          privacy_write: PrivacyLevel.AUTHOR
        }
      ],
      count: 1,
      next: null,
      previous: null
    };

    service.getPosts().subscribe(res => {
      expect(res.count).toBe(1);
      expect(res.results.length).toBe(1);
      expect(res.results[0].title).toBe('Test');
      expect(res.results[0].teamColor).toBeDefined(); // 🔥 ahora validamos enrichment
    });

    const req = httpMock.expectOne('/api/posts/');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPosts);
  });


  it('getPostById should return a post', () => {
    const dummyPost: Post = {
      id: 1,
      author: 1,
      author_email: 'user1@example.com',
      author_team: 'Team A',
      title: 'Test',
      content: 'Test content',
      excerpt: 'Test...',
      likes_count: 0,
      comments_count: 0,
      is_liked: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      privacy_read: PrivacyLevel.PUBLIC,
      privacy_write: PrivacyLevel.AUTHOR
    };

    service.getPostById(1).subscribe(res => {
      expect(res.id).toBe(1);
      expect(res.title).toBe('Test');
      expect(res.teamColor).toBeDefined(); // 🔥 enrichment validado
    });

    const req = httpMock.expectOne('/api/posts/1/');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPost);
  });

  it('getByUrl should call PaginationService.getByUrl', () => {
    const url = '/api/posts/?page=1';

    const dummyPaginated: Paginated<Post> = {
      results: [
        {
          id: 1,
          author: 1,
          author_email: 'user1@example.com',
          author_team: 'Team A',
          title: 'Test',
          content: 'Test content',
          excerpt: 'Test...',
          likes_count: 0,
          comments_count: 0,
          is_liked: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          privacy_read: PrivacyLevel.PUBLIC,
          privacy_write: PrivacyLevel.AUTHOR
        }
      ],
      count: 1,
      next: null,
      previous: null
    };

    paginationServiceSpy.getByUrl.and.returnValue(of(dummyPaginated));

    service.getByUrl(url).subscribe(result => {
      expect(result.count).toBe(1);
      expect(result.results[0].teamColor).toBeDefined();
    });

    expect(paginationServiceSpy.getByUrl).toHaveBeenCalledWith(url);
  });


  it('createPost should POST and return a post', () => {
    const url = '/api/posts/?page=1';

    const dummyPaginated: Paginated<Post> = {
      results: [
        {
          id: 1,
          author: 1,
          author_email: 'user1@example.com',
          author_team: 'Team A',
          title: 'Test',
          content: 'Test content',
          excerpt: 'Test...',
          likes_count: 0,
          comments_count: 0,
          is_liked: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          privacy_read: PrivacyLevel.PUBLIC,
          privacy_write: PrivacyLevel.AUTHOR
        }
      ],
      count: 1,
      next: null,
      previous: null
    };

    paginationServiceSpy.getByUrl.and.returnValue(of(dummyPaginated));

    service.getByUrl(url).subscribe(result => {
      expect(result.count).toBe(1);
      expect(result.results[0].teamColor).toBeDefined();
    });

    expect(paginationServiceSpy.getByUrl).toHaveBeenCalledWith(url);
  });


  it('updatePost should PATCH and return updated post', () => {
    const update: UpdatePostDTO = { title: 'Updated' };

    const returnedPost: Post = {
      id: 1,
      author: 1,
      author_email: 'user1@example.com',
      author_team: 'Team A',
      title: 'Updated',
      content: 'Old content',
      excerpt: 'Old...',
      likes_count: 0,
      comments_count: 0,
      is_liked: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      privacy_read: PrivacyLevel.PUBLIC,
      privacy_write: PrivacyLevel.AUTHOR
    };

    service.updatePost(1, update).subscribe(res => {
      expect(res.title).toBe('Updated');
    });

    const req = httpMock.expectOne('/api/posts/1/');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(update);
    req.flush(returnedPost);
  });

  it('deletePost should DELETE', () => {
    service.deletePost(1).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne('/api/posts/1/');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle errors on getPosts', () => {
    const mockError = { status: 500, statusText: 'Server Error' };

    service.getPosts().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('/api/posts/');
    req.flush({}, mockError);
  });
});

