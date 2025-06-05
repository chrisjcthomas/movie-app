export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface UserNotification {
  id: string;
  user_id: string;
  type: string;
  content: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  movie_id: string;
  rating: number;
  content: string;
  has_spoilers: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewReaction {
  id: string;
  review_id: string;
  user_id: string;
  type: 'like' | 'dislike';
  created_at: string;
}

export interface ReviewComment {
  id: string;
  review_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Discussion {
  id: string;
  movie_id: string;
  user_id: string;
  title: string;
  category: 'general' | 'theories' | 'reviews' | 'news';
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiscussionPost {
  id: string;
  discussion_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}