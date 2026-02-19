import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
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
  ){
    this.isLoggedIn$ = this.authService.authStatus();
    this.userEmail$ = this.authService.currentUser();
  }

  logout(){
    this.authService.logout().subscribe(() => {
      this.router.navigate(['']);
    },);
  }

}
