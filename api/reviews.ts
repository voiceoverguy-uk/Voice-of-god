import type { VercelRequest, VercelResponse } from "@vercel/node";

const GOOGLE_PLACE_ID = "ChIJL1W4QyVneUgRBV8j4XrOzaM";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

let cache: { rating: number; reviewCount: number; fetchedAt: number } | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return res.status(200).json(cache);
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ rating: 5.0, reviewCount: 119 });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=rating,user_ratings_total&key=${apiKey}`;
    const googleRes = await fetch(url);
    const json = await googleRes.json() as { result?: { rating?: number; user_ratings_total?: number } };
    const rating = json.result?.rating ?? 5.0;
    const reviewCount = json.result?.user_ratings_total ?? 119;
    cache = { rating, reviewCount, fetchedAt: now };
    return res.status(200).json(cache);
  } catch {
    const fallback = cache ?? { rating: 5.0, reviewCount: 119 };
    return res.status(200).json(fallback);
  }
}
