import { Component, OnInit} from '@angular/core';

import { AuthService } from './services/auth.service';
import { PostsService } from './services/posts.service';


import { Post } from './models/post.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{
  title = 'blog-frontend-avanzatech';
  posts: any[] = [];

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.postsService.getPosts().subscribe({
      next: response => {
        this.posts = response.results; // según paginación de tu backend
        console.log('Respuesta backend', response);
      },
      error: (err) => {
        console.error('Error al conectar con backend', err);
      }
    });
  }
}
