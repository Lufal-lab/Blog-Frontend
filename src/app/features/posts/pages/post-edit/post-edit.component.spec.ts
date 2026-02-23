import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostEditComponent } from './post-edit.component';

import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { PostsService } from '../../services/posts.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Post } from 'src/app/core/models/post.model';
import { PrivacyLevel } from 'src/app/core/models/privacy-level.enum';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PostEditComponent', () => {
  let component: PostEditComponent;
  let fixture: ComponentFixture<PostEditComponent>;

  let postsServiceSpy: jasmine.SpyObj<PostsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  const mockPost: Post = {
    id: 123,
    author: 1,
    author_email: 'test@test.com',
    author_team: 'Team A',
    teamColor: '#000000',
    title: 'Test Post',
    content: 'Test Content',
    excerpt: 'Test Excerpt',
    likes_count: 0,
    comments_count: 0,
    is_liked: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    privacy_read: PrivacyLevel.PUBLIC,
    privacy_write: PrivacyLevel.AUTHOR
  };

  beforeEach(async () => {

    postsServiceSpy = jasmine.createSpyObj('PostsService', [
      'getPostById',
      'updatePost'
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['success']);

    await TestBed.configureTestingModule({
      declarations: [PostEditComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '123'
              }
            }
          }
        },
        { provide: PostsService, useValue: postsServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AlertService, useValue: alertServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    postsServiceSpy.getPostById.and.returnValue(of(mockPost));
    postsServiceSpy.updatePost.and.returnValue(of(mockPost));

    fixture = TestBed.createComponent(PostEditComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load post on init', () => {
    expect(postsServiceSpy.getPostById).toHaveBeenCalledWith('123');
    expect(component.post).toEqual(mockPost);
  });

  it('should update post and navigate', () => {
    const payload = { title: 'Updated Title' };

    component.post = mockPost;

    component.updatePost(payload);

    expect(postsServiceSpy.updatePost).toHaveBeenCalledWith(123, payload);
    expect(alertServiceSpy.success).toHaveBeenCalledWith('Post updated successfully!');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/posts', 123]);
  });

  it('should navigate back', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/posts']);
  });
});
