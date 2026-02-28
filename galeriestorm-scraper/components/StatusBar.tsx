"use client";

import { useState, useEffect } from "react";

interface Status {
  lastRun: number | null;
  lastFinished: number | null;
  nextRun: number | null;
  totalItems: number;
  lastStatus: string | null;
  isRunning: boolean;
}

function timeAgo(ts: number | null): string {
  if (!ts) return "never";
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function timeIn(ts: number | null): string {
  if (!ts) return "—";
  const diff = ts - Math.floor(Date.now() / 1000);
  if (diff <= 0) return "soon";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
}

export default function StatusBar() {
  const [status, setStatus] = useState<Status | null>(null);
  const [wasRunning, setWasRunning] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/status");
      const data: Status = await res.json();
      if (wasRunning && !data.isRunning) {
        window.dispatchEvent(new Event("gallery:scraped"));
      }
      setWasRunning(data.isRunning);
      setStatus(data);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchStatus();
    // Poll: fast (5s) while running, slow (60s) at rest
    const id = setInterval(
      fetchStatus,
      (status?.isRunning ?? false) ? 5000 : 60000
    );
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.isRunning]);

  if (!status) return null;

  const statusDot = status.isRunning
    ? "bg-yellow-400 animate-pulse"
    : status.lastStatus === "error"
    ? "bg-red-500"
    : "bg-emerald-500";

  return (
    <div className="flex items-center gap-4 text-[13px] text-gallery-muted">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot}`} />
      {status.isRunning ? (
        <span className="text-yellow-400">Scraping in progress…</span>
      ) : (
        <span>
          Last scraped{" "}
          <span className="text-gallery-text">{timeAgo(status.lastFinished ?? status.lastRun)}</span>
          {" · "}Next in{" "}
          <span className="text-gallery-text">{timeIn(status.nextRun)}</span>
        </span>
      )}
      <span className="text-gallery-border">·</span>
      <span>
        <span className="text-gallery-text font-medium">{status.totalItems.toLocaleString()}</span> items
      </span>
    </div>
  );
}
