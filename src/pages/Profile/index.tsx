import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import { MovieCard } from '@/common';
import { supabase } from '@/utils/supabaseClient';
import { IMovie } from '@/types';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [savedMovies, setSavedMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchSavedMovies = async () => {
      try {
        const { data, error } = await supabase
          .from('saved_movies')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setSavedMovies(data || []);
      } catch (error) {
        console.error('Error fetching saved movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedMovies();
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 dark:bg-black bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Saved Movies</h3>
            {loading ? (
              <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            ) : savedMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                {savedMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} category="movie" />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 mt-2">No saved movies yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;