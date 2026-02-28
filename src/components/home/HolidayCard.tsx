import Image from "next/image";
import Link from "next/link";
import type { Holiday } from "@/types/holiday";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { PriceTag } from "@/components/ui/PriceTag";

interface HolidayCardProps {
  holiday: Holiday;
}

export function HolidayCard({ holiday }: HolidayCardProps) {
  const primaryImage = holiday.images.find((i) => i.isPrimary) ?? holiday.images[0];

  return (
    <Link
      href={`/holidays/${holiday.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <Badge variant={holiday.type}>{holiday.type}</Badge>
          {holiday.isSpecialOffer && holiday.specialOfferLabel && (
            <Badge variant="offer">{holiday.specialOfferLabel}</Badge>
          )}
        </div>

        {/* Duration */}
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {holiday.durationNights} nights
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-xs text-slate-500 font-medium mb-1">
          {holiday.destination.resort}, {holiday.destination.country}
        </div>
        <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
          {holiday.name}
        </h3>

        <StarRating
          rating={holiday.rating.average}
          count={holiday.rating.count}
          className="mb-3"
        />

        {/* Included highlights */}
        {holiday.included.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {holiday.included.slice(0, 3).map((item) => (
              <span
                key={item.label}
                className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full border border-slate-100"
              >
                {item.icon} {item.label}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-end justify-between mt-auto pt-3 border-t border-slate-100">
          <PriceTag
            price={holiday.pricing.fromPrice}
            originalPrice={holiday.originalFromPrice}
            suffix="pp"
            size="md"
          />
          <span className="text-xs text-primary-600 font-semibold group-hover:underline">
            View &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
