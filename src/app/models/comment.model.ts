export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_email: string;
}

export interface CreateCommentDTO extends Pick<Comment, 'content'> {
}


