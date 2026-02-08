import { Component, OnInit } from '@angular/core';

import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/models/post.model';
import { Paginated } from 'src/app/models/paginated.model';

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
      next: (response) => {
        this.posts = response.results;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los posts';
        this.loading = false;
      }
    });
  }

}
