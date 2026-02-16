import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './pages/posts/posts-list.component';
import { PostIdComponent } from './components/post-id/post-card.component';
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
