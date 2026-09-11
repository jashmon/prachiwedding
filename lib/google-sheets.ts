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
  const responseText = await response.text();
  let payload: { ok?: boolean; message?: string } | null = null;
  try {
    payload = JSON.parse(responseText) as { ok?: boolean; message?: string };
  } catch {
    // Google returns an HTML authorization page when the web app has not been
    // authorized or deployed for anonymous access.
  }

  if (!response.ok || !payload?.ok) {
    const detail = payload?.message || `HTTP ${response.status}; response type ${response.headers.get("content-type") || "unknown"}`;
    console.error("Google Sheets RSVP append failed:", detail);
    throw new Error("Google Sheets could not save this RSVP. Please try again.");
  }
  return true;
}
