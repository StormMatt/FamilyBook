"use client";

import { useState } from "react";
import Image from "next/image";
import type { HolidayImage } from "@/types/holiday";

export function PhotoGallery({ images }: { images: HolidayImage[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (images.length === 0) return null;

  return (
    <>
      <div className="rounded-2xl overflow-hidden grid gap-2 grid-cols-4 h-[400px] lg:h-[480px]">
        {/* Main image */}
        <div
          className="col-span-3 relative cursor-zoom-in"
          onClick={() => setLightbox(true)}
        >
          <Image
            src={images[active].url}
            alt={images[active].alt}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 65vw"
          />
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {active + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="col-span-1 flex flex-col gap-2 overflow-y-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${
                i === active ? "border-primary-500" : "border-transparent"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="15vw"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <div className="relative max-w-5xl w-full max-h-full aspect-video">
            <Image
              src={images[active].url}
              alt={images[active].alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button
            className="absolute top-4 right-4 text-white bg-white/10 rounded-full p-2 hover:bg-white/20"
            onClick={() => setLightbox(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
