import { Component, Input } from '@angular/core';

import { Post } from 'src/app/core/models/post.model';

@Component({
  selector: 'app-post-id',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostIdComponent{

  @Input() post!: Post;

  showFull = false;

      likePost() {}
      goToComments() {}
      editPost() {}
      deletePost() {}
      openLikes() {
      }
      openPost(){}

}
