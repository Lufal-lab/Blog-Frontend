import { Component, OnInit} from '@angular/core';

import { AuthService } from './services/auth.service'; 


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
      next: (data) => {
        this.posts = data.results || data; // según paginación de tu backend
      },
      error: (err) => {
        console.error('Error al conectar con backend', err);
      }
    });
  }
}
