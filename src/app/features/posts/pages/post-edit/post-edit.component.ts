import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';

import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {

  post: any;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private router: Router,
    private alertService: AlertService
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

        this.alertService.success('Post updated successfully!');
        this.router.navigate(['/posts', this.post.id]);
      },
      // error: (err) => {
      //   const message = err?.error?.message || 'Error updating post';
      //   this.alertService.error(message);
      // }
    });
  }

  goBack(): void {
    this.router.navigate(['/posts']);
  }
}
