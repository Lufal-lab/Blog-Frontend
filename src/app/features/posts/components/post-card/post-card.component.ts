import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { AlertService } from 'src/app/core/services/alert.service';


import { User } from 'src/app/core/models/user.model';
import { Post } from 'src/app/core/models/post.model';
import { LikesComponent } from '../likes/likes.component';

import { LikesService } from '../../services/likes.service';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent{

  @Input() post!: Post;
  @Output() postDeleted = new EventEmitter<number | string>();

  isLoggedIn$: Observable<boolean>;
  currentUser: User | null = null;

  showFull = false;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private router: Router,
    private likesService: LikesService,
    private postsService: PostsService
  ){
    this.isLoggedIn$ = this.authService.authStatus();

    this.authService.currentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  openLikes(): void {
    this.dialog.open(LikesComponent, {
      width: '450px',
      data: { postId: this.post.id }
    })
  }

  openPost(): void {
    this.router.navigate(['/posts', this.post.id]);
  }

  get canEdit(): boolean{
    if(!this.currentUser) return false;

    if(this.currentUser.is_superuser){
      return true;
    }

    if (this.currentUser.email === this.post.author_email) {
      return true;
    }

    if (
      this.post.privacy_write === 'team'
      // && this.post.author_team !== "Default"
      &&
      this.currentUser.team === this.post.author_team
    ) {
      return true;
    }

    if (
      this.post.privacy_write === 'authenticated'
    ){
      return true
    }

    return false
  }

  editPost(): void {
    this.router.navigate(['/posts', this.post.id, 'edit']);
  }

  toggleLike(): void {

    if (this.post.is_liked) {

      this.post.is_liked = false;
      this.post.likes_count--;

      this.likesService.removeLike(this.post.id).subscribe({
        error: () => {
          this.post.is_liked = true;
          this.post.likes_count++;
        }
      });

    } else {

      this.post.is_liked = true;
      this.post.likes_count++;

      this.likesService.addLike(this.post.id).subscribe({
        error: () => {
          this.post.is_liked = false;
          this.post.likes_count--;
        }
      });

    }
  }

  async onDeletePost(): Promise<void> {
    const confirmed = await this.alertService.confirm(
    'Delete Post',
    'This action cannot be undone. Are you sure?',
    'Delete',
    'warn'
    );

    if (!confirmed) return;

    this.postsService.deletePost(this.post.id).subscribe(() => {
      this.postDeleted.emit(this.post.id);
      this.alertService.success('Post deleted');
    });
  }

}
