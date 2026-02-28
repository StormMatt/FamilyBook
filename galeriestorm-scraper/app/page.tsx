import { queryItems } from "@/lib/db";
import GalleryGrid from "@/components/GalleryGrid";
import StatusBar from "@/components/StatusBar";
import FilterBar from "@/components/FilterBar";
import ScrapeButton from "@/components/ScrapeButton";

// Revalidate every 3 minutes so a simple page refresh shows new items
export const revalidate = 180;

export default function Home() {
  // Server-side DB read — no HTTP round-trip
  const initialItems = queryItems({ limit: 200 });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gallery-bg/90 backdrop-blur-sm border-b border-gallery-border">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Logo + status */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <h1 className="text-gallery-text font-semibold tracking-wide text-sm uppercase shrink-0">
              Galerie<span className="text-gallery-accent">storm</span>
            </h1>
            <StatusBar />
          </div>
          <ScrapeButton />
        </div>

        {/* Filter row */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 pb-3">
          <FilterBar />
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        <GalleryGrid initialItems={initialItems} />
      </main>
    </div>
  );
}
