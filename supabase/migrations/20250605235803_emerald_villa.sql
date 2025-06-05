/*
  # Social Engagement System Schema

  1. New Tables
    - `user_follows` - Track user follow relationships
    - `user_notifications` - Store user notifications
    - `reviews` - Store movie reviews
    - `review_reactions` - Store reactions to reviews
    - `review_comments` - Store comments on reviews
    - `discussions` - Store movie discussions
    - `discussion_posts` - Store posts within discussions

  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations
*/

-- User follows
CREATE TABLE IF NOT EXISTS user_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- User notifications
CREATE TABLE IF NOT EXISTS user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  content jsonb NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  movie_id text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  content text NOT NULL,
  has_spoilers boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Review reactions
CREATE TABLE IF NOT EXISTS review_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text CHECK (type IN ('like', 'dislike')) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- Review comments
CREATE TABLE IF NOT EXISTS review_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Discussions
CREATE TABLE IF NOT EXISTS discussions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  category text CHECK (category IN ('general', 'theories', 'reviews', 'news')) NOT NULL,
  is_pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Discussion posts
CREATE TABLE IF NOT EXISTS discussion_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id uuid REFERENCES discussions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_posts ENABLE ROW LEVEL SECURITY;

-- User follows policies
CREATE POLICY "Users can follow others"
  ON user_follows FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others"
  ON user_follows FOR DELETE TO authenticated
  USING (auth.uid() = follower_id);

CREATE POLICY "Users can view follow relationships"
  ON user_follows FOR SELECT TO authenticated
  USING (true);

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON user_notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark their notifications as read"
  ON user_notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view reviews"
  ON reviews FOR SELECT TO authenticated
  USING (true);

-- Review reactions policies
CREATE POLICY "Users can react to reviews"
  ON review_reactions FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Review comments policies
CREATE POLICY "Users can create comments"
  ON review_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON review_comments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON review_comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view comments"
  ON review_comments FOR SELECT TO authenticated
  USING (true);

-- Discussions policies
CREATE POLICY "Users can create discussions"
  ON discussions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discussions"
  ON discussions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own discussions"
  ON discussions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view discussions"
  ON discussions FOR SELECT TO authenticated
  USING (true);

-- Discussion posts policies
CREATE POLICY "Users can create posts"
  ON discussion_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON discussion_posts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON discussion_posts FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view posts"
  ON discussion_posts FOR SELECT TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS user_follows_follower_id_idx ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS user_follows_following_id_idx ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS user_notifications_user_id_idx ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON reviews(user_id);
CREATE INDEX IF NOT EXISTS reviews_movie_id_idx ON reviews(movie_id);
CREATE INDEX IF NOT EXISTS review_reactions_review_id_idx ON review_reactions(review_id);
CREATE INDEX IF NOT EXISTS review_comments_review_id_idx ON review_comments(review_id);
CREATE INDEX IF NOT EXISTS discussions_movie_id_idx ON discussions(movie_id);
CREATE INDEX IF NOT EXISTS discussion_posts_discussion_id_idx ON discussion_posts(discussion_id);