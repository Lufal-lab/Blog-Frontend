import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsComponent } from './pages/posts/posts.component';
import { PostIdComponent } from './pages/post-id/post-id.component';
import { LoginFormComponent } from './pages/login-form/login-form.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { path: 'login',
    component: LoginFormComponent },
  {
    path: 'posts',
    component: PostsComponent
  },
  {
    path: 'posts/:id',
    component: PostIdComponent
  },
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
