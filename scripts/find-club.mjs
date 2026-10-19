/**
 * Cherche un lieu dans notre base (base d'origine + clubs ajoutés), pour
 * éviter de créer un doublon : par nom, ville, téléphone ou adresse.
 * Donne aussi les libellés exacts de département et de région à reprendre
 * dans une nouvelle fiche de base.
 *
 * Usage :
 *   node scripts/find-club.mjs "<texte>"      nom, ville, téléphone ou adresse
 *   node scripts/find-club.mjs --dept <code>  libellés du département (ex. 30, 2A, 974)
 */
import { loadAllRawClubs, clubSlug, slugify } from './lib/base-clubs.mjs';

const clubs = loadAllRawClubs();
const args = process.argv.slice(2);

if (args[0] === '--dept') {
  const code = args[1];
  const c = clubs.find((x) => x.departement_code === code);
  console.log(c
    ? JSON.stringify({ departement_code: code, departement_nom: c.departement_nom, region: c.region, pays: c.pays })
    : `Département ${code} absent de la base : reprendre le nom officiel du département et de sa région.`);
  process.exit(0);
}

const q = args.join(' ');
if (!q) throw new Error('Usage: node scripts/find-club.mjs "<texte>"');
const digits = q.replace(/\D/g, '');
const words = slugify(q).split('-').filter((w) => w.length > 2);

const hits = clubs.map((c) => {
  const hay = slugify([c.nom, c.ville, c.adresse, c.code_postal].join(' '));
  let score = words.filter((w) => hay.includes(w)).length / Math.max(words.length, 1);
  if (digits.length >= 9 && (c.telephone || '').replace(/\D/g, '').endsWith(digits.slice(-9))) score = 2;
  return { c, score };
}).filter((h) => h.score >= 0.5).sort((a, b) => b.score - a.score).slice(0, 10);

if (!hits.length) console.log('Aucun lieu correspondant dans la base.');
for (const { c, score } of hits) {
  console.log(`${score >= 2 ? 'TÉLÉPHONE IDENTIQUE' : `score ${score.toFixed(2)}`} — ${c.nom}, ${c.adresse || '?'} ${c.code_postal || ''} ${c.ville} — tél. ${c.telephone || '?'} — /${clubSlug(c)}`);
}
