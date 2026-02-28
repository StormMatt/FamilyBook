"use client";

import { useState } from "react";
import Link from "next/link";
import type { Holiday } from "@/types/holiday";
import { formatDate } from "@/lib/utils";

interface BookingCTAProps {
  holiday: Holiday;
}

// Deterministic viewer count from slug so it's consistent server/client
function viewerCount(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) & 0xffff;
  return 3 + (h % 14); // 3–16 viewers
}

export function BookingCTA({ holiday }: BookingCTAProps) {
  const [selectedDep, setSelectedDep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const dep = holiday.departures[selectedDep];

  // Dynamic price: cheapest room pppn × nights + selected airport return
  const minRoomPppn = Math.min(...holiday.rooms.map((r) => r.pricePerPersonPerNight));
  const dynamicPrice = minRoomPppn * holiday.durationNights + dep.priceAdultReturn;

  const viewers = viewerCount(holiday.slug);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 sticky top-20">
      {/* Live price */}
      <div className="mb-1">
        <div className="flex items-baseline gap-2">
          {holiday.originalFromPrice && (
            <span className="text-slate-400 line-through text-lg">
              £{Math.round(holiday.originalFromPrice + dep.priceAdultReturn)}
            </span>
          )}
          <span className="text-3xl font-bold text-slate-900">£{dynamicPrice}</span>
        </div>
        <p className="text-xs text-slate-500">per person · updates with airport selection</p>
      </div>

      <p className="text-xs text-slate-500 mb-4">
        {holiday.pricing.depositType === "fixed"
          ? `Secure with £${holiday.pricing.deposit} deposit`
          : `${holiday.pricing.deposit}% deposit available`}
      </p>

      {/* Urgency signal */}
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4 text-xs">
        <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shrink-0" />
        <span className="text-amber-800 font-medium">
          {viewers} people viewing this holiday right now
        </span>
      </div>

      {/* Departure airport */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">
          Departure Airport
        </label>
        <select
          value={selectedDep}
          onChange={(e) => { setSelectedDep(Number(e.target.value)); setSelectedDate(null); }}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 bg-white"
        >
          {holiday.departures.map((d, i) => (
            <option key={d.airportCode} value={i}>
              {d.airport} (+£{d.priceAdultReturn} return)
            </option>
          ))}
        </select>
        <p className="text-[11px] text-primary-600 mt-1 font-medium">
          Price updated for {dep.airport}
        </p>
      </div>

      {/* Dates */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">
          Departure Date
        </label>
        <div className="flex flex-wrap gap-2">
          {dep.availableDates.slice(0, 6).map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                selectedDate === date
                  ? "bg-primary-600 text-white border-primary-600"
                  : "border-slate-200 text-slate-700 hover:border-primary-400"
              }`}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
      </div>

      <Link
        href={`/booking/${holiday.slug}${selectedDate ? `?date=${selectedDate}&airport=${dep.airportCode}` : ""}`}
        className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-xl transition-colors text-base"
      >
        Book Now — from £{dynamicPrice}pp
      </Link>

      <p className="text-xs text-center text-slate-500 mt-3">
        🛡️ ATOL & ABTA protected · Free cancellation available
      </p>

      {holiday.hotelSlug && (
        <Link
          href={`/hotels/${holiday.hotelSlug}`}
          className="block w-full text-center text-sm text-primary-600 font-medium mt-3 hover:underline"
        >
          🏨 View hotel details →
        </Link>
      )}
    </div>
  );
}
