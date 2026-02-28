"use client";

import { useState } from "react";

export default function ScrapeButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/scrape", { method: "POST" });
      const data = await res.json();
      if (res.status === 409) {
        setMessage("Already running");
      } else if (data.started) {
        setMessage("Started!");
      }
    } catch {
      setMessage("Error");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-1.5 rounded-full bg-gallery-accent text-black text-xs font-semibold hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Starting…" : "Scrape Now"}
      </button>
      {message && (
        <span className="text-xs text-gallery-muted">{message}</span>
      )}
    </div>
  );
}
