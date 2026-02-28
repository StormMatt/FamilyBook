"use client";

import { useEffect, useState } from "react";
import { useBooking } from "../BookingContext";
import { getAllExtras } from "@/lib/extras";
import type { Extra } from "@/types/extras";
import { formatPrice } from "@/lib/utils";

export function StepExtras({ holidayType }: { holidayType: string }) {
  const { state, dispatch } = useBooking();
  const [extras, setExtras] = useState<Extra[]>([]);
  const totalGuests = state.adultCount + state.childCount;

  useEffect(() => {
    getAllExtras().then((all) =>
      setExtras(all.filter((e) => e.compatibleTypes.includes(holidayType) || e.compatibleTypes.includes("*")))
    );
  }, [holidayType]);

  function isSelected(extraId: string) {
    return state.selectedExtras.some((e) => e.extraId === extraId);
  }

  function toggle(extra: Extra) {
    if (isSelected(extra.id)) {
      dispatch({ type: "REMOVE_EXTRA", extraId: extra.id });
    } else {
      const qty = extra.priceType === "per-person" ? totalGuests : 1;
      dispatch({
        type: "ADD_EXTRA",
        extra: { extraId: extra.id, quantity: qty, totalPrice: extra.pricePerPerson * qty },
      });
    }
  }

  function extrasTotal() {
    return state.selectedExtras.reduce((sum, e) => sum + e.totalPrice, 0);
  }

  const categoryLabels: Record<string, string> = {
    insurance: "Protection",
    transfer: "Transfers",
    sport: "Activities",
    upgrade: "Upgrades",
    dining: "Dining",
  };

  const grouped = extras.reduce<Record<string, Extra[]>>((acc, e) => {
    acc[e.category] = [...(acc[e.category] ?? []), e];
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Extras & Add-ons</h2>
        <p className="text-sm text-slate-500 mt-1">
          Enhance your holiday with our hand-picked extras. All prices shown per person unless stated.
        </p>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            {categoryLabels[category] ?? category}
          </h3>
          <div className="space-y-3">
            {items.map((extra) => {
              const selected = isSelected(extra.id);
              const qty = extra.priceType === "per-person" ? totalGuests : 1;
              const lineTotal = extra.pricePerPerson * qty;

              return (
                <div
                  key={extra.id}
                  onClick={() => toggle(extra)}
                  className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selected
                      ? "border-primary-500 bg-primary-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  {/* Recommended badge */}
                  {extra.isRecommended && !selected && (
                    <span className="absolute top-3 right-3 text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                  {selected && (
                    <span className="absolute top-3 right-3 text-xs bg-primary-600 text-white font-semibold px-2 py-0.5 rounded-full">
                      Added ✓
                    </span>
                  )}

                  {/* Icon */}
                  <div className="text-2xl shrink-0">{extra.icon}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-16">
                    <div className="font-semibold text-slate-900 text-sm">{extra.name}</div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{extra.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    {extra.pricePerPerson === 0 ? (
                      <div className="text-sm font-bold text-green-700">Free</div>
                    ) : (
                      <>
                        <div className="text-sm font-bold text-slate-900">{formatPrice(lineTotal)}</div>
                        <div className="text-xs text-slate-500">
                          {extra.priceType === "per-person"
                            ? `${formatPrice(extra.pricePerPerson)} × ${qty}`
                            : "per booking"}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Extras total */}
      {state.selectedExtras.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl px-4 py-3 flex justify-between items-center">
          <span className="text-sm font-semibold text-primary-800">
            {state.selectedExtras.length} extra{state.selectedExtras.length !== 1 ? "s" : ""} added
          </span>
          <span className="font-bold text-primary-900">{formatPrice(extrasTotal())} extra</span>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_STEP", step: 1 })}
          className="border border-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => {
            const total = state.adultCount + state.childCount;
            for (let i = 0; i < total; i++) {
              dispatch({ type: "UPDATE_GUEST", index: i, guest: { isLeadGuest: i === 0 } });
            }
            dispatch({ type: "SET_STEP", step: 3 });
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Continue to Guest Details →
        </button>
      </div>

      {state.selectedExtras.length === 0 && (
        <p className="text-xs text-slate-500 text-center">
          No extras added — you can always add them after booking.
        </p>
      )}
    </div>
  );
}
