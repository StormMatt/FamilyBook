"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import type { SavedBooking } from "@/types/booking";
import { formatPrice, formatDate } from "@/lib/utils";

function addNights(dateStr: string, nights: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + nights);
  return d.toISOString().split("T")[0];
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dep = new Date(dateStr);
  return Math.ceil((dep.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ManageBookingPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = use(params);
  const [booking, setBooking] = useState<SavedBooking | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`booking_${ref}`);
      if (raw) setBooking(JSON.parse(raw));
      const isCancelled = localStorage.getItem(`booking_${ref}_cancelled`);
      if (isCancelled) setCancelled(true);
    } catch {
      // ignore
    }
    setLoaded(true);
  }, [ref]);

  function handleCancel() {
    try {
      localStorage.setItem(`booking_${ref}_cancelled`, "true");
    } catch {
      // ignore
    }
    setCancelled(true);
    setShowCancelConfirm(false);
  }

  if (!loaded) return null;

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-center px-4">
        <div>
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking not found</h1>
          <p className="text-slate-500 mb-2">
            Booking reference: <span className="font-mono font-bold">{ref}</span>
          </p>
          <p className="text-sm text-slate-400 mb-6">
            This may have expired or be on a different browser.
          </p>
          <Link href="/" className="bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const returnDate = booking.selectedDate ? addNights(booking.selectedDate, booking.durationNights) : null;
  const days = booking.selectedDate ? daysUntil(booking.selectedDate) : null;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4">

        {/* Breadcrumb */}
        <div className="text-sm text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">My Booking · {ref}</span>
        </div>

        {/* Status banner */}
        {cancelled ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">❌</span>
            <div>
              <div className="font-bold text-red-800">Booking Cancelled</div>
              <div className="text-sm text-red-600">This booking has been cancelled. Refund processed within 10 working days.</div>
            </div>
          </div>
        ) : days !== null && days > 0 ? (
          <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">✈️</span>
            <div>
              <div className="font-bold text-primary-900">
                {days === 1 ? "You depart tomorrow!" : `${days} days until departure`}
              </div>
              <div className="text-sm text-primary-700">
                {booking.destination} · {booking.selectedDate ? formatDate(booking.selectedDate) : ""}
              </div>
            </div>
          </div>
        ) : days !== null && days <= 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">🏖️</span>
            <div>
              <div className="font-bold text-green-800">Enjoy your holiday!</div>
              <div className="text-sm text-green-700">You should currently be on your way or in {booking.destination}.</div>
            </div>
          </div>
        ) : null}

        <h1 className="text-2xl font-bold text-slate-900 mb-6">Manage My Booking</h1>

        {/* Quick nav */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: "📋", label: "Details", href: "#details" },
            { icon: "🗺️", label: "Pre-Departure", href: `/my-booking/${ref}/pre-departure` },
            { icon: "✈️", label: "Travel Day", href: `/my-booking/${ref}/travel-day` },
            { icon: "📞", label: "Get Help", href: "#help" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1.5 bg-white border border-slate-200 rounded-xl py-4 text-sm font-medium text-slate-700 hover:border-primary-400 hover:text-primary-700 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Booking details */}
        <div id="details" className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Booking Details</h2>
            <span className="text-xs text-slate-500 font-mono">{ref}</span>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Holiday</span>
              <span className="font-semibold text-slate-900 text-right max-w-xs">{booking.holidayName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Destination</span>
              <span className="font-medium">{booking.destination}</span>
            </div>
            {booking.hotelName && (
              <div className="flex justify-between">
                <span className="text-slate-500">Hotel</span>
                <span className="font-medium">{booking.hotelName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Departure date</span>
              <span className="font-medium">
                {booking.selectedDate ? formatDate(booking.selectedDate) : "—"}
              </span>
            </div>
            {returnDate && (
              <div className="flex justify-between">
                <span className="text-slate-500">Return date</span>
                <span className="font-medium">{formatDate(returnDate)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Duration</span>
              <span className="font-medium">{booking.durationNights} nights</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Guests</span>
              <span className="font-medium">
                {booking.adultCount} adult{booking.adultCount !== 1 ? "s" : ""}
                {booking.childCount > 0 ? `, ${booking.childCount} child${booking.childCount !== 1 ? "ren" : ""}` : ""}
              </span>
            </div>
            {booking.selectedExtras.length > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500">Extras</span>
                <span className="font-medium">{booking.selectedExtras.length} add-on{booking.selectedExtras.length !== 1 ? "s" : ""} included</span>
              </div>
            )}
            <div className="border-t border-slate-100 pt-3">
              <div className="flex justify-between text-base font-bold text-slate-900">
                <span>Total Paid</span>
                <span>{formatPrice(booking.totalPrice)}</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Booked on {new Date(booking.bookedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
          </div>
        </div>

        {/* Guests */}
        {booking.guests.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-800">Passengers</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {booking.guests.filter(g => g.firstName).map((guest, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium text-slate-900">
                      {guest.title} {guest.firstName} {guest.lastName}
                      {guest.isLeadGuest && (
                        <span className="ml-2 text-xs bg-primary-100 text-primary-700 font-semibold px-1.5 py-0.5 rounded">Lead</span>
                      )}
                    </div>
                    <div className="text-slate-500 text-xs">
                      {i < booking.adultCount ? "Adult" : "Child"}
                      {guest.nationality ? ` · ${guest.nationality}` : ""}
                    </div>
                  </div>
                  {guest.passportNumber && (
                    <div className="text-xs text-slate-400 font-mono">
                      Passport: {guest.passportNumber}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {!cancelled && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-800">Manage</h2>
            </div>
            <div className="p-6 space-y-3">
              <button
                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-primary-400 hover:bg-primary-50 transition-colors text-sm text-left"
                onClick={() => alert("Amendment requests are processed within 24 hours. Our team will contact you.")}
              >
                <div>
                  <div className="font-semibold text-slate-900">✏️ Amend Your Booking</div>
                  <div className="text-slate-500 text-xs mt-0.5">Change dates, room type, or add extras</div>
                </div>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-primary-400 hover:bg-primary-50 transition-colors text-sm text-left"
                onClick={() => alert("Travel insurance can be added up to 14 days before departure. Call 0800 123 4567.")}
              >
                <div>
                  <div className="font-semibold text-slate-900">🛡️ Add Travel Insurance</div>
                  <div className="text-slate-500 text-xs mt-0.5">Comprehensive cover from £42 per person</div>
                </div>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                className="w-full flex items-center justify-between p-4 rounded-xl border border-red-100 hover:border-red-300 hover:bg-red-50 transition-colors text-sm text-left"
                onClick={() => setShowCancelConfirm(true)}
              >
                <div>
                  <div className="font-semibold text-red-700">✕ Cancel Booking</div>
                  <div className="text-red-400 text-xs mt-0.5">Cancellation charges may apply</div>
                </div>
                <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Help */}
        <div id="help" className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800">Need Help?</h2>
          </div>
          <div className="p-6 grid sm:grid-cols-3 gap-4 text-center text-sm">
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl mb-2">📞</div>
              <div className="font-semibold text-slate-900">Phone</div>
              <div className="text-slate-500 text-xs mt-1">0800 123 4567</div>
              <div className="text-slate-400 text-xs">Mon–Fri 9am–8pm</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl mb-2">💬</div>
              <div className="font-semibold text-slate-900">Live Chat</div>
              <div className="text-slate-500 text-xs mt-1">Available 24/7</div>
              <button className="mt-2 text-xs text-primary-600 font-semibold hover:underline">Start chat →</button>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl mb-2">📧</div>
              <div className="font-semibold text-slate-900">Email</div>
              <div className="text-slate-500 text-xs mt-1">help@sunway.com</div>
              <div className="text-slate-400 text-xs">Reply within 4h</div>
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href={`/booking/confirmed/${ref}`}
            className="text-sm text-slate-600 hover:text-primary-600 border border-slate-200 px-4 py-2 rounded-lg hover:border-primary-400 transition-colors"
          >
            📄 Booking Confirmation
          </Link>
          <Link
            href={`/my-booking/${ref}/pre-departure`}
            className="text-sm text-slate-600 hover:text-primary-600 border border-slate-200 px-4 py-2 rounded-lg hover:border-primary-400 transition-colors"
          >
            🗺️ Pre-Departure Guide
          </Link>
          <Link
            href={`/my-booking/${ref}/travel-day`}
            className="text-sm text-slate-600 hover:text-primary-600 border border-slate-200 px-4 py-2 rounded-lg hover:border-primary-400 transition-colors"
          >
            ✈️ Travel Day Info
          </Link>
        </div>
      </div>

      {/* Cancel confirmation modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Cancel Booking?</h3>
            <p className="text-sm text-slate-600 mb-4">
              Are you sure you want to cancel booking <strong>{ref}</strong>?
              Cancellation charges apply as per our booking conditions.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-800">
              ⚠️ This action cannot be undone. A refund will be processed within 10 working days based on the cancellation schedule.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
