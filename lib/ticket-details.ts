export type TicketDetails = {
  text?: string;
  arrivalDate?: string;
  arrivalTime?: string;
};

const months: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function toIsoDate(day: string, month: string, year: string) {
  const monthNumber = /^\d+$/.test(month) ? Number(month) : months[month.slice(0, 3).toLowerCase()];
  const fullYear = year.length === 2 ? Number(`20${year}`) : Number(year);
  const dayNumber = Number(day);
  if (!monthNumber || dayNumber < 1 || dayNumber > 31 || fullYear < 2000) return undefined;
  return `${fullYear}-${String(monthNumber).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
}

function toTwentyFourHourTime(hourText: string, minute: string, meridiem?: string) {
  let hour = Number(hourText);
  if (meridiem?.toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (meridiem?.toUpperCase() === "AM" && hour === 12) hour = 0;
  if (hour > 23) return undefined;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

export function extractTicketDetails(rawText: string): TicketDetails {
  const text = rawText.trim().slice(0, 12_000);
  if (!text) return {};

  let arrivalDate: string | undefined;
  let arrivalTime: string | undefined;

  // Ticket PDFs contain several dates (booking, departure, journey). Prefer
  // the explicitly labelled arrival value before considering generic dates.
  const labelledArrival = text.match(
    /(?:scheduled\s+arrival|arrival(?:\s+date(?:\s*&\s*time)?|\s+time)?)\s*:?\s*(\d{1,2})[-/.\s]+([A-Za-z]{3,9}|\d{1,2})[-/.\s]+(20\d{2}|\d{2})(?:\s+(\d{1,2})[:.]([0-5]\d)\s*(AM|PM)?)?/i,
  );
  if (labelledArrival) {
    arrivalDate = toIsoDate(labelledArrival[1], labelledArrival[2], labelledArrival[3]);
    if (labelledArrival[4]) {
      arrivalTime = toTwentyFourHourTime(labelledArrival[4], labelledArrival[5], labelledArrival[6]);
    }
  }

  const isoDate = text.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
  const dayFirstDate = text.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](20\d{2}|\d{2})\b/);
  const namedDate = text.match(/\b(\d{1,2})[-\s]+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[-\s,]+(20\d{2})\b/i);

  if (!arrivalDate) {
    if (isoDate) {
      arrivalDate = `${isoDate[1]}-${isoDate[2].padStart(2, "0")}-${isoDate[3].padStart(2, "0")}`;
    } else if (dayFirstDate) {
      arrivalDate = toIsoDate(dayFirstDate[1], dayFirstDate[2], dayFirstDate[3]);
    } else if (namedDate) {
      arrivalDate = toIsoDate(namedDate[1], namedDate[2], namedDate[3]);
    }
  }

  const arrivalContext = text.match(/(?:arrival|arrives?|landing|arrival time).{0,70}/i)?.[0] || text;
  const time = arrivalContext.match(/\b(0?[1-9]|1[0-2]|[01]\d|2[0-3])[:.]([0-5]\d)\s*(AM|PM)?\b/i);
  if (!arrivalTime && time) {
    arrivalTime = toTwentyFourHourTime(time[1], time[2], time[3]);
  }

  return { text, arrivalDate, arrivalTime };
}
