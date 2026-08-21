import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { RsvpRecord } from "./rsvp";

async function saveToSupabase(record: RsvpRecord) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
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
      email: record.email,
      guest_count: record.guestCount,
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
  if (!savedRemotely) await saveLocally(record);
}

export async function sendConfirmation(record: RsvpRecord) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [record.email],
      subject: "Your RSVP for Prachi and Pratik",
      text: `Thank you, ${record.name}. We have saved your RSVP for ${record.guestCount} guest${record.guestCount === 1 ? "" : "s"}. We cannot wait to celebrate together.`,
    }),
  });

  if (!response.ok) console.error("RSVP saved, but the confirmation email could not be sent.");
}
