"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { HolidayType } from "@/types/holiday";
import type { FilterParams } from "@/types/filters";

const HOLIDAY_TYPES: { value: HolidayType; label: string; emoji: string }[] = [
  { value: "ski", label: "Ski", emoji: "⛷️" },
  { value: "beach", label: "Beach", emoji: "🏖️" },
  { value: "city", label: "City Breaks", emoji: "🏙️" },
  { value: "summer", label: "Summer", emoji: "☀️" },
];

const AIRPORTS = [
  { code: "LGW", name: "London Gatwick" },
  { code: "LHR", name: "London Heathrow" },
  { code: "STN", name: "London Stansted" },
  { code: "MAN", name: "Manchester" },
  { code: "BHX", name: "Birmingham" },
  { code: "EDI", name: "Edinburgh" },
  { code: "BRS", name: "Bristol" },
];

const DURATIONS = [
  { label: "3–5 nights", min: 3, max: 5 },
  { label: "7 nights", min: 7, max: 7 },
  { label: "10–11 nights", min: 10, max: 11 },
  { label: "14 nights", min: 14, max: 14 },
];

interface FilterSidebarProps {
  currentFilters: FilterParams;
}

export function FilterSidebar({ currentFilters }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string, checked: boolean, multi = false) {
    const params = new URLSearchParams(searchParams.toString());
    if (multi) {
      const current = params.getAll(key);
      if (checked) {
        params.append(key, value);
      } else {
        params.delete(key);
        current.filter((v) => v !== value).forEach((v) => params.append(key, v));
      }
    } else {
      if (checked) params.set(key, value);
      else params.delete(key);
    }
    router.replace(`/holidays?${params.toString()}`);
  }

  function updateRange(min?: number, max?: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (min !== undefined) params.set("durationMin", String(min));
    else params.delete("durationMin");
    if (max !== undefined) params.set("durationMax", String(max));
    else params.delete("durationMax");
    router.replace(`/holidays?${params.toString()}`);
  }

  function updatePrice(key: "priceMin" | "priceMax", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`/holidays?${params.toString()}`);
  }

  const currentDuration =
    currentFilters.durationMin !== undefined
      ? `${currentFilters.durationMin}-${currentFilters.durationMax}`
      : "";

  return (
    <aside className="space-y-6">
      {/* Holiday Type */}
      <div>
        <h3 className="font-semibold text-slate-900 text-sm mb-3">Holiday Type</h3>
        <div className="space-y-2">
          {HOLIDAY_TYPES.map((t) => {
            const checked = currentFilters.type?.includes(t.value) ?? false;
            return (
              <label key={t.value} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => update("type", t.value, e.target.checked, true)}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900">
                  {t.emoji} {t.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Departure Airport */}
      <div>
        <h3 className="font-semibold text-slate-900 text-sm mb-3">Departure Airport</h3>
        <div className="space-y-2">
          {AIRPORTS.map((a) => {
            const checked = currentFilters.departureAirport?.includes(a.code) ?? false;
            return (
              <label key={a.code} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    update("departureAirport", a.code, e.target.checked, true)
                  }
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900">
                  {a.name} ({a.code})
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-slate-900 text-sm mb-3">Budget (per person)</h3>
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <label className="text-xs text-slate-500 mb-1 block">Min £</label>
            <input
              type="number"
              placeholder="0"
              defaultValue={currentFilters.priceMin}
              onBlur={(e) => updatePrice("priceMin", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
              min={0}
              step={50}
            />
          </div>
          <span className="text-slate-400 mt-5">–</span>
          <div className="flex-1">
            <label className="text-xs text-slate-500 mb-1 block">Max £</label>
            <input
              type="number"
              placeholder="5000"
              defaultValue={currentFilters.priceMax}
              onBlur={(e) => updatePrice("priceMax", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
              min={0}
              step={50}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Duration */}
      <div>
        <h3 className="font-semibold text-slate-900 text-sm mb-3">Duration</h3>
        <div className="space-y-2">
          {DURATIONS.map((d) => {
            const key = `${d.min}-${d.max}`;
            return (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="duration"
                  checked={currentDuration === key}
                  onChange={(e) => {
                    if (e.target.checked) updateRange(d.min, d.max);
                  }}
                  className="w-4 h-4 border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900">
                  {d.label}
                </span>
              </label>
            );
          })}
          {currentDuration && (
            <button
              onClick={() => updateRange()}
              className="text-xs text-primary-600 hover:underline mt-1"
            >
              Clear duration
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
