import { NextResponse } from "next/server";
import { getIsRunning, triggerScrape } from "@/lib/scraper/state";

export async function POST() {
  if (getIsRunning()) {
    return NextResponse.json({ started: false, reason: "already running" }, { status: 409 });
  }

  // Fire and forget — do not await
  triggerScrape().catch(console.error);

  return NextResponse.json({ started: true });
}
