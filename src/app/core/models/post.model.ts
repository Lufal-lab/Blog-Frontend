import { PrivacyLevel } from "./privacy-level.enum";

export interface Post {
  id: number;
  author : number;
  author_email: string;
  author_team: string;
  teamColor?: string;
  title: string;
  content: string;
  excerpt: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
  privacy_read: PrivacyLevel;
  privacy_write: PrivacyLevel;
}

export interface CreatePostDTO extends Pick
<Post, 'title' | 'content' | 'privacy_read' | 'privacy_write' > {
}

export interface UpdatePostDTO extends Partial<CreatePostDTO> {
}



