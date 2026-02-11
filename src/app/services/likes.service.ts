import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Like } from '../models/like.model';
import { Paginated } from '../models/paginated.model';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  constructor(
    private http: HttpClient,
  ) { }

  getLikesByPost(postId: number): Observable<Paginated<Like>> {
    return this.http
      .get<Paginated<Like>>(`/api/posts/${postId}/likes/`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Navegación por paginación
   */
  getByUrl(url: string): Observable<Paginated<Like>> {
    return this.http.get<Paginated<Like>>(url);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en LikesService', error);
    return throwError(() => error);
  }
}
