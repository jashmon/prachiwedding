create extension if not exists "pgcrypto";

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  guest_count integer not null check (guest_count between 1 and 10),
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;
