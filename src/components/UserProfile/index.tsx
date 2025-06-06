import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '@/context/authContext';
import { MovieCard } from '@/common';
import { followUser, unfollowUser } from '@/utils/socialDb';
import { supabase } from '@/utils/supabaseClient';
import { IMovie } from '@/types';

const UserProfile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [savedMovies, setSavedMovies] = useState<IMovie[]>([]);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data
        const { data: userData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (userData) {
          setProfileUser(userData);
        }

        // Fetch saved movies
        const { data: moviesData } = await supabase
          .from('saved_movies')
          .select('*')
          .eq('user_id', userId);

        if (moviesData) {
          setSavedMovies(moviesData);
        }

        // Fetch followers
        const { data: followersData } = await supabase
          .from('user_follows')
          .select('follower_id')
          .eq('following_id', userId);

        if (followersData) {
          setFollowers(followersData);
        }

        // Fetch following
        const { data: followingData } = await supabase
          .from('user_follows')
          .select('following_id')
          .eq('follower_id', userId);

        if (followingData) {
          setFollowing(followingData);
        }

        // Check if current user is following this profile
        if (user) {
          const { data: followCheck } = await supabase
            .from('user_follows')
            .select('id')
            .match({ follower_id: user.id, following_id: userId })
            .single();

          setIsFollowing(!!followCheck);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, user]);

  const handleFollowToggle = async () => {
    if (!user || !userId) return;

    try {
      if (isFollowing) {
        await unfollowUser(user.id, userId);
        setIsFollowing(false);
        setFollowers(prev => prev.filter(f => f.follower_id !== user.id));
      } else {
        await followUser(user.id, userId);
        setIsFollowing(true);
        setFollowers(prev => [...prev, { follower_id: user.id }]);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="loader" />
    </div>;
  }

  if (!profileUser) {
    return <div className="min-h-screen pt-20 text-center">User not found</div>;
  }

  return (
    <div className="min-h-screen pt-20 dark:bg-black bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profileUser.username || profileUser.email}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Joined {format(new Date(profileUser.created_at), 'MMMM yyyy')}
              </p>
              <div className="mt-2 flex gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {followers.length} followers
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {following.length} following
                </span>
              </div>
            </div>
            
            {user && user.id !== userId && (
              <button
                onClick={handleFollowToggle}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isFollowing
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Saved Movies</h3>
            {savedMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                {savedMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} category={movie.category || 'movie'} />
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

export default UserProfile;