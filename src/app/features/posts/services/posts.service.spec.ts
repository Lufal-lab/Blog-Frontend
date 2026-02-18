// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// import { PostsService } from './posts.service';
// import { Post } from 'src/app/core/models/post.model';
// import { Paginated } from 'src/app/core/models/paginated.model';
// import { PrivacyLevel } from 'src/app/core/models/privacy-level.enum';

// describe('PostsService', () => {
//   let service: PostsService;
//   let httpMock: HttpTestingController; // variable para controlar las peticiones simuladas

//   // Mock de un post, que se usará en varios tests
//   const postMock: Post = {
//     id: 1,
//     author: 1,
//     author_email: 'user@example.com',
//     author_team: 'team1',
//     title: 'Mi primer post',
//     content: 'Contenido del post',
//     excerpt: 'Contenido...',
//     likes_count: 0,
//     comments_count: 0,
//     is_liked: true,
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//     privacy_read: PrivacyLevel.PUBLIC,
//     privacy_write: PrivacyLevel.PUBLIC
//   };

//   const dummyPosts: Paginated<Post> = {
//     count: 1,
//     next: null,
//     previous: null,
//     results: [postMock]
//   };

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       // Se importa el módulo de testing HTTP para simular peticiones
//       imports: [HttpClientTestingModule],
//       // Se registra el servicio que se va a probar
//       providers: [PostsService]
//     });
//     //Se inyecta el servicio desde TestBed
//     service = TestBed.inject(PostsService);
//     //Se inyecta el controlador para verificar las peticiones HTTP
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     // Esto asegura que no quede ninguna petición HTTP pendiente
//     httpMock.verify();
//   })

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should fetch the lists of posts', () => {
//     service.getPosts().subscribe(res => {
//     expect(res).toEqual(dummyPosts);
//   });

//   const req = httpMock.expectOne('/api/posts/');
//   expect(req.request.method).toBe('GET');
//   req.flush(dummyPosts);
//   });

//   it('should fetch a single post by ID', () => {
//     service.getPostById(1).subscribe(res => {
//       expect(res).toEqual(postMock);
//     });

//   const req = httpMock.expectOne('/api/posts/1/');
//   expect(req.request.method).toBe('GET');
//   req.flush(postMock);
//   });

//   it('getPosts should handle error', () => {
//     service.getPosts().subscribe({
//       next: () => fail('Debe fallar con un error'),
//       error: (err) => {
//         expect(err.status).toBe(500);
//       }
//     });

//     const req = httpMock.expectOne('/api/posts/');
//     req.flush({ message: 'Error interno' }, { status: 500, statusText: 'Internal Server Error' });
//   });

//   it('getPostById should handle error', () => {
//     const postId = 999;
//     service.getPostById(postId).subscribe({
//       next: () => fail('Debe fallar con un error'),
//       error: (err) => {
//         expect(err.status).toBe(404);
//       }
//     });

//     const req = httpMock.expectOne(`/api/posts/${postId}/`);
//     req.flush({ message: 'No encontrado' }, { status: 404, statusText: 'Not Found' });
//   });

// });
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

  it('getPosts should return paginated posts', () => {
    const dummyPosts: Paginated<Post> = {
      results: [{ id: 1, title: 'Test', content: 'Test content' } as Post],
      count: 1,
      next: null,
      previous: null
    };

    service.getPosts().subscribe(res => {
      expect(res).toEqual(dummyPosts);
    });

    const req = httpMock.expectOne('/api/posts/');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPosts);
  });

  it('getPostById should return a post', () => {
    const dummyPost: Post = { id: 1, title: 'Test', content: 'Test content' } as Post;

    service.getPostById(1).subscribe(res => {
      expect(res).toEqual(dummyPost);
    });

    const req = httpMock.expectOne('/api/posts/1/');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPost);
  });

  it('getByUrl should call PaginationService.getByUrl', () => {
    const url = '/api/posts/?page=1';
    const dummyPaginated: Paginated<Post> = {
      results: [],
      count: 0,
      next: null,
      previous: null
    };

    paginationServiceSpy.getByUrl.and.returnValue(of(dummyPaginated));

    service.getByUrl(url).subscribe(result => {
      expect(result).toEqual(dummyPaginated);
    });

    expect(paginationServiceSpy.getByUrl).toHaveBeenCalledWith(url);
  });


  it('createPost should POST and return a post', () => {
    const post: CreatePostDTO = { title: 'New', content: 'Content', privacy_read: PrivacyLevel.PUBLIC, privacy_write: PrivacyLevel.AUTHOR  };
    const returnedPost: Post = { id: 1, title: 'New', content: 'Content' } as Post;

    service.createPost(post).subscribe(res => {
      expect(res).toEqual(returnedPost);
    });

    const req = httpMock.expectOne('/api/posts/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(post);
    req.flush(returnedPost);
  });

  it('updatePost should PATCH and return updated post', () => {
    const update: UpdatePostDTO = { title: 'Updated' };
    const returnedPost: Post = { id: 1, title: 'Updated', content: 'Old content' } as Post;

    service.updatePost(1, update).subscribe(res => {
      expect(res).toEqual(returnedPost);
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
