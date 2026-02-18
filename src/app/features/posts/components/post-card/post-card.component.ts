import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

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
  @Output() postDeleted = new EventEmitter<number>();

  isLoggedIn$: Observable<boolean>;
  currentUser: User | null = null;

  showFull = false;

  constructor(
    private authService: AuthService,
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
      this.post.privacy_write === 'team' &&
      this.currentUser.team === this.post.author_team
    ) {
      return true;
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

  deletePost(): void {
    const confirmed = window.confirm('Alert: Are you sure you want to delete this post?');

    if (!confirmed) return;

    this.postsService.deletePost(this.post.id).subscribe(() => {
      this.postDeleted.emit(this.post.id);
    });
  }

}
