import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Comment } from 'src/app/core/models/comment.model';
import { Paginated } from 'src/app/core/models/paginated.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(
    private http: HttpClient,
  ) { }

  getCommentsByPost(PostId:number): Observable<Paginated<Comment>> {
    return this.http.get<Paginated<Comment>>(`/api/posts/${PostId}/comments/`)
    .pipe(catchError(this.handleError));
  }

  getByUrl(url: string): Observable<Paginated<Comment>> {
    return this.http.get<Paginated<Comment>>(url)
    .pipe(catchError(this.handleError));;
  }

  createComment(postId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`/api/posts/${postId}/comments/`, { content })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en CommentsService', error);
    return throwError(() => error);
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// import { Comment } from 'src/app/core/models/comment.model'; // ✅ tu modelo correcto
// import { Paginated } from 'src/app/core/models/paginated.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class CommentsService {

//   constructor(private http: HttpClient) { }

//   /**
//    * Trae los comentarios de un post específico (paginados)
//    */
//   getCommentsByPost(postId: number, pageSize: number = 5): Observable<Paginated<Comment>> {
//     return this.http.get<Paginated<Comment>>(
//       `/api/posts/${postId}/comments/?page_size=${pageSize}&ordering=created_at`
//     ).pipe(
//       catchError(this.handleError)
//     );
//   }

//   /**
//    * Navegar a través de la paginación usando la URL devuelta por el backend
//    */
//   getByUrl(url: string): Observable<Paginated<Comment>> {
//     return this.http.get<Paginated<Comment>>(url).pipe(
//       catchError(this.handleError)
//     );
//   }

//   /**
//    * Crear un comentario en un post
//    */
//   createComment(postId: number, content: string) {
//     return this.http.post<Comment>(`/api/posts/${postId}/comments/`, { content }).pipe(
//       catchError(this.handleError)
//     );
//   }

//   private handleError(error: HttpErrorResponse) {
//     console.error('Error en CommentsService', error);
//     return throwError(() => error);
//   }
// }

