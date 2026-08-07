import { createClient } from '@supabase/supabase-js';
import type { GameItem } from '../types/catalog';

let envUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lotrtayywfeggmtzgjje.supabase.co';
if (envUrl.includes('feqqmtzqjje')) {
  envUrl = envUrl.replace('feqqmtzqjje', 'feggmtzgjje');
}
const supabaseUrl = envUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_bR-5Iydb0_27gk3OhZ7LCw_1JqmDEUj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SupabaseGameRow {
  id: string;
  titulo: string;
  genero: string;
  tipocaja?: string;
  tipoCaja?: string;
  estado?: string;
  faltacaratula?: boolean;
  faltaCaratula?: boolean;
  imagen: string;
  region?: string;
  idioma?: string;
  tamaniomb?: number;
  tamanioMb?: number;
  sinopsis?: string | null;
  etiquetadvd?: boolean;
  etiquetaDvd?: boolean;
  copias?: number;
  codigojuego?: string;
  codigoJuego?: string;
}

function mapRowToGameItem(row: SupabaseGameRow): GameItem {
  let codigoJuego = row.codigoJuego || row.codigojuego;
  let sinopsis = row.sinopsis || undefined;

  // Extract serial code from sinopsis if stored in header format [SERIAL: SLUS-xxxxx] or [CODE: SLUS-xxxxx]
  if (!codigoJuego && sinopsis) {
    const match = sinopsis.match(/^\[(?:SERIAL|CODE):\s*([^\]]+)\]\s*/i);
    if (match) {
      codigoJuego = match[1].trim();
      sinopsis = sinopsis.replace(/^\[(?:SERIAL|CODE):\s*[^\]]+\]\s*/i, '').trim() || undefined;
    }
  }

  return {
    id: row.id,
    titulo: row.titulo,
    genero: row.genero as any,
    tipoCaja: (row.tipocaja || row.tipoCaja || 'Caja DVD') as any,
    estado: (row.estado || 'Funciona') as any,
    faltaCaratula: typeof row.faltacaratula === 'boolean' ? row.faltacaratula : typeof row.faltaCaratula === 'boolean' ? row.faltaCaratula : false,
    imagen: row.imagen || '/ps2-cover-placeholder.png',
    region: (row.region || 'NTSC-U/C') as any,
    idioma: row.idioma || 'Español',
    tamanioMb: row.tamaniomb ?? row.tamanioMb ?? 0,
    sinopsis: sinopsis,
    etiquetaDvd: typeof row.etiquetadvd === 'boolean' ? row.etiquetadvd : typeof row.etiquetaDvd === 'boolean' ? row.etiquetaDvd : false,
    copias: row.copias ?? 1,
    codigoJuego: codigoJuego || undefined,
  };
}

function mapGameItemToRow(game: GameItem): SupabaseGameRow {
  let sinopsis = game.sinopsis || '';
  if (game.codigoJuego && !sinopsis.includes(`[SERIAL: ${game.codigoJuego}]`)) {
    sinopsis = `[SERIAL: ${game.codigoJuego}] ${sinopsis}`.trim();
  }

  return {
    id: game.id,
    titulo: game.titulo,
    genero: game.genero,
    tipocaja: game.tipoCaja,
    estado: game.estado,
    faltacaratula: game.faltaCaratula,
    imagen: game.imagen,
    region: game.region,
    idioma: game.idioma,
    tamaniomb: game.tamanioMb,
    sinopsis: sinopsis || null,
    etiquetadvd: game.etiquetaDvd,
    copias: game.copias || 1,
  };
}

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

    if (!data) return [];
    return (data as SupabaseGameRow[]).map(mapRowToGameItem);
  } catch (err) {
    console.error('Unexpected error fetching from Supabase:', err);
    return [];
  }
}

export async function saveGameToSupabase(game: GameItem): Promise<boolean> {
  try {
    const row = mapGameItemToRow(game);
    const { error } = await supabase
      .from('games')
      .upsert([row], { onConflict: 'id' });

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
