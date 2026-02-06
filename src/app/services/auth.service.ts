import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //prueba de conección al endpoint
  private apiUrl = 'http://localhost:8000/api/posts/'; // tu endpoint de posts

  constructor(
    private http: HttpClient,
  ) { }

  private currentUser: any = null;

  getPosts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  login(credentials: any): Observable<any> {
    return this.http.post('/api/users/login/', credentials, {
      withCredentials: true,
    });
  }

  setCurrentUser(user:any){
    this.currentUser = user;
  }

  getCurrentUser(){
    return this.currentUser;
  }
  
  logout() {
    this.currentUser = null;
  }

  isLoggedIn(): boolean {
    return this.currentUser != null;
  }

}
