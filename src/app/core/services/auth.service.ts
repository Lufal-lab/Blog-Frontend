// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject, of } from 'rxjs';
// import { tap, catchError, filter } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { AlertService } from './alert.service';

// import { AuthCredentials, User } from '../models/user.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private apiUrl = '/api/users/';
//   // private apiUrl = 'http://localhost:8000/api/users/';

//   // BehaviorSubjects: Guardan el estado actual y lo emiten a quien se suscriba,
//   // Se usa en header o con el boton crear posts para saber en tiempo real si hay alguien logueado
//   // Variale con memoria si ya se cargo algo esto entrega el ultimo valor conocido
//   private isLoggedIn$ = new BehaviorSubject<boolean | null>(null);
//   private currentUser$ = new BehaviorSubject<User | null>(null);

//   //Se ejecuta de primero o apenas se recarga el documento
//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     private alert: AlertService
//   ) {
//     //
//     this.checkSession();
//   }

//   //Metodos que hacen todo el trabajo de logica de negocio

//   login(credentials: AuthCredentials): Observable<User> {
//     return this.http.post<User>(`${this.apiUrl}login/`, credentials, {
//       withCredentials: true,
//     }
//     )
//     .pipe(
//         tap(() => {
//           this.checkSession();
//         })
//     );
//     }

//   //   logout(): void {

//   // // logout(): Observable<void> {
//   //   // return this.http.post<void>(
//   //   //   `${this.apiUrl}logout/`,
//   //   //   {},
//   //   //   {
//   //   //     withCredentials: true
//   //   //   }
//   //   // )
//   //   // .pipe(
//   //   //   tap(() => {
//   //   //     this.isLoggedIn$.next(false);
//   //   //     this.currentUser$.next(null);
//   //   //   }
//   //   //   )
//   //   // );

//   //   // 1. Limpiamos el frontend de inmediato, sin preguntar
//   //   this.isLoggedIn$.next(false);
//   //   this.currentUser$.next(null);

//   //   // 2. Le avisamos al backend en segundo plano y silenciamos cualquier error
//   //   this.http.post(`${this.apiUrl}logout/`, {}, { withCredentials: true })
//   //     .subscribe({
//   //       next: () => console.log('Backend logout ok'),
//   //       error: () => {
//   //         console.warn('Backend logout failed or session already gone');
//   //       } });
//   // }

//   logout(): void {
//   this.http.post(`${this.apiUrl}logout/`, {}, { withCredentials: true })
//     .subscribe({
//       next: () => {
//         this.completeLogoutCleanup();
//         this.alert.success('Successfully logged out.');
//       },
//       error: (err) => {
//         console.error('Logout failed at server', err);
//         // Si el servidor falla con 403 (CSRF), limpiamos el front de todos modos
//         // para no dejar al usuario atrapado
//         // this.completeLogoutCleanup();
//         // this.alert.warning('Logged out locally, but there was a security token sync issue.');
//       }
//     });
// }

// private completeLogoutCleanup(): void {
//   // 1. Limpiar estados
//   this.isLoggedIn$.next(false);
//   this.currentUser$.next(null);

//   // 2. Borrar físicamente la cookie de CSRF si sigue ahí
//   // Esto soluciona tu problema de que "se mantiene ahí viviendo"
//   document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";

//   // // 3. Redirigir
//   // this.router.navigate(['/auth/login']);
// }

//     createUser(data: AuthCredentials): Observable<User> {
//     return this.http.post<User>(
//       `${this.apiUrl}register/`,
//       data,
//     { withCredentials: true })
//   }

//   refreshSession(): void {
//     this.checkSession();
//   }

//   //Usa cookies y el navegador las envia solas a /me/ si el usuario existe se rellenan
//   // los subjects si responde 401 se limpia todo
//   //Evita que el usuario se tenga que estr logueando


//   // public checkSession(): void {
//   //   this.http.get<User>(`${this.apiUrl}me/`,
//   //     { withCredentials: true})
//   //   .pipe(
//   //     catchError(() => {
//   //       this.isLoggedIn$.next(false);
//   //       this.currentUser$.next(null);
//   //       return of(null);
//   //     }))
//   //   .subscribe(user => {
//   //     if (user) {
//   //       this.isLoggedIn$.next(true);
//   //       this.currentUser$.next(user);
//   //     }
//   //   });
//   // }

// public checkSession(): void {
//   // Al agregar un header personalizado (aunque sea inventado),
//   // obligamos a ciertos navegadores y proxies a tratar la petición
//   // de forma más estricta, pero lo importante es que el backend responda con el token.
//   this.http.get<User>(`${this.apiUrl}me/`, {
//     withCredentials: true
//   })
//   .pipe(
//     catchError((err) => {
//       this.isLoggedIn$.next(false);
//       this.currentUser$.next(null);
//       return of(null);
//     })
//   )
//   .subscribe(user => {
//     if (user) {
//       this.isLoggedIn$.next(true);
//       this.currentUser$.next(user);
//     }
//     // Si llegamos aquí, al menos el GET /me/ ya debió traer
//     // la cookie 'csrftoken' para la SIGUIENTE petición.
//   });
// }


//   //OBSERVABLES
//   //Devuelven los estados los ultimos que se obtuvieron,
//   //  generalmente el estado de logue y el usuario

//   authStatus(): Observable<boolean> {
//     return this.isLoggedIn$.pipe(
//       filter((status): status is boolean => status !== null)
//     );
//   }

//   currentUser(): Observable<User | null> {
//     return this.currentUser$.asObservable();
//   }

//   // //Metodo sincronico se usa en el gurads
//   //   isAuthenticated(): boolean {
//   //   return this.isLoggedIn$.value;
//   // }

// }

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
        else {
        this.isLoggedIn$.next(false);
        this.currentUser$.next(null);
        this.router.navigate(['/posts']);
      }});
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
