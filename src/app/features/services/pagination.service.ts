import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Paginated } from '../../core/models/paginated.model';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor(
    private http: HttpClient
  ) { }

  getByUrl<T>(url: string): Observable<Paginated<T>> {
    return this.http.get<Paginated<T>>(url);
  }
}
