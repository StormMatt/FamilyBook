"use client";

import { useEffect } from "react";
import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "Ski Holidays", href: "/holidays?type=ski" },
  { label: "Beach Holidays", href: "/holidays?type=beach" },
  { label: "City Breaks", href: "/holidays?type=city" },
  { label: "Summer Holidays", href: "/holidays?type=summer" },
  { label: "Special Offers", href: "/holidays?offer=true" },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-72 bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <span className="font-bold text-lg text-primary-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-primary-50 hover:text-primary-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-slate-100">
          <Link
            href="/holidays"
            onClick={onClose}
            className="block w-full text-center bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors"
          >
            Browse All Holidays
          </Link>
        </div>
      </div>
    </div>
  );
}
