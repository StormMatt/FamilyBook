"use client";

import { useBooking } from "../BookingContext";
import type { Holiday } from "@/types/holiday";
import { formatDate } from "@/lib/utils";

const FLEX_SURCHARGE = 29;

// Deterministic price offset per date so cheapest dates are visually clear
function datePriceMultiplier(date: string): number {
  let hash = 0;
  for (let i = 0; i < date.length; i++) hash = (hash * 31 + date.charCodeAt(i)) & 0xffff;
  // 0 = cheapest, 1 = mid, 2 = peak
  return hash % 3;
}

export function StepRoomDates({ holiday }: { holiday: Holiday }) {
  const { state, dispatch } = useBooking();

  const selectedRoom = holiday.rooms.find((r) => r.id === state.selectedRoomId) ?? holiday.rooms[0];
  const selectedDep =
    holiday.departures.find((d) => d.airportCode === state.selectedAirportCode) ??
    holiday.departures[0];

  const flexSurcharge = state.flightFlexibility === "flexible" ? FLEX_SURCHARGE : 0;

  function canContinue() {
    return state.selectedDate !== null;
  }

  function handleContinue() {
    if (!state.selectedRoomId) dispatch({ type: "SET_ROOM", roomId: holiday.rooms[0].id });
    if (!state.selectedAirportCode) {
      dispatch({ type: "SET_AIRPORT", airportCode: holiday.departures[0].airportCode });
    }
    // Initialise guest slots before step 2 (guest details)
    const total = state.adultCount + state.childCount;
    for (let i = 0; i < total; i++) {
      dispatch({ type: "UPDATE_GUEST", index: i, guest: { isLeadGuest: i === 0 } });
    }
    dispatch({ type: "SET_STEP", step: 2 });
  }

  const priceLabels: Record<number, { label: string; bg: string; text: string }> = {
    0: { label: "Best price", bg: "bg-green-50 border-green-300", text: "text-green-700" },
    1: { label: "", bg: "border-slate-200", text: "text-slate-700" },
    2: { label: "Peak", bg: "bg-amber-50 border-amber-300", text: "text-amber-700" },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Choose your room & dates</h2>

      {/* Room selection */}
      <div>
        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3 block">
          Room Type
        </label>
        <div className="space-y-3">
          {holiday.rooms.map((room, idx) => {
            const isSelected = (state.selectedRoomId ?? holiday.rooms[0].id) === room.id;
            const isCheapest = room.pricePerPersonPerNight === Math.min(...holiday.rooms.map((r) => r.pricePerPersonPerNight));
            const isMostPop = idx === 0;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => dispatch({ type: "SET_ROOM", roomId: room.id })}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-primary-500 bg-primary-50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 text-sm">{room.name}</span>
                      {isMostPop && (
                        <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-2 py-0.5 rounded-full">
                          Most Popular
                        </span>
                      )}
                      {isCheapest && !isMostPop && (
                        <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                          Best Value
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 capitalize">
                      {room.boardBasis.replace(/-/g, " ")} · Up to {room.maxOccupancy} guests
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {room.amenities.slice(0, 4).map((a) => (
                        <span key={a} className="text-xs bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded-full border border-slate-100">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-bold text-slate-900">£{room.pricePerPersonPerNight}</div>
                    <div className="text-xs text-slate-400">pp/night</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Flight flexibility */}
      <div>
        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2 block">
          Flight Ticket Type
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: "SET_FLIGHT_FLEXIBILITY", flexibility: "standard" })}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              state.flightFlexibility === "standard"
                ? "border-primary-500 bg-primary-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="font-semibold text-slate-900 text-sm">Standard</div>
            <div className="text-xs text-slate-500 mt-0.5">Non-changeable · Non-refundable</div>
            <div className="text-sm font-bold text-slate-900 mt-2">Included in price</div>
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "SET_FLIGHT_FLEXIBILITY", flexibility: "flexible" })}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              state.flightFlexibility === "flexible"
                ? "border-primary-500 bg-primary-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-sm">Flexible</span>
              <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-1.5 py-0.5 rounded-full">
                Recommended
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Change date once free · Partial refund</div>
            <div className="text-sm font-bold text-primary-700 mt-2">+£{FLEX_SURCHARGE}pp</div>
          </button>
        </div>
      </div>

      {/* Airport */}
      <div>
        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2 block">
          Departure Airport
        </label>
        <select
          value={state.selectedAirportCode ?? holiday.departures[0].airportCode}
          onChange={(e) => dispatch({ type: "SET_AIRPORT", airportCode: e.target.value })}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
        >
          {holiday.departures.map((d) => (
            <option key={d.airportCode} value={d.airportCode}>
              {d.airport} — return flight £{d.priceAdultReturn}pp
            </option>
          ))}
        </select>
      </div>

      {/* Date calendar */}
      <div>
        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2 block">
          Departure Date
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Green = best price · Amber = peak pricing
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {selectedDep.availableDates.map((date) => {
            const mul = datePriceMultiplier(date);
            const style = priceLabels[mul];
            const isSelected = state.selectedDate === date;
            return (
              <button
                key={date}
                type="button"
                onClick={() => dispatch({ type: "SET_DATE", date })}
                className={`relative text-xs px-2 py-2.5 rounded-xl border transition-all text-center ${
                  isSelected
                    ? "bg-primary-600 text-white border-primary-600 shadow-md"
                    : `${style.bg} ${style.text} hover:border-primary-400`
                }`}
              >
                <div className="font-semibold">{formatDate(date)}</div>
                {!isSelected && mul === 0 && (
                  <div className="text-green-600 text-[10px] leading-tight mt-0.5">Best price</div>
                )}
                {!isSelected && mul === 2 && (
                  <div className="text-amber-600 text-[10px] leading-tight mt-0.5">Peak</div>
                )}
                {isSelected && (
                  <div className="text-primary-100 text-[10px] leading-tight mt-0.5">Selected</div>
                )}
              </button>
            );
          })}
        </div>
        {flexSurcharge > 0 && state.selectedDate && (
          <p className="text-xs text-primary-700 bg-primary-50 border border-primary-200 rounded-lg px-3 py-2 mt-3">
            Flexible ticket selected — +£{flexSurcharge}pp added to your total.
          </p>
        )}
      </div>

      {/* Guest count */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2 block">
            Adults (16+)
          </label>
          <select
            value={state.adultCount}
            onChange={(e) => dispatch({ type: "SET_ADULT_COUNT", count: Number(e.target.value) })}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} adult{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2 block">
            Children (2–15)
          </label>
          <select
            value={state.childCount}
            onChange={(e) => dispatch({ type: "SET_CHILD_COUNT", count: Number(e.target.value) })}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
          >
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n === 0 ? "No children" : `${n} child${n > 1 ? "ren" : ""}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue()}
          className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Continue to Guest Details →
        </button>
      </div>

      {!canContinue() && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Please select a departure date to continue.
        </p>
      )}
    </div>
  );
}
