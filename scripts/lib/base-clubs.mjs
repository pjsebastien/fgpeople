/**
 * Chargement de la base des clubs pour les scripts : la base d'origine
 * (data/clubs_libertins_verified.json) et les clubs ajoutés depuis
 * (data/clubs/new/<slug>.json), avec les slugs calculés comme sur le site
 * (lib/data/clubs.ts).
 */
import fs from 'node:fs';
import path from 'node:path';

export const NEW_DIR = 'data/clubs/new';

export const slugify = (t) => (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export function clubSlug(c) {
  const ville = (c.ville || '').trim();
  const unknown = !ville || /^(ville )?inconnue$/i.test(ville);
  return c.slug || slugify(`${c.nom}-${unknown ? c.pays : ville}`);
}

/** Clubs ajoutés après la base d'origine, un fichier par club. */
export function loadNewClubs() {
  if (!fs.existsSync(NEW_DIR)) return [];
  return fs.readdirSync(NEW_DIR).filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(NEW_DIR, f), 'utf8')));
}

/** Tous les clubs bruts (base d'origine + ajouts). */
export function loadAllRawClubs() {
  const raw = JSON.parse(fs.readFileSync('data/clubs_libertins_verified.json', 'utf8'));
  return [...raw.clubs, ...loadNewClubs()];
}
