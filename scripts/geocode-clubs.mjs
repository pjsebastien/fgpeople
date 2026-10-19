/**
 * Géocode les adresses des clubs français avec la Base Adresse Nationale
 * (api-adresse.data.gouv.fr, service public gratuit), pour afficher une
 * carte sur les fiches. L'adresse corrigée par une fiche personnalisée
 * prime sur celle de la base.
 *
 * Seuls les résultats fiables sont gardés (numéro ou rue, score ≥ 0,6) :
 * mieux vaut pas de carte qu'un repère au mauvais endroit.
 *
 * Usage : node scripts/geocode-clubs.mjs [--force]
 *   Sans --force, les clubs déjà géocodés pour la même adresse sont ignorés.
 * Sortie : data/clubs/geo.json
 */
import fs from 'node:fs';
import { loadAllRawClubs, clubSlug } from './lib/base-clubs.mjs';

const OUT = 'data/clubs/geo.json';
const force = process.argv.includes('--force');
const geo = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};

const profiles = fs.existsSync('data/clubs/profiles.generated.json')
  ? JSON.parse(fs.readFileSync('data/clubs/profiles.generated.json', 'utf8')) : {};

const jobs = loadAllRawClubs()
  .filter((c) => (c.pays || 'France') === 'France')
  .map((c) => {
    const slug = clubSlug(c);
    const fix = profiles[slug]?.corrections || {};
    const adresse = (fix.adresse ?? c.adresse ?? '').replace(/\s+/g, ' ').trim();
    const cp = (fix.code_postal ?? c.code_postal ?? '').trim();
    return { slug, adresse, cp, ville: c.ville, query: [adresse, cp, c.ville].filter(Boolean).join(' ') };
  })
  .filter((j) => j.adresse && (force || geo[j.slug]?.query !== j.query));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ok = 0;
let rejected = 0;

async function geocode(j) {
  const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(j.query)}&limit=1${/^\d{5}$/.test(j.cp) ? `&postcode=${j.cp}` : ''}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) { await sleep(1000); continue; }
      const f = (await res.json()).features?.[0];
      if (f && f.properties.score >= 0.6 && ['housenumber', 'street'].includes(f.properties.type)) {
        const [lon, lat] = f.geometry.coordinates;
        geo[j.slug] = { lat, lon, precision: f.properties.type, label: f.properties.label, score: Math.round(f.properties.score * 100) / 100, query: j.query };
        ok++;
      } else {
        delete geo[j.slug];
        rejected++;
      }
      return;
    } catch {
      await sleep(500);
    }
  }
}

// Le service accepte 50 requêtes par seconde : 5 en parallèle restent très en dessous.
for (let i = 0; i < jobs.length; i += 5) {
  await Promise.all(jobs.slice(i, i + 5).map(geocode));
  await sleep(150);
}

fs.writeFileSync(OUT, JSON.stringify(geo, null, 1) + '\n');
console.log(`${ok} adresse(s) géocodée(s), ${rejected} écartée(s) (résultat imprécis), ${Object.keys(geo).length} au total dans ${OUT}`);
