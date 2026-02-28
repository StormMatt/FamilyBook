import { NextRequest, NextResponse } from "next/server";
import { queryItems } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const source = searchParams.get("source") ?? undefined;
  const term = searchParams.get("term") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? 100);
  const offset = Number(searchParams.get("offset") ?? 0);

  const items = queryItems({ source, term, limit, offset });
  return NextResponse.json({ items });
}
