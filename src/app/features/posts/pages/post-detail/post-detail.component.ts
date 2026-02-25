import { Component, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { CommentsService } from '../../services/comments.service';
import { LikesService } from '../../services/likes.service';
import { User } from 'src/app/core/models/user.model';
import { Post } from 'src/app/core/models/post.model';
import { Comment } from 'src/app/core/models/comment.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Observable } from 'rxjs';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {

  @Output() postDeleted = new EventEmitter<number | string>();

  post!: Post;
  postId!: number;

  safeContent!: SafeHtml;

  currentUser: User | null = null;

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
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private alertService: AlertService,
  ){
    this.isLoggedIn$ = this.authService.authStatus();
  }

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.authService.currentUser().subscribe(user => {
      this.currentUser = user;
    });
    this.loadPost();
    this.loadComments();
    this.loadLikes();
  }

  //   ngOnChanges(){
  //   if (this.post?.content) {
  //     this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.post.content);
  //   }
  // }

  loadPost(): void {
    this.loadingPost = true;
    this.postsService.getPostById(this.postId).subscribe({
      next: post => {
        this.post = post;
        if (this.post?.content) {
          this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.post.content);
        }
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

  // handleCommentSubmit(content: string): void {
  //   // Usamos el 'content' que viene del componente hijo
  //   this.commentsService.createComment(this.postId, content).subscribe({
  //     next: () => {
  //       this.loadComments(); // Recarga la lista para ver el nuevo
  //     },
  //     error: () => {
  //       this.error = 'Could not submit comment';
  //     }
  //   });
  // }

  handleCommentSubmit(content: string): void {
    this.commentsService.createComment(this.postId, content).subscribe({
      next: () => {
        // 1. Primero cargamos para saber cuántos comentarios hay en total ahora
        this.commentsService.getCommentsByPost(this.postId).subscribe(res => {

          // 2. TRUCO: Calculamos la última página de forma simple
          // Si tienes 11 comentarios y el tamaño es 5, la última es la 3.
          this.currentPage = Math.ceil(res.count / this.pageSize);

          // 3. Cargamos los comentarios de esa página específica
          this.loadCommentsByPage(this.currentPage);
        });
      }
    });
  }

// Un mini método para cargar una página específica
loadCommentsByPage(page: number): void {
  // Aquí usas la URL de tu API pasándole el número de página
  const url = `/api/posts/${this.postId}/comments/?page=${page}`;

  this.commentsService.getByUrl(url).subscribe(res => {
    this.setCommentsResponse(res);
    // Bajamos un poquito para que el usuario vea su mensaje
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 300);
  });
}

  loadLikes(): void {
    this.likesService.getLikesByPost(this.postId).subscribe({
      next: resp => {
        this.likesCount = resp.count;
      }
    });
  }

  editPost(): void {
    this.router.navigate(['/posts', this.post.id, 'edit']);
  }

  async onDeletePost(): Promise<void> {
    const confirmed = await this.alertService.confirm(
    'Delete Post',
    'Are you sure you want to delete this post?',
    'Delete',
    'warn'
    );

    if (!confirmed) return;

    this.postsService.deletePost(this.post.id).subscribe(() => {
      this.postDeleted.emit(this.post.id);
      this.alertService.success('Post deleted');
    });
  }

  goBack(): void {
    this.router.navigate(['/posts']);
  }

  get canEdit(): boolean{

    console.log(this.currentUser);
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
}
