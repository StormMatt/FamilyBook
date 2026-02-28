"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { SortOption } from "@/types/filters";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Top Rated" },
  { value: "duration-asc", label: "Shortest First" },
];

export function SortDropdown({ currentSort }: { currentSort: SortOption }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.replace(`/holidays?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-slate-500 whitespace-nowrap">Sort by</label>
      <select
        value={currentSort}
        onChange={handleChange}
        className="text-sm font-medium text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 bg-white hover:border-slate-300 focus:outline-none focus:border-primary-500 cursor-pointer"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
