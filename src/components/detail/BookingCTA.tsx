"use client";

import { useState } from "react";
import Link from "next/link";
import type { Holiday } from "@/types/holiday";
import { PriceTag } from "@/components/ui/PriceTag";
import { formatDate } from "@/lib/utils";

interface BookingCTAProps {
  holiday: Holiday;
}

export function BookingCTA({ holiday }: BookingCTAProps) {
  const [selectedDep, setSelectedDep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const dep = holiday.departures[selectedDep];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 sticky top-20">
      <PriceTag
        price={holiday.pricing.fromPrice}
        originalPrice={holiday.originalFromPrice}
        suffix="per person"
        size="lg"
        className="mb-1"
      />
      <p className="text-xs text-slate-500 mb-5">
        {holiday.pricing.depositType === "fixed"
          ? `Secure with £${holiday.pricing.deposit} deposit`
          : `${holiday.pricing.deposit}% deposit available`}
      </p>

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
        Book Now
      </Link>

      <p className="text-xs text-center text-slate-500 mt-3">
        🛡️ ATOL & ABTA protected · Free cancellation available
      </p>
    </div>
  );
}
