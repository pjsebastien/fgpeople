-- ============================================
-- Briefs d'avis sur les sites de rencontre libertins
-- ============================================
-- Ces tables stockent la MATIÈRE PREMIÈRE saisie depuis /admin/sites :
-- captures d'écran, vidéos, liens YouTube, lien d'affiliation, instructions.
-- L'article final n'est PAS stocké ici : il est rédigé depuis le brief puis
-- committé dans data/site_reviews/<slug>.ts (contenu statique, versionné).
--
-- À exécuter dans Supabase SQL Editor → New query → Run.
-- Idempotent : peut être relancé sans risque.

create extension if not exists pgcrypto;

-- ============================================
-- 1. Le brief (un par site à reviewer)
-- ============================================
create table if not exists public.site_briefs (
  id                  uuid primary key default gen_random_uuid(),
  -- Slug de la future page : 'avis-wyylde'
  slug                text not null unique,
  site_name           text not null,
  site_url            text,
  affiliate_url       text,
  -- draft = en cours de saisie / ready = prêt à rédiger / generated = article écrit / published = en ligne
  status              text not null default 'draft'
                      check (status in ('draft','ready','generated','published')),

  -- Matière rédactionnelle (tout est optionnel : je complète ce qui manque)
  instructions        text,   -- angle, ton, consignes perso
  key_facts           text,   -- chiffres à intégrer (membres, trafic, ancienneté…)
  personal_experience text,   -- ce que tu as vécu en testant le site
  pricing_notes       text,   -- formules et prix relevés
  pros_notes          text,   -- points forts constatés
  cons_notes          text,   -- points faibles constatés
  target_keywords     text,   -- mots-clés SEO à viser

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists site_briefs_status_idx
  on public.site_briefs (status, updated_at desc);

-- Maintient updated_at à jour automatiquement
create or replace function public.touch_site_briefs_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists site_briefs_touch_updated_at on public.site_briefs;
create trigger site_briefs_touch_updated_at
  before update on public.site_briefs
  for each row execute function public.touch_site_briefs_updated_at();

-- ============================================
-- 2. Les assets rattachés à un brief
-- ============================================
-- kind :
--   image   → capture d'écran uploadée sur Cloudinary
--   video   → vidéo courte uploadée sur Cloudinary (démo d'interface)
--   youtube → simple lien YouTube (rien n'est uploadé)
--   logo    → logo du site
create table if not exists public.site_brief_assets (
  id           uuid primary key default gen_random_uuid(),
  brief_id     uuid not null references public.site_briefs(id) on delete cascade,
  kind         text not null check (kind in ('image','video','youtube','logo')),

  -- URL publique : secure_url Cloudinary, ou URL YouTube pour kind='youtube'
  url          text not null,
  -- Identifiant Cloudinary (null pour YouTube) — sert à la suppression
  public_id    text,
  width        integer,
  height       integer,
  format       text,
  bytes        bigint,
  duration     numeric,   -- durée en secondes pour les vidéos

  -- Optionnels : si tu ne dis rien, j'analyse l'image pour deviner ce qu'elle montre
  label        text,      -- "page tarifs", "messagerie"…
  instruction  text,      -- "à placer dans la section abonnement"

  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists site_brief_assets_brief_idx
  on public.site_brief_assets (brief_id, sort_order, created_at);

-- ============================================
-- 3. Row Level Security
-- ============================================
-- Même principe que la table reviews : aucune policy = aucun accès depuis le
-- navigateur. Tout passe par la service_role key côté serveur.
alter table public.site_briefs enable row level security;
alter table public.site_brief_assets enable row level security;
