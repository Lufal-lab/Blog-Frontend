import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './pages/posts-list/posts-list.component';
import { PostCardComponent } from './components/post-card/post-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LikesComponent } from './components/likes/likes.component';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';
import { PostEditComponent } from './pages/post-edit/post-edit.component';
import { PostCreateComponent } from './pages/post-create/post-create.component';
import { FormsModule } from '@angular/forms';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { CommentCardComponent } from './components/comment-card/comment-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PostFormComponent } from './components/post-form/post-form.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    PostsComponent,
    PostCardComponent,
    LikesComponent,
    PostDetailComponent,
    PostEditComponent,
    PostCreateComponent,
    CommentFormComponent,
    CommentCardComponent,
    PostFormComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    PostsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    QuillModule.forRoot()
  ]
})
export class PostsModule { }
