import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllHolidays, getHolidayBySlug } from "@/lib/holidays";
import { PhotoGallery } from "@/components/detail/PhotoGallery";
import { IncludesSection } from "@/components/detail/IncludesSection";
import { ReviewsSection } from "@/components/detail/ReviewsSection";
import { BookingCTA } from "@/components/detail/BookingCTA";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Deterministic "booked N times this month" from slug
function recentBookings(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) & 0xffff;
  return 12 + (h % 47); // 12–58
}

export async function generateStaticParams() {
  const holidays = await getAllHolidays();
  return holidays.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const holiday = await getHolidayBySlug(slug);
  if (!holiday) return {};
  return {
    title: holiday.name,
    description: holiday.tagline,
  };
}

export default async function HolidayDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const holiday = await getHolidayBySlug(slug);
  if (!holiday) notFound();

  const bookings = recentBookings(holiday.slug);
  const minRoomPppn = Math.min(...holiday.rooms.map((r) => r.pricePerPersonPerNight));
  const maxRoomPppn = Math.max(...holiday.rooms.map((r) => r.pricePerPersonPerNight));

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-sm text-slate-500 flex gap-2 items-center">
          <a href="/" className="hover:text-primary-600">Home</a>
          <span>/</span>
          <a href="/holidays" className="hover:text-primary-600">Holidays</a>
          <span>/</span>
          <span className="text-slate-900">{holiday.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant={holiday.type}>{holiday.type}</Badge>
            {holiday.isSpecialOffer && holiday.specialOfferLabel && (
              <Badge variant="offer">{holiday.specialOfferLabel}</Badge>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            {holiday.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span>
              📍 {holiday.destination.resort}, {holiday.destination.country}
            </span>
            <span>🌙 {holiday.durationNights} nights</span>
            <StarRating
              rating={holiday.rating.average}
              count={holiday.rating.count}
            />
          </div>

          {/* Social proof / urgency strip */}
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5 text-xs text-green-800 font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              {bookings} bookings this month
            </div>
            {holiday.isSpecialOffer && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 text-xs text-amber-800 font-medium">
                ⚡ Limited availability — book soon
              </div>
            )}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-600 font-medium">
              🛡️ ATOL protected
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <PhotoGallery images={holiday.images} />

            {/* Highlights */}
            {holiday.highlights.length > 0 && (
              <div className="bg-primary-50 rounded-2xl p-5">
                <h2 className="font-bold text-primary-900 text-lg mb-3">Holiday Highlights</h2>
                <ul className="space-y-2">
                  {holiday.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-primary-800">
                      <svg className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">About this holiday</h2>
              <p className="text-slate-600 leading-relaxed">{holiday.description}</p>
            </div>

            {/* Rooms — comparison table */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Choose your room</h2>
              <p className="text-sm text-slate-500 mb-4">
                Prices from £{minRoomPppn}pp/night · rooms up to {Math.max(...holiday.rooms.map(r => r.maxOccupancy))} guests
              </p>

              {/* Feature comparison header */}
              {holiday.rooms.length > 1 && (
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide w-28" />
                        {holiday.rooms.map((room, idx) => {
                          const isCheapest = room.pricePerPersonPerNight === minRoomPppn;
                          const isMostExpensive = room.pricePerPersonPerNight === maxRoomPppn;
                          return (
                            <th key={room.id} className="text-center py-2 px-3">
                              <div className="font-bold text-slate-900">{room.name}</div>
                              <div className="mt-1 flex justify-center gap-1 flex-wrap">
                                {idx === 0 && (
                                  <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-2 py-0.5 rounded-full">
                                    Most Popular
                                  </span>
                                )}
                                {isCheapest && !isMostExpensive && (
                                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                                    Best Value
                                  </span>
                                )}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-slate-100">
                        <td className="py-2.5 pr-4 text-xs text-slate-500 font-semibold">Price</td>
                        {holiday.rooms.map((room) => (
                          <td key={room.id} className="text-center py-2.5 px-3">
                            <span className="font-bold text-slate-900">£{room.pricePerPersonPerNight}</span>
                            <span className="text-xs text-slate-400 ml-0.5">pp/night</span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-t border-slate-100 bg-slate-50/50">
                        <td className="py-2.5 pr-4 text-xs text-slate-500 font-semibold">Board basis</td>
                        {holiday.rooms.map((room) => (
                          <td key={room.id} className="text-center py-2.5 px-3 text-xs capitalize text-slate-700">
                            {room.boardBasis.replace(/-/g, " ")}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-t border-slate-100">
                        <td className="py-2.5 pr-4 text-xs text-slate-500 font-semibold">Max guests</td>
                        {holiday.rooms.map((room) => (
                          <td key={room.id} className="text-center py-2.5 px-3 text-xs text-slate-700">
                            Up to {room.maxOccupancy}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-t border-slate-100 bg-slate-50/50">
                        <td className="py-2.5 pr-4 text-xs text-slate-500 font-semibold">Description</td>
                        {holiday.rooms.map((room) => (
                          <td key={room.id} className="py-2.5 px-3 text-xs text-slate-600 align-top">
                            {room.description}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Room cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {holiday.rooms.map((room, idx) => {
                  const isCheapest = room.pricePerPersonPerNight === minRoomPppn;
                  const isMostExpensive = room.pricePerPersonPerNight === maxRoomPppn;
                  return (
                    <div key={room.id} className={`border rounded-2xl p-4 relative ${idx === 0 ? "border-primary-300 bg-primary-50/30" : "border-slate-200"}`}>
                      {idx === 0 && (
                        <div className="absolute -top-3 left-4">
                          <span className="text-xs bg-primary-600 text-white font-semibold px-2.5 py-1 rounded-full shadow-sm">
                            Most Popular
                          </span>
                        </div>
                      )}
                      {isCheapest && !isMostExpensive && idx !== 0 && (
                        <div className="absolute -top-3 left-4">
                          <span className="text-xs bg-green-600 text-white font-semibold px-2.5 py-1 rounded-full shadow-sm">
                            Best Value
                          </span>
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-2 mt-1">
                        <h3 className="font-bold text-slate-900">{room.name}</h3>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full capitalize">
                          {room.boardBasis.replace(/-/g, " ")}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{room.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {room.amenities.map((a) => (
                          <span key={a} className="text-xs bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full border border-slate-100">
                            {a}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        from £{room.pricePerPersonPerNight}
                        <span className="font-normal text-slate-500"> /person/night</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Includes */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What&apos;s included</h2>
              <IncludesSection included={holiday.included} notIncluded={holiday.notIncluded} />
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Guest Reviews</h2>
              <ReviewsSection
                reviews={holiday.reviews}
                ratingAverage={holiday.rating.average}
                ratingCount={holiday.rating.count}
              />
            </div>
          </div>

          {/* Right: booking CTA */}
          <div className="lg:col-span-1">
            <BookingCTA holiday={holiday} />
          </div>
        </div>
      </div>
    </div>
  );
}
