/**
 * Rassemble les lieux libertins repérés pendant les recherches et absents
 * de notre base dans la file des nouvelles fiches (data/clubs/candidates/).
 *
 * Sources : data/clubs/research/<slug>.missing.json (écrits par les agents
 * de recherche) et, en option, un fichier JSON [{nom, ville, url, foundIn}].
 * Un lieu déjà présent dans la file ou dans la base (même nom normalisé et
 * même ville) n'est pas ajouté une seconde fois ; la qualification par un
 * agent vérifie ensuite plus finement les doublons (adresse, téléphone…).
 *
 * Usage : node scripts/collect-candidates.mjs [fichier-supplémentaire.json]
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadAllRawClubs, slugify } from './lib/base-clubs.mjs';

const CAND = 'data/clubs/candidates';
fs.mkdirSync(CAND, { recursive: true });

// Les mots génériques sont retirés pour rapprocher « Le Must Club » et « Must ».
const STOP = new Set(['le', 'la', 'les', 'l', 'club', 'sauna', 'spa', 'libertin', 'libertine', 'bar', 'de', 'du', 'des']);
const key = (nom, ville) => {
  const n = slugify(nom.replace(/\(.*?\)/g, '')).split('-').filter((w) => w && !STOP.has(w)).join('-');
  return `${n || slugify(nom)}--${slugify((ville || '').replace(/\(.*?\)/g, ''))}`.slice(0, 90);
};

const base = new Set(loadAllRawClubs().map((c) => key(c.nom, c.ville)));
const known = new Set(fs.readdirSync(CAND).map((f) => path.basename(f, '.json')));

const found = [];
for (const f of fs.readdirSync('data/clubs/research').filter((x) => x.endsWith('.missing.json'))) {
  const from = f.replace('.missing.json', '');
  for (const m of JSON.parse(fs.readFileSync(path.join('data/clubs/research', f), 'utf8'))) found.push({ ...m, foundIn: m.foundIn || from });
}
if (process.argv[2]) found.push(...JSON.parse(fs.readFileSync(process.argv[2], 'utf8')));

let added = 0;
for (const m of found) {
  if (!m.nom || !m.ville) continue;
  const k = key(m.nom, m.ville);
  if (base.has(k)) continue;
  const file = path.join(CAND, `${k}.json`);
  if (known.has(k)) {
    // Déjà en file : on note seulement la nouvelle fiche qui l'a repéré.
    const c = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!c.foundIn.includes(m.foundIn)) {
      c.foundIn.push(m.foundIn);
      fs.writeFileSync(file, JSON.stringify(c, null, 2) + '\n');
    }
    continue;
  }
  fs.writeFileSync(file, JSON.stringify({ nom: m.nom, ville: m.ville, url: m.url || null, foundIn: [m.foundIn], status: 'todo' }, null, 2) + '\n');
  known.add(k);
  added++;
}
console.log(`${added} nouveau(x) lieu(x) en file, ${known.size} au total`);
