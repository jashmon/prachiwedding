import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { appendRsvpToGoogleSheet } from "./google-sheets";
import type { RsvpRecord } from "./rsvp";

function getSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET,
    bucket: process.env.SUPABASE_TICKETS_BUCKET || "travel-tickets",
  };
}

async function saveToSupabase(record: RsvpRecord) {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return false;

  const response = await fetch(`${url}/rest/v1/rsvps`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      id: record.id,
      name: record.name,
      // Preserve the original required `email` field for already-created tables.
      // New installations also receive the correctly named `whatsapp_number` field.
      email: record.whatsappNumber,
      whatsapp_number: record.whatsappNumber,
      guest_count: record.guestCount,
      arrival_date: record.arrivalDate,
      arrival_time: record.arrivalTime,
      ticket_path: record.ticketPath || null,
      ticket_ocr_text: record.ticketOcrText || null,
      created_at: record.createdAt,
    }),
  });

  if (!response.ok) throw new Error("Supabase rejected the RSVP.");
  return true;
}

async function saveLocally(record: RsvpRecord) {
  const dataDirectory = path.join(process.cwd(), ".data");
  await mkdir(dataDirectory, { recursive: true });
  await appendFile(path.join(dataDirectory, "rsvps.jsonl"), `${JSON.stringify(record)}\n`, "utf8");
}

export async function saveRsvp(record: RsvpRecord) {
  const savedRemotely = await saveToSupabase(record);
  if (!savedRemotely) {
    if (process.env.VERCEL) throw new Error("Supabase RSVP storage is not configured.");
    await saveLocally(record);
  }

  const savedToSheet = await appendRsvpToGoogleSheet(record);
  if (!savedToSheet && process.env.VERCEL) {
    throw new Error("Google Sheets is not configured for RSVP submissions.");
  }
}

const allowedTicketTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
const ticketMaxBytes = 4 * 1024 * 1024;

export function validateTicket(file: File) {
  if (!allowedTicketTypes.has(file.type)) throw new Error("Upload a PDF, JPG, PNG, or WEBP ticket.");
  if (file.size === 0 || file.size > ticketMaxBytes) throw new Error("Ticket files must be 4 MB or smaller.");
}

export async function saveTicket(file: File) {
  validateTicket(file);
  const { url, key, bucket } = getSupabaseConfig();
  if (!url || !key) throw new Error("Ticket uploads are not configured yet.");

  const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "file";
  const storagePath = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  const response = await fetch(`${url}/storage/v1/object/${bucket}/${storagePath}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": file.type,
      "x-upsert": "false",
    },
    body: await file.arrayBuffer(),
  });
  if (!response.ok) throw new Error("We could not securely save that ticket. Please try again.");
  return storagePath;
}
