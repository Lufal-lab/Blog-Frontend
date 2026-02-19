import { Component, Input } from '@angular/core';
import { Comment } from 'src/app/core/models/comment.model';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent {
  @Input() comment! : Comment;
  // @Input() comments: Comment[] = [];

}
