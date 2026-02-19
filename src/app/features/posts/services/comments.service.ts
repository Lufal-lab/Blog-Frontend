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

  getCommentsByPost(postId:number|string): Observable<Paginated<Comment>> {
    return this.http.get<Paginated<Comment>>(`/api/posts/${postId}/comments/`)
    .pipe(catchError(this.handleError));
  }

  getByUrl(url: string): Observable<Paginated<Comment>> {
    return this.http.get<Paginated<Comment>>(url)
    .pipe(catchError(this.handleError));
  }

  createComment(postId: number|string, content: string): Observable<Comment> {
    return this.http.post<Comment>(`/api/posts/${postId}/comments/`, { content })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en CommentsService', error);
    return throwError(() => error);
  }
}
