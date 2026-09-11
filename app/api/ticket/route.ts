import { NextResponse } from "next/server";
import { saveTicket, validateTicket } from "@/lib/rsvp-store";

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
    return NextResponse.json({ ticketPath, extraction: {} }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "We could not process that ticket.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
