import { isFreshGoogleReviews, validReviewNumbers, type GoogleReviews } from "../shared/google-reviews";

const GOOGLE_PLACE_ID = "ChIJL1W4QyVneUgRBV8j4XrOzaM";
let cache: GoogleReviews | null = null;

// Only successful, validated provider responses enter the existing in-memory
// cache. Expired data is never returned as a current numeric claim.
export async function getGoogleReviews(): Promise<GoogleReviews | { available: false }> {
  if (isFreshGoogleReviews(cache)) return cache;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return { available: false };
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=rating,user_ratings_total&key=${apiKey}`,
      { signal: AbortSignal.timeout(10000) },
    );
    if (!response.ok) return { available: false };
    const json = await response.json();
    if (json?.status !== "OK" ||
        !validReviewNumbers(json.result?.rating, json.result?.user_ratings_total)) {
      return { available: false };
    }
    cache = {
      rating: json.result.rating,
      reviewCount: json.result.user_ratings_total,
      fetchedAt: Date.now(),
    };
    return cache;
  } catch {
    return { available: false };
  }
}