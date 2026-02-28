import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getHotelBySlug } from "@/lib/hotels";
import { getAllHolidays } from "@/lib/holidays";
import type { Holiday } from "@/types/holiday";
import { formatPrice } from "@/lib/utils";

export async function generateStaticParams() {
  const { getAllHotels } = await import("@/lib/hotels");
  const hotels = await getAllHotels();
  return hotels.map((h) => ({ slug: h.slug }));
}

function StarRating({ rating, showCount, count }: { rating: number; showCount?: boolean; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? "text-amber-400" : i < rating ? "text-amber-300" : "text-slate-200"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {showCount && count && (
        <span className="text-sm text-slate-500">{count.toLocaleString()} reviews</span>
      )}
    </div>
  );
}

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);
  if (!hotel) notFound();

  const allHolidays = await getAllHolidays();
  const linkedHolidays = allHolidays.filter((h: Holiday) =>
    hotel.holidaySlugs.includes(h.slug)
  );

  const primaryImage = hotel.images.find((i) => i.isPrimary) ?? hotel.images[0];

  const categoryColors: Record<string, string> = {
    pool: "bg-blue-50 text-blue-700",
    dining: "bg-orange-50 text-orange-700",
    wellness: "bg-purple-50 text-purple-700",
    sport: "bg-green-50 text-green-700",
    kids: "bg-yellow-50 text-yellow-700",
    connectivity: "bg-slate-50 text-slate-700",
    general: "bg-slate-50 text-slate-700",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero gallery */}
      <div className="relative h-[50vh] min-h-80 max-h-[560px] bg-slate-900">
        <Image
          src={primaryImage.url}
          alt={primaryImage.alt}
          fill
          priority
          className="object-cover opacity-90"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Back nav */}
        <div className="absolute top-4 left-4">
          <Link
            href="/hotels"
            className="flex items-center gap-2 bg-white/90 text-slate-800 text-sm font-semibold px-3 py-2 rounded-xl hover:bg-white transition-colors shadow-sm"
          >
            ← All Hotels
          </Link>
        </div>

        {/* Gallery thumbnails */}
        {hotel.images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            {hotel.images.slice(1, 4).map((img, i) => (
              <div key={i} className="w-16 h-12 rounded-lg overflow-hidden border-2 border-white/60 opacity-80 hover:opacity-100 transition-opacity">
                <Image src={img.url} alt={img.alt} width={64} height={48} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        )}

        {/* Star badges */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="bg-white/95 text-slate-800 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
            <StarRating rating={hotel.starRating} />
            <span>{hotel.starRating}-star hotel</span>
          </div>
          <div className="bg-primary-600/90 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
            {hotel.location.resort}, {hotel.location.country}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Name & intro */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{hotel.name}</h1>
              <p className="text-lg text-slate-600 italic mb-4">{hotel.tagline}</p>
              <p className="text-slate-700 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Why We Love It</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {hotel.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-3 p-3 bg-primary-50 rounded-xl">
                    <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-primary-900 font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Facilities & Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities.map((a) => (
                  <div
                    key={a.label}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium ${categoryColors[a.category] ?? "bg-slate-50 text-slate-700"}`}
                  >
                    <span className="text-lg">{a.icon}</span>
                    <span>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Room Types</h2>
              <div className="space-y-4">
                {hotel.rooms.map((room) => (
                  <div key={room.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="flex">
                      {room.images[0] && (
                        <div className="relative w-32 sm:w-48 shrink-0">
                          <Image
                            src={room.images[0]}
                            alt={room.name}
                            fill
                            className="object-cover"
                            sizes="192px"
                          />
                        </div>
                      )}
                      <div className="p-5 flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-bold text-slate-900">{room.name}</h3>
                            <div className="text-xs text-slate-500 capitalize mt-0.5">
                              {room.boardBasis.replace(/-/g, " ")} · Up to {room.maxOccupancy} guests · {room.sizeSqm}m²
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{room.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {room.highlights.map((h) => (
                            <span key={h} className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full">
                              ✓ {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guest ratings */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Guest Ratings</h2>
              <div className="bg-slate-50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary-700">{hotel.rating.average}</div>
                    <div className="text-xs text-slate-500 mt-1">{hotel.rating.count.toLocaleString()} reviews</div>
                  </div>
                  <div className="flex-1">
                    <StarRating rating={hotel.rating.average} showCount count={hotel.rating.count} />
                    <div className="text-sm text-slate-600 mt-1">
                      {hotel.rating.average >= 4.7 ? "Exceptional" : hotel.rating.average >= 4.4 ? "Excellent" : hotel.rating.average >= 4.0 ? "Very Good" : "Good"}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {hotel.rating.breakdown.map((b) => (
                    <div key={b.label}>
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>{b.label}</span>
                        <span className="font-semibold text-slate-900">{b.score}</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full"
                          style={{ width: `${(b.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Policies */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Hotel Policies</h2>
              <div className="space-y-2">
                {hotel.policies.map((p) => (
                  <div key={p} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="text-slate-400 mt-0.5">•</span>
                    {p}
                  </div>
                ))}
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="text-slate-400 mt-0.5">•</span>
                  Check-in from {hotel.checkInTime} · Check-out by {hotel.checkOutTime}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Location card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
                <h3 className="font-bold text-slate-800">📍 Location</h3>
              </div>
              <div className="p-5 text-sm space-y-2">
                <div className="font-medium text-slate-900">{hotel.location.address}</div>
                {hotel.location.distanceToSlopes && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <span>⛷️</span>
                    <span>{hotel.location.distanceToSlopes}</span>
                  </div>
                )}
                {hotel.location.distanceToBeach && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <span>🏖️</span>
                    <span>{hotel.location.distanceToBeach}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-600">
                  <span>🗺️</span>
                  <span>{hotel.location.distanceToCenter}</span>
                </div>
                <div className="mt-3">
                  <div className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wide">Nearby</div>
                  {hotel.location.nearbyAttractions.map((a) => (
                    <div key={a} className="text-xs text-slate-600 py-0.5">· {a}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Book this hotel */}
            {linkedHolidays.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="bg-primary-600 px-5 py-4">
                  <h3 className="font-bold text-white">Book a Holiday at This Hotel</h3>
                  <p className="text-primary-100 text-xs mt-0.5">
                    {linkedHolidays.length} package{linkedHolidays.length !== 1 ? "s" : ""} available
                  </p>
                </div>
                <div className="divide-y divide-slate-100">
                  {linkedHolidays.map((holiday: Holiday) => (
                    <Link
                      key={holiday.slug}
                      href={`/holidays/${holiday.slug}`}
                      className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors group"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 text-sm group-hover:text-primary-700">
                          {holiday.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {holiday.durationNights} nights · from {formatPrice(holiday.pricing.fromPrice)} pp
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-slate-400 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Check-in info */}
            <div className="bg-slate-50 rounded-2xl p-5 text-sm">
              <h3 className="font-bold text-slate-800 mb-3">Check-in Info</h3>
              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span>Check-in</span>
                  <span className="font-medium text-slate-900">From {hotel.checkInTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out</span>
                  <span className="font-medium text-slate-900">By {hotel.checkOutTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
