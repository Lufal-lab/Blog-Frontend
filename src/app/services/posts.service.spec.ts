// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// import { PostsService } from './posts.service';
// import { Post } from '../models/post.model';
// import { Paginated } from '../models/paginated.model'
// import { PrivacyLevel } from '../models/privacy-level.enum';

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
//     likes_count: '0',
//     comments_count: '0',
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

// it('should fetch a single post by ID', () => {
//   service.getPost(1).subscribe(res => {
//     expect(res).toEqual(postMock);
//   });

//   const req = httpMock.expectOne('/api/posts/1/');
//   expect(req.request.method).toBe('GET');
//   req.flush(postMock);
// });

// // it('should create a post', () => {
// //   const newPost: PostCreate = { title: 'Title', content: 'Content', privacy_read: 'public', privacy_write: 'public' };
// //   service.createPost(newPost).subscribe(res => {
// //     expect(res.title).toBe('Title');
// //   });

// //   const req = httpMock.expectOne('/api/posts/');
// //   expect(req.request.method).toBe('POST');
// //   expect(req.request.body).toEqual(newPost);
// //   req.flush(postMock);
// // });

// // it('should update a post completely', () => {
// //   service.updatePost(1, postUpdateMock).subscribe(res => {
// //     expect(res.id).toBe(1);
// //   });

// //   const req = httpMock.expectOne('/api/posts/1/');
// //   expect(req.request.method).toBe('PUT');
// //   req.flush(postMock);
// // });

// // it('should partially update a post', () => {
// //   const patchData = { title: 'New title' };
// //   service.partialUpdatePost(1, patchData).subscribe(res => {
// //     expect(res.title).toBe('New title');
// //   });

// //   const req = httpMock.expectOne('/api/posts/1/');
// //   expect(req.request.method).toBe('PATCH');
// //   expect(req.request.body).toEqual(patchData);
// //   req.flush({...postMock, ...patchData});
// // });

// // it('should delete a post', () => {
// //   service.deletePost(1).subscribe(res => {
// //     expect(res).toBeUndefined();
// //   });

// //   const req = httpMock.expectOne('/api/posts/1/');
// //   expect(req.request.method).toBe('DELETE');
// //   req.flush({});
// // });


// });

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostsService } from './posts.service';
import { Post } from '../models/post.model';
import { Paginated } from '../models/paginated.model';
import { PrivacyLevel } from '../models/privacy-level.enum';

describe('PostsService', () => {
  let service: PostsService;
  let httpMock: HttpTestingController;

  const mockPosts: Post[] = [
    { id: 1, author: 1, author_email: 'a@example.com', author_team: 'Team A', title: 'Post 1', content: 'Content 1', excerpt: 'Excerpt 1', likes_count: '0', comments_count: '0', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), privacy_read: PrivacyLevel.PUBLIC, privacy_write: PrivacyLevel.PUBLIC },
    { id: 2, author: 2, author_email: 'b@example.com', author_team: 'Team B', title: 'Post 2', content: 'Content 2', excerpt: 'Excerpt 2', likes_count: '0', comments_count: '0', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), privacy_read: PrivacyLevel.PUBLIC, privacy_write: PrivacyLevel.PUBLIC }
  ];

  const mockPaginatedResponse: Paginated<Post> = {
    count: 2,
    next: null,
    previous: null,
    results: mockPosts
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostsService]
    });
    service = TestBed.inject(PostsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden requests abiertas
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPosts', () => {
    it('should fetch all posts successfully', () => {
      service.getPosts().subscribe(response => {
        expect(response.results.length).toBe(2);
        expect(response).toEqual(mockPaginatedResponse);
      });

      const req = httpMock.expectOne('/api/posts/');
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should handle error when getPosts fails', () => {
      service.getPosts().subscribe({
        next: () => fail('Expected an error, not posts'),
        error: (error) => expect(error.status).toBe(500)
      });

      const req = httpMock.expectOne('/api/posts/');
      req.flush('Error interno', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getPostById', () => {
    it('should fetch a single post by id successfully', () => {
      const postId = 1;
      service.getPostById(postId).subscribe(post => {
        expect(post.id).toBe(postId);
        expect(post).toEqual(mockPosts[0]);
      });

      const req = httpMock.expectOne(`/api/posts/${postId}/`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPosts[0]);
    });

    it('should handle error when getPostById fails', () => {
      const postId = 999;
      service.getPostById(postId).subscribe({
        next: () => fail('Expected an error, not post'),
        error: (error) => expect(error.status).toBe(404)
      });

      const req = httpMock.expectOne(`/api/posts/${postId}/`);
      req.flush('Post no encontrado', { status: 404, statusText: 'Not Found' });
    });
  });
});
