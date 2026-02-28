import { NextResponse } from "next/server";
import { getLastScrapeLog, getTotalItemCount } from "@/lib/db";
import { getIsRunning } from "@/lib/scraper/state";

export async function GET() {
  const log = getLastScrapeLog();
  const totalItems = getTotalItemCount();
  const isRunning = getIsRunning();

  // Next run = last started_at + 3 hours (10800 seconds), or null
  const nextRun = log?.started_at ? log.started_at + 10800 : null;

  return NextResponse.json({
    lastRun: log?.started_at ?? null,
    lastFinished: log?.finished_at ?? null,
    nextRun,
    totalItems,
    lastStatus: log?.status ?? null,
    isRunning,
  });
}
