"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import type { SavedBooking } from "@/types/booking";
import { formatDate } from "@/lib/utils";

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dep = new Date(dateStr);
  return Math.ceil((dep.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const skiPacking = [
  "Ski jacket & trousers", "Thermal base layers (×3)", "Fleece mid-layer", "Ski socks (×5)",
  "Warm gloves / mittens", "Goggles", "Sunglasses", "High-SPF sun cream",
  "Lip balm with SPF", "Passport & travel documents", "Travel insurance documents",
  "Camera / memory cards", "Euros / local currency", "Snacks for travel day",
];

const beachPacking = [
  "Swimwear (×3)", "Sunscreen SPF 50+", "After-sun lotion", "Sunglasses & hat",
  "Light cotton clothing", "Sandals & flip-flops", "Snorkel set", "Beach bag",
  "Insect repellent", "Rehydration sachets", "Passport & travel documents",
  "Travel insurance documents", "Euros / local currency", "Kindle / books",
];

const cityPacking = [
  "Comfortable walking shoes", "Smart evening outfit", "Lightweight rain jacket",
  "Day bag / backpack", "Portable charger", "City guidebook / maps app",
  "Passport & travel documents", "Travel insurance documents",
  "Local currency / card", "Adaptor plug", "Headphones",
];

const summerPacking = [
  "Sunscreen SPF 30+", "Light linen clothing", "Swimwear", "Hat & sunglasses",
  "Evening wear", "Comfortable shoes for sightseeing", "Insect repellent",
  "Reusable water bottle", "Passport & travel documents",
  "Travel insurance documents", "Local currency / card",
];

function getPackingList(holidayName: string): string[] {
  const lower = holidayName.toLowerCase();
  if (lower.includes("ski") || lower.includes("snow") || lower.includes("alps") || lower.includes("mountain")) return skiPacking;
  if (lower.includes("beach") || lower.includes("sun") || lower.includes("island") || lower.includes("tenerife") || lower.includes("lanzarote") || lower.includes("mykonos") || lower.includes("santorini") || lower.includes("bodrum") || lower.includes("mallorca") || lower.includes("crete") || lower.includes("fuerteventura")) return beachPacking;
  if (lower.includes("city") || lower.includes("barcelona") || lower.includes("prague") || lower.includes("amsterdam") || lower.includes("lisbon") || lower.includes("paris") || lower.includes("rome")) return cityPacking;
  return summerPacking;
}

function getWeatherForecast(destination: string) {
  const hash = destination.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const temps = [8, 12, 15, 18, 22, 25, 28, 26, 22, 17, 12, 9];
  const conditions = ["☀️ Sunny", "⛅ Partly cloudy", "🌤️ Mostly sunny", "🌧️ Light rain", "❄️ Snow showers"];
  const month = new Date().getMonth();
  const temp = temps[month] + (hash % 6);
  const condition = conditions[hash % conditions.length];
  return { temp, condition };
}

const checklistByWeek: Array<{ week: string; items: string[] }> = [
  {
    week: "8 weeks before",
    items: [
      "Check all passports are valid (6+ months beyond return date)",
      "Apply for ESTA / visa if required for your destination",
      "Check FCDO travel advice for your destination",
      "Inform your bank you're travelling abroad",
    ],
  },
  {
    week: "4 weeks before",
    items: [
      "Arrange travel money or notify your credit card company",
      "Book airport parking or arrange travel to the airport",
      "Confirm any special dietary requirements with the hotel",
      "Download airline app for mobile boarding passes",
    ],
  },
  {
    week: "2 weeks before",
    items: [
      "Check your e-tickets and accommodation vouchers have arrived",
      "Research things to do and book restaurant reservations",
      "Pack first aid kit: plasters, pain relief, antihistamines",
      "Charge all devices and download offline maps",
    ],
  },
  {
    week: "1 week before",
    items: [
      "Check flight times haven't changed (check airline website)",
      "Do online check-in 24–48 hours before departure",
      "Confirm transfer pickup time and details",
      "Set out of office on email",
    ],
  },
];

export default function PreDeparturePage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = use(params);
  const [booking, setBooking] = useState<SavedBooking | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`booking_${ref}`);
      if (raw) setBooking(JSON.parse(raw));
      const savedChecked = localStorage.getItem(`predeparture_${ref}_checked`);
      if (savedChecked) setChecked(new Set(JSON.parse(savedChecked)));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, [ref]);

  function toggleCheck(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      try {
        localStorage.setItem(`predeparture_${ref}_checked`, JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  }

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

  const days = booking.selectedDate ? daysUntil(booking.selectedDate) : null;
  const packingList = getPackingList(booking.holidayName);
  const weather = getWeatherForecast(booking.destination);

  const totalChecked = checked.size;
  const totalItems = checklistByWeek.reduce((sum, w) => sum + w.items.length, 0) + packingList.length;
  const progress = Math.round((totalChecked / totalItems) * 100);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4">

        {/* Breadcrumb */}
        <div className="text-sm text-slate-500 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link href={`/my-booking/${ref}`} className="hover:text-primary-600">My Booking</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Pre-Departure Guide</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-1">Pre-Departure Guide</h1>
        <p className="text-slate-500 mb-8">
          {booking.holidayName} · {booking.destination}
          {booking.selectedDate && ` · Departs ${formatDate(booking.selectedDate)}`}
        </p>

        {/* Countdown */}
        {days !== null && (
          <div className={`rounded-2xl p-6 mb-8 text-center ${days > 0 ? "bg-primary-600 text-white" : "bg-green-600 text-white"}`}>
            {days > 0 ? (
              <>
                <div className="text-6xl font-bold mb-1">{days}</div>
                <div className="text-primary-200 text-lg">days until departure</div>
                <div className="text-primary-100 text-sm mt-1">
                  {booking.selectedDate ? formatDate(booking.selectedDate) : ""}
                </div>
              </>
            ) : (
              <>
                <div className="text-4xl font-bold mb-1">Bon Voyage! 🎉</div>
                <div className="text-green-200">You&apos;re on your way to {booking.destination}</div>
              </>
            )}
          </div>
        )}

        {/* Overall progress */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Overall Preparation</span>
            <span className="text-sm font-bold text-primary-700">{progress}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-slate-400 mt-1">{totalChecked} of {totalItems} items completed</div>
        </div>

        {/* Weather forecast */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 flex items-center gap-5">
          <div className="text-4xl">{weather.condition.split(" ")[0]}</div>
          <div>
            <div className="font-bold text-slate-900 text-lg">{weather.condition.split(" ").slice(1).join(" ")}</div>
            <div className="text-slate-500 text-sm">{booking.destination} · Expected {weather.temp}°C</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-3xl font-bold text-slate-900">{weather.temp}°C</div>
            <div className="text-xs text-slate-400">Forecast</div>
          </div>
        </div>

        {/* Pre-departure checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800">Pre-Departure Checklist</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {checklistByWeek.map((section) => (
              <div key={section.week} className="p-5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                  {section.week}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const key = `checklist_${section.week}_${item}`;
                    const isChecked = checked.has(key);
                    return (
                      <label
                        key={key}
                        className="flex items-start gap-3 cursor-pointer group"
                        onClick={() => toggleCheck(key)}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isChecked ? "bg-green-500 border-green-500" : "border-slate-300 group-hover:border-primary-400"}`}>
                          {isChecked && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm ${isChecked ? "line-through text-slate-400" : "text-slate-700"}`}>
                          {item}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Packing list */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800">🧳 Packing List</h2>
            <p className="text-xs text-slate-500 mt-0.5">Tailored for {booking.holidayName}</p>
          </div>
          <div className="p-5 grid sm:grid-cols-2 gap-2">
            {packingList.map((item) => {
              const key = `pack_${item}`;
              const isChecked = checked.has(key);
              return (
                <label
                  key={key}
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => toggleCheck(key)}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isChecked ? "bg-green-500 border-green-500" : "border-slate-300 group-hover:border-primary-400"}`}>
                    {isChecked && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${isChecked ? "line-through text-slate-400" : "text-slate-700"}`}>
                    {item}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Useful info */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800">🌍 Good to Know</h2>
          </div>
          <div className="p-5 grid sm:grid-cols-2 gap-4 text-sm">
            {[
              { icon: "💊", title: "EHIC / GHIC", desc: "Apply for a free UK Global Health Insurance Card before travelling to Europe." },
              { icon: "📱", title: "Roaming charges", desc: "Check your mobile data plan. Consider a local SIM or travel data add-on." },
              { icon: "💷", title: "Travel money", desc: "Order currency in advance online for the best rates. Notify your bank." },
              { icon: "🔌", title: "Plug adaptors", desc: "EU 2-pin adaptors needed for France, Spain, Greece. UK sockets in some UK hotels." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="font-semibold text-slate-900">{item.title}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href={`/my-booking/${ref}`}
            className="text-sm border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:border-primary-400 hover:text-primary-700 transition-colors"
          >
            ← Manage Booking
          </Link>
          <Link
            href={`/my-booking/${ref}/travel-day`}
            className="text-sm bg-primary-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            ✈️ Travel Day Info →
          </Link>
        </div>
      </div>
    </div>
  );
}
