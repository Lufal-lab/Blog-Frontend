import { PrivacyLevel } from "./privacy-level.enum";

export interface Post {
  id: number;
  author : number;
  author_email: string;
  author_team: string;
  title: string;
  content: string;
  excerpt: string;
  likes_count: string;
  comments_count: string;
  created_at: string;
  updated_at: string;
  privacy_read: PrivacyLevel;
  privacy_write: PrivacyLevel;
}
