"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MobileMenu } from "./MobileMenu";

const navLinks = [
  { label: "Ski", href: "/holidays?type=ski" },
  { label: "Beach", href: "/holidays?type=beach" },
  { label: "City Breaks", href: "/holidays?type=city" },
  { label: "Summer", href: "/holidays?type=summer" },
  { label: "Special Offers", href: "/holidays?offer=true" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-primary-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <span className={`font-bold text-xl tracking-tight transition-colors ${scrolled ? "text-primary-900" : "text-white"}`}>
                Sunway
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    scrolled
                      ? "text-slate-700 hover:bg-slate-100 hover:text-primary-700"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/holidays"
                className={`hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  scrolled
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-white text-primary-700 hover:bg-primary-50"
                }`}
              >
                Find a Holiday
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  scrolled ? "hover:bg-slate-100 text-slate-700" : "hover:bg-white/10 text-white"
                }`}
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
