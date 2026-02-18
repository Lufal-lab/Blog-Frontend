import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { PaginationService } from 'src/app/core/services/pagination.service';

import { CreatePostDTO, Post, UpdatePostDTO } from 'src/app/core/models/post.model';
import { Paginated } from 'src/app/core/models/paginated.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private apiUrl = '/api/posts/';

  constructor(
    private http: HttpClient,
    private paginationService: PaginationService,
  ) { }

  getPosts(): Observable<Paginated<Post>> {
    return this.http.get<Paginated<Post>>(this.apiUrl)
    .pipe(
      catchError(this.handleError)
    );
  }

  getPostById(id: number | string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}${id}/`)
    .pipe(
      catchError(this.handleError)
    );
  }

  getByUrl(url: string): Observable<Paginated<Post>> {
    return this.paginationService.getByUrl<Post>(url);
  }

  createPost(post: CreatePostDTO): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  updatePost(id: number | string, post: UpdatePostDTO): Observable<Post> {
    return this.http.patch<Post>(`${this.apiUrl}${id}/`, post);
  }

  deletePost(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }

}
