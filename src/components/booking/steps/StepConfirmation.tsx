"use client";

import Link from "next/link";
import { useBooking } from "../BookingContext";
import { formatDate } from "@/lib/utils";
import type { Holiday } from "@/types/holiday";

export function StepConfirmation({ holiday }: { holiday: Holiday }) {
  const { state } = useBooking();

  return (
    <div className="text-center py-4">
      {/* Success icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>

      <h2 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
      <p className="text-slate-500 mb-6 max-w-sm mx-auto">
        Your holiday is booked. A confirmation email has been sent to{" "}
        <strong>{state.contactInfo.email ?? "your email"}</strong>.
      </p>

      {/* Reference */}
      <div className="bg-primary-50 border border-primary-200 rounded-2xl p-5 mb-6 inline-block min-w-64">
        <div className="text-xs text-primary-600 font-semibold uppercase tracking-wider mb-1">
          Booking Reference
        </div>
        <div className="text-3xl font-bold font-mono text-primary-900 tracking-widest">
          {state.bookingReference}
        </div>
        <div className="text-xs text-primary-600 mt-1">Please keep this safe</div>
      </div>

      {/* Summary */}
      <div className="bg-slate-50 rounded-2xl p-5 text-left mb-6 max-w-sm mx-auto">
        <h3 className="font-bold text-slate-900 mb-3">Booking Summary</h3>
        <div className="space-y-2 text-sm text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">Holiday</span>
            <span className="font-medium text-right max-w-44">{holiday.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Destination</span>
            <span className="font-medium">{holiday.destination.resort}</span>
          </div>
          {state.selectedDate && (
            <div className="flex justify-between">
              <span className="text-slate-500">Departure</span>
              <span className="font-medium">{formatDate(state.selectedDate)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500">Guests</span>
            <span className="font-medium">
              {state.adultCount} adult{state.adultCount !== 1 ? "s" : ""}
              {state.childCount > 0 ? `, ${state.childCount} child${state.childCount !== 1 ? "ren" : ""}` : ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Duration</span>
            <span className="font-medium">{holiday.durationNights} nights</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/holidays"
          className="border border-slate-200 text-slate-700 font-semibold px-8 py-3 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Browse More Holidays
        </Link>
      </div>
    </div>
  );
}
