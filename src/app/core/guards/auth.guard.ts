import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // if(this.authService.isAuthenticated()) {
      //   return true;
      // }

      // this.alertService.error('You must be logged in to access this page.');

      // this.router.navigate(['/auth/login']);
      // return false;

      return this.authService.authStatus().pipe(
          filter(status => status !== null),
          take(1),
          map(status => {
            if (status === true) return true;

            this.alertService.error('You must be logged in.');
            return this.router.createUrlTree(['/auth/login']);
          })
        );
      }

}
    
//   return this.authService.currentUser().pipe(
//     filter(user => user !== undefined), // espera que el subject tenga algún valor
//     take(1),
//     map(user => {
//       if (user) {
//         // opcional: revisar rol o permisos
//         // if (user.role !== 'admin') return this.router.createUrlTree(['/unauthorized']);
//         return true;
//       }

//       // no hay usuario => redirige al login
//       this.alertService.error('You must be logged in.');
//       return this.router.createUrlTree(['/auth/login']);
//     })
//   );
// }
// }
