import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AlertService } from 'src/app/core/services/alert.service';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLoggedIn$: Observable<boolean>;
  userEmail$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
  ){
    this.isLoggedIn$ = this.authService.authStatus();
    this.userEmail$ = this.authService.currentUser();
  }

  async onLogout(){
    const confirmed = await this.alertService.confirm(
    'Logout',
    'Are you sure you want to log out?',
    'Logout',
    'primary'
  );

  if (confirmed) {
    // this.authService.logout().subscribe(() => {
    //   this.router.navigate(['']);
    //   this.alertService.success('Successfully logged out!');
    // });

    this.authService.logout(); // 👈 Llamas al servicio (ya te limpió los datos)
    this.router.navigate(['']); // 👈 Te vas al inicio
    this.alertService.success('Successfully logged out!');
  }


  }

}
