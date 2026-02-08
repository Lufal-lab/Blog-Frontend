import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PostsService } from './posts.service';
import { Post } from '../models/post.model';
import { Paginated } from '../models/paginated.model'
import { PrivacyLevel } from '../models/privacy-level.enum';

describe('PostsService', () => {
  let service: PostsService;
  let httpMock: HttpTestingController; // variable para controlar las peticiones simuladas

  // Mock de un post, que se usará en varios tests
  const postMock: Post = {
    id: 1,
    author: 1,
    author_email: 'user@example.com',
    author_team: 'team1',
    title: 'Mi primer post',
    content: 'Contenido del post',
    excerpt: 'Contenido...',
    likes_count: '0',
    comments_count: '0',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    privacy_read: PrivacyLevel.PUBLIC,
    privacy_write: PrivacyLevel.PUBLIC
  };

  const dummyPosts: Paginated<Post> = {
    count: 1,
    next: null,
    previous: null,
    results: [postMock]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Se importa el módulo de testing HTTP para simular peticiones
      imports: [HttpClientTestingModule],
      // Se registra el servicio que se va a probar
      providers: [PostsService]
    });
    //Se inyecta el servicio desde TestBed
    service = TestBed.inject(PostsService);
    //Se inyecta el controlador para verificar las peticiones HTTP
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Esto asegura que no quede ninguna petición HTTP pendiente
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the lists of posts', () => {
    service.getPosts().subscribe(res => {
    expect(res).toEqual(dummyPosts);
  });

  const req = httpMock.expectOne('/api/posts/');
  expect(req.request.method).toBe('GET');
  req.flush(dummyPosts);
  });

  it('should fetch a single post by ID', () => {
    service.getPostById(1).subscribe(res => {
      expect(res).toEqual(postMock);
    });

  const req = httpMock.expectOne('/api/posts/1/');
  expect(req.request.method).toBe('GET');
  req.flush(postMock);
  });

  it('getPosts should handle error', () => {
    service.getPosts().subscribe({
      next: () => fail('Debe fallar con un error'),
      error: (err) => {
        expect(err.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('/api/posts/');
    req.flush({ message: 'Error interno' }, { status: 500, statusText: 'Internal Server Error' });
  });

  it('getPostById should handle error', () => {
    const postId = 999;
    service.getPostById(postId).subscribe({
      next: () => fail('Debe fallar con un error'),
      error: (err) => {
        expect(err.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`/api/posts/${postId}/`);
    req.flush({ message: 'No encontrado' }, { status: 404, statusText: 'Not Found' });
  });

});
