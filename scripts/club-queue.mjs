/**
 * File de travail des fiches clubs, calculée à partir des fichiers : rien
 * n'est perdu si un lot s'interrompt (limite d'utilisation, coupure).
 *
 * Étapes d'un club :
 *   research  aucun dossier data/clubs/research/<slug>.md
 *   write     dossier présent, aucun brouillon data/clubs/drafts/<slug>.json
 *   verify    brouillon présent, marque de vérification absente ou périmée
 *   publish   vérifié et publiable, pas encore dans data/clubs/profiles/
 *   done      publié
 *
 * Usage :
 *   node scripts/club-queue.mjs --next <n>     prochains éléments à traiter (JSON)
 *   node scripts/club-queue.mjs --publishable  slugs prêts à publier (JSON)
 *   node scripts/club-queue.mjs --summary      état d'avancement
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

const read = (f, d) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : d);
const hash = (f) => crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex');

const priority = read('data/clubs/priority.json', { clubs: [] }).clubs;
const merged = new Set(read('data/clubs/merged.json', { merges: [] }).merges.map((m) => m.from));
const hold = read('data/clubs/hold.json', { slugs: [] }).slugs.map((h) => h.slug);
const held = new Set(hold);

// Dossier constitué sans recherche web (quota épuisé le 16/10/2026) et pas encore complété.
const NO_SEARCH = /websearch (indisponible|épuisé|non disponible)|quota (websearch|de recherche)|quota.{0,20}épuisé|budget websearch/i;
function needsComplement(slug) {
  const f = `data/clubs/research/${slug}.md`;
  if (!fs.existsSync(f)) return false;
  const t = fs.readFileSync(f, 'utf8');
  // Seule une section complète compte ; « ## Recherche complémentaire partielle » (recherches refusées) laisse en file.
  return NO_SEARCH.test(t) && !/^## Recherche complémentaire \(/m.test(t);
}

function stage(slug) {
  if (fs.existsSync(`data/clubs/profiles/${slug}.json`)) return needsComplement(slug) ? 'done-complement' : 'done';
  const draft = `data/clubs/drafts/${slug}.json`;
  if (!fs.existsSync(`data/clubs/research/${slug}.md`)) return 'research';
  if (needsComplement(slug)) return 'complement';
  if (!fs.existsSync(draft)) return 'write';
  const marker = read(`data/clubs/verified/${slug}.json`, null);
  if (!marker || marker.draftHash !== hash(draft)) return 'verify';
  return marker.publishable ? 'publish' : 'blocked';
}

// Clubs de la base, par ordre de priorité Search Console. Ceux sans aucune
// impression reçoivent une recherche allégée.
const existing = priority
  .filter((c) => !merged.has(c.slug) && !held.has(c.slug))
  .map((c) => ({ kind: 'existing', slug: c.slug, depth: c.gsc ? 'full' : 'light', from: stage(c.slug), hasDraft: fs.existsSync(`data/clubs/drafts/${c.slug}.json`) }));

// Nouveaux lieux repérés pendant les recherches (data/clubs/candidates/*.json).
const CAND = 'data/clubs/candidates';
const candidates = fs.existsSync(CAND)
  ? fs.readdirSync(CAND).filter((f) => f.endsWith('.json')).map((f) => ({ key: path.basename(f, '.json'), ...read(path.join(CAND, f)) }))
  : [];
const fresh = candidates.filter((c) => c.status === 'todo')
  .map((c) => ({ kind: 'new', key: c.key, candidate: { nom: c.nom, ville: c.ville, url: c.url, foundIn: c.foundIn }, depth: 'full', from: 'qualify' }));
// Nouveaux clubs qualifiés (fiche de base créée), qui suivent ensuite le même circuit.
const added = candidates.filter((c) => c.status === 'added' && c.slug)
  .map((c) => ({ kind: 'new', key: c.key, slug: c.slug, depth: 'full', from: stage(c.slug) }));

const all = [...existing, ...added];
const args = process.argv.slice(2);

// Éléments déjà confiés à un lot en cours (data/clubs/night-state.json) : exclus.
const busy = new Set(read('data/clubs/night-state.json', { running: [] }).running.flatMap((r) => r.items));

if (args[0] === '--next') {
  const n = Number(args[1] || 20);
  const free = (c) => !busy.has(c.slug || c.key);
  // Priorité aux clubs déjà engagés (vérification, rédaction), puis aux
  // nouveaux lieux (le site ne doit en manquer aucun), puis au reste.
  const order = { complement: 0, verify: 0, write: 1, research: 3 };
  const work = all.filter((c) => c.from in order)
    .map((c, i) => ({ ...c, rank: order[c.from] * 10000 + i }));
  const queue = [...work.filter((c) => c.rank < 20000), ...fresh.map((c, i) => ({ ...c, rank: 20000 + i })), ...work.filter((c) => c.rank >= 20000)];
  console.log(JSON.stringify(queue.filter(free).slice(0, n).map(({ rank, ...c }) => c)));
} else if (args[0] === '--published-complement') {
  // Fiches déjà en ligne dont le dossier attend sa recherche complémentaire.
  console.log(JSON.stringify(all.filter((c) => c.from === 'done-complement').map((c) => c.slug)));
} else if (args[0] === '--publishable') {
  console.log(JSON.stringify(all.filter((c) => c.from === 'publish').map((c) => c.slug)));
} else {
  const count = (s) => all.filter((c) => c.from === s).length;
  console.log(`Publiées : ${count('done') + count('done-complement')} (dont ${count('done-complement')} à compléter) · prêtes à publier : ${count('publish')} · à compléter : ${count('complement')} · à vérifier : ${count('verify')} · à rédiger : ${count('write')} · à rechercher : ${count('research')} · bloquées : ${count('blocked')}`);
  console.log(`Nouveaux lieux : ${fresh.length} à qualifier · ${candidates.filter((c) => c.status === 'added').length} ajoutés · ${candidates.filter((c) => c.status === 'rejected').length} écartés`);
  console.log(`En attente de décision : ${hold.join(', ') || 'aucun'}`);
  const blocked = all.filter((c) => c.from === 'blocked').map((c) => c.slug);
  if (blocked.length) console.log(`Bloquées (non publiables après vérification) : ${blocked.join(', ')}`);
}
