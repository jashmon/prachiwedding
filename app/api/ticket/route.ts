import { NextResponse } from "next/server";
import { saveTicket, validateTicket } from "@/lib/rsvp-store";
import { extractTicketDetails } from "@/lib/ticket-details";

export const runtime = "nodejs";

async function readPdfText(ticket: File) {
  if (ticket.type !== "application/pdf") return "";

  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const document = await pdfjs.getDocument({ data: new Uint8Array(await ticket.arrayBuffer()) }).promise;
  const pageCount = Math.min(document.numPages, 4);
  const pages = await Promise.all(Array.from({ length: pageCount }, async (_, index) => {
    const page = await document.getPage(index + 1);
    const content = await page.getTextContent();
    return content.items.map((item) => "str" in item ? item.str : "").join(" ");
  }));
  return pages.join(" ").trim().slice(0, 12_000);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const ticket = formData.get("ticket");
    if (!(ticket instanceof File)) {
      return NextResponse.json({ message: "Choose a ticket file first." }, { status: 400 });
    }
    validateTicket(ticket);
    const extraction = extractTicketDetails(await readPdfText(ticket));
    const ticketPath = await saveTicket(ticket);
    return NextResponse.json({ ticketPath, extraction }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "We could not process that ticket.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
