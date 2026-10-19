/**
 * Affiche tout ce que la base sait d'un club, pour préparer sa fiche :
 * fiche brute, URLs du site, données Search Console, clubs proches (pour le
 * maillage interne) et doublons possibles dans la base.
 *
 * Usage : node scripts/club-context.mjs <slug>
 */
import fs from 'node:fs';
import { loadAllRawClubs, slugify } from './lib/base-clubs.mjs';

const slug = process.argv[2];
if (!slug) throw new Error('Usage: node scripts/club-context.mjs <slug>');

const priority = fs.existsSync('data/clubs/priority.json')
  ? JSON.parse(fs.readFileSync('data/clubs/priority.json', 'utf8')).clubs : [];

const clubs = loadAllRawClubs().map((c) => {
  const ville = (c.ville || '').trim();
  const unknown = !ville || /^(ville )?inconnue$/i.test(ville);
  const villeAff = unknown ? c.pays : ville;
  return {
    raw: c,
    slug: c.slug || slugify(`${c.nom}-${villeAff}`),
    villeSlug: slugify(villeAff),
    departementSlug: slugify(c.departement_nom),
    hasProfile: fs.existsSync(`data/clubs/profiles/${c.slug || slugify(`${c.nom}-${villeAff}`)}.json`),
  };
});

const me = clubs.find((c) => c.slug === slug);
if (!me) throw new Error(`Slug inconnu : ${slug}`);
const r = me.raw;

const digits = (t) => (t || '').replace(/\D/g, '').slice(-9);
const dupes = clubs.filter((c) => c !== me && (
  (digits(r.telephone) && digits(c.raw.telephone) === digits(r.telephone)) ||
  (r.adresse && c.raw.code_postal === r.code_postal && slugify(c.raw.adresse) === slugify(r.adresse)) ||
  (slugify(c.raw.nom) === slugify(r.nom) && c.raw.departement_code === r.departement_code)
));

const sameCity = clubs.filter((c) => c !== me && c.villeSlug === me.villeSlug && c.raw.pays === r.pays);
const sameDept = clubs.filter((c) => c !== me && c.villeSlug !== me.villeSlug && c.raw.departement_code === r.departement_code && c.raw.pays === r.pays);
const fmt = (c) => `- ${c.raw.nom} — ${c.raw.ville} — type « ${c.raw.type} » — lien interne : /${c.slug}${c.hasProfile ? ' (fiche personnalisée)' : ''}`;

const gsc = priority.find((p) => p.slug === slug);
const { description, description_originale, ...rest } = r;

console.log(`# Contexte : ${r.nom} (${slug})

## Fiche brute de la base (non vérifiée, issue d'annuaires en janvier 2026)
${JSON.stringify(rest, null, 1)}

Description d'origine (texte d'annuaire générique, ne PAS réutiliser) :
${description || '(aucune)'}

## URLs sur fgpeople.com
- Fiche : https://www.fgpeople.com/${slug}  (lien interne : /${slug})
- Ville : /ville/${me.villeSlug}
- Département : /departement/${me.departementSlug}
- Région : /region/${slugify(r.region)}

## Search Console (3 derniers mois, export du 2026-10-16)
${gsc?.gsc ? `Page : ${gsc.gsc.impressions} impressions, ${gsc.gsc.clicks} clics, CTR ${gsc.gsc.ctr} %, position moyenne ${gsc.gsc.position}` : 'Page absente du top 1000 des pages.'}
Requêtes liées (nom du club ou ville, top 1000 du site) :
${gsc?.queries?.length ? gsc.queries.map((q) => `- « ${q.q} » : ${q.impressions} impr., ${q.clicks} clics, pos. ${q.position}`).join('\n') : '- aucune'}

## Doublons possibles dans la base
${dupes.length ? dupes.map(fmt).join('\n') : '- aucun'}

## Autres établissements de la base dans la même ville (${sameCity.length})
${sameCity.slice(0, 15).map(fmt).join('\n') || '- aucun'}

## Dans le reste du département (${sameDept.length})
${sameDept.slice(0, 15).map(fmt).join('\n') || '- aucun'}
`);
