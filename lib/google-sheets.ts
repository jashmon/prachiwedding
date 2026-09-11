import type { RsvpRecord } from "./rsvp";

export async function appendRsvpToGoogleSheet(record: RsvpRecord) {
  const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL;
  const token = process.env.GOOGLE_APPS_SCRIPT_TOKEN;
  if (!endpoint || !token) return false;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      id: record.id,
      createdAt: record.createdAt,
      name: record.name,
      whatsappNumber: record.whatsappNumber,
      guestCount: record.guestCount,
      arrivalDate: record.arrivalDate,
      arrivalTime: record.arrivalTime,
      ticketPath: record.ticketPath || "",
      ticketOcrText: record.ticketOcrText || "",
    }),
  });
  if (!response.ok) throw new Error("Google Sheets could not save this RSVP. Please try again.");
  const payload = await response.json().catch(() => null) as { ok?: boolean } | null;
  if (!payload?.ok) throw new Error("Google Sheets could not save this RSVP. Please try again.");
  return true;
}
