"use client";

import { useBooking } from "../BookingContext";
import type { Holiday } from "@/types/holiday";
import { formatDate } from "@/lib/utils";

export function StepRoomDates({ holiday }: { holiday: Holiday }) {
  const { state, dispatch } = useBooking();

  const selectedRoom = holiday.rooms.find((r) => r.id === state.selectedRoomId) ?? holiday.rooms[0];
  const selectedDep =
    holiday.departures.find((d) => d.airportCode === state.selectedAirportCode) ??
    holiday.departures[0];

  function canContinue() {
    return state.selectedDate !== null;
  }

  function handleContinue() {
    if (!state.selectedRoomId) dispatch({ type: "SET_ROOM", roomId: holiday.rooms[0].id });
    if (!state.selectedAirportCode) {
      dispatch({ type: "SET_AIRPORT", airportCode: holiday.departures[0].airportCode });
    }
    dispatch({ type: "SET_STEP", step: 2 });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Choose your room & dates</h2>

      {/* Room selection */}
      <div>
        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3 block">
          Room Type
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          {holiday.rooms.map((room) => (
            <button
              key={room.id}
              type="button"
              onClick={() => dispatch({ type: "SET_ROOM", roomId: room.id })}
              className={`text-left p-4 rounded-xl border-2 transition-colors ${
                (state.selectedRoomId ?? holiday.rooms[0].id) === room.id
                  ? "border-primary-500 bg-primary-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="font-semibold text-slate-900 text-sm">{room.name}</div>
              <div className="text-xs text-slate-500 mt-0.5 capitalize mb-2">
                {room.boardBasis.replace(/-/g, " ")} · Up to {room.maxOccupancy} guests
              </div>
              <div className="text-sm font-bold text-slate-900">
                £{room.pricePerPersonPerNight}{" "}
                <span className="text-slate-500 font-normal text-xs">pp/night</span>
              </div>
            </button>
          ))}
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

      {/* Dates */}
      <div>
        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2 block">
          Departure Date
        </label>
        <div className="flex flex-wrap gap-2">
          {selectedDep.availableDates.map((date) => (
            <button
              key={date}
              type="button"
              onClick={() => dispatch({ type: "SET_DATE", date })}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                state.selectedDate === date
                  ? "bg-primary-600 text-white border-primary-600"
                  : "border-slate-200 text-slate-700 hover:border-primary-400 hover:text-primary-700"
              }`}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
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
          Continue to Extras →
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
