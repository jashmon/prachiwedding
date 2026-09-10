create extension if not exists "pgcrypto";

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  guest_count integer not null check (guest_count between 1 and 10),
  arrival_date date not null,
  arrival_time time not null,
  ticket_path text,
  ticket_ocr_text text,
  created_at timestamptz not null default now()
);

alter table public.rsvps add column if not exists arrival_date date;
alter table public.rsvps add column if not exists arrival_time time;
alter table public.rsvps add column if not exists ticket_path text;
alter table public.rsvps add column if not exists ticket_ocr_text text;

-- Existing tables created before the required arrival fields need this after
-- historical rows have been populated or removed.
-- alter table public.rsvps alter column arrival_date set not null;
-- alter table public.rsvps alter column arrival_time set not null;

alter table public.rsvps enable row level security;

-- Create a private bucket named `travel-tickets` in Storage. Uploads are made
-- only by the server-side service role, so no anonymous Storage policy is needed.
