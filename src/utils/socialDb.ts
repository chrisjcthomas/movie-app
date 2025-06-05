import { supabase } from './supabaseClient';
import { UserFollow, Review, ReviewReaction, ReviewComment, Discussion, DiscussionPost } from '@/types/social';

// User Follow Functions
export const followUser = async (followerId: string, followingId: string): Promise<UserFollow | null> => {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .insert({ follower_id: followerId, following_id: followingId })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error following user:', error);
    return null;
  }
};

export const unfollowUser = async (followerId: string, followingId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_follows')
      .delete()
      .match({ follower_id: followerId, following_id: followingId });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return false;
  }
};

// Review Functions
export const createReview = async (
  userId: string,
  movieId: string,
  rating: number,
  content: string,
  hasSpoilers: boolean
): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        movie_id: movieId,
        rating,
        content,
        has_spoilers: hasSpoilers
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating review:', error);
    return null;
  }
};

export const updateReview = async (
  reviewId: string,
  updates: Partial<Review>
): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating review:', error);
    return null;
  }
};

// Review Reaction Functions
export const toggleReviewReaction = async (
  reviewId: string,
  userId: string,
  type: 'like' | 'dislike'
): Promise<ReviewReaction | null> => {
  try {
    // First, remove any existing reaction
    await supabase
      .from('review_reactions')
      .delete()
      .match({ review_id: reviewId, user_id: userId });

    // Then add the new reaction
    const { data, error } = await supabase
      .from('review_reactions')
      .insert({
        review_id: reviewId,
        user_id: userId,
        type
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error toggling review reaction:', error);
    return null;
  }
};

// Review Comment Functions
export const addReviewComment = async (
  reviewId: string,
  userId: string,
  content: string
): Promise<ReviewComment | null> => {
  try {
    const { data, error } = await supabase
      .from('review_comments')
      .insert({
        review_id: reviewId,
        user_id: userId,
        content
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding review comment:', error);
    return null;
  }
};

// Discussion Functions
export const createDiscussion = async (
  movieId: string,
  userId: string,
  title: string,
  category: 'general' | 'theories' | 'reviews' | 'news'
): Promise<Discussion | null> => {
  try {
    const { data, error } = await supabase
      .from('discussions')
      .insert({
        movie_id: movieId,
        user_id: userId,
        title,
        category
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating discussion:', error);
    return null;
  }
};

export const addDiscussionPost = async (
  discussionId: string,
  userId: string,
  content: string
): Promise<DiscussionPost | null> => {
  try {
    const { data, error } = await supabase
      .from('discussion_posts')
      .insert({
        discussion_id: discussionId,
        user_id: userId,
        content
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding discussion post:', error);
    return null;
  }
};