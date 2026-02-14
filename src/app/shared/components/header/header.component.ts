import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { map, Observable } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLoggedIn$: Observable<boolean>;
  userEmail$: Observable<{ email: string } | null>;

  constructor(
    private authService: AuthService,
  ){
    this.isLoggedIn$ = this.authService.authStatus();
    this.userEmail$ = this.authService.currentUser();
  }

  logout(){
    this.authService.logout().subscribe(() => {
      location.reload();
    });
  }

}
