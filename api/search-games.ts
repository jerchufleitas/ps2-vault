export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { name } = req.query;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Query parameter name is required' });
  }

  const API_KEY = process.env.VITE_THEGAMESDB_API_KEY || '264cb03427179b76c8f91e0aa8fb2b37f2b41e6c2cbcca2f60b96d7365c24f80';
  const BASE_URL = 'https://api.thegamesdb.net/v1.1';

  try {
    const url = `${BASE_URL}/Games/ByGameName?apikey=${API_KEY}&name=${encodeURIComponent(name)}&filter%5Bplatform%5D=11&fields=overview%2Cgenres`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'TheGamesDB request failed' });
    }

    const data = await response.json();
    if (!data || data.code !== 200 || !data.data || !data.data.games) {
      return res.status(200).json({ games: [], genresData: {}, coversMap: {} });
    }

    const gamesList = Array.isArray(data.data.games) ? data.data.games.slice(0, 8) : [];
    const genresData = data.include?.genres?.data || {};
    const gameIds = gamesList.map((g: any) => g.id).join(',');

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
        console.warn('Error fetching covers in proxy:', err);
      }
    }

    return res.status(200).json({
      games: gamesList,
      genresData,
      coversMap,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
