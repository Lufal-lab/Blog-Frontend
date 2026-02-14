import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './pages/posts/posts.component';
import { PostIdComponent } from './pages/post-id/post-id.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    PostsComponent,
    PostIdComponent,
  ],
  imports: [
    CommonModule,
    PostsRoutingModule,
    SharedModule,
  ]
})
export class PostsModule { }
