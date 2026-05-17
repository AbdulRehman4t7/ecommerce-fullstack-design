import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export default function StarRating({
  rating,
  size = 14,
  showValue = false,
  reviewCount,
  className = "",
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < fullStars || (i === fullStars && hasHalf);
          return (
            <Star
              key={i}
              size={size}
              className={
                filled ? "fill-accent text-accent" : "fill-none text-border"
              }
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-dark-text">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-grey-text">| {reviewCount} reviews</span>
      )}
    </div>
  );
}
