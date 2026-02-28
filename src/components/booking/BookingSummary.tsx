"use client";

import type { Holiday } from "@/types/holiday";
import Image from "next/image";
import { formatPrice, formatDate } from "@/lib/utils";
import { useBooking } from "./BookingContext";

export function BookingSummary({ holiday }: { holiday: Holiday }) {
  const { state } = useBooking();
  const img = holiday.images.find((i) => i.isPrimary) ?? holiday.images[0];

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
  const total = accommodationCost + flightCost + extrasCost;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden sticky top-24">
      {img && (
        <div className="relative h-36">
          <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="300px" />
        </div>
      )}
      <div className="p-4">
        <div className="text-xs text-slate-500 mb-0.5">
          {holiday.destination.resort}, {holiday.destination.country}
        </div>
        <h3 className="font-bold text-slate-900 text-sm leading-snug mb-3">{holiday.name}</h3>

        {state.selectedDate && (
          <div className="text-xs text-primary-700 font-medium bg-primary-50 rounded-lg px-2 py-1 mb-3">
            ✈️ {formatDate(state.selectedDate)} · {selectedDep.airport}
          </div>
        )}

        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Duration</span>
            <span className="font-medium text-slate-900">{holiday.durationNights} nights</span>
          </div>
          <div className="flex justify-between">
            <span>Room</span>
            <span className="font-medium text-slate-900 text-right max-w-32 truncate">{selectedRoom.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Guests</span>
            <span className="font-medium text-slate-900">
              {adultCount} adult{adultCount !== 1 ? "s" : ""}
              {childCount > 0 ? ` + ${childCount}` : ""}
            </span>
          </div>

          <div className="border-t border-slate-100 my-2 pt-2 space-y-1.5">
            <div className="flex justify-between">
              <span>Accommodation</span>
              <span className="font-medium text-slate-800">{formatPrice(accommodationCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Flights</span>
              <span className="font-medium text-slate-800">{formatPrice(flightCost)}</span>
            </div>
            {extrasCost > 0 && (
              <div className="flex justify-between text-primary-700">
                <span>Extras</span>
                <span className="font-semibold">+{formatPrice(extrasCost)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 pt-2">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-900">Total</span>
              <span className="font-bold text-slate-900 text-base">{formatPrice(total)}</span>
            </div>
            <div className="text-slate-400 text-xs mt-0.5">
              {formatPrice(Math.round(total / totalGuests))} per person
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
