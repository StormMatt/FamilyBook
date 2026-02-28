"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import { BookingProvider, useBooking } from "@/components/booking/BookingContext";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { StepRoomDates } from "@/components/booking/steps/StepRoomDates";
import { StepExtras } from "@/components/booking/steps/StepExtras";
import { StepGuestDetails } from "@/components/booking/steps/StepGuestDetails";
import { StepOrderSummary } from "@/components/booking/steps/StepOrderSummary";
import { StepPayment } from "@/components/booking/steps/StepPayment";
import { getAllHolidays } from "@/lib/holidays";
import { getHotelByHolidaySlug } from "@/lib/hotels";
import { useEffect, useState } from "react";
import type { Holiday } from "@/types/holiday";
import type { Hotel } from "@/types/hotel";
import { Spinner } from "@/components/ui/Spinner";

function BookingPageInner({ holiday, hotel }: { holiday: Holiday; hotel: Hotel | null }) {
  const { state } = useBooking();

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Complete your booking</h1>
          <BookingProgress currentStep={state.currentStep} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              {state.currentStep === 1 && <StepRoomDates holiday={holiday} />}
              {state.currentStep === 2 && <StepExtras holidayType={holiday.type} />}
              {state.currentStep === 3 && <StepGuestDetails />}
              {state.currentStep === 4 && <StepOrderSummary holiday={holiday} />}
              {state.currentStep === 5 && (
                <StepPayment
                  holidayName={holiday.name}
                  durationNights={holiday.durationNights}
                  destination={`${holiday.destination.resort}, ${holiday.destination.country}`}
                  hotelName={hotel?.name}
                  hotelSlug={hotel?.slug}
                />
              )}
            </div>
          </div>

          {/* Sidebar summary */}
          <div className="lg:col-span-1">
            <BookingSummary holiday={holiday} />
            <div className="mt-4 bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>🛡️</span>
                <span>ATOL & ABTA protected booking</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                <span>🔒</span>
                <span>Secure 256-bit SSL payment</span>
              </div>
              {state.selectedExtras.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-green-700 mt-2">
                  <span>✓</span>
                  <span>{state.selectedExtras.length} extra{state.selectedExtras.length !== 1 ? "s" : ""} added</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage({
  params,
}: {
  params: Promise<{ holidaySlug: string }>;
}) {
  const { holidaySlug } = use(params);
  const searchParams = useSearchParams();
  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  const initialDate = searchParams.get("date") ?? undefined;
  const initialAirport = searchParams.get("airport") ?? undefined;

  useEffect(() => {
    Promise.all([
      getAllHolidays().then((holidays) => holidays.find((h) => h.slug === holidaySlug) ?? null),
      getHotelByHolidaySlug(holidaySlug),
    ]).then(([h, hot]) => {
      setHoliday(h);
      setHotel(hot ?? null);
      setLoading(false);
    });
  }, [holidaySlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-10 h-10" />
      </div>
    );
  }

  if (!holiday) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="text-xl font-bold text-slate-900">Holiday not found</h2>
          <a href="/holidays" className="text-primary-600 hover:underline mt-2 block">
            Browse holidays →
          </a>
        </div>
      </div>
    );
  }

  return (
    <BookingProvider
      initialSlug={holidaySlug}
      initialDate={initialDate}
      initialAirport={initialAirport}
    >
      <BookingPageInner holiday={holiday} hotel={hotel} />
    </BookingProvider>
  );
}
