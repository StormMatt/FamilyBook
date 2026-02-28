"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "../BookingContext";
import { generateBookingRef } from "@/lib/utils";
import { formatPrice, formatDate } from "@/lib/utils";
import type { SavedBooking } from "@/types/booking";
import type { Holiday } from "@/types/holiday";

const FLEX_SURCHARGE = 29;

export function StepPayment({ holiday, hotelName, hotelSlug }: {
  holiday: Holiday;
  hotelName?: string;
  hotelSlug?: string;
}) {
  const { state, dispatch } = useBooking();
  const router = useRouter();
  const [summaryOpen, setSummaryOpen] = useState(false);

  const selectedRoom = holiday.rooms.find((r) => r.id === state.selectedRoomId) ?? holiday.rooms[0];
  const selectedDep =
    holiday.departures.find((d) => d.airportCode === state.selectedAirportCode) ??
    holiday.departures[0];

  const adultCount = state.adultCount;
  const childCount = state.childCount;
  const totalGuests = adultCount + childCount;
  const flexCost = state.flightFlexibility === "flexible" ? FLEX_SURCHARGE * totalGuests : 0;

  const accommodationCost = selectedRoom.pricePerPersonPerNight * holiday.durationNights * totalGuests;
  const flightCost = selectedDep.priceAdultReturn * adultCount;
  const extrasCost = state.selectedExtras.reduce((sum, e) => sum + e.totalPrice, 0);
  const subtotal = accommodationCost + flightCost + flexCost + extrasCost;

  const deposit =
    holiday.pricing.depositType === "percentage"
      ? Math.round(subtotal * (holiday.pricing.deposit / 100))
      : holiday.pricing.deposit;
  const balance = subtotal - deposit;

  // Sync total price into context
  useEffect(() => {
    dispatch({ type: "SET_TOTAL_PRICE", price: subtotal });
  }, [subtotal, dispatch]);

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

    const saved: SavedBooking = {
      reference: ref,
      holidaySlug: state.holidaySlug,
      holidayName: holiday.name,
      destination: `${holiday.destination.resort}, ${holiday.destination.country}`,
      selectedDate: state.selectedDate ?? "",
      selectedAirportCode: state.selectedAirportCode ?? "",
      selectedRoomId: state.selectedRoomId ?? "",
      adultCount: state.adultCount,
      childCount: state.childCount,
      selectedExtras: state.selectedExtras,
      guests: state.guests,
      contactInfo: state.contactInfo,
      totalPrice: subtotal,
      bookedAt: new Date().toISOString(),
      durationNights: holiday.durationNights,
      hotelName,
      hotelSlug,
    };
    try {
      localStorage.setItem(`booking_${ref}`, JSON.stringify(saved));
    } catch {
      // localStorage not available in SSR — silently ignore
    }

    router.push(`/booking/confirmed/${ref}`);
  }

  function formatCard(value: string) {
    return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  const returnDate = state.selectedDate
    ? (() => {
        const d = new Date(state.selectedDate);
        d.setDate(d.getDate() + holiday.durationNights);
        return d.toISOString().split("T")[0];
      })()
    : null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Payment</h2>

      {/* Collapsible order summary */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setSummaryOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <span className="font-semibold text-slate-800 text-sm">Your order summary</span>
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
            <svg
              className={`w-4 h-4 text-slate-500 transition-transform ${summaryOpen ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        {summaryOpen && (
          <div className="p-5 space-y-2.5 text-sm border-t border-slate-200">
            {/* Holiday summary */}
            <div className="text-xs text-slate-500 pb-2 border-b border-slate-100 space-y-1">
              <div className="flex justify-between">
                <span>Destination</span>
                <span className="font-medium text-slate-700">{holiday.destination.resort}, {holiday.destination.country}</span>
              </div>
              <div className="flex justify-between">
                <span>Departure</span>
                <span className="font-medium text-slate-700">
                  {state.selectedDate ? formatDate(state.selectedDate) : "—"} from {selectedDep.airport}
                </span>
              </div>
              {returnDate && (
                <div className="flex justify-between">
                  <span>Return</span>
                  <span className="font-medium text-slate-700">{formatDate(returnDate)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Room</span>
                <span className="font-medium text-slate-700 capitalize">{selectedRoom.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Guests</span>
                <span className="font-medium text-slate-700">
                  {adultCount} adult{adultCount !== 1 ? "s" : ""}
                  {childCount > 0 ? `, ${childCount} child${childCount !== 1 ? "ren" : ""}` : ""}
                </span>
              </div>
            </div>
            {/* Price lines */}
            <div className="flex justify-between text-slate-600">
              <span>Accommodation ({totalGuests} × {holiday.durationNights} nights)</span>
              <span>{formatPrice(accommodationCost)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Return flights ({adultCount} adult{adultCount !== 1 ? "s" : ""})</span>
              <span>{formatPrice(flightCost)}</span>
            </div>
            {flexCost > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Flexible tickets ({totalGuests} × £{FLEX_SURCHARGE})</span>
                <span>{formatPrice(flexCost)}</span>
              </div>
            )}
            {state.selectedExtras.length > 0 && state.selectedExtras.map((se) => (
              <div key={se.extraId} className="flex justify-between text-slate-600">
                <span>Extra ({se.extraId})</span>
                <span>{formatPrice(se.totalPrice)}</span>
              </div>
            ))}
            <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
        )}
      </div>

      {/* What you pay today vs balance */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 text-center">
          <div className="text-xs text-primary-600 font-semibold uppercase tracking-wide mb-1">
            Charged today
          </div>
          <div className="text-3xl font-bold text-primary-700">{formatPrice(deposit)}</div>
          <div className="text-xs text-primary-500 mt-1">
            {holiday.pricing.depositType === "fixed" ? "Fixed deposit" : `${holiday.pricing.deposit}% deposit`}
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">
            Balance due later
          </div>
          <div className="text-3xl font-bold text-slate-700">{formatPrice(balance)}</div>
          <div className="text-xs text-slate-400 mt-1">Due 10 weeks before departure</div>
        </div>
      </div>

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
        <p className="text-xs text-slate-500 -mt-2">
          Only the deposit ({formatPrice(deposit)}) will be charged today.
        </p>

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

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-500">
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-xl mb-1">✈️</div>
          <div className="font-medium">ATOL Protected</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-xl mb-1">🛡️</div>
          <div className="font-medium">ABTA Member</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <div className="text-xl mb-1">🔒</div>
          <div className="font-medium">256-bit SSL</div>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_STEP", step: 3 })}
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
          🔒 Pay {formatPrice(deposit)} deposit now
        </button>
      </div>
    </div>
  );
}
