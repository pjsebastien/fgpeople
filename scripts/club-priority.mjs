/**
 * Calcule l'ordre de traitement des fiches clubs à partir d'un export
 * Search Console (Pages.csv + Requêtes.csv) et y rattache, pour chaque club,
 * les requêtes GSC qui le concernent (nom du club ou ville).
 *
 * Usage : node scripts/club-priority.mjs <dossier-export-gsc>
 * Sortie : data/clubs/priority.json
 */
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
if (!dir) throw new Error('Usage: node scripts/club-priority.mjs <dossier-export-gsc>');

const slugify = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function readCsv(file) {
  const [head, ...lines] = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  return lines.map((l) => {
    // Les requêtes ne contiennent pas de virgule dans les exports GSC, sauf rares cas entre guillemets.
    const m = l.match(/^(?:"((?:[^"]|"")*)"|([^,]*)),(\d+),(\d+),([\d.]+)%,([\d.]+)$/);
    if (!m) return null;
    return { key: (m[1] ?? m[2]).replace(/""/g, '"'), clicks: +m[3], impressions: +m[4], ctr: +m[5], position: +m[6] };
  }).filter(Boolean);
}

const files = fs.readdirSync(dir);
const pages = readCsv(path.join(dir, files.find((f) => f.startsWith('Pages'))));
const queries = readCsv(path.join(dir, files.find((f) => f.startsWith('Requ'))));

const raw = JSON.parse(fs.readFileSync('data/clubs_libertins_verified.json', 'utf8'));
const clubs = raw.clubs.map((c) => {
  const ville = (c.ville || '').trim();
  const unknown = !ville || /^(ville )?inconnue$/i.test(ville);
  return {
    id: c.id,
    nom: c.nom,
    ville: unknown ? c.pays : ville,
    slug: c.slug || slugify(`${c.nom}-${unknown ? c.pays : ville}`),
  };
});

const pageBySlug = new Map(pages.map((p) => [p.key.replace('https://www.fgpeople.com/', '').replace(/\/$/, ''), p]));
const STOP = new Set(['le', 'la', 'les', 'l', 'de', 'du', 'des', 'club', 'sauna', 'spa', 'bar', 'et', 'libertin', 'the', 'a', 'au', 'd']);

const out = clubs.map((c) => {
  const p = pageBySlug.get(c.slug);
  const nameTokens = slugify(c.nom).split('-').filter((t) => t.length > 2 && !STOP.has(t));
  const villeSlug = slugify(c.ville);
  const related = queries.filter((q) => {
    const qs = slugify(q.key);
    const words = qs.split('-');
    return (nameTokens.length && nameTokens.every((t) => words.includes(t))) ||
      (villeSlug.length > 2 && qs.includes(villeSlug));
  }).sort((a, b) => b.impressions - a.impressions).slice(0, 25);
  return {
    slug: c.slug, id: c.id, nom: c.nom, ville: c.ville,
    gsc: p ? { clicks: p.clicks, impressions: p.impressions, ctr: p.ctr, position: p.position } : null,
    queries: related.map((q) => ({ q: q.key, clicks: q.clicks, impressions: q.impressions, position: q.position })),
  };
}).sort((a, b) => (b.gsc?.impressions ?? 0) - (a.gsc?.impressions ?? 0) || b.queries.length - a.queries.length);

const dupes = out.length - new Set(out.map((c) => c.slug)).size;
fs.writeFileSync('data/clubs/priority.json', JSON.stringify({ source: path.basename(dir), generatedAt: new Date().toISOString(), clubs: out }, null, 1));
console.log(`${out.length} clubs, ${out.filter((c) => c.gsc).length} avec données GSC, ${dupes} slugs en double`);
