import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './features/not-found/not-found.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module')
        .then(m => m.AuthModule)
  },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
        import('./features/posts/posts.module')
        .then(m =>m.PostsModule)
      }
    ]

  },


  // { path: 'login',
  //   component: LoginFormComponent },
  // {
  //   path: 'posts',
  //   component: PostsComponent
  // },
  // {
  //   path: 'posts/:id',
  //   component: PostIdComponent
  // },
  // {
  //   path: '',
  //   redirectTo: 'posts',
  //   pathMatch: 'full'
  // },
  // {
  //   path: '**',
  //   component: NotFoundComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
