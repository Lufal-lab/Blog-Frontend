import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LikesService } from './likes.service';
import { Paginated } from 'src/app/core/models/paginated.model';
import { Like } from 'src/app/core/models/like.model';

describe('LikesService', () => {
  let service: LikesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LikesService],
    });

    service = TestBed.inject(LikesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getLikesByPost should GET likes for a post', () => {
    const dummyPaginated: Paginated<Like> = {
      results: [
        { id: 1, user_email: 'usuario1@gmail.com', post: 1, created_at: '2026-01-01' } as Like,
        { id: 2, user_email: 'usuario2@gmail.com', post: 1, created_at: '2026-01-02' } as Like,
      ],
      count: 2,
      next: null,
      previous: null,
    };

    service.getLikesByPost(1).subscribe(res => {
      expect(res).toEqual(dummyPaginated);
    });

    const req = httpMock.expectOne('/api/posts/1/likes/');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPaginated);
  });

  it('getByUrl should GET likes from a given URL', () => {
    const dummyPaginated: Paginated<Like> = {
      results: [],
      count: 0,
      next: null,
      previous: null,
    };
    const url = '/api/posts/1/likes/?page=2';

    service.getByUrl(url).subscribe(res => {
      expect(res).toEqual(dummyPaginated);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPaginated);
  });

  it('addLike should POST to the like endpoint', () => {
    service.addLike(1).subscribe(res => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne('/api/posts/1/likes/');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('removeLike should DELETE to the unlike endpoint', () => {
    service.removeLike(1).subscribe(res => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne('/api/posts/1/likes/unlike/');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('getLikesByPost should handle error', () => {
    const errorMsg = 'simulated network error';

    service.getLikesByPost(1).subscribe({
      next: () => fail('should have failed with error'),
      error: (error) => {
        expect(error.statusText).toBe('Bad Request');
      }
    });

    const req = httpMock.expectOne('/api/posts/1/likes/');
    req.flush({ message: errorMsg }, { status: 400, statusText: 'Bad Request' });
  });

});
