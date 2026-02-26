import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';
import { AuthCredentials, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/users/';

  private isLoggedIn$ = new BehaviorSubject<boolean | null>(null);
  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private alert: AlertService
  ) {
    this.checkSession();
  }

  login(credentials: AuthCredentials): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}login/`, credentials, {
      withCredentials: true,
    }).pipe(
      tap(() => this.checkSession())
    );
  }

  // logout(): void {
  //   // IMPORTANTE: No limpiamos el front aquí.
  //   // Esperamos a que el backend responda 200 OK.
  //   this.http.post(`${this.apiUrl}logout/`, {}, { withCredentials: true })
  //     .subscribe({
  //       next: () => {
  //         this.completeLogoutCleanup();
  //         this.alert.success('Successfully logged out.');
  //       },
  //       error: (err) => {
  //         // El ErrorInterceptor capturará el 403, hará refreshSession()
  //         // y le pedirá al usuario que intente de nuevo.
  //         console.error('Logout falló en el servidor, manejando vía Interceptor', err);
  //       }
  //     });
  // }

  logout(): void {
  this.http.post(`${this.apiUrl}logout/`, {}, { withCredentials: true })
    .subscribe({
      next: () => {
        this.completeLogoutCleanup();
        this.alert.success('Successfully logged out.');
      },
      error: (err) => {
        // Si el interceptor ya detectó el 403 y llamó a refreshSession,
        // nosotros solo confirmamos que el usuario debe reintentar.
        if (err.status === 403) {
           // No hacemos nada aquí, el Interceptor ya sacó la alerta de "Try again"
        } else {
           // Si es otro error, limpiamos por seguridad
           this.completeLogoutCleanup();
        }
      }
    });
}

  // Este método se llama desde el Logout (si sale bien)
  // o desde el Interceptor (si la sesión expiró de verdad)
  public completeLogoutCleanup(): void {
    this.isLoggedIn$.next(false);
    this.currentUser$.next(null);



    // Borramos físicamente la cookie de CSRF
    document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
    document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;

    // const cookies = document.cookie.split(";");
    // for (let i = 0; i < cookies.length; i++) {
    //   const cookie = cookies[i];
    //   const eqPos = cookie.indexOf("=");
    //   const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    //   document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    // }
    // this.router.navigate(['/posts']);
  }

  createUser(data: AuthCredentials): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}register/`, data, { withCredentials: true });
  }

  refreshSession(): void {
    this.checkSession();
  }

  public checkSession(): void {
    this.http.get<User>(`${this.apiUrl}me/`, { withCredentials: true })
      .pipe(
        catchError((err) => {
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
    return this.isLoggedIn$.pipe(
      filter((status): status is boolean => status !== null)
    );
  }

  currentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }
}
