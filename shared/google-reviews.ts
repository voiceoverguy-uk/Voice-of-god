export const REVIEWS_TTL_MS = 24 * 60 * 60 * 1000;

export type GoogleReviews = {
  rating: number;
  reviewCount: number;
  fetchedAt: number;
};

export function validReviewNumbers(rating: unknown, count: unknown): boolean {
  return typeof rating === "number" && Number.isFinite(rating) &&
    rating >= 1 && rating <= 5 &&
    typeof count === "number" && Number.isSafeInteger(count) && count >= 0;
}

export function isFreshGoogleReviews(value: unknown, now = Date.now()): value is GoogleReviews {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<GoogleReviews>;
  return validReviewNumbers(data.rating, data.reviewCount) &&
    typeof data.fetchedAt === "number" && Number.isFinite(data.fetchedAt) &&
    data.fetchedAt > 0 && data.fetchedAt <= now &&
    now - data.fetchedAt < REVIEWS_TTL_MS;
}