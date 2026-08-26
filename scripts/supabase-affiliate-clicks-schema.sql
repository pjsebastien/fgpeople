-- ============================================
-- Comptage des clics sur les liens d'affiliation
-- ============================================
-- Enregistre chaque clic avec sa PAGE d'origine et le BLOC qui l'a généré,
-- pour savoir quels emplacements rapportent réellement.
--
-- À exécuter dans Supabase SQL Editor → New query → Run. Idempotent.

create extension if not exists pgcrypto;

create table if not exists public.affiliate_clicks (
  id          uuid primary key default gen_random_uuid(),
  -- Partenaire visé : 'gleese', 'related-gay', ou le slug d'un site testé
  target      text        not null,
  -- Emplacement du CTA : 'floating-cta', 'review-hero', 'pricing-table'…
  block       text        not null,
  -- Chemin de la page d'où part le clic (jamais l'URL complète : pas de query)
  page_path   text        not null,
  referrer    text,
  ip_hash     text,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists affiliate_clicks_created_idx
  on public.affiliate_clicks (created_at desc);

create index if not exists affiliate_clicks_block_idx
  on public.affiliate_clicks (block, created_at desc);

create index if not exists affiliate_clicks_page_idx
  on public.affiliate_clicks (page_path, created_at desc);

-- ============================================
-- Rapport agrégé
-- ============================================
-- Tout est calculé côté Postgres : l'admin reçoit un seul objet JSON au lieu
-- de rapatrier des milliers de lignes pour les compter en JavaScript.
create or replace function public.affiliate_click_report(p_days integer default 30)
returns json
language sql
stable
as $$
  with scoped as (
    select *
    from public.affiliate_clicks
    where created_at >= now() - make_interval(days => greatest(p_days, 1))
  )
  select json_build_object(
    'total', (select count(*) from scoped),
    'by_target', (
      select coalesce(json_agg(row_to_json(t)), '[]'::json) from (
        select target as key, count(*) as clicks
        from scoped group by target order by count(*) desc
      ) t
    ),
    'by_block', (
      select coalesce(json_agg(row_to_json(t)), '[]'::json) from (
        select block as key, count(*) as clicks
        from scoped group by block order by count(*) desc limit 50
      ) t
    ),
    'by_page', (
      select coalesce(json_agg(row_to_json(t)), '[]'::json) from (
        select page_path as key, count(*) as clicks
        from scoped group by page_path order by count(*) desc limit 50
      ) t
    ),
    'by_page_block', (
      select coalesce(json_agg(row_to_json(t)), '[]'::json) from (
        select page_path as page, block, count(*) as clicks
        from scoped group by page_path, block order by count(*) desc limit 100
      ) t
    ),
    'by_day', (
      select coalesce(json_agg(row_to_json(t)), '[]'::json) from (
        select to_char(created_at at time zone 'Europe/Paris', 'YYYY-MM-DD') as key,
               count(*) as clicks
        from scoped
        group by 1 order by 1
      ) t
    )
  );
$$;

-- ============================================
-- Row Level Security
-- ============================================
-- Aucune policy = aucun accès depuis le navigateur. L'insertion passe par la
-- route API serveur, la lecture par l'admin, tous deux en service_role.
alter table public.affiliate_clicks enable row level security;
