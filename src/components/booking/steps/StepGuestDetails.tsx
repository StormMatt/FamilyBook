"use client";

import { useBooking } from "../BookingContext";

const TITLES = ["Mr", "Mrs", "Ms", "Dr"] as const;
const NATIONALITIES = ["British", "Irish", "American", "Australian", "Canadian", "French", "German", "Dutch", "Other"];

export function StepGuestDetails() {
  const { state, dispatch } = useBooking();
  const total = state.adultCount + state.childCount;

  function update(index: number, key: string, value: string) {
    dispatch({ type: "UPDATE_GUEST", index, guest: { [key]: value } as never });
  }

  function updateContact(key: string, value: string) {
    dispatch({ type: "SET_CONTACT", contact: { [key]: value } as never });
  }

  function canContinue() {
    const lead = state.guests[0];
    return (
      lead?.firstName && lead?.lastName && lead?.dateOfBirth &&
      state.contactInfo.email && state.contactInfo.phone
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Guest Details</h2>

      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="border border-slate-200 rounded-2xl p-5">
          <h3 className="font-semibold text-slate-800 mb-4">
            {i === 0 ? "🧳 Lead Guest" : `Guest ${i + 1}`}{" "}
            <span className="text-xs font-normal text-slate-500">
              {i < state.adultCount ? "(Adult)" : "(Child)"}
            </span>
          </h3>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">Title</label>
              <select
                value={state.guests[i]?.title ?? ""}
                onChange={(e) => update(i, "title", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
              >
                <option value="">Select</option>
                {TITLES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">First Name</label>
              <input
                type="text"
                value={state.guests[i]?.firstName ?? ""}
                onChange={(e) => update(i, "firstName", e.target.value)}
                placeholder="Jane"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">Last Name</label>
              <input
                type="text"
                value={state.guests[i]?.lastName ?? ""}
                onChange={(e) => update(i, "lastName", e.target.value)}
                placeholder="Smith"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">Date of Birth</label>
              <input
                type="date"
                value={state.guests[i]?.dateOfBirth ?? ""}
                onChange={(e) => update(i, "dateOfBirth", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">Nationality</label>
              <select
                value={state.guests[i]?.nationality ?? ""}
                onChange={(e) => update(i, "nationality", e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
              >
                <option value="">Select</option>
                {NATIONALITIES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">Passport Number</label>
            <input
              type="text"
              value={state.guests[i]?.passportNumber ?? ""}
              onChange={(e) => update(i, "passportNumber", e.target.value)}
              placeholder="123456789"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      ))}

      {/* Contact Info */}
      <div className="border border-slate-200 rounded-2xl p-5">
        <h3 className="font-semibold text-slate-800 mb-4">📧 Contact Information</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">Email Address *</label>
            <input
              type="email"
              value={state.contactInfo.email ?? ""}
              onChange={(e) => updateContact("email", e.target.value)}
              placeholder="jane@example.com"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">Phone Number *</label>
            <input
              type="tel"
              value={state.contactInfo.phone ?? ""}
              onChange={(e) => updateContact("phone", e.target.value)}
              placeholder="+44 7700 900000"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      </div>

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
          onClick={() => dispatch({ type: "SET_STEP", step: 4 })}
          disabled={!canContinue()}
          className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Review Order →
        </button>
      </div>
    </div>
  );
}
