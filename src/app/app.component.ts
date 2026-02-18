import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from './core/services/alert.service';

import { AuthService } from './core/services/auth.service';

import { Post } from './core/models/post.model';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  // title = 'blog-frontend-avanzatech';
  // posts: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private alert: AlertService,
  ) {}

  ngOnInit() {
    // console.log('AppComponent cargado');
    // this.alert.error('¡PRUEBA DE ERROR!');
  }


}
