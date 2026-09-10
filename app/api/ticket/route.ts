import { NextResponse } from "next/server";
import { saveTicket, validateTicket } from "@/lib/rsvp-store";
import { extractTicket } from "@/lib/ticket-ocr";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const ticket = formData.get("ticket");
    if (!(ticket instanceof File)) {
      return NextResponse.json({ message: "Choose a ticket file first." }, { status: 400 });
    }
    validateTicket(ticket);
    const ticketPath = await saveTicket(ticket);
    let extraction = {};
    try {
      extraction = await extractTicket(ticket);
    } catch (error) {
      console.warn("Ticket OCR failed", error);
    }
    return NextResponse.json({ ticketPath, extraction }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "We could not process that ticket.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
