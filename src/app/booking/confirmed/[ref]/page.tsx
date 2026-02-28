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

export default function BookingConfirmedPage({
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
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking not found</h1>
          <p className="text-slate-500 mb-6">
            We couldn&apos;t load booking <span className="font-mono font-bold">{ref}</span>.
            This may be because you&apos;re on a different device or browser.
          </p>
          <Link
            href="/"
            className="bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const returnDate = booking.selectedDate
    ? addNights(booking.selectedDate, booking.durationNights)
    : null;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4">

        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-500">
            A confirmation email has been sent to{" "}
            <strong>{booking.contactInfo.email ?? "your email address"}</strong>.
          </p>
        </div>

        {/* Reference card */}
        <div className="bg-primary-600 text-white rounded-2xl p-6 text-center mb-6 shadow-lg">
          <div className="text-xs text-primary-200 font-semibold uppercase tracking-widest mb-2">
            Booking Reference
          </div>
          <div className="text-4xl font-bold font-mono tracking-widest mb-2">{booking.reference}</div>
          <div className="text-primary-200 text-sm">Please save this reference</div>
        </div>

        {/* Itinerary */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800">Your Itinerary</h2>
          </div>
          <div className="p-6 space-y-4 text-sm">
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
              <span className="text-slate-500">Departure</span>
              <span className="font-medium">
                {booking.selectedDate ? formatDate(booking.selectedDate) : "—"}
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
                <span className="font-medium">{booking.selectedExtras.length} add-on{booking.selectedExtras.length !== 1 ? "s" : ""}</span>
              </div>
            )}
            <div className="border-t border-slate-100 pt-4">
              <div className="flex justify-between text-base">
                <span className="font-bold text-slate-900">Total Paid</span>
                <span className="font-bold text-slate-900 text-xl">{formatPrice(booking.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lead guest */}
        {booking.guests[0]?.firstName && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-800">Lead Guest</h2>
            </div>
            <div className="p-6 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Name</span>
                <span className="font-medium">
                  {booking.guests[0].title} {booking.guests[0].firstName} {booking.guests[0].lastName}
                </span>
              </div>
              {booking.contactInfo.email && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium">{booking.contactInfo.email}</span>
                </div>
              )}
              {booking.contactInfo.phone && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone</span>
                  <span className="font-medium">{booking.contactInfo.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* What's next */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800">What happens next?</h2>
          </div>
          <div className="p-6">
            <ol className="space-y-4">
              {[
                { icon: "📧", title: "Confirmation email", desc: "You'll receive a full booking confirmation within 24 hours." },
                { icon: "📋", title: "ATOL certificate", desc: "Your ATOL financial protection certificate will be emailed within 48 hours." },
                { icon: "🛂", title: "Travel documents", desc: "E-tickets and accommodation vouchers sent 2 weeks before departure." },
                { icon: "✈️", title: "Online check-in", desc: "Check in online with your airline 24–48 hours before departure." },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {item.icon} {item.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href={`/my-booking/${ref}`}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            📁 Manage My Booking
          </Link>
          <Link
            href={`/my-booking/${ref}/pre-departure`}
            className="flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            🗺️ Pre-Departure Guide
          </Link>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-slate-500 hover:text-primary-600 underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
