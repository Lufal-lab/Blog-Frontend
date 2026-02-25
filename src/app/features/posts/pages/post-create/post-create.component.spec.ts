import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostCreateComponent } from './post-create.component';
import { PostsService } from '../../services/posts.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PostCreateComponent', () => {
  let component: PostCreateComponent;
  let fixture: ComponentFixture<PostCreateComponent>;
  let mockPostsService: any;
  let mockRouter: any;
  let mockAlertService: any;

  beforeEach(async () => {

    mockPostsService = {
      createPost: jasmine.createSpy('createPost').and.returnValue(of({
        id: 1,
        title: 'Test Post'
      }))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockAlertService = {
      success: jasmine.createSpy('success')
    };

    await TestBed.configureTestingModule({
      declarations: [PostCreateComponent],
      providers: [
        { provide: PostsService, useValue: mockPostsService },
        { provide: Router, useValue: mockRouter },
        { provide: AlertService, useValue: mockAlertService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // por si el template tiene app-post-form
    }).compileComponents();

    fixture = TestBed.createComponent(PostCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call createPost and navigate on success', () => {
    const payload = { title: 'New Post' };

    component.createPost(payload);

    expect(mockPostsService.createPost).toHaveBeenCalledWith(payload);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
    expect(mockAlertService.success)
      .toHaveBeenCalledWith('Post published successfully!');
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
  });

});
