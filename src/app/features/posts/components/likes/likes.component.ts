import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { LikesService } from '../../services/likes.service';
import { Like } from 'src/app/core/models/like.model';
import { Paginated } from 'src/app/core/models/paginated.model';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.scss']
})
export class LikesComponent implements OnInit {

  likes: Like[] = [];

  pagination: {
    next: string | null;
    previous: string | null;
  } = {
    next: null,
    previous: null
  };

  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 15;

  loading = true;
  error: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { postId: number },
    private likesService: LikesService
  ) {}

  ngOnInit(): void {
    this.loadLikes();
  }
  private loadLikes(): void {
    this.loading = true;
    this.error = null;

    this.likesService.getLikesByPost(this.data.postId)
      .subscribe({
        next: (response: Paginated<Like>) => this.setLikesResponse(response),
        error: () => {
          this.error ='Likes could not be loaded';
          this.loading = false;
        }
      });
  }

  loadNext(): void {
    if (!this.pagination.next) {
      console.log('No hay next:', this.pagination.next);
      return;
    }
    this.loading = true;

    console.log('Cargando siguiente página con URL:', this.pagination.next);
    this.likesService.getByUrl(this.pagination.next).subscribe({
      next: (response: Paginated<Like>) => {
        this.setLikesResponse(response);
        this.currentPage++; // sube la página
      },
      error: () => {
        this.error = 'Likes could not be loaded';
        this.loading = false;
      }
    });
  }

  loadPrevious(): void {
    if (!this.pagination.previous) return;
    this.loading = true;

    this.likesService.getByUrl(this.pagination.previous).subscribe({
      next: (response: Paginated<Like>) => {
        this.setLikesResponse(response);
        this.currentPage--; // baja la página
      },
      error: () => {
        this.error = 'Likes could not be loaded';
        this.loading = false;
      }
    });
  }

  private setLikesResponse(response: Paginated<Like>): void {
    console.log('Respuesta de Likes API:', response); // <- Esto nos dice qué devuelve realmente

    this.likes = response.results;
    this.pagination.next = response.next ? response.next.replace('http://127.0.0.1:8000', '') : null;
    this.pagination.previous = response.previous ? response.previous.replace('http://127.0.0.1:8000', '') : null;

    this.totalItems = response.count;
    this.pageSize = 15;
    this.loading = false;
  }

}

