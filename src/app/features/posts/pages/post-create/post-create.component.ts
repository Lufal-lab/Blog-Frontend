import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';

@Component({
  templateUrl: './post-create.component.html'
})
export class PostCreateComponent {

  constructor(
    private postsService: PostsService,
    private router: Router
  ) {}

  createPost(payload: any) {
    this.postsService.createPost(payload).subscribe({
      next: (post) => {
        this.router.navigate(['/posts', post.id]);
      },
      error: () => {
        alert('Error creating post');
      }
    });
  }
}
