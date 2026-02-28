"use client";

import { useState, useEffect, useCallback } from "react";
import Masonry from "react-masonry-css";
import ItemCard from "./ItemCard";

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

interface Props {
  initialItems: Item[];
}

const BREAKPOINTS = {
  default: 5,
  1536: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 1,
};

export default function GalleryGrid({ initialItems }: Props) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(
    async (source: string | null, term: string | null) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: "200" });
        if (source) params.set("source", source);
        if (term) params.set("term", term);
        const res = await fetch(`/api/items?${params}`);
        const data = await res.json();
        setItems(data.items ?? []);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const { source, term } = e.detail ?? {};
      setActiveSource(source ?? null);
      setActiveTerm(term ?? null);
      fetchItems(source ?? null, term ?? null);
    };
    window.addEventListener("gallery:filter", handler as EventListener);
    return () => window.removeEventListener("gallery:filter", handler as EventListener);
  }, [fetchItems]);

  // Refresh after a scrape completes
  useEffect(() => {
    const handler = () => fetchItems(activeSource, activeTerm);
    window.addEventListener("gallery:scraped", handler);
    return () => window.removeEventListener("gallery:scraped", handler);
  }, [fetchItems, activeSource, activeTerm]);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-gallery-bg/60 z-10 flex items-center justify-center">
          <span className="text-gallery-muted text-sm animate-pulse">Loading…</span>
        </div>
      )}
      {items.length === 0 ? (
        <div className="text-center py-24 text-gallery-muted">
          <p className="text-lg">No items yet.</p>
          <p className="text-sm mt-1">Click &quot;Scrape Now&quot; to fetch the first batch.</p>
        </div>
      ) : (
        <Masonry
          breakpointCols={BREAKPOINTS}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {items.map((item) => (
            <div key={item.id} className="mb-4">
              <ItemCard item={item} />
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
}
