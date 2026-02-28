import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Galeriestorm · Scraper",
  description: "Internal market monitor — eBay, Etsy, Selency, Tradera",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gallery-bg text-gallery-text antialiased">
        {children}
      </body>
    </html>
  );
}
