import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

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
      map(response => this.enrichPaginated(response)),
      catchError(this.handleError)
    );
  }

  getPostById(id: number | string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}${id}/`)
    .pipe(
      map(post => this.enrichPost(post)),
      catchError(this.handleError)
    );
  }

  getByUrl(url: string): Observable<Paginated<Post>> {
    //
    return this.paginationService.getByUrl<Post>(url).pipe(
    map(response => ({
      ...response,
      results: response.results.map(post => ({
        ...post,
        teamColor: this.getColorForTeam(post.author_team)
      }))
    }))
  );
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

  private palette = [
    '#0ea5e9',
    '#0891b2',
    '#16a34a',
    '#9333ea',
    '#ea580c',
    '#dc2626',
    '#ca8a04',
    // '#db2777',
    '#0f766e'
  ];

  private getColorForTeam(team: string): string {
    if (!team) return this.palette[0];

    let hash = 0;

    for (let i = 0; i < team.length; i++) {
      hash = team.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % this.palette.length;

    return this.palette[index];
  }

private enrichPost(post: Post): Post {
  return {
    ...post,
    teamColor: this.getColorForTeam(post.author_team)
  };
}

private enrichPaginated(response: Paginated<Post>): Paginated<Post> {
  return {
    ...response,
    results: response.results.map(post => this.enrichPost(post))
  };
}

}
