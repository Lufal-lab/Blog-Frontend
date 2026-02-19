import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Like } from 'src/app/core/models/like.model';
import { Paginated } from 'src/app/core/models/paginated.model';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  constructor(
    private http: HttpClient,
  ) { }

  //Obtención de likes por post
  getLikesByPost(postId: number | string): Observable<Paginated<Like>> {
    return this.http
      .get<Paginated<Like>>(`/api/posts/${postId}/likes/`)
      .pipe(catchError(this.handleError));
  }

  //Navegación por paginación: al dar vermas en lugar de armar la
  // url el servicio usa la que el maquen mando en el objeo de paginación
  getByUrl(url: string): Observable<Paginated<Like>> {
    return this.http.get<Paginated<Like>>(url);
  }

  addLike(postId: number | string){
    return this.http.post(`/api/posts/${postId}/likes/`, {});
  }

  removeLike(postId: number | string){
    return this.http.delete(`/api/posts/${postId}/likes/unlike/`);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en LikesService', error);
    return throwError(() => error);
  }
}
