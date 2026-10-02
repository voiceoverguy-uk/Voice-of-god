import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { isFreshGoogleReviews, REVIEWS_TTL_MS } from "@shared/google-reviews";

function useFreshReviews() {
  const { data, isError } = useQuery<unknown>({
    queryKey: ["/api/reviews"],
    staleTime: 60000,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
  });
  const [, tick] = useState(0);
  const review = !isError && isFreshGoogleReviews(data) ? data : null;
  // Expire even if an open tab receives no successful refresh.
  const expiresAt = review ? review.fetchedAt + REVIEWS_TTL_MS : null;
  useEffect(() => {
    if (expiresAt === null) return;
    const timer = setTimeout(() => tick(n => n + 1), Math.max(0, expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [expiresAt]);
  return review;
}

export function GoogleRatingValue() {
  const review = useFreshReviews();
  return <>
    {review ? review.rating.toFixed(1) : "—"}
    <span className="block text-xs font-normal text-gray-500">Guy / VoiceoverGuy</span>
  </>;
}

export function GoogleReviewSummary() {
  const review = useFreshReviews();
  return (
    <>
      <div className="flex items-center justify-center gap-1 mb-4" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`relative block h-6 w-6${review ? "" : " invisible"}`}>
            <Star className="h-6 w-6 text-yellow-400 opacity-30" />
            <span className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${review ? Math.max(0, Math.min(1, review.rating - i)) * 100 : 0}%` }}>
              <Star className="h-6 w-6 text-yellow-400" fill="currentColor" />
            </span>
          </span>
        ))}
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3"
        style={{ fontFamily: "'Montserrat', sans-serif" }}>
        {review
          ? `Rated ${review.rating.toFixed(1)} on Google · ${review.reviewCount} reviews`
          : "Google Reviews"}
      </h3>
      <p className="text-sm text-gray-400 mb-3">
        Google reviews for Guy Harris / VoiceoverGuy, shared here.
      </p>
    </>
  );
}