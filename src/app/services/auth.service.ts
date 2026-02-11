import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { AuthCredentials, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //prueba de conección al endpoint
  private apiUrl = '/api/users/'; // tu endpoint de posts
  private isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
  ) { }

  login(credentials: AuthCredentials): Observable<unknown> {
    return this.http.post(`${this.apiUrl}login/`, credentials, {
      withCredentials: true,
    }
  )
  .pipe(
      tap(() => this.isLoggedIn$.next(true)))
  ;
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
      tap(() => this.isLoggedIn$.next(false)))
    ;
  }

  authStatus() {
    return this.isLoggedIn$.asObservable();
  }

  // setCurrentUser(user:any){
  //   this.currentUser = user;
  // }

  // getCurrentUser(){
  //   return this.currentUser;
  // }



  // isLoggedIn(): boolean {
  //   return this.currentUser != null;
  // }

}
