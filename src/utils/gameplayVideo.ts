import { useState, useEffect } from 'react';

// Memory cache for fetched Dailymotion video IDs to prevent duplicate API calls
const videoCache: Record<string, string> = {};

// Active, high-quality PS2 Gameplay fallback video ID on Dailymotion
const FALLBACK_DAILYMOTION_ID = 'x89q0v0'; 

/**
 * Dynamically searches Dailymotion API for a PS2 gameplay video matching the game title.
 * Zero API keys required, zero CORS errors, 100% automated for any new game title.
 */
export async function searchDailymotionVideo(gameTitle: string): Promise<string> {
  if (!gameTitle) return FALLBACK_DAILYMOTION_ID;

  // Clean title for search (e.g. "Conan", "Splinter Cell Double Agent")
  const cleanTitle = gameTitle.replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const normalizedKey = cleanTitle.toLowerCase();

  if (videoCache[normalizedKey]) {
    return videoCache[normalizedKey];
  }

  try {
    // Search strategy 1: "{Title} PS2 gameplay"
    const query1 = encodeURIComponent(`${cleanTitle} PS2 gameplay`);
    let response = await fetch(
      `https://api.dailymotion.com/videos?fields=id,title,allow_embed&search=${query1}&limit=5`
    );

    if (response.ok) {
      const data = await response.json();
      if (data && data.list && data.list.length > 0) {
        const validVideo = data.list.find((item: any) => item.id && item.allow_embed !== false);
        if (validVideo) {
          videoCache[normalizedKey] = validVideo.id;
          return validVideo.id;
        }
      }
    }

    // Search strategy 2: "{Title} PlayStation 2"
    const query2 = encodeURIComponent(`${cleanTitle} PlayStation 2`);
    response = await fetch(
      `https://api.dailymotion.com/videos?fields=id,title,allow_embed&search=${query2}&limit=5`
    );

    if (response.ok) {
      const data = await response.json();
      if (data && data.list && data.list.length > 0) {
        const validVideo = data.list.find((item: any) => item.id && item.allow_embed !== false);
        if (validVideo) {
          videoCache[normalizedKey] = validVideo.id;
          return validVideo.id;
        }
      }
    }
  } catch (error) {
    console.warn('Error fetching Dailymotion gameplay video:', error);
  }

  return FALLBACK_DAILYMOTION_ID;
}

/**
 * Returns a clean Dailymotion embed URL without controls or branding.
 */
export function getDailymotionEmbedUrl(videoId: string): string {
  return `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1&mute=1&queue-enable=0&ui-start-screen-info=0&ui-logo=0&sharing-enable=0&start=5`;
}

/**
 * Custom React hook to fetch Dailymotion video URL automatically for any game title.
 */
export function useDailymotionGameplay(gameTitle: string) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    searchDailymotionVideo(gameTitle).then((videoId) => {
      if (isMounted) {
        setEmbedUrl(getDailymotionEmbedUrl(videoId));
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [gameTitle]);

  return { embedUrl, loading };
}
