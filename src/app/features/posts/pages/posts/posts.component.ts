import { Component, OnInit } from '@angular/core';

import { PostsService } from 'src/app/features/services/posts.service';

import { Post } from 'src/app/core/models/post.model';
import { Paginated } from 'src/app/core/models/paginated.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.sass']
})
export class PostsComponent implements OnInit {

  posts: Post[] = [];

  loading = false;
  error: string | null = null;

  pagination: {
    next: string | null;
    previous: string | null;
  } = {
    next: null,
    previous: null
  };

  constructor(
    private postsService: PostsService,
  ){}

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
    this.pagination.next = response.next ? response.next.replace('http://127.0.0.1:8000', '') : null;
    this.pagination.previous = response.previous ? response.previous.replace('http://127.0.0.1:8000', '') : null;
    this.loading = false;
  }


}
