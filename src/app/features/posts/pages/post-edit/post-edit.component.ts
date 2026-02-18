import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';

@Component({
  templateUrl: './post-edit.component.html'
})
export class PostEditComponent implements OnInit {

  post: any;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.postsService.getPostById(id).subscribe(post => {
      this.post = post;
    });
  }

  updatePost(payload: any) {
    this.postsService.updatePost(this.post.id, payload).subscribe({
      next: (updated) => {
        this.router.navigate(['/posts', updated.id]);
      },
      error: () => {
        alert('Error updating post');
      }
    });
  }
}
