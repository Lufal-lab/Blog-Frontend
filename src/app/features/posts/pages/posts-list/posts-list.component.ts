import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsService } from '../../services/posts.service';

import { Post } from 'src/app/core/models/post.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsComponent implements OnInit {

  posts: Post[] = [];

  isLoggedIn$: Observable<boolean>;

  loading = false;
  error: string | null = null;

  pagination: {
    next: string | null;
    previous: string | null;
  } = {
    next: null,
    previous: null
  };

  totalItems: number = 0;      // total de posts (count del backend)
  currentPage: number = 1;     // página actual
  pageSize: number = 10;

  constructor(
    private postsService: PostsService,
    private router: Router,
    private authService: AuthService,
  ){
    this.isLoggedIn$ = this.authService.authStatus();
  }

  ngOnInit(): void {
    this.loadPosts();
  }



  private loadPosts(): void {
    this.loading = true;
    this.error = null;

    this.postsService.getPosts().subscribe({
      next: (response: Paginated<Post>) =>
      this.setPostsResponse(response),
      error: () => {
        this.error = 'No se pudieron cargar los posts';
        this.loading = false;
      }
    });
  }

    /**
   * Carga la página siguiente usando la URL del backend
   */
  loadNext(): void {
    if (!this.pagination.next) return;

    this.loading = true;

    this.postsService.getByUrl(this.pagination.next).subscribe({
      next: (response: Paginated<Post>) => {
        this.setPostsResponse(response);
      },
      error: () => {
        this.error = 'No se pudieron cargar los posts';
        this.loading = false;
      }
    });
  }

  /**
   * Carga la página anterior usando la URL del backend
   */
  loadPrevious(): void {
    if (!this.pagination.previous) return;

    this.loading = true;

    this.postsService.getByUrl(this.pagination.previous).subscribe({
      next: (response: Paginated<Post>) => {
        this.setPostsResponse(response);
      },
      error: () => {
        this.error = 'No se pudieron cargar los posts';
        this.loading = false;
      }
    });
  }

  /**
   * Método centralizado para procesar la respuesta paginada
   */
  private setPostsResponse(response: Paginated<Post>): void {
    this.posts = response.results;

    // this.pagination.next = response.next ? response.next.replace('http://127.0.0.1:8000', '') : null;
    // this.pagination.previous = response.previous ? response.previous.replace('http://127.0.0.1:8000', '') : null;
    this.pagination.next = this.extractRelativePath(response.next);
    this.pagination.previous = this.extractRelativePath(response.previous);

    // Total items
    this.totalItems = response.count;

    // Calcular currentPage usando la URL previous
    if (!response.previous) {
      this.currentPage = 1;
    } else {
      const params = new URLSearchParams(response.previous.split('?')[1]);
      const page = params.get('page');
      this.currentPage = page ? Number(page) + 1 : 2;
    }

    this.loading = false;
  }

  private extractRelativePath(fullUrl: string | null): string | null {
    if (!fullUrl) return null;
    try {
      const url = new URL(fullUrl);
      return url.pathname + url.search; // Esto devuelve solo "/api/posts/?page=2"
    } catch {
      return fullUrl;
    }
  }

  onPostDeleted(postId: number | string): void {
    this.posts = this.posts.filter(post => post.id !== postId )
  }

  createPost(): void {
    this.router.navigate(['/posts/create']); // ruta al formulario de creación
  }
}
