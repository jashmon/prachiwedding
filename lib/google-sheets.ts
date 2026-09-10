import { createSign } from "node:crypto";
import type { RsvpRecord } from "./rsvp";

const googleTokenUrl = "https://oauth2.googleapis.com/token";
const googleSheetsScope = "https://www.googleapis.com/auth/spreadsheets";

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function getGoogleConfig() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetRange = process.env.GOOGLE_SHEET_RANGE || "RSVPs!A:Z";
  if (!email || !privateKey || !spreadsheetId) return null;
  return { email, privateKey, spreadsheetId, sheetRange };
}

async function getAccessToken(email: string, privateKey: string) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64Url(JSON.stringify({
    iss: email,
    scope: googleSheetsScope,
    aud: googleTokenUrl,
    iat: now,
    exp: now + 3600,
  }));
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  signer.end();
  const assertion = `${header}.${claims}.${signer.sign(privateKey).toString("base64url")}`;
  const response = await fetch(googleTokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!response.ok) throw new Error("Google could not authorize the RSVP sheet connection.");
  const payload = await response.json() as { access_token?: string };
  if (!payload.access_token) throw new Error("Google did not return an access token.");
  return payload.access_token;
}

export async function appendRsvpToGoogleSheet(record: RsvpRecord) {
  const config = getGoogleConfig();
  if (!config) return false;

  const token = await getAccessToken(config.email, config.privateKey);
  const range = encodeURIComponent(config.sheetRange);
  const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      values: [[
        record.id,
        record.createdAt,
        record.name,
        record.email,
        record.guestCount,
        record.arrivalDate,
        record.arrivalTime,
        record.ticketPath || "",
        record.ticketOcrText || "",
      ]],
    }),
  });
  if (!response.ok) throw new Error("Google Sheets could not save this RSVP. Please try again.");
  return true;
}
