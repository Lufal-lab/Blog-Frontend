import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
// import { map } from 'rxjs/operators';

import { AuthCredentials, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //prueba de conección al endpoint
  private apiUrl = '/api/users/'; // tu endpoint de posts
  private isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
  ) {
    this.checkSession();
   }

  login(credentials: AuthCredentials): Observable<unknown> {
    return this.http.post(`${this.apiUrl}login/`, credentials, {
      withCredentials: true,
    }
    )
    .pipe(
        tap(() => {
          this.checkSession();
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

  private checkSession(): void {
    this.http.get<User>(`${this.apiUrl}me/`, {
      withCredentials: true
    })
    .pipe(
      catchError(() => {
        this.isLoggedIn$.next(false);
        this.currentUser$.next(null);
        return of(null);
      })
    )
    .subscribe(user => {
      if (user) {
        this.isLoggedIn$.next(true);
        this.currentUser$.next(user);
      }
    });
  }

  authStatus(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn$.value;
  }

  createUser(data: {email: string, password: string}) {
    return this.http.post(
      `${this.apiUrl}register/`,
      data,
    { withCredentials: true })
  }

  currentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

}
