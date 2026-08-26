-- ============================================
-- Migration : autorise les avis visiteurs sur les SITES de rencontre
-- ============================================
-- Étend entity_type de ('lieu','club') à ('lieu','club','site').
-- Pour un avis de type 'site' :
--   lieu_id    = slug de l'avis (ex: 'avis-wyylde')
--   lieu_slug  = slug de l'avis  (idem)
--   ville_slug = '' (non pertinent, mais la colonne est NOT NULL)
--
-- À exécuter dans Supabase SQL Editor → New query → Run.
-- Idempotent.

alter table public.reviews
  drop constraint if exists reviews_entity_type_check;

alter table public.reviews
  add constraint reviews_entity_type_check
  check (entity_type in ('lieu','club','site'));

-- ville_slug n'a pas de sens pour un site : on autorise la chaîne vide.
alter table public.reviews
  alter column ville_slug set default '';
