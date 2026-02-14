import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './core/services/auth.service';
import { PostsService } from './features/services/posts.service';
import { CommentsService } from './features/services/comments.service';
import { LikesService } from './features/services/likes.service';

import { Post } from './core/models/post.model';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent{
  // title = 'blog-frontend-avanzatech';
  // posts: any[] = [];

  constructor(
    private postsService: PostsService,
    private commentsService: CommentsService,
    private likesService: LikesService,
    private router: Router,
    private authService: AuthService,
  ) {}

  // ngOnInit() {
  //   this.postsService.getPosts().subscribe({
  //     next: response => {
  //       this.posts = response.results; // según paginación de tu backend
  //       console.log('Respuesta backend', response);
  //       this.commentsService.getCommentsByPost(40).subscribe(console.log);
  //       this.likesService.getLikesByPost(40).subscribe(console.log);
  //     },
  //     error: (err) => {
  //       console.error('Error al conectar con backend', err);
  //     }
  //   });
  // }


}
