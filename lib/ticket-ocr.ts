export type TicketExtraction = {
  text?: string;
  arrivalDate?: string;
  arrivalTime?: string;
};

export async function extractTicket(file: File): Promise<TicketExtraction> {
  const serviceUrl = process.env.OCR_SERVICE_URL;
  if (!serviceUrl) return {};

  const body = new FormData();
  body.append("ticket", file, file.name);
  const response = await fetch(`${serviceUrl.replace(/\/$/, "")}/extract`, {
    method: "POST",
    headers: process.env.OCR_SERVICE_TOKEN ? { "X-OCR-Token": process.env.OCR_SERVICE_TOKEN } : undefined,
    body,
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) throw new Error("We could not read that ticket. Please enter your arrival details manually.");
  const payload = await response.json() as TicketExtraction;
  return {
    text: payload.text?.slice(0, 12_000),
    arrivalDate: /^\d{4}-\d{2}-\d{2}$/.test(payload.arrivalDate || "") ? payload.arrivalDate : undefined,
    arrivalTime: /^([01]\d|2[0-3]):[0-5]\d$/.test(payload.arrivalTime || "") ? payload.arrivalTime : undefined,
  };
}
