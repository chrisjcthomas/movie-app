/*
  # Create saved movies table

  1. New Tables
    - `saved_movies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `movie_id` (text, not null)
      - `created_at` (timestamp with time zone)
      - `category` (text, not null)
      - `poster_path` (text)
      - `title` (text)
      - `overview` (text)

  2. Security
    - Enable RLS on `saved_movies` table
    - Add policies for authenticated users to:
      - Read their own saved movies
      - Insert new saved movies
      - Delete their saved movies
*/

CREATE TABLE IF NOT EXISTS saved_movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  movie_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  category text NOT NULL,
  poster_path text,
  title text,
  overview text,
  UNIQUE(user_id, movie_id)
);

ALTER TABLE saved_movies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own saved movies"
  ON saved_movies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved movies"
  ON saved_movies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved movies"
  ON saved_movies
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);