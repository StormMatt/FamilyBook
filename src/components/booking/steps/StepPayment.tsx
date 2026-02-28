"use client";

import { useBooking } from "../BookingContext";
import { generateBookingRef } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

export function StepPayment() {
  const { state, dispatch } = useBooking();

  function updatePayment(key: string, value: string) {
    dispatch({ type: "SET_PAYMENT", payment: { [key]: value } as never });
  }

  function canContinue() {
    const p = state.paymentInfo;
    return p.cardholderName && p.cardNumber && p.expiryMonth && p.expiryYear && p.cvv && state.agreedToTerms;
  }

  function handleConfirm() {
    const ref = generateBookingRef();
    dispatch({ type: "CONFIRM_BOOKING", reference: ref });
  }

  function formatCard(value: string) {
    return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Payment</h2>

      {/* Order summary */}
      {state.totalPrice > 0 && (
        <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center">
          <span className="text-slate-700 font-medium">Total amount due</span>
          <span className="text-2xl font-bold text-slate-900">{formatPrice(state.totalPrice)}</span>
        </div>
      )}

      {/* Card details */}
      <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-slate-800">💳 Card Details</h3>
          <div className="flex gap-1 ml-auto">
            {["VISA", "MC", "AMEX"].map((c) => (
              <span key={c} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">Cardholder Name</label>
          <input
            type="text"
            value={state.paymentInfo.cardholderName ?? ""}
            onChange={(e) => updatePayment("cardholderName", e.target.value)}
            placeholder="Jane Smith"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">Card Number</label>
          <input
            type="text"
            value={formatCard(state.paymentInfo.cardNumber ?? "")}
            onChange={(e) => updatePayment("cardNumber", e.target.value.replace(/\s/g, ""))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">Month</label>
            <select
              value={state.paymentInfo.expiryMonth ?? ""}
              onChange={(e) => updatePayment("expiryMonth", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            >
              <option value="">MM</option>
              {Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, "0");
                return <option key={m} value={m}>{m}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">Year</label>
            <select
              value={state.paymentInfo.expiryYear ?? ""}
              onChange={(e) => updatePayment("expiryYear", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            >
              <option value="">YYYY</option>
              {Array.from({ length: 10 }, (_, i) => {
                const y = String(new Date().getFullYear() + i);
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">CVV</label>
            <input
              type="password"
              value={state.paymentInfo.cvv ?? ""}
              onChange={(e) => updatePayment("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="•••"
              maxLength={4}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={state.agreedToTerms}
          onChange={(e) => dispatch({ type: "SET_AGREED_TO_TERMS", agreed: e.target.checked })}
          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600"
        />
        <span className="text-sm text-slate-600">
          I agree to the{" "}
          <a href="#" className="text-primary-600 underline">Terms & Conditions</a>{" "}
          and{" "}
          <a href="#" className="text-primary-600 underline">Booking Conditions</a>.
          I confirm all passenger details are correct.
        </span>
      </label>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_STEP", step: 2 })}
          className="border border-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!canContinue()}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          🔒 Confirm Booking
        </button>
      </div>
    </div>
  );
}
