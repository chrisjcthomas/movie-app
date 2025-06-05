import { supabase } from './supabaseClient';
import { List, ListItem, ItemTag } from '@/types/watchlist';

export const createList = async (
  userId: string,
  name: string,
  description?: string,
  isPublic = false
): Promise<List | null> => {
  try {
    const { data, error } = await supabase
      .from('lists')
      .insert({
        user_id: userId,
        name,
        description,
        is_public: isPublic,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating list:', error);
    return null;
  }
};

export const updateList = async (
  listId: string,
  updates: Partial<List>
): Promise<List | null> => {
  try {
    const { data, error } = await supabase
      .from('lists')
      .update(updates)
      .eq('id', listId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating list:', error);
    return null;
  }
};

export const deleteList = async (listId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', listId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting list:', error);
    return false;
  }
};

export const addItemToList = async (
  listId: string,
  movieId: string,
  order?: number
): Promise<ListItem | null> => {
  try {
    const { data, error } = await supabase
      .from('list_items')
      .insert({
        list_id: listId,
        movie_id: movieId,
        order,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding item to list:', error);
    return null;
  }
};

export const updateListItem = async (
  itemId: string,
  updates: Partial<ListItem>
): Promise<ListItem | null> => {
  try {
    const { data, error } = await supabase
      .from('list_items')
      .update(updates)
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating list item:', error);
    return null;
  }
};

export const removeItemFromList = async (itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('list_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing item from list:', error);
    return false;
  }
};

export const addTagToItem = async (
  itemId: string,
  tag: string
): Promise<ItemTag | null> => {
  try {
    const { data, error } = await supabase
      .from('item_tags')
      .insert({
        item_id: itemId,
        tag,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding tag to item:', error);
    return null;
  }
};

export const removeTagFromItem = async (tagId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('item_tags')
      .delete()
      .eq('id', tagId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing tag from item:', error);
    return false;
  }
};

export const getUserLists = async (userId: string): Promise<List[]> => {
  try {
    const { data, error } = await supabase
      .from('lists')
      .select(`
        *,
        items:list_items (
          *,
          tags:item_tags (*)
        )
      `)
      .eq('user_id', userId)
      .order('order');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user lists:', error);
    return [];
  }
};

export const getListDetails = async (listId: string): Promise<List | null> => {
  try {
    const { data, error } = await supabase
      .from('lists')
      .select(`
        *,
        items:list_items (
          *,
          tags:item_tags (*)
        )
      `)
      .eq('id', listId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching list details:', error);
    return null;
  }
};