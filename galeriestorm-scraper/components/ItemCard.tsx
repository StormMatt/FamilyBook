"use client";

import Image from "next/image";

interface Item {
  id: string;
  title: string;
  price: string | null;
  currency: string | null;
  image_url: string | null;
  item_url: string;
  source: string;
  search_term: string;
  scraped_at: number;
}

const SOURCE_COLORS: Record<string, string> = {
  ebay: "bg-yellow-500 text-black",
  etsy: "bg-orange-500 text-white",
  selency: "bg-emerald-600 text-white",
  tradera: "bg-blue-600 text-white",
};

function timeAgo(ts: number): string {
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ItemCard({ item }: { item: Item }) {
  const badgeClass = SOURCE_COLORS[item.source] ?? "bg-zinc-600 text-white";

  return (
    <a
      href={item.item_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative overflow-hidden rounded-lg bg-gallery-surface border border-gallery-border hover:border-gallery-accent transition-colors duration-200"
    >
      {/* Image */}
      <div className="relative w-full bg-zinc-900">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            loading="lazy"
            className="w-full h-auto object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center text-gallery-muted text-sm">
            No image
          </div>
        )}
        {/* Source badge */}
        <span
          className={`absolute top-2 right-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${badgeClass}`}
        >
          {item.source}
        </span>
      </div>

      {/* Info overlay */}
      <div className="p-3">
        <p className="text-gallery-text text-sm font-medium leading-snug line-clamp-2 group-hover:text-gallery-accent transition-colors">
          {item.title}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-gallery-accent font-semibold text-sm">
            {item.price ?? "—"}
          </span>
          <span className="text-gallery-muted text-[11px]">
            {timeAgo(item.scraped_at)}
          </span>
        </div>
        <p className="text-gallery-muted text-[11px] mt-1 truncate">
          {item.search_term}
        </p>
      </div>
    </a>
  );
}
