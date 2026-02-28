"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { FilterParams } from "@/types/filters";

interface FilterChipsProps {
  filters: FilterParams;
}

export function FilterChips({ filters }: FilterChipsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const chips: { key: string; value: string; label: string }[] = [];

  if (filters.type) {
    filters.type.forEach((t) =>
      chips.push({ key: "type", value: t, label: `Type: ${t}` })
    );
  }
  if (filters.departureAirport) {
    filters.departureAirport.forEach((a) =>
      chips.push({ key: "departureAirport", value: a, label: `From: ${a}` })
    );
  }
  if (filters.priceMin !== undefined) {
    chips.push({ key: "priceMin", value: String(filters.priceMin), label: `From £${filters.priceMin}` });
  }
  if (filters.priceMax !== undefined) {
    chips.push({ key: "priceMax", value: String(filters.priceMax), label: `Up to £${filters.priceMax}` });
  }
  if (filters.q) {
    chips.push({ key: "q", value: filters.q, label: `"${filters.q}"` });
  }

  if (chips.length === 0) return null;

  function removeFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (["type", "departureAirport", "boardBasis", "destination"].includes(key)) {
      const current = params.getAll(key).filter((v) => v !== value);
      params.delete(key);
      current.forEach((v) => params.append(key, v));
    } else {
      params.delete(key);
    }
    router.replace(`/holidays?${params.toString()}`);
  }

  function clearAll() {
    router.replace("/holidays");
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      {chips.map((chip) => (
        <button
          key={`${chip.key}-${chip.value}`}
          onClick={() => removeFilter(chip.key, chip.value)}
          className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 border border-primary-200 rounded-full px-3 py-1 text-xs font-medium hover:bg-primary-100 transition-colors"
        >
          {chip.label}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ))}
      <button
        onClick={clearAll}
        className="text-xs text-slate-500 hover:text-slate-800 underline"
      >
        Clear all
      </button>
    </div>
  );
}
