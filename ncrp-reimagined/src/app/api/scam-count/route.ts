import { NextRequest, NextResponse } from "next/server";
import { getCount, normalizeIdentifier } from "@/lib/scam-counts";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ count: 0 });
  const normalized = normalizeIdentifier(id);
  if (!normalized) return NextResponse.json({ count: 0 });
  const count = await getCount(normalized);
  return NextResponse.json({ count });
}
