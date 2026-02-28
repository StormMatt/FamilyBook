import type { Holiday } from "@/types/holiday";
import { HolidayCard } from "@/components/home/HolidayCard";

interface HolidayGridProps {
  holidays: Holiday[];
  total: number;
}

export function HolidayGrid({ holidays, total }: HolidayGridProps) {
  if (holidays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No holidays found</h3>
        <p className="text-slate-500">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-slate-500 mb-5">
        <span className="font-semibold text-slate-900">{total}</span> holidays found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {holidays.map((h) => (
          <HolidayCard key={h.id} holiday={h} />
        ))}
      </div>
    </div>
  );
}
