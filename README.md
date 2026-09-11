# Prachi and Pratik

A cinematic, responsive wedding invitation for 24 October 2026.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Customize the invitation

All names, dates, event copy, venue details, contact text, and map links live in `data/wedding.ts`.

The supplied lakeside film is served in an optimized mobile-first version from `public/media`.

## RSVP storage

The RSVP endpoint validates submissions on the server and rate limits repeated attempts.

- An arrival date and time are required. Guests may optionally upload a PDF, JPG, PNG, or WEBP ticket (up to 4 MB) to prefill those details.
- Ticket files are stored privately in Supabase Storage. Create a private bucket named `travel-tickets`, then run `supabase/schema.sql` in the Supabase SQL editor.
- For production, deploy the supplied Google Apps Script as a web app that runs as you, then set `GOOGLE_APPS_SCRIPT_URL` and `GOOGLE_APPS_SCRIPT_TOKEN` in Vercel. The provided workbook uses `Sheet1`; the script appends: ID, Submitted at, Name, WhatsApp number, Guests, Arrival date, Arrival time, Ticket path, OCR text.
- Without Supabase and Google variables, submissions are appended to `.data/rsvps.jsonl` only for local development. Vercel deliberately rejects unconfigured production submissions.
- To enable ticket reading, deploy `ocr-service/` as a private Docker service and add its URL/token to Vercel. OCR suggestions must be confirmed by the guest before submitting.

### Ticket OCR service

The OCR service is intentionally separate from Vercel: PaddleOCR is a native Python workload and is too large for a dependable serverless request. Deploy the `ocr-service` directory to a Docker host such as Render, Railway, Fly.io, or a private VM. Configure the same random `OCR_SERVICE_TOKEN` on that service and in Vercel, and do not expose its URL publicly without the token.

```bash
cd ocr-service
docker build -t wedding-ticket-ocr .
docker run --rm -p 8080:8080 -e OCR_SERVICE_TOKEN="replace-me" wedding-ticket-ocr
```

Health check: `GET /health`. The wedding site calls `POST /extract` only from the Vercel server, so guests never receive the OCR service token.

## Verify

```bash
npm run lint
npm run typecheck
npm run build
```
