import { Component, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent {
  content: string = '';
  @Output() onSubmit = new EventEmitter<string>();

  submit() {
    this.onSubmit.emit(this.content);
    this.content = ''; // Reset tras enviar
  }

  cancel() {
    this.content = ''; // AC 4: Reset a valores por defecto
  }
}
