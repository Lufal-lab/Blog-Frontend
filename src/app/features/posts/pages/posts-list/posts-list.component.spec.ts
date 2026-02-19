import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { PostsComponent } from './posts-list.component';
import { PostsService } from '../../services/posts.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Post } from 'src/app/core/models/post.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { PrivacyLevel } from 'src/app/core/models/privacy-level.enum';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let postsServiceSpy: jasmine.SpyObj<PostsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const postsSpy = jasmine.createSpyObj('PostsService', ['getPosts', 'getByUrl']);
    const router = jasmine.createSpyObj('Router', ['navigate']);
    const auth = jasmine.createSpyObj('AuthService', ['authStatus']);

    await TestBed.configureTestingModule({
      declarations: [PostsComponent],
      providers: [
        { provide: PostsService, useValue: postsSpy },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: auth }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    postsServiceSpy = TestBed.inject(PostsService) as jasmine.SpyObj<PostsService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Default auth status observable
    authServiceSpy.authStatus.and.returnValue(of(true));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should load posts', () => {
    const dummyPaginated: Paginated<Post> = {
      results: [
        {
        id: 1,
        author: 1,
        author_email: 'user1@example.com',
        author_team: 'Team A',
        title: 'Post 1',
        content: 'Content',
        excerpt: 'Content...',
        likes_count: 0,
        comments_count: 0,
        is_liked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        privacy_read: PrivacyLevel.PUBLIC,  // o 'public' si tu enum lo permite
        privacy_write: PrivacyLevel.AUTHOR // o 'private'
      }
      ],
      count: 1,
      next: null,
      previous: null
    };
    postsServiceSpy.getPosts.and.returnValue(of(dummyPaginated));

    component.ngOnInit();

    expect(postsServiceSpy.getPosts).toHaveBeenCalled();
    expect(component.posts.length).toBe(1);
    expect(component.totalItems).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('loadPosts should handle errors', () => {
    postsServiceSpy.getPosts.and.returnValue(throwError(() => new Error('Server error')));

    component['loadPosts']();

    expect(component.error).toBe('No se pudieron cargar los posts');
    expect(component.loading).toBeFalse();
  });

  it('loadNext should call getByUrl if next exists', () => {
    const dummyPaginated: Paginated<Post> = {
      results: [],
      count: 0,
      next: null,
      previous: null
    };
    component.pagination.next = '/api/posts/?page=2';
    postsServiceSpy.getByUrl.and.returnValue(of(dummyPaginated));

    component.loadNext();

    expect(postsServiceSpy.getByUrl).toHaveBeenCalledWith('/api/posts/?page=2');
    expect(component.loading).toBeFalse();
  });

  it('loadNext should do nothing if next is null', () => {
    component.pagination.next = null;
    component.loadNext();
    expect(postsServiceSpy.getByUrl).not.toHaveBeenCalled();
  });

  it('loadPrevious should call getByUrl if previous exists', () => {
    const dummyPaginated: Paginated<Post> = {
      results: [],
      count: 0,
      next: null,
      previous: null
    };
    component.pagination.previous = '/api/posts/?page=1';
    postsServiceSpy.getByUrl.and.returnValue(of(dummyPaginated));

    component.loadPrevious();

    expect(postsServiceSpy.getByUrl).toHaveBeenCalledWith('/api/posts/?page=1');
    expect(component.loading).toBeFalse();
  });

  it('loadPrevious should do nothing if previous is null', () => {
    component.pagination.previous = null;
    component.loadPrevious();
    expect(postsServiceSpy.getByUrl).not.toHaveBeenCalled();
  });

  it('onPostDeleted should remove post from array', () => {
    component.posts = [
      {
        id: 1,
        author: 1,
        author_email: 'user1@example.com',
        author_team: 'Team A',
        title: 'Post 1',
        content: 'Content',
        excerpt: 'Content...',
        likes_count: 0,
        comments_count: 0,
        is_liked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        privacy_read: PrivacyLevel.PUBLIC,  // o 'public' si tu enum lo permite
        privacy_write: PrivacyLevel.AUTHOR // o 'private'
      },
      {
        id: 2,
        author: 2,
        author_email: 'user2@example.com',
        author_team: 'Team B',
        title: 'Post 2',
        content: 'Content',
        excerpt: 'Content...',
        likes_count: 0,
        comments_count: 0,
        is_liked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        privacy_read: PrivacyLevel.PUBLIC,
        privacy_write: PrivacyLevel.AUTHOR
      }
    ];

    component.onPostDeleted(1);

    expect(component.posts.length).toBe(1);
    expect(component.posts[0].id).toBe(2);
  });

  it('createPost should navigate to /posts/create', () => {
    component.createPost();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/posts/create']);
  });

  it('extractRelativePath should return path and search', () => {
    const url = 'http://localhost:8000/api/posts/?page=2';
    const result = component['extractRelativePath'](url);
    expect(result).toBe('/api/posts/?page=2');
  });

  it('extractRelativePath should return null if null', () => {
    expect(component['extractRelativePath'](null)).toBeNull();
  });

  it('setPostsResponse should set pagination and currentPage correctly', () => {
    const response: Paginated<Post> = {
      results: [
        {
        id: 1,
        author: 1,
        author_email: 'user1@example.com',
        author_team: 'Team A',
        title: 'Post 1',
        content: 'Content',
        excerpt: 'Content...',
        likes_count: 0,
        comments_count: 0,
        is_liked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        privacy_read: PrivacyLevel.PUBLIC,  // o 'public' si tu enum lo permite
        privacy_write: PrivacyLevel.AUTHOR // o 'private'
        }
      ],
      count: 10,
      next: 'http://localhost:8000/api/posts/?page=2',
      previous: 'http://localhost:8000/api/posts/?page=1'
    };

    component['setPostsResponse'](response);

    expect(component.posts.length).toBe(1);
    expect(component.totalItems).toBe(10);
    expect(component.currentPage).toBe(2);
    expect(component.pagination.next).toBe('/api/posts/?page=2');
    expect(component.pagination.previous).toBe('/api/posts/?page=1');
    expect(component.loading).toBeFalse();
  });

});
