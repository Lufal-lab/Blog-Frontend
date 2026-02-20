import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent {

  constructor(
    private postsService: PostsService,
    private router: Router,
    private alertService: AlertService,
  ) {}

  createPost(payload: any) {
    this.postsService.createPost(payload).subscribe({
      next: (post) => {
        this.router.navigate(['/posts']);
        this.alertService.success('Post published successfully!');
      },
      error: () => {
        alert('Error creating post');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/posts']);
  }
}
