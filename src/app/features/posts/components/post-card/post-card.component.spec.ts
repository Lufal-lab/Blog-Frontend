import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PostCardComponent } from './post-card.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostsService } from '../../services/posts.service';
import { LikesService } from '../../services/likes.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { Post } from 'src/app/core/models/post.model';
import { PrivacyLevel } from 'src/app/core/models/privacy-level.enum';
import { User } from 'src/app/core/models/user.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AlertService } from 'src/app/core/services/alert.service';

describe('PostCardComponent', () => {
  let component: PostCardComponent;
  let fixture: ComponentFixture<PostCardComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let postsServiceSpy: jasmine.SpyObj<PostsService>;
  let likesServiceSpy: jasmine.SpyObj<LikesService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const dummyUser: User = {
    id: 1,
    email: 'user1@example.com',
    team: 'Team A',
    is_superuser: false,
    is_staff: false
  };

  const dummyPost: Post = {
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
    privacy_read: PrivacyLevel.PUBLIC,
    privacy_write: PrivacyLevel.AUTHOR
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['authStatus', 'currentUser']);
    postsServiceSpy = jasmine.createSpyObj('PostsService', ['deletePost']);
    likesServiceSpy = jasmine.createSpyObj('LikesService', ['addLike', 'removeLike']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    // AuthService
    authServiceSpy.authStatus.and.returnValue(of(true));
    authServiceSpy.currentUser.and.returnValue(of(dummyUser));

    // Mock de MatDialogRef
    const matDialogRefSpyObj: Partial<MatDialogRef<any>> = {
      afterClosed: () => of(true)
    };

    dialogSpy.open.and.returnValue(matDialogRefSpyObj as MatDialogRef<any>);

    await TestBed.configureTestingModule({
      declarations: [PostCardComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: PostsService, useValue: postsServiceSpy },
        { provide: LikesService, useValue: likesServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
        AlertService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCardComponent);
    component = fixture.componentInstance;
    component.post = { ...dummyPost };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open likes dialog', () => {
    component.openLikes();
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should navigate to post on openPost', () => {
    component.openPost();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/posts', dummyPost.id]);
  });

  it('canEdit should return true for author', () => {
    expect(component.canEdit).toBeTrue();
  });

  it('canEdit should return true for superuser', () => {
    authServiceSpy.currentUser.and.returnValue(of({ ...dummyUser, is_superuser: true }));
    component = TestBed.createComponent(PostCardComponent).componentInstance;
    component.post = { ...dummyPost };
    fixture.detectChanges();
    expect(component.canEdit).toBeTrue();
  });

  it('editPost should navigate to edit route', () => {
    component.editPost();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/posts', dummyPost.id, 'edit']);
  });

  it('toggleLike should add like if not liked', fakeAsync(() => {
    likesServiceSpy.addLike.and.returnValue(of({}));
    component.toggleLike();
    tick();
    expect(component.post.is_liked).toBeTrue();
    expect(component.post.likes_count).toBe(1);
    expect(likesServiceSpy.addLike).toHaveBeenCalledWith(dummyPost.id);
  }));

  it('toggleLike should remove like if already liked', fakeAsync(() => {
    component.post.is_liked = true;
    component.post.likes_count = 1;
    likesServiceSpy.removeLike.and.returnValue(of({}));
    component.toggleLike();
    tick();
    expect(component.post.is_liked).toBeFalse();
    expect(component.post.likes_count).toBe(0);
    expect(likesServiceSpy.removeLike).toHaveBeenCalledWith(dummyPost.id);
  }));

  it('toggleLike should revert on error', fakeAsync(() => {
    likesServiceSpy.addLike.and.returnValue(throwError(() => new Error('fail')));
    component.toggleLike();
    tick();
    expect(component.post.is_liked).toBeFalse();
    expect(component.post.likes_count).toBe(0);
  }));

  it('deletePost should emit postDeleted on confirm', fakeAsync(() => {
    // Mock AlertService.confirm para devolver true
    spyOn(TestBed.inject(AlertService), 'confirm').and.returnValue(Promise.resolve(true));
    postsServiceSpy.deletePost.and.returnValue(of(void 0));
    spyOn(component.postDeleted, 'emit');

    component.onDeletePost();
    tick();

    expect(postsServiceSpy.deletePost).toHaveBeenCalledWith(dummyPost.id);
    expect(component.postDeleted.emit).toHaveBeenCalledWith(dummyPost.id);
  }));

  it('deletePost should not emit if confirm is false', fakeAsync(() => {
    // Mock AlertService.confirm para devolver false
    spyOn(TestBed.inject(AlertService), 'confirm').and.returnValue(Promise.resolve(false));
    spyOn(component.postDeleted, 'emit');

    component.onDeletePost();
    tick();

    expect(postsServiceSpy.deletePost).not.toHaveBeenCalled();
    expect(component.postDeleted.emit).not.toHaveBeenCalled();
  }));
});
