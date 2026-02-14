import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import { AuthCredentials, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //prueba de conección al endpoint
  private apiUrl = '/api/users/'; // tu endpoint de posts
  private isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private currentUser$ = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
  ) { }

  login(credentials: AuthCredentials): Observable<unknown> {
    return this.http.post<{ email: string }>(`${this.apiUrl}login/`, credentials, {
      withCredentials: true,
    }
    )
    .pipe(
        tap(() => {
          this.isLoggedIn$.next(true);
          this.currentUser$.next(credentials.email);
        })
    );
    }

  logout(): Observable<unknown> {
    return this.http.post(
      `${this.apiUrl}logout/`,
      {},
      {
        withCredentials: true
      }
    )
    .pipe(
      tap(() => {
        this.isLoggedIn$.next(false);
        this.currentUser$.next(null);
      }
      )
    );
  }

  authStatus() {
    return this.isLoggedIn$.asObservable();
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn$.value;
  }

  createUser(data: {email: string, password: string}) {
    return this.http.post<string>(
      `${this.apiUrl}register/`,
      data,
    { withCredentials: true })
  }

  currentUser(): Observable<{ email: string } | null> {
    return this.currentUser$.asObservable().pipe(
    map(email => email ? { email } : null)
  );
  }

}
