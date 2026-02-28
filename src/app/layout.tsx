import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | Sunway Holidays",
    default: "Sunway Holidays — Ski, Beach & Summer Holidays",
  },
  description:
    "Europe's leading holiday specialist. Ski, beach, city and summer holidays with lift passes included. ATOL & ABTA protected.",
  openGraph: {
    siteName: "Sunway Holidays",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
