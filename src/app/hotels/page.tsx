import Link from "next/link";
import Image from "next/image";
import { getAllHotels } from "@/lib/hotels";
import type { Hotel } from "@/types/hotel";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function HotelCard({ hotel }: { hotel: Hotel }) {
  const img = hotel.images.find((i) => i.isPrimary) ?? hotel.images[0];
  return (
    <Link
      href={`/hotels/${hotel.slug}`}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all"
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={img.url}
          alt={img.alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 bg-white/95 text-slate-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <StarRating rating={hotel.starRating} />
          <span className="ml-0.5">{hotel.starRating}★</span>
        </div>
        <div className="absolute top-3 right-3 bg-primary-600/90 text-white text-xs font-bold px-2 py-1 rounded-full">
          {hotel.location.country}
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs text-slate-500 mb-0.5">
          {hotel.location.resort}, {hotel.location.country}
        </div>
        <h3 className="font-bold text-slate-900 text-base leading-snug mb-1 group-hover:text-primary-700 transition-colors">
          {hotel.name}
        </h3>
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{hotel.tagline}</p>

        {/* Top amenities */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {hotel.amenities.slice(0, 4).map((a) => (
            <span
              key={a.label}
              className="flex items-center gap-1 text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full"
            >
              <span>{a.icon}</span>
              <span>{a.label}</span>
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="bg-primary-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              {hotel.rating.average}
            </span>
            <span className="text-xs text-slate-500">
              ({hotel.rating.count.toLocaleString()} reviews)
            </span>
          </div>
          <span className="text-xs text-primary-600 font-semibold group-hover:underline">
            View hotel →
          </span>
        </div>
      </div>
    </Link>
  );
}

const STAR_OPTIONS = [3, 4, 5];

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<{ stars?: string; country?: string }>;
}) {
  const params = await searchParams;
  const allHotels = await getAllHotels();

  // Filter
  let filtered = allHotels;
  if (params.stars) {
    const stars = parseInt(params.stars);
    filtered = filtered.filter((h) => h.starRating === stars);
  }
  if (params.country) {
    filtered = filtered.filter((h) =>
      h.location.country.toLowerCase().includes(params.country!.toLowerCase())
    );
  }

  // Unique countries
  const countries = [...new Set(allHotels.map((h) => h.location.country))].sort();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-primary-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Our Hotels</h1>
          <p className="text-primary-200 text-lg max-w-2xl">
            Hand-picked accommodation across Europe — from ski-in ski-out Alpine chalets to
            clifftop Aegean retreats. Every hotel personally vetted by our experts.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="text-sm font-semibold text-slate-700 mr-1">Filter:</span>

          {/* Star rating */}
          <div className="flex gap-2">
            <Link
              href="/hotels"
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                !params.stars
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-primary-400"
              }`}
            >
              All Stars
            </Link>
            {STAR_OPTIONS.map((s) => (
              <Link
                key={s}
                href={`/hotels?stars=${s}${params.country ? `&country=${params.country}` : ""}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  params.stars === String(s)
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-primary-400"
                }`}
              >
                {s}★
              </Link>
            ))}
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Country */}
          <div className="flex flex-wrap gap-2">
            {countries.slice(0, 7).map((c) => (
              <Link
                key={c}
                href={`/hotels?country=${encodeURIComponent(c)}${params.stars ? `&stars=${params.stars}` : ""}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  params.country === c
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-primary-400"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-slate-500 mb-6">
          Showing <strong className="text-slate-900">{filtered.length}</strong> hotel{filtered.length !== 1 ? "s" : ""}
          {params.stars && ` · ${params.stars}★`}
          {params.country && ` · ${params.country}`}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🏨</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No hotels match your filters</h2>
            <Link href="/hotels" className="text-primary-600 hover:underline text-sm">
              Clear all filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
