import { createClient } from '@supabase/supabase-js';
import type { GameItem } from '../types/catalog';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lotrtayywfeggmtzgjje.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_bR-5Iydb0_27gk3OhZ7LCw_1JqmDEUj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchGamesFromSupabase(): Promise<GameItem[]> {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('titulo', { ascending: true });

    if (error) {
      console.error('Error fetching games from Supabase:', error);
      return [];
    }

    return (data as GameItem[]) || [];
  } catch (err) {
    console.error('Unexpected error fetching from Supabase:', err);
    return [];
  }
}

export async function saveGameToSupabase(game: GameItem): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('games')
      .upsert([game], { onConflict: 'id' });

    if (error) {
      console.error('Error saving game to Supabase:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Unexpected error saving to Supabase:', err);
    return false;
  }
}

export async function deleteGameFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting game from Supabase:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Unexpected error deleting from Supabase:', err);
    return false;
  }
}
