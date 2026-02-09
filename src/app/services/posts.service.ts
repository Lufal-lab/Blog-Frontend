import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { PaginationService } from './pagination.service';

import { Post } from '../models/post.model';
import { Paginated } from '../models/paginated.model';

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

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`/api/posts/${id}/`)
    .pipe(
      catchError(this.handleError)
    );
  }

  getByUrl(url: string): Observable<Paginated<Post>> {
    return this.paginationService.getByUrl<Post>(url);
  }

  private handleError(error: HttpErrorResponse) {
    console.log('Error in PostService: ', error);
    return throwError(() => error);
  }

  // createPost(post: PostCreate): Observable<Post> {
  //   return this.http.post<Post>('/api/posts/', post);
  // }

  // updatePost(id: number, post: PostUpdate): Observable<Post> {
  //   return this.http.put<Post>(`/api/posts/${id}/`, post);
  // }

  // partialUpdatePost(id: number, post: Partial<PostUpdate>): Observable<Post> {
  //   return this.http.patch<Post>(`/api/posts/${id}/`, post);
  // }

  // deletePost(id: number): Observable<void> {
  //   return this.http.delete<void>(`/api/posts/${id}/`);
  // }
}
