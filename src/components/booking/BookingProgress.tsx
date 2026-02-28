import type { BookingStep } from "@/types/booking";

const steps = [
  { n: 1 as BookingStep, label: "Room & Dates" },
  { n: 2 as BookingStep, label: "Extras" },
  { n: 3 as BookingStep, label: "Guest Details" },
  { n: 4 as BookingStep, label: "Review" },
  { n: 5 as BookingStep, label: "Payment" },
];

export function BookingProgress({ currentStep }: { currentStep: BookingStep }) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, i) => {
        const done = currentStep > step.n;
        const active = currentStep === step.n;
        return (
          <div key={step.n} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  done
                    ? "bg-green-500 text-white"
                    : active
                    ? "bg-primary-600 text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                {done ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.n
                )}
              </div>
              <span className={`text-xs mt-1.5 font-medium whitespace-nowrap ${active ? "text-primary-700" : "text-slate-500"}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 ${done ? "bg-green-400" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
