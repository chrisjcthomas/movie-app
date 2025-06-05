/*
  # Watch List Management System

  1. New Tables
    - `lists`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `description` (text)
      - `is_public` (boolean)
      - `order` (integer)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

    - `list_items`
      - `id` (uuid, primary key)
      - `list_id` (uuid, references lists)
      - `movie_id` (text)
      - `order` (integer)
      - `rating` (integer)
      - `notes` (text)
      - `watch_date` (date)
      - `status` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

    - `item_tags`
      - `id` (uuid, primary key)
      - `item_id` (uuid, references list_items)
      - `tag` (text)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations
*/

-- Create lists table
CREATE TABLE IF NOT EXISTS lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create list_items table
CREATE TABLE IF NOT EXISTS list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid REFERENCES lists(id) ON DELETE CASCADE NOT NULL,
  movie_id text NOT NULL,
  "order" integer DEFAULT 0,
  rating integer CHECK (rating >= 1 AND rating <= 10),
  notes text,
  watch_date date,
  status text CHECK (status IN ('completed', 'in_progress', 'dropped')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create item_tags table
CREATE TABLE IF NOT EXISTS item_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES list_items(id) ON DELETE CASCADE NOT NULL,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_tags ENABLE ROW LEVEL SECURITY;

-- Lists policies
CREATE POLICY "Users can create their own lists"
  ON lists FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own lists"
  ON lists FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can update their own lists"
  ON lists FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists"
  ON lists FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- List items policies
CREATE POLICY "Users can create items in their lists"
  ON list_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM lists WHERE id = list_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can view items in their lists or public lists"
  ON list_items FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM lists WHERE id = list_id AND (user_id = auth.uid() OR is_public = true)
  ));

CREATE POLICY "Users can update items in their lists"
  ON list_items FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM lists WHERE id = list_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete items in their lists"
  ON list_items FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM lists WHERE id = list_id AND user_id = auth.uid()
  ));

-- Item tags policies
CREATE POLICY "Users can create tags for their items"
  ON item_tags FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM list_items li
    JOIN lists l ON l.id = li.list_id
    WHERE li.id = item_id AND l.user_id = auth.uid()
  ));

CREATE POLICY "Users can view tags for their items or public lists"
  ON item_tags FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM list_items li
    JOIN lists l ON l.id = li.list_id
    WHERE li.id = item_id AND (l.user_id = auth.uid() OR l.is_public = true)
  ));

CREATE POLICY "Users can delete tags for their items"
  ON item_tags FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM list_items li
    JOIN lists l ON l.id = li.list_id
    WHERE li.id = item_id AND l.user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS lists_user_id_idx ON lists(user_id);
CREATE INDEX IF NOT EXISTS list_items_list_id_idx ON list_items(list_id);
CREATE INDEX IF NOT EXISTS item_tags_item_id_idx ON item_tags(item_id);