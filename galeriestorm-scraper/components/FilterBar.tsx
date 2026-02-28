"use client";

import { useState } from "react";
import { SEARCH_TERMS } from "@/lib/scraper/index";

const SOURCES = ["ebay", "etsy", "selency", "tradera"] as const;

function emit(source: string | null, term: string | null) {
  window.dispatchEvent(
    new CustomEvent("gallery:filter", { detail: { source, term } })
  );
}

export default function FilterBar() {
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [termSearch, setTermSearch] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  function handleSource(src: string | null) {
    const next = src === activeSource ? null : src;
    setActiveSource(next);
    emit(next, activeTerm);
  }

  function handleTerm(term: string | null) {
    const next = term === activeTerm ? null : term;
    setActiveTerm(next);
    setShowTerms(false);
    emit(activeSource, next);
  }

  const filteredTerms = SEARCH_TERMS.filter((t) =>
    t.toLowerCase().includes(termSearch.toLowerCase())
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* All */}
      <button
        onClick={() => { setActiveSource(null); setActiveTerm(null); emit(null, null); }}
        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
          !activeSource && !activeTerm
            ? "bg-gallery-accent text-black border-gallery-accent"
            : "border-gallery-border text-gallery-muted hover:border-gallery-text"
        }`}
      >
        All
      </button>

      {/* Source chips */}
      {SOURCES.map((src) => (
        <button
          key={src}
          onClick={() => handleSource(src)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize ${
            activeSource === src
              ? "bg-gallery-accent text-black border-gallery-accent"
              : "border-gallery-border text-gallery-muted hover:border-gallery-text"
          }`}
        >
          {src}
        </button>
      ))}

      <span className="text-gallery-border text-sm">·</span>

      {/* Term selector */}
      <div className="relative">
        <button
          onClick={() => setShowTerms((v) => !v)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            activeTerm
              ? "bg-gallery-accent text-black border-gallery-accent"
              : "border-gallery-border text-gallery-muted hover:border-gallery-text"
          }`}
        >
          {activeTerm ? activeTerm : "Filter by term ▾"}
        </button>

        {showTerms && (
          <div className="absolute top-8 left-0 z-20 bg-gallery-surface border border-gallery-border rounded-lg shadow-xl w-72 max-h-72 overflow-hidden flex flex-col">
            <input
              type="text"
              placeholder="Search terms…"
              value={termSearch}
              onChange={(e) => setTermSearch(e.target.value)}
              className="px-3 py-2 text-xs bg-transparent border-b border-gallery-border text-gallery-text placeholder-gallery-muted outline-none"
              autoFocus
            />
            <div className="overflow-y-auto">
              <button
                onClick={() => handleTerm(null)}
                className="w-full text-left px-3 py-2 text-xs text-gallery-muted hover:bg-gallery-border"
              >
                — All terms
              </button>
              {filteredTerms.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTerm(t)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gallery-border ${
                    activeTerm === t ? "text-gallery-accent" : "text-gallery-text"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear */}
      {(activeSource || activeTerm) && (
        <button
          onClick={() => { setActiveSource(null); setActiveTerm(null); emit(null, null); }}
          className="text-xs text-gallery-muted hover:text-gallery-text underline underline-offset-2"
        >
          Clear
        </button>
      )}
    </div>
  );
}
