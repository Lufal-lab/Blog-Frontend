import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LikesComponent } from './likes.component';
import { LikesService } from '../../services/likes.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { Paginated } from 'src/app/core/models/paginated.model';
import { Like } from 'src/app/core/models/like.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LikesComponent', () => {
  let component: LikesComponent;
  let fixture: ComponentFixture<LikesComponent>;
  let likesService: LikesService;

  const dummyPaginated: Paginated<Like> = {
    results: [
      { id: 1, user_email: 'usuario1@gmail.com', post: 1, created_at: '2026-01-01' } as Like,
      { id: 2, user_email: 'usuario2@gmail.com', post: 1, created_at: '2026-01-02' } as Like
    ],
    count: 2,
    next: '/api/posts/1/likes/?page=2',
    previous: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LikesComponent],
      imports: [HttpClientTestingModule],
      providers: [
        LikesService,
        { provide: MAT_DIALOG_DATA, useValue: { postId: 1 } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LikesComponent);
    component = fixture.componentInstance;
    likesService = TestBed.inject(LikesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load likes on init', () => {
    spyOn(likesService, 'getLikesByPost').and.returnValue(of(dummyPaginated));

    component.ngOnInit();

    expect(likesService.getLikesByPost).toHaveBeenCalledWith(1);
    expect(component.likes.length).toBe(2);
    expect(component.totalItems).toBe(2);
    expect(component.loading).toBeFalse();
    expect(component.pagination.next).toBe('/api/posts/1/likes/?page=2');
    expect(component.pagination.previous).toBeNull();
  });

  it('loadNext should call getByUrl if next exists', () => {
    component.pagination.next = '/api/posts/1/likes/?page=2';
    spyOn(likesService, 'getByUrl').and.returnValue(of(dummyPaginated));

    component.loadNext();

    expect(likesService.getByUrl).toHaveBeenCalledWith('/api/posts/1/likes/?page=2');
    expect(component.currentPage).toBe(2); // inicial 1 + 1
  });

  it('loadNext should do nothing if next is null', () => {
    component.pagination.next = null;
    spyOn(likesService, 'getByUrl');

    component.loadNext();

    expect(likesService.getByUrl).not.toHaveBeenCalled();
  });

  it('loadPrevious should call getByUrl if previous exists', () => {
    component.pagination.previous = '/api/posts/1/likes/?page=1';
    component.currentPage = 2;
    spyOn(likesService, 'getByUrl').and.returnValue(of(dummyPaginated));

    component.loadPrevious();

    expect(likesService.getByUrl).toHaveBeenCalledWith('/api/posts/1/likes/?page=1');
    expect(component.currentPage).toBe(1);
  });

  it('loadPrevious should do nothing if previous is null', () => {
    component.pagination.previous = null;
    spyOn(likesService, 'getByUrl');

    component.loadPrevious();

    expect(likesService.getByUrl).not.toHaveBeenCalled();
  });

  it('should handle error on getLikesByPost', () => {
    spyOn(likesService, 'getLikesByPost').and.returnValue(throwError(() => ({ status: 500 })));

    component.ngOnInit();

    expect(component.error).toBe('Likes could not be loaded');
    expect(component.loading).toBeFalse();
  });

  it('should handle error on loadNext', () => {
    component.pagination.next = '/api/posts/1/likes/?page=2';
    spyOn(likesService, 'getByUrl').and.returnValue(throwError(() => ({ status: 500 })));

    component.loadNext();

    expect(component.error).toBe('Likes could not be loaded');
    expect(component.loading).toBeFalse();
  });

  it('should handle error on loadPrevious', () => {
    component.pagination.previous = '/api/posts/1/likes/?page=1';
    spyOn(likesService, 'getByUrl').and.returnValue(throwError(() => ({ status: 500 })));

    component.loadPrevious();

    expect(component.error).toBe('Likes could not be loaded');
    expect(component.loading).toBeFalse();
  });

});
