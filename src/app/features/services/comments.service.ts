import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Comment } from '../../core/models/comment.model';
import { Paginated } from '../../core/models/paginated.model';

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
    return this.http.get<Paginated<Comment>>(url);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en CommentsService', error);
    return throwError(() => error);
  }
}
