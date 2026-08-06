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
  'beat': "Beat 'em up",
  'hack': "Beat 'em up",
  'brawler': "Beat 'em up",
  'flight': 'Aviones',
  'aviation': 'Aviones',
  'airplane': 'Aviones',
  'disney': 'Disney',
  'movie': 'Películas',
  'film': 'Películas',
  'kids': 'Infantiles',
  'children': 'Infantiles',
  'family': 'Infantiles',
  'horror': 'Terror',
  'survival horror': 'Terror',
  'fighting': 'Lucha',
  'martial': 'Lucha',
  'shooter': 'Shooter',
  'fps': 'Shooter',
  'tps': 'Shooter',
  'sports': 'Deportes',
  'racing': 'Carreras',
  'driving': 'Carreras',
  'strategy': 'Estrategia',
  'tactical': 'Estrategia',
  'rpg': 'Aventura',
  'role-playing': 'Aventura',
  'adventure': 'Aventura',
  'platform': 'Aventura',
  'action': 'Acción',
  'arcade': 'Arcade',
  'simulation': 'Arcade',
  'music': 'Arcade',
  'rhythm': 'Arcade',
  'puzzle': 'Arcade',
  'party': 'Arcade',
};

function mapGenre(genreName: string): GenreType {
  const lower = genreName.toLowerCase();
  for (const [key, val] of Object.entries(GENRE_MAPPING)) {
    if (lower.includes(key)) return val;
  }
  return 'Acción';
}

const searchCache = new Map<string, TheGamesDBResult[]>();

export async function searchGamesTheGamesDB(query: string): Promise<TheGamesDBResult[]> {
  const cleanQuery = query ? query.trim().toLowerCase() : '';
  if (!cleanQuery || cleanQuery.length < 3) return [];

  if (searchCache.has(cleanQuery)) {
    return searchCache.get(cleanQuery)!;
  }

  // 1. Try Vercel Serverless Proxy Endpoint (/api/search-games)
  try {
    const proxyUrl = `/api/search-games?name=${encodeURIComponent(query)}`;
    const proxyRes = await fetch(proxyUrl);
    if (proxyRes.ok) {
      const data = await proxyRes.json();
      if (data && Array.isArray(data.games) && data.games.length > 0) {
        const { games, genresData = {}, coversMap = {} } = data;
        const results: TheGamesDBResult[] = games.map((g: any) => {
          let mappedGenre: GenreType = 'Acción';
          if (g.genres && Array.isArray(g.genres) && g.genres.length > 0) {
            const firstGenreId = g.genres[0];
            const genreName = genresData[firstGenreId]?.name || '';
            mappedGenre = mapGenre(genreName);
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
        searchCache.set(cleanQuery, results);
        return results;
      }
    }
  } catch (proxyErr) {
    console.warn('Proxy fetch failed or running locally without Vercel API, falling back to direct request:', proxyErr);
  }

  // 2. Direct Fallback Request (for local dev or direct access)
  try {
    const url = `${BASE_URL}/Games/ByGameName?apikey=${API_KEY}&name=${encodeURIComponent(query)}&filter%5Bplatform%5D=11&include=boxart&fields=overview%2Cgenres`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    if (!data || data.code !== 200 || !data.data || !data.data.games) {
      return [];
    }

    const gamesList = Array.isArray(data.data.games) ? data.data.games.slice(0, 8) : [];
    const genresData = data.include?.genres?.data || {};
    const baseUrl = data.include?.boxart?.base_url?.medium || data.include?.boxart?.base_url?.original || 'https://cdn.thegamesdb.net/images/medium/';
    const boxartsData = data.include?.boxart?.data || {};

    let coversMap: Record<number, string> = {};
    gamesList.forEach((g: any) => {
      const gBoxarts = boxartsData[g.id] || boxartsData[String(g.id)];
      if (Array.isArray(gBoxarts) && gBoxarts.length > 0) {
        const front = gBoxarts.find((b: any) => b.side === 'front') || gBoxarts[0];
        if (front && front.filename) {
          coversMap[g.id] = `${baseUrl}${front.filename}`;
        }
      }
    });

    const results: TheGamesDBResult[] = gamesList.map((g: any) => {
      let mappedGenre: GenreType = 'Acción';
      if (g.genres && Array.isArray(g.genres) && g.genres.length > 0) {
        const firstGenreId = g.genres[0];
        const genreName = genresData[firstGenreId]?.name || '';
        mappedGenre = mapGenre(genreName);
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
    searchCache.set(cleanQuery, results);
    return results;
  } catch (err) {
    console.error('Error searching TheGamesDB:', err);
    return [];
  }
}
