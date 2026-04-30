-- ============================================
-- Migration : entity_type + critères structurés (tags)
-- ============================================
-- - Permet d'étendre le système d'avis aux clubs (en plus des lieux de drague).
-- - Ajoute une colonne tags pour les critères structurés (ambiance, clientèle, âge, etc.)
-- À exécuter dans Supabase SQL Editor → New query → Run.
-- Idempotent : peut être exécuté plusieurs fois sans casser quoi que ce soit.

-- 1. entity_type
alter table public.reviews
  add column if not exists entity_type text not null default 'lieu';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'reviews_entity_type_check'
  ) then
    alter table public.reviews
      add constraint reviews_entity_type_check check (entity_type in ('lieu','club'));
  end if;
end $$;

-- 2. tags (critères structurés multi-valeurs)
-- Format : tableau de chaînes au format "<categorie>:<valeur>"
-- Ex : ['ambiance:festive', 'clientele:couples', 'age:30-45']
alter table public.reviews
  add column if not exists tags text[] not null default '{}';

-- 3. Index optimisé pour les lookups multi-types
create index if not exists reviews_entity_lookup_idx
  on public.reviews (entity_type, lieu_id, status, created_at desc);

-- 4. Index pour le rate-limit par IP + entity_type
create index if not exists reviews_iphash_entity_idx
  on public.reviews (ip_hash, entity_type, created_at desc);

-- 5. Index GIN sur tags (permet les requêtes 'contient ce critère')
create index if not exists reviews_tags_gin_idx
  on public.reviews using gin (tags);
