import { supabase } from './supabaseClient';
import { IMovie } from '@/types';

export const saveMovie = async (
  userId: string,
  movie: IMovie,
  category: string
) => {
  try {
    const { error } = await supabase.from('saved_movies').insert({
      user_id: userId,
      movie_id: movie.id,
      category,
      poster_path: movie.poster_path,
      title: movie.title || movie.name,
      overview: movie.overview,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving movie:', error);
    return false;
  }
};

export const removeMovie = async (userId: string, movieId: string) => {
  try {
    const { error } = await supabase
      .from('saved_movies')
      .delete()
      .match({ user_id: userId, movie_id: movieId });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing movie:', error);
    return false;
  }
};

export const isMovieSaved = async (userId: string, movieId: string) => {
  try {
    const { data, error } = await supabase
      .from('saved_movies')
      .select('id')
      .match({ user_id: userId, movie_id: movieId })
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking if movie is saved:', error);
    return false;
  }
};