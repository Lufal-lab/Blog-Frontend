import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) { }

  private currentUser: any = null;

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
