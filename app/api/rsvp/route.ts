import { NextResponse } from "next/server";
import { rsvpSchema, type RsvpRecord } from "@/lib/rsvp";
import { saveRsvp } from "@/lib/rsvp-store";
import { extractTicketDetails } from "@/lib/ticket-details";

export const runtime = "nodejs";

type RateEntry = { count: number; resetAt: number };
const globalRateState = globalThis as typeof globalThis & { weddingRsvpRate?: Map<string, RateEntry> };
const rateState = globalRateState.weddingRsvpRate ?? new Map<string, RateEntry>();
globalRateState.weddingRsvpRate = rateState;

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = rateState.get(ip);
  if (!current || current.resetAt < now) {
    rateState.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ message: "Too many attempts. Please try again in a little while." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "We could not read that RSVP." }, { status: 400 });
  }

  // A ticket is an alternative to manually entering travel timing. The client
  // sends its local OCR text, which lets us fill these fields before validation.
  if (body && typeof body === "object" && "ticketPath" in body && "ticketOcrText" in body) {
    const candidate = body as Record<string, unknown>;
    const extracted = typeof candidate.ticketOcrText === "string" ? extractTicketDetails(candidate.ticketOcrText) : {};
    if (typeof candidate.arrivalDate !== "string" || !candidate.arrivalDate) candidate.arrivalDate = extracted.arrivalDate || "";
    if (typeof candidate.arrivalTime !== "string" || !candidate.arrivalTime) candidate.arrivalTime = extracted.arrivalTime || "";
  }

  if (body && typeof body === "object" && !("ticketPath" in body)) {
    const candidate = body as Record<string, unknown>;
    if (!candidate.arrivalDate || !candidate.arrivalTime) {
      return NextResponse.json({ message: "Please enter your arrival date and time." }, { status: 400 });
    }
  }

  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({
      message: "Please check the highlighted details.",
      fields: parsed.error.flatten().fieldErrors,
    }, { status: 400 });
  }

  const record: RsvpRecord = {
    id: crypto.randomUUID(),
    ...parsed.data,
    createdAt: new Date().toISOString(),
  };

  try {
    await saveRsvp(record);
    return NextResponse.json({ ok: true, id: record.id }, { status: 201 });
  } catch (error) {
    console.error("RSVP persistence failed", error);
    return NextResponse.json({ message: "We could not save your RSVP just now. Please try again." }, { status: 500 });
  }
}
