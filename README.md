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

The supplied film is served in optimized desktop and mobile versions from `public/media`. Story photographs are frames from the same film.

## RSVP storage

The RSVP endpoint validates submissions on the server and rate limits repeated attempts.

- Without environment variables, submissions are appended to `.data/rsvps.jsonl` for local development.
- For production, add the Supabase variables from `.env.example` and run `supabase/schema.sql` once.
- Add Resend variables to enable confirmation emails. Email delivery is optional and never blocks RSVP storage.

## Verify

```bash
npm run lint
npm run typecheck
npm run build
```
