import type { IncludedItem } from "@/types/holiday";

interface IncludesSectionProps {
  included: IncludedItem[];
  notIncluded: string[];
}

export function IncludesSection({ included, notIncluded }: IncludesSectionProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <div className="bg-green-50 rounded-2xl p-5">
        <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          What&apos;s included
        </h3>
        <ul className="space-y-2.5">
          {included.map((item) => (
            <li key={item.label} className="flex items-start gap-2.5">
              <span className="text-lg shrink-0">{item.icon}</span>
              <div>
                <div className="text-sm font-semibold text-green-900">{item.label}</div>
                {item.detail && (
                  <div className="text-xs text-green-700">{item.detail}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-50 rounded-2xl p-5">
        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Not included
        </h3>
        <ul className="space-y-2">
          {notIncluded.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
