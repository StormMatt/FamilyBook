import { Suspense } from "react";
import { filterHolidays } from "@/lib/holidays";
import { parseSearchParams } from "@/lib/filters";
import { HolidayGrid } from "@/components/holidays/HolidayGrid";
import { FilterSidebar } from "@/components/holidays/FilterSidebar";
import { FilterChips } from "@/components/holidays/FilterChips";
import { SortDropdown } from "@/components/holidays/SortDropdown";
import { Spinner } from "@/components/ui/Spinner";
import type { SortOption } from "@/types/filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Holidays",
  description: "Browse ski, beach, city and summer holidays across Europe.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[]>>;
}

export default async function HolidaysPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseSearchParams(params);
  const { holidays, total } = await filterHolidays(filters);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-primary-900 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">All Holidays</h1>
          <p className="text-white/70">
            {total} holiday{total !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sticky top-20">
              <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter holidays
              </h2>
              <Suspense fallback={<Spinner />}>
                <FilterSidebar currentFilters={filters} />
              </Suspense>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <Suspense fallback={null}>
                <FilterChips filters={filters} />
              </Suspense>
              <Suspense fallback={null}>
                <SortDropdown currentSort={(filters.sort ?? "featured") as SortOption} />
              </Suspense>
            </div>

            <HolidayGrid holidays={holidays} total={total} />
          </div>
        </div>
      </div>
    </div>
  );
}
