import type { GenreType } from '../types/catalog';

const API_KEY = import.meta.env.VITE_THEGAMESDB_API_KEY || '264cb03427179b76c8f91e0aa8fb2b37f2b41e6c2cbcca2f60b96d7365c24f80';
const BASE_URL = 'https://api.thegamesdb.net/v1.1';

export interface TheGamesDBResult {
  id: number;
  game_title: string;
  release_date?: string;
  overview?: string;
  coverUrl?: string;
  genre?: GenreType;
}

const GENRE_MAPPING: Record<string, GenreType> = {
  'action': 'Acción',
  'adventure': 'Aventura',
  'fighting': 'Lucha',
  'role-playing': 'Aventura',
  'rpg': 'Aventura',
  'racing': 'Carreras',
  'driving': 'Carreras',
  'sports': 'Deportes',
  'strategy': 'Estrategia',
  'shooter': 'Shooter',
  'horror': 'Terror',
  'survival horror': 'Terror',
  'platform': 'Aventura',
  'simulation': 'Arcade',
  'music': 'Arcade',
  'rhythm': 'Arcade',
  'puzzle': 'Arcade',
  'party': 'Arcade',
};

export async function searchGamesTheGamesDB(query: string): Promise<TheGamesDBResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `${BASE_URL}/Games/ByGameName?apikey=${API_KEY}&name=${encodeURIComponent(query)}&fields=overview%2Cgenres`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    if (!data || data.code !== 200 || !data.data || !data.data.games) {
      return [];
    }

    const gamesList = data.data.games.slice(0, 8); // Top 8 results
    const genresData = data.include?.genres?.data || {};

    const gameIds = gamesList.map((g: any) => g.id).join(',');

    // Fetch covers for these games
    let coversMap: Record<number, string> = {};
    if (gameIds) {
      try {
        const imgUrl = `${BASE_URL}/Games/Images?apikey=${API_KEY}&games_id=${gameIds}&filter%5Btype%5D=boxart`;
        const imgRes = await fetch(imgUrl);
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          const baseImgUrl = imgData.data?.base_url?.medium || imgData.data?.base_url?.original || 'https://cdn.thegamesdb.net/images/medium/boxart/';
          const images = imgData.data?.images || {};

          Object.keys(images).forEach((gIdStr) => {
            const boxarts = images[gIdStr];
            if (Array.isArray(boxarts)) {
              const front = boxarts.find((b: any) => b.side === 'front') || boxarts[0];
              if (front && front.filename) {
                const gId = parseInt(gIdStr, 10);
                coversMap[gId] = `${baseImgUrl}${front.filename}`;
              }
            }
          });
        }
      } catch (err) {
        console.warn('Could not fetch game covers from TheGamesDB:', err);
      }
    }

    return gamesList.map((g: any) => {
      let mappedGenre: GenreType = 'Acción';

      if (g.genres && Array.isArray(g.genres) && g.genres.length > 0) {
        const firstGenreId = g.genres[0];
        const genreName = genresData[firstGenreId]?.name?.toLowerCase() || '';
        for (const [key, val] of Object.entries(GENRE_MAPPING)) {
          if (genreName.includes(key)) {
            mappedGenre = val;
            break;
          }
        }
      }

      return {
        id: g.id,
        game_title: g.game_title,
        release_date: g.release_date,
        overview: g.overview || '',
        coverUrl: coversMap[g.id] || '/ps2-cover-placeholder.png',
        genre: mappedGenre,
      };
    });
  } catch (err) {
    console.error('Error searching TheGamesDB:', err);
    return [];
  }
}
