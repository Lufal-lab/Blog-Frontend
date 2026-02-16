import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostsComponent } from './pages/posts/posts-list.component';
import { PostIdComponent } from './components/post-id/post-card.component';

import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
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

  // {
  //   path: 'create',
  //   component: PostCreateComponent,
  //   canActivate: [AuthGuard]
  // }




];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
