# Prachi and Pratik

A cinematic, responsive wedding invitation for Prachi and Pratik.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Customize the invitation

All names, event copy, venue details, contact text, and map links live in `data/wedding.ts`.

The supplied lakeside film is served in an optimized mobile-first version from `public/media`.

## RSVP storage

The RSVP endpoint validates submissions on the server and rate limits repeated attempts.

- Guests first choose whether they have travel booked. Without a ticket, the RSVP collects just their side, name, and WhatsApp number. With travel booked, it also collects guest count and arrival details; a PDF, JPG, PNG, or WEBP ticket (up to 4 MB) can provide those details through OCR.
- Ticket files are stored privately in Supabase Storage. Create a private bucket named `travel-tickets`, then run `supabase/schema.sql` in the Supabase SQL editor.
- For production, deploy the supplied Google Apps Script as a web app that runs as you, then set `GOOGLE_APPS_SCRIPT_URL` and `GOOGLE_APPS_SCRIPT_TOKEN` in Vercel. The provided workbook uses `Sheet1`; the script appends: ID, Submitted at, Name, WhatsApp number, Guest side, Guests, Arrival date, Arrival time, Ticket path, OCR text.
- Without Supabase and Google variables, submissions are appended to `.data/rsvps.jsonl` only for local development. Vercel deliberately rejects unconfigured production submissions.
- Ticket reading runs on the guest's device with Tesseract.js. The original ticket is then saved privately to Supabase. OCR suggestions must be confirmed by the guest before submitting.

## Verify

```bash
npm run lint
npm run typecheck
npm run build
```
