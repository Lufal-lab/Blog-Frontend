import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, filter } from 'rxjs/operators';

import { AuthCredentials, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/users/';
  // private apiUrl = 'http://localhost:8000/api/users/';

  // BehaviorSubjects: Guardan el estado actual y lo emiten a quien se suscriba,
  // Se usa en header o con el boton crear posts para saber en tiempo real si hay alguien logueado
  // Variale con memoria si ya se cargo algo esto entrega el ultimo valor conocido
  private isLoggedIn$ = new BehaviorSubject<boolean | null>(null);
  private currentUser$ = new BehaviorSubject<User | null>(null);

  //Se ejecuta de primero o apenas se recarga el documento
  constructor(
    private http: HttpClient,
  ) {
    //
    this.checkSession();
  }

  //Metodos que hacen todo el trabajo de logica de negocio

  login(credentials: AuthCredentials): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}login/`, credentials, {
      withCredentials: true,
    }
    )
    .pipe(
        tap(() => {
          this.checkSession();
        })
    );
    }

    logout(): void {

  // logout(): Observable<void> {
    // return this.http.post<void>(
    //   `${this.apiUrl}logout/`,
    //   {},
    //   {
    //     withCredentials: true
    //   }
    // )
    // .pipe(
    //   tap(() => {
    //     this.isLoggedIn$.next(false);
    //     this.currentUser$.next(null);
    //   }
    //   )
    // );

    // 1. Limpiamos el frontend de inmediato, sin preguntar
    this.isLoggedIn$.next(false);
    this.currentUser$.next(null);

    // 2. Le avisamos al backend en segundo plano y silenciamos cualquier error
    this.http.post(`${this.apiUrl}logout/`, {}, { withCredentials: true })
      .subscribe({ error: () => {} });
  }

    createUser(data: AuthCredentials): Observable<User> {
    return this.http.post<User>(
      `${this.apiUrl}register/`,
      data,
    { withCredentials: true })
  }

  //Usa cookies y el navegador las envia solas a /me/ si el usuario existe se rellenan
  // los subjects si responde 401 se limpia todo
  //Evita que el usuario se tenga que estr logueando
  private checkSession(): void {
    this.http.get<User>(`${this.apiUrl}me/`,
      { withCredentials: true})
    .pipe(
      catchError(() => {
        this.isLoggedIn$.next(false);
        this.currentUser$.next(null);
        return of(null);
      }))
    .subscribe(user => {
      if (user) {
        this.isLoggedIn$.next(true);
        this.currentUser$.next(user);
      }
    });
  }



  //OBSERVABLES
  //Devuelven los estados los ultimos que se obtuvieron,
  //  generalmente el estado de logue y el usuario

  authStatus(): Observable<boolean> {
    return this.isLoggedIn$.pipe(
      filter((status): status is boolean => status !== null)
    );
  }

  currentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  // //Metodo sincronico se usa en el gurads
  //   isAuthenticated(): boolean {
  //   return this.isLoggedIn$.value;
  // }

}

