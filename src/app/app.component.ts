import { Component, OnInit} from '@angular/core';

import { AuthService } from './services/auth.service';

import { Post } from './models/post.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{
  title = 'blog-frontend-avanzatech';
  posts: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getPosts().subscribe({
      next: response => {
        this.posts = response.results; // según paginación de tu backend
      },
      error: (err) => {
        console.error('Error al conectar con backend', err);
      }
    });
  }
}
