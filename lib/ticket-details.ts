export type TicketDetails = {
  text?: string;
  arrivalDate?: string;
  arrivalTime?: string;
};

export function extractTicketDetails(rawText: string): TicketDetails {
  const text = rawText.trim().slice(0, 12_000);
  if (!text) return {};

  let arrivalDate: string | undefined;
  const isoDate = text.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
  const dayFirstDate = text.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](20\d{2}|\d{2})\b/);
  const namedDate = text.match(/\b(\d{1,2})\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*,?\s*(20\d{2})\b/i);

  try {
    if (isoDate) {
      arrivalDate = new Date(Date.UTC(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]))).toISOString().slice(0, 10);
    } else if (dayFirstDate) {
      const year = dayFirstDate[3].length === 2 ? `20${dayFirstDate[3]}` : dayFirstDate[3];
      arrivalDate = new Date(Date.UTC(Number(year), Number(dayFirstDate[2]) - 1, Number(dayFirstDate[1]))).toISOString().slice(0, 10);
    } else if (namedDate) {
      arrivalDate = new Date(`${namedDate[2]} ${namedDate[1]}, ${namedDate[3]} UTC`).toISOString().slice(0, 10);
    }
  } catch {
    arrivalDate = undefined;
  }

  const arrivalContext = text.match(/(?:arrival|arrives?|landing|arrival time).{0,70}/i)?.[0] || text;
  const time = arrivalContext.match(/\b(0?[1-9]|1[0-2]|[01]\d|2[0-3])[:.]([0-5]\d)\s*(AM|PM)?\b/i);
  let arrivalTime: string | undefined;
  if (time) {
    let hour = Number(time[1]);
    if (time[3]?.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (time[3]?.toUpperCase() === "AM" && hour === 12) hour = 0;
    arrivalTime = `${String(hour).padStart(2, "0")}:${time[2]}`;
  }

  return { text, arrivalDate, arrivalTime };
}
