import type { Holiday } from "@/types/holiday";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface BookingSummaryProps {
  holiday: Holiday;
  adultCount?: number;
  childCount?: number;
}

export function BookingSummary({ holiday, adultCount = 2, childCount = 0 }: BookingSummaryProps) {
  const img = holiday.images.find((i) => i.isPrimary) ?? holiday.images[0];
  const totalGuests = adultCount + childCount;
  const estimatedTotal = holiday.pricing.fromPrice * totalGuests;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {img && (
        <div className="relative h-36">
          <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="300px" />
        </div>
      )}
      <div className="p-4">
        <div className="text-xs text-slate-500 mb-0.5">
          {holiday.destination.resort}, {holiday.destination.country}
        </div>
        <h3 className="font-bold text-slate-900 text-sm leading-snug mb-3">{holiday.name}</h3>
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Duration</span>
            <span className="font-medium text-slate-900">{holiday.durationNights} nights</span>
          </div>
          <div className="flex justify-between">
            <span>Guests</span>
            <span className="font-medium text-slate-900">
              {adultCount} adult{adultCount !== 1 ? "s" : ""}
              {childCount > 0 ? ` + ${childCount}` : ""}
            </span>
          </div>
          <div className="border-t border-slate-100 my-2" />
          <div className="flex justify-between text-sm">
            <span className="text-slate-700">Estimated Total</span>
            <span className="font-bold text-slate-900">{formatPrice(estimatedTotal)}</span>
          </div>
          <div className="text-slate-500 text-xs">From {formatPrice(holiday.pricing.fromPrice)} pp</div>
        </div>
      </div>
    </div>
  );
}
