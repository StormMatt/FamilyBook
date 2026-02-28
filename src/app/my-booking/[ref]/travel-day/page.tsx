"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import type { SavedBooking } from "@/types/booking";
import { formatDate } from "@/lib/utils";

const FLIGHT_TIPS = [
  "Arrive at the airport at least 2.5 hours before departure",
  "Check in online 24–48 hours before to save time",
  "Keep travel documents & boarding passes easily accessible",
  "Liquids must be under 100ml and in a clear resealable bag",
  "Fully charge your phone before you leave home",
  "Pack a change of clothes and essentials in your carry-on",
];

const TRANSFER_INFO = [
  "Your transfer driver will be waiting in the arrivals hall with a name board",
  "Allow 30–45 minutes for baggage reclaim before meeting your driver",
  "Transfer duration is typically 30–90 minutes depending on the resort",
  "Your hotel check-in time is usually 3:00 PM — early arrivals can store luggage",
];

const HOTEL_ARRIVAL = [
  "Present your booking voucher and photo ID at reception",
  "Your welcome pack includes resort maps, ski pass info, and dining options",
  "Ask the concierge about local taxi numbers and restaurant recommendations",
  "Report any issues with your room within 24 hours of arrival",
];

function addNights(dateStr: string, nights: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + nights);
  return d.toISOString().split("T")[0];
}

function getFlightDuration(destination: string): string {
  const lower = destination.toLowerCase();
  if (lower.includes("france") || lower.includes("spain") || lower.includes("portugal")) return "2h 15m – 2h 30m";
  if (lower.includes("greece") || lower.includes("turkey") || lower.includes("croatia")) return "3h 30m – 4h 00m";
  if (lower.includes("italy")) return "2h 30m – 3h 00m";
  if (lower.includes("czech") || lower.includes("netherlands") || lower.includes("switzerland") || lower.includes("austria")) return "2h 00m – 2h 30m";
  return "2h 30m – 3h 30m";
}

export default function TravelDayPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = use(params);
  const [booking, setBooking] = useState<SavedBooking | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`booking_${ref}`);
      if (raw) setBooking(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, [ref]);

  if (!loaded) return null;

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-center px-4">
        <div>
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Booking not found</h2>
          <Link href="/" className="text-primary-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  const returnDate = booking.selectedDate ? addNights(booking.selectedDate, booking.durationNights) : null;
  const flightDuration = getFlightDuration(booking.destination);

  // Generate a realistic departure time based on booking reference hash
  const hash = ref.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hour = 6 + (hash % 12);
  const min = (hash % 4) * 15;
  const departureTime = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  const arrivalHour = hour + 2 + Math.floor((hash % 120) / 60);
  const arrivalMin = min;
  const arrivalTime = `${String(arrivalHour % 24).padStart(2, "0")}:${String(arrivalMin).padStart(2, "0")}`;
  const checkInTime = `${String((arrivalHour + 2) % 24).padStart(2, "0")}:00`;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4">

        {/* Breadcrumb */}
        <div className="text-sm text-slate-500 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href={`/my-booking/${ref}`} className="hover:text-primary-600">My Booking</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Travel Day Info</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-1">Travel Day Info</h1>
        <p className="text-slate-500 mb-8">
          {booking.holidayName} · {booking.destination}
        </p>

        {/* Journey timeline */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800">✈️ Your Journey</h2>
            {booking.selectedDate && (
              <p className="text-sm text-slate-500 mt-0.5">Outbound: {formatDate(booking.selectedDate)}</p>
            )}
          </div>
          <div className="p-6">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />

              {[
                {
                  icon: "🏠",
                  time: `Leave home by ${String(Math.max(hour - 3, 4)).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
                  title: "Leave for airport",
                  desc: `Allow plenty of time — aim to arrive at the airport by ${String(hour - 2).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
                },
                {
                  icon: "🛫",
                  time: `${departureTime} departure`,
                  title: `Flight departs from ${booking.selectedAirportCode}`,
                  desc: `${flightDuration} flight to ${booking.destination}`,
                },
                {
                  icon: "🛬",
                  time: `~${arrivalTime} local time`,
                  title: "Arrive at destination airport",
                  desc: "Collect your baggage and proceed to the arrivals hall for your transfer",
                },
                {
                  icon: "🚌",
                  time: `~${String((arrivalHour + 1) % 24).padStart(2, "0")}:${String(arrivalMin).padStart(2, "0")}`,
                  title: "Transfer to hotel",
                  desc: "Your private transfer will take you directly to your hotel (30–90 min)",
                },
                {
                  icon: "🏨",
                  time: `Check-in from ${checkInTime}`,
                  title: `Arrive at ${booking.hotelName ?? "your hotel"}`,
                  desc: `Standard check-in time is ${checkInTime}. Early luggage storage is available on request.`,
                },
              ].map((item, i) => (
                <div key={i} className="relative flex items-start gap-5 mb-6 last:mb-0">
                  <div className="relative z-10 w-8 h-8 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center text-sm shrink-0">
                    {item.icon}
                  </div>
                  <div className="pb-1">
                    <div className="text-xs font-bold text-primary-700 mb-0.5">{item.time}</div>
                    <div className="font-semibold text-slate-900 text-sm">{item.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Return journey */}
        {returnDate && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-800">🛬 Return Journey</h2>
              <p className="text-sm text-slate-500 mt-0.5">Return: {formatDate(returnDate)}</p>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-lg">⏰</span>
                <div>
                  <div className="font-semibold text-slate-900">Check-out time</div>
                  <div className="text-slate-500">Standard checkout is 11:00. Late checkout may be available on request (charge may apply).</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🚌</span>
                <div>
                  <div className="font-semibold text-slate-900">Return transfer</div>
                  <div className="text-slate-500">Your transfer time will be confirmed in your travel documents, typically 3–4 hours before departure.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🛫</span>
                <div>
                  <div className="font-semibold text-slate-900">Flight home</div>
                  <div className="text-slate-500">Exact return flight times will be in your e-ticket. Check the airline website for real-time updates.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Flight tips */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800">✅ Airport Tips</h2>
          </div>
          <div className="p-5 space-y-3">
            {FLIGHT_TIPS.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span className="text-slate-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transfer & hotel arrival */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-800 text-sm">🚌 Transfer Info</h2>
            </div>
            <div className="p-5 space-y-2">
              {TRANSFER_INFO.map((t, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="text-primary-500 mt-0.5 shrink-0">•</span>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-800 text-sm">🏨 Hotel Arrival</h2>
            </div>
            <div className="p-5 space-y-2">
              {HOTEL_ARRIVAL.map((t, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="text-primary-500 mt-0.5 shrink-0">•</span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency contacts */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
          <h2 className="font-bold text-amber-900 mb-3">📞 Emergency & Useful Numbers</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              { label: "Sunway 24/7 Emergency", value: "+44 800 123 4567" },
              { label: "Worldwide emergency", value: "112" },
              { label: "UK Foreign Office", value: "+44 20 7008 5000" },
              { label: "NHS advice (UK)", value: "111" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-amber-600 text-xs font-semibold w-40 shrink-0">{item.label}</span>
                <span className="font-mono font-bold text-amber-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href={`/my-booking/${ref}/pre-departure`}
            className="text-sm border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:border-primary-400 hover:text-primary-700 transition-colors"
          >
            ← Pre-Departure Guide
          </Link>
          <Link
            href={`/my-booking/${ref}`}
            className="text-sm bg-primary-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            📁 Manage Booking
          </Link>
        </div>
      </div>
    </div>
  );
}
