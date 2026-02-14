import { Component, Input } from '@angular/core';

import { Post } from 'src/app/core/models/post.model';

@Component({
  selector: 'app-post-id',
  templateUrl: './post-id.component.html',
  styleUrls: ['./post-id.component.sass']
})
export class PostIdComponent{

  @Input() post!: Post;

}
