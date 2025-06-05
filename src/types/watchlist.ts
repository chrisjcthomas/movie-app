export interface List {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ListItem {
  id: string;
  list_id: string;
  movie_id: string;
  order: number;
  rating?: number;
  notes?: string;
  watch_date?: string;
  status?: 'completed' | 'in_progress' | 'dropped';
  created_at: string;
  updated_at: string;
}

export interface ItemTag {
  id: string;
  item_id: string;
  tag: string;
  created_at: string;
}

export interface ListWithItems extends List {
  items: (ListItem & {
    movie: {
      title: string;
      poster_path: string;
      release_date: string;
      runtime?: number;
    };
    tags: ItemTag[];
  })[];
}