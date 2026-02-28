import type { Review } from "@/types/holiday";
import { StarRating } from "@/components/ui/StarRating";
import { formatDate } from "@/lib/utils";

interface ReviewsSectionProps {
  reviews: Review[];
  ratingAverage: number;
  ratingCount: number;
}

export function ReviewsSection({ reviews, ratingAverage, ratingCount }: ReviewsSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-slate-900">{ratingAverage}</div>
          <StarRating rating={ratingAverage} size="md" className="justify-center mt-1" />
          <div className="text-xs text-slate-500 mt-1">{ratingCount.toLocaleString()} reviews</div>
        </div>
        <div className="flex-1 text-sm text-slate-600">
          <p className="font-semibold text-slate-900 mb-1">Customer Rating</p>
          <p>Based on verified guest reviews from travellers who booked with us.</p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review, i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="font-semibold text-slate-900 text-sm">{review.author}</div>
                <div className="text-xs text-slate-500">{formatDate(review.date)}</div>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <h4 className="font-semibold text-slate-800 text-sm mb-1">{review.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{review.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
