import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostsComponent } from './pages/posts-list/posts-list.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';


import { AuthGuard } from 'src/app/core/guards/auth.guard';


import { PostEditComponent } from './pages/post-edit/post-edit.component';
import { PostCreateComponent } from './pages/post-create/post-create.component';

const routes: Routes = [

  {
    path: 'posts/create',
    component: PostCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'posts/:id/edit',
    component: PostEditComponent,
    canActivate: [AuthGuard]
  },


  {
    path: 'posts/:id',
    component: PostDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'posts',
    component: PostsComponent
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
