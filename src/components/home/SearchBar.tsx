"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HolidayType } from "@/types/holiday";

const holidayTypes: { value: HolidayType | ""; label: string; emoji: string }[] = [
  { value: "", label: "All Holidays", emoji: "🌍" },
  { value: "ski", label: "Ski", emoji: "⛷️" },
  { value: "beach", label: "Beach", emoji: "🏖️" },
  { value: "city", label: "City Breaks", emoji: "🏙️" },
  { value: "summer", label: "Summer", emoji: "☀️" },
];

const popularDestinations = [
  "Val Thorens", "Verbier", "Courchevel", "Tenerife", "Mallorca",
  "Mykonos", "Santorini", "Barcelona", "Lisbon", "Dubrovnik",
];

export function SearchBar() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [type, setType] = useState<HolidayType | "">("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = popularDestinations.filter((d) =>
    destination.length > 0 && d.toLowerCase().includes(destination.toLowerCase())
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (destination) params.set("q", destination);
    router.push(`/holidays${params.size ? `?${params}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col sm:flex-row gap-2"
    >
      {/* Destination */}
      <div className="relative flex-1">
        <div className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <input
            type="text"
            placeholder="Where do you want to go?"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-sm"
          />
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 z-10 overflow-hidden">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { setDestination(s); setShowSuggestions(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Type */}
      <div className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl min-w-40 focus-within:border-primary-500 transition-all">
        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as HolidayType | "")}
          className="flex-1 bg-transparent outline-none text-slate-800 text-sm cursor-pointer"
        >
          {holidayTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.emoji} {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors shrink-0"
      >
        Search
      </button>
    </form>
  );
}
