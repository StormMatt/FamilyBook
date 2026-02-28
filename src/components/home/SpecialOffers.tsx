import type { Holiday } from "@/types/holiday";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

interface SpecialOffersProps {
  offers: Holiday[];
}

export function SpecialOffers({ offers }: SpecialOffersProps) {
  if (offers.length === 0) return null;

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-accent-400/10 text-accent-500 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            🔥 Limited Time
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Special Offers
          </h2>
          <p className="text-slate-500 mt-1">Grab these deals before they&apos;re gone</p>
        </div>
        <Link
          href="/holidays?offer=true"
          className="hidden sm:inline-flex text-primary-600 font-semibold text-sm hover:text-primary-800 transition-colors"
        >
          All offers →
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {offers.map((offer) => {
          const img = offer.images.find((i) => i.isPrimary) ?? offer.images[0];
          const saving = offer.originalFromPrice
            ? offer.originalFromPrice - offer.pricing.fromPrice
            : 0;

          return (
            <Link
              key={offer.id}
              href={`/holidays/${offer.slug}`}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="relative h-44 bg-slate-100">
                {img && (
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {offer.specialOfferLabel && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="offer">{offer.specialOfferLabel}</Badge>
                  </div>
                )}
                {saving > 0 && (
                  <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    Save {formatPrice(saving)}
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="text-xs text-slate-500 mb-1">
                  {offer.destination.resort}, {offer.destination.country}
                </p>
                <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                  {offer.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    {offer.originalFromPrice && (
                      <p className="text-slate-400 line-through text-xs">
                        {formatPrice(offer.originalFromPrice)} pp
                      </p>
                    )}
                    <p className="font-bold text-slate-900">
                      {formatPrice(offer.pricing.fromPrice)}{" "}
                      <span className="text-slate-500 font-normal text-xs">pp</span>
                    </p>
                  </div>
                  <span className="text-primary-600 text-xs font-semibold group-hover:underline">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
