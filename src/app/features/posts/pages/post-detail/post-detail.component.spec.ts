import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostDetailComponent } from './post-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PostsService } from '../../services/posts.service';
import { CommentsService } from '../../services/comments.service';
import { LikesService } from '../../services/likes.service';
import { AuthService } from 'src/app/core/services/auth.service';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;

  let postsServiceMock: any;
  let commentsServiceMock: any;
  let likesServiceMock: any;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    postsServiceMock = {
      getPostById: jasmine.createSpy()
    };

    commentsServiceMock = {
      getCommentsByPost: jasmine.createSpy(),
      getByUrl: jasmine.createSpy(),
      createComment: jasmine.createSpy()
    };

    likesServiceMock = {
      getLikesByPost: jasmine.createSpy()
    };

    authServiceMock = {
      authStatus: jasmine.createSpy().and.returnValue(of(true))
    };

    routerMock = {
      navigate: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      declarations: [PostDetailComponent],
      providers: [
        { provide: PostsService, useValue: postsServiceMock },
        { provide: CommentsService, useValue: commentsServiceMock },
        { provide: LikesService, useValue: likesServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load data on ngOnInit', () => {
    postsServiceMock.getPostById.and.returnValue(of({ id: 1 }));
    commentsServiceMock.getCommentsByPost.and.returnValue(of({
      count: 0,
      results: [],
      next: null,
      previous: null
    }));
    likesServiceMock.getLikesByPost.and.returnValue(of({ count: 5 }));

    fixture.detectChanges(); // dispara ngOnInit

    expect(component.postId).toBe(1);
    expect(postsServiceMock.getPostById).toHaveBeenCalledWith(1);
    expect(commentsServiceMock.getCommentsByPost).toHaveBeenCalledWith(1);
    expect(likesServiceMock.getLikesByPost).toHaveBeenCalledWith(1);
  });

  it('should handle post load error', () => {
    component.postId = 1;
    postsServiceMock.getPostById.and.returnValue(
      throwError(() => new Error('Error'))
    );

    component.loadPost();

    expect(component.error).toBe('Post could not be loaded');
    expect(component.loadingPost).toBeFalse();
  });

  it('should load comments correctly', () => {
    component.postId = 1;

    commentsServiceMock.getCommentsByPost.and.returnValue(of({
      count: 2,
      results: [{ id: 1 }, { id: 2 }],
      next: null,
      previous: null
    }));

    component.loadComments();

    expect(component.comments.length).toBe(2);
    expect(component.totalComments).toBe(2);
  });

  it('should submit comment and load last page', () => {
    component.postId = 1;
    component.pageSize = 5;

    commentsServiceMock.createComment.and.returnValue(of({}));

    commentsServiceMock.getCommentsByPost.and.returnValue(of({
      count: 11,
      results: [],
      next: null,
      previous: null
    }));

    spyOn(component, 'loadCommentsByPage');

    component.handleCommentSubmit('New comment');

    expect(commentsServiceMock.createComment)
      .toHaveBeenCalledWith(1, 'New comment');

    expect(component.currentPage).toBe(3);
    expect(component.loadCommentsByPage).toHaveBeenCalledWith(3);
  });

  it('should load specific page of comments', () => {
    component.postId = 1;

    commentsServiceMock.getByUrl.and.returnValue(of({
      count: 11,
      results: [{ id: 10 }],
      next: null,
      previous: null
    }));

    component.loadCommentsByPage(2);

    expect(commentsServiceMock.getByUrl)
      .toHaveBeenCalledWith('/api/posts/1/comments/?page=2');

    expect(component.comments.length).toBe(1);
  });

  it('should navigate back to posts', () => {
    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/posts']);
  });
});
