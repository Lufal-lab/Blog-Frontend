import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { CommentsService } from '../../services/comments.service';
import { LikesService } from '../../services/likes.service';
import { Post } from 'src/app/core/models/post.model';
import { Comment } from 'src/app/core/models/comment.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {

  post!: Post;
  postId!: number;

  comments: Comment[] = [];
  likesCount = 0;

  loadingPost = false;
  loadingComments = false;
  error: string | null = null;

  pagination = { next: null as string | null, previous: null as string | null };

  totalComments = 0;
  currentPage = 1;
  pageSize = 5; // configurable

  isLoggedIn$: Observable<boolean>;


  // newComment = '';



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postsService: PostsService,
    private commentsService: CommentsService,
    private likesService: LikesService,
    private authService: AuthService
  ){
    this.isLoggedIn$ = this.authService.authStatus();
  }

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPost();
    this.loadComments();
    this.loadLikes();
  }

  loadPost(): void {
    this.loadingPost = true;
    this.postsService.getPostById(this.postId).subscribe({
      next: post => {
        this.post = post;
        this.loadingPost = false;
      },
      error: () => {
        this.error = 'Post could not be loaded';
        this.loadingPost = false;
      }
    });
  }

  loadComments(): void {
    this.loadingComments = true;
    this.error = null;

    this.commentsService.getCommentsByPost(this.postId).subscribe({
      next: (response: Paginated<Comment>) => this.setCommentsResponse(response),
      error: () => {
        this.error = 'Comments could not be loaded';
        this.loadingComments = false;
      }
    });
  }

  loadNextComments(): void {
    if (!this.pagination.next) return;
    this.loadingComments = true;

    this.commentsService.getByUrl(this.pagination.next).subscribe({
      next: (response: Paginated<Comment>) => {
        this.setCommentsResponse(response);
        this.currentPage++;
      },
      error: () => {
        this.error = 'Comments could not be loaded';
        this.loadingComments = false;
      }
    });
  }

  loadPreviousComments(): void {
    if (!this.pagination.previous) return;
    this.loadingComments = true;

    this.commentsService.getByUrl(this.pagination.previous).subscribe({
      next: (response: Paginated<Comment>) => {
        this.setCommentsResponse(response);
        this.currentPage--;
      },
      error: () => {
        this.error = 'Comments could not be loaded';
        this.loadingComments = false;
      }
    });
  }

  private setCommentsResponse(response: Paginated<Comment>) {
    this.comments = response.results;
    this.pagination.next = response.next ? response.next.replace('http://127.0.0.1:8000', '') : null;
    this.pagination.previous = response.previous ? response.previous.replace('http://127.0.0.1:8000', '') : null;
    this.totalComments = response.count;
    this.loadingComments = false;
  }

  handleCommentSubmit(content: string): void {
    // Usamos el 'content' que viene del componente hijo
    this.commentsService.createComment(this.postId, content).subscribe({
      next: () => {
        this.loadComments(); // Recarga la lista para ver el nuevo
      },
      error: () => {
        this.error = 'Could not submit comment';
      }
    });
  }

  loadLikes(): void {
    this.likesService.getLikesByPost(this.postId).subscribe({
      next: resp => {
        this.likesCount = resp.count;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/posts']);
  }
}
