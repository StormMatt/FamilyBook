"use client";

import { useEffect } from "react";
import { useBooking } from "../BookingContext";
import type { Holiday } from "@/types/holiday";
import { formatPrice, formatDate } from "@/lib/utils";

interface StepOrderSummaryProps {
  holiday: Holiday;
}

export function StepOrderSummary({ holiday }: StepOrderSummaryProps) {
  const { state, dispatch } = useBooking();

  const selectedRoom =
    holiday.rooms.find((r) => r.id === state.selectedRoomId) ?? holiday.rooms[0];
  const selectedDep =
    holiday.departures.find((d) => d.airportCode === state.selectedAirportCode) ??
    holiday.departures[0];

  const adultCount = state.adultCount;
  const childCount = state.childCount;
  const totalGuests = adultCount + childCount;

  const accommodationCost =
    selectedRoom.pricePerPersonPerNight * holiday.durationNights * totalGuests;
  const flightCost = selectedDep.priceAdultReturn * adultCount;
  const extrasCost = state.selectedExtras.reduce((sum, e) => sum + e.totalPrice, 0);
  const subtotal = accommodationCost + flightCost + extrasCost;
  const deposit =
    holiday.pricing.depositType === "percentage"
      ? Math.round(subtotal * (holiday.pricing.deposit / 100))
      : holiday.pricing.deposit;

  // Sync total price into state
  useEffect(() => {
    dispatch({ type: "SET_TOTAL_PRICE", price: subtotal });
  }, [subtotal, dispatch]);

  const departureDate = state.selectedDate;
  const returnDate = departureDate
    ? (() => {
        const d = new Date(departureDate);
        d.setDate(d.getDate() + holiday.durationNights);
        return d.toISOString().split("T")[0];
      })()
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Review Your Order</h2>
        <p className="text-sm text-slate-500 mt-1">
          Check everything looks correct before payment.
        </p>
      </div>

      {/* Holiday summary */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden">
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
          <h3 className="font-bold text-slate-800 text-sm">Your Holiday</h3>
        </div>
        <div className="p-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Holiday</span>
            <span className="font-semibold text-slate-900 text-right max-w-xs">{holiday.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Destination</span>
            <span className="font-medium">
              {holiday.destination.resort}, {holiday.destination.country}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Departure</span>
            <span className="font-medium">
              {departureDate ? formatDate(departureDate) : "—"} from {selectedDep.airport}
            </span>
          </div>
          {returnDate && (
            <div className="flex justify-between">
              <span className="text-slate-500">Return</span>
              <span className="font-medium">{formatDate(returnDate)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500">Duration</span>
            <span className="font-medium">{holiday.durationNights} nights</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Guests</span>
            <span className="font-medium">
              {adultCount} adult{adultCount !== 1 ? "s" : ""}
              {childCount > 0 ? `, ${childCount} child${childCount !== 1 ? "ren" : ""}` : ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Room</span>
            <span className="font-medium capitalize">
              {selectedRoom.name} · {selectedRoom.boardBasis.replace(/-/g, " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Lead guest */}
      {state.guests[0]?.firstName && (
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm">Lead Guest</h3>
          </div>
          <div className="p-5 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Name</span>
              <span className="font-medium">
                {state.guests[0].title} {state.guests[0].firstName} {state.guests[0].lastName}
              </span>
            </div>
            {state.contactInfo.email && (
              <div className="flex justify-between">
                <span className="text-slate-500">Email</span>
                <span className="font-medium">{state.contactInfo.email}</span>
              </div>
            )}
            {state.contactInfo.phone && (
              <div className="flex justify-between">
                <span className="text-slate-500">Phone</span>
                <span className="font-medium">{state.contactInfo.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Price breakdown */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden">
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
          <h3 className="font-bold text-slate-800 text-sm">Price Breakdown</h3>
        </div>
        <div className="p-5 space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">
              Accommodation ({totalGuests} guests × {holiday.durationNights} nights)
            </span>
            <span className="font-medium">{formatPrice(accommodationCost)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">
              Return flights ({adultCount} adult{adultCount !== 1 ? "s" : ""})
            </span>
            <span className="font-medium">{formatPrice(flightCost)}</span>
          </div>
          {state.selectedExtras.length > 0 && (
            <>
              <div className="border-t border-slate-100 pt-2 mt-1" />
              {state.selectedExtras.map((se) => (
                <div key={se.extraId} className="flex justify-between text-slate-500">
                  <span>Extra ({se.extraId})</span>
                  <span>{formatPrice(se.totalPrice)}</span>
                </div>
              ))}
            </>
          )}
          <div className="border-t border-slate-200 mt-2 pt-3">
            <div className="flex justify-between text-base font-bold text-slate-900">
              <span>Total Holiday Cost</span>
              <span className="text-xl">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500 mt-1">
              <span>Deposit due today</span>
              <span className="text-primary-700 font-semibold">{formatPrice(deposit)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-0.5">
              <span>Balance due 10 weeks before departure</span>
              <span>{formatPrice(subtotal - deposit)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation policy */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
        <div className="font-semibold text-amber-800 mb-1">📋 Cancellation Policy</div>
        <ul className="text-amber-700 space-y-1 text-xs">
          <li>• More than 70 days before departure: deposit only forfeited</li>
          <li>• 43–70 days before departure: 30% of total holiday cost</li>
          <li>• 29–42 days before departure: 50% of total holiday cost</li>
          <li>• Less than 29 days before departure: 100% of total holiday cost</li>
        </ul>
      </div>

      {/* Trust signals */}
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
          onClick={() => dispatch({ type: "SET_STEP", step: 4 })}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Continue to Payment →
        </button>
      </div>
    </div>
  );
}
