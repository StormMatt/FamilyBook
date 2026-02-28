import type { Holiday } from "@/types/holiday";
import { HolidayCard } from "./HolidayCard";
import Link from "next/link";

interface FeaturedHolidaysProps {
  holidays: Holiday[];
}

export function FeaturedHolidays({ holidays }: FeaturedHolidaysProps) {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Featured Holidays
            </h2>
            <p className="text-slate-500">Hand-picked favourites from our experts</p>
          </div>
          <Link
            href="/holidays"
            className="hidden sm:inline-flex items-center gap-1 text-primary-600 font-semibold text-sm hover:text-primary-800 transition-colors"
          >
            View all <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {holidays.map((holiday) => (
            <HolidayCard key={holiday.id} holiday={holiday} />
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/holidays"
            className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors"
          >
            View all holidays →
          </Link>
        </div>
      </div>
    </section>
  );
}
