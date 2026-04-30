-- ============================================
-- Supabase schema for FG People reviews
-- ============================================
-- Run this in the Supabase SQL editor (Project → SQL → New query).
-- Then come back here once executed.

create extension if not exists pgcrypto;

create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  lieu_id      text        not null,
  lieu_slug    text        not null,
  ville_slug   text        not null,
  pseudo       text,
  rating       smallint    not null check (rating between 1 and 5),
  comment      text        not null check (char_length(comment) between 10 and 2000),
  status       text        not null default 'pending' check (status in ('pending','approved','rejected')),
  ip_hash      text,
  user_agent   text,
  created_at   timestamptz not null default now(),
  approved_at  timestamptz
);

create index if not exists reviews_lieu_status_idx
  on public.reviews (lieu_id, status, created_at desc);

create index if not exists reviews_status_created_idx
  on public.reviews (status, created_at desc);

create index if not exists reviews_ville_status_idx
  on public.reviews (ville_slug, status);

-- Anti-spam helper: count recent reviews from same ip_hash for a given lieu
create index if not exists reviews_iphash_created_idx
  on public.reviews (ip_hash, created_at desc);

-- ============================================
-- Row Level Security
-- ============================================
-- We never expose this table from the browser; all queries go through the
-- service role key from Next.js Server Actions / server components.
-- RLS is enabled with NO public policies = everything is denied unless the
-- service role bypass is used (which it always is from our server code).

alter table public.reviews enable row level security;
-- (no policies = no access for anon/authenticated roles. service_role bypasses RLS.)
