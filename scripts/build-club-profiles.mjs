/**
 * Valide les fiches clubs (data/clubs/profiles/*.json) et les regroupe dans
 * data/clubs/profiles.generated.json, seul fichier lu par le site.
 *
 * Une fiche invalide n'est pas publiée : elle est listée en erreur et le
 * script sort en code 1, les fiches valides restant regroupées.
 *
 * Usage : node scripts/build-club-profiles.mjs [--check <slug>...]
 *   --check : valide seulement les fiches indiquées, sans rien écrire.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadAllRawClubs, loadNewClubs, clubSlug, NEW_DIR } from './lib/base-clubs.mjs';

const DIR = 'data/clubs/profiles';
const OUT = 'data/clubs/profiles.generated.json';

const allRaw = loadAllRawClubs();
const baseSlugs = new Map(allRaw.map((c) => [clubSlug(c), c.id]));

const CONFIDENCE = ['confirme', 'source_unique', 'a_verifier'];
const STATUS = ['ouvert', 'ferme', 'fermeture_probable', 'incertain'];
const SOURCE_TYPES = ['officiel', 'reseau_social', 'registre', 'annuaire', 'presse', 'avis', 'carte', 'forum', 'autre'];
const BLOCKS = ['text', 'list', 'table', 'callout', 'timeline'];
const LINK_KINDS = ['site', 'facebook', 'instagram', 'x', 'galerie', 'agenda', 'reservation', 'autre'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
// Clés acceptées dans `[ancre](aff:<clé>)` — voir lib/config/inline-affiliates.ts.
const AFFILIATES = ['wyylde', 'carre-libertin', 'gleese'];

export function validateProfile(p, file) {
  const errors = [];
  const warnings = [];
  const err = (m) => errors.push(m);
  const warn = (m) => warnings.push(m);
  const str = (v) => typeof v === 'string' && v.trim().length > 0;

  if (!str(p.slug)) err('slug manquant');
  else if (path.basename(file, '.json') !== p.slug) err(`nom de fichier ≠ slug (${p.slug})`);
  else if (!baseSlugs.has(p.slug)) err(`slug inconnu de la base : ${p.slug}`);
  else if (baseSlugs.get(p.slug) !== p.clubId) err(`clubId ${p.clubId} ≠ id de la base ${baseSlugs.get(p.slug)}`);
  if (!DATE.test(p.researchedAt || '')) err('researchedAt invalide');
  if (p.display && !Object.entries(p.display).every(([k, v]) => ['nom', 'ville'].includes(k) && str(v))) err('display invalide');

  const ids = new Set();
  if (!Array.isArray(p.sources) || p.sources.length === 0) err('aucune source');
  for (const s of p.sources || []) {
    if (!str(s.id) || ids.has(s.id)) err(`source id invalide ou en double : ${s.id}`);
    ids.add(s.id);
    if (!/^https?:\/\//.test(s.url || '')) err(`source ${s.id} : url invalide`);
    if (!str(s.label)) err(`source ${s.id} : label manquant`);
    if (!SOURCE_TYPES.includes(s.type)) err(`source ${s.id} : type invalide ${s.type}`);
    if (!DATE.test(s.consulted || '')) err(`source ${s.id} : date de consultation invalide`);
  }
  const used = new Set();
  const refs = (list, where) => {
    if (!Array.isArray(list)) return err(`${where} : sources manquantes`);
    for (const r of list) { used.add(r); if (!ids.has(r)) err(`${where} : source inconnue ${r}`); }
  };

  if (!STATUS.includes(p.status?.value)) err('status.value invalide');
  if (!str(p.status?.summary)) err('status.summary manquant');
  refs(p.status?.sources, 'status');
  if (['ferme', 'fermeture_probable'].includes(p.status?.value) && (p.status.sources || []).length < 1) err('fermeture sans source');

  if (!str(p.seo?.title)) err('seo.title manquant');
  else if (p.seo.title.length > 70) warn(`seo.title long (${p.seo.title.length} car.)`);
  if (!str(p.seo?.metaDescription)) err('seo.metaDescription manquante');
  else if (p.seo.metaDescription.length > 165 || p.seo.metaDescription.length < 90) warn(`metaDescription ${p.seo.metaDescription.length} car.`);
  if (!Array.isArray(p.seo?.targetQueries)) err('seo.targetQueries manquant');

  if (!str(p.lead)) err('lead manquant');
  if (!Array.isArray(p.keyFacts)) err('keyFacts manquant');
  for (const [i, f] of (p.keyFacts || []).entries()) {
    if (!str(f.label) || !str(f.value)) err(`keyFacts[${i}] incomplet`);
    if (!CONFIDENCE.includes(f.confidence)) err(`keyFacts[${i}] confidence invalide`);
    refs(f.sources, `keyFacts[${i}]`);
  }

  if (!Array.isArray(p.sections) || p.sections.length === 0) err('aucune section');
  const anchors = new Set();
  for (const [i, s] of (p.sections || []).entries()) {
    const at = `sections[${i}]`;
    if (!/^[a-z0-9-]+$/.test(s.id || '') || anchors.has(s.id)) err(`${at} : id invalide ou en double`);
    anchors.add(s.id);
    if (!str(s.title)) err(`${at} : titre manquant`);
    if (s.confidence && !CONFIDENCE.includes(s.confidence)) err(`${at} : confidence invalide`);
    refs(s.sources, at);
    if ((s.sources || []).length === 0) warn(`${at} (${s.title}) : aucune source`);
    if (!Array.isArray(s.blocks) || s.blocks.length === 0) err(`${at} : aucun bloc`);
    for (const [j, b] of (s.blocks || []).entries()) {
      const bt = `${at}.blocks[${j}]`;
      if (!BLOCKS.includes(b.kind)) { err(`${bt} : kind invalide ${b.kind}`); continue; }
      if ((b.kind === 'text' || b.kind === 'callout') && !str(b.body)) err(`${bt} : body vide`);
      if (b.kind === 'callout' && !['info', 'warning', 'tip'].includes(b.tone)) err(`${bt} : tone invalide`);
      if (b.kind === 'list' && (!Array.isArray(b.items) || !b.items.every(str))) err(`${bt} : items invalides`);
      if (b.kind === 'timeline' && (!Array.isArray(b.items) || !b.items.every((x) => str(x.date) && str(x.text)))) err(`${bt} : timeline invalide`);
      if (b.kind === 'table') {
        if (!Array.isArray(b.headers) || !Array.isArray(b.rows)) err(`${bt} : table invalide`);
        else if (!b.rows.every((r) => Array.isArray(r) && r.length === b.headers.length)) err(`${bt} : lignes de largeur incorrecte`);
      }
    }
  }

  for (const key of ['horaires', 'tarifs']) {
    const x = p[key];
    if (!x) continue;
    if (!x.rows || typeof x.rows !== 'object' || !Object.values(x.rows).every(str)) err(`${key}.rows invalide`);
    if (!CONFIDENCE.includes(x.confidence)) err(`${key}.confidence invalide`);
    refs(x.sources, key);
  }
  if (p.equipements && !(Array.isArray(p.equipements) && p.equipements.every(str))) err('equipements invalide');

  for (const [i, r] of (p.externalRatings || []).entries()) {
    if (!(r.rating > 0 && r.rating <= r.scale) || !(r.count >= 0) || !DATE.test(r.date || '') || !/^https?:\/\//.test(r.url || '') || !str(r.platform)) {
      err(`externalRatings[${i}] invalide`);
    }
  }
  for (const [i, l] of (p.officialLinks || []).entries()) {
    if (!str(l.label) || !/^https?:\/\//.test(l.url || '') || !LINK_KINDS.includes(l.kind)) err(`officialLinks[${i}] invalide`);
  }
  if (p.corrections) refs(p.corrections.sources, 'corrections');

  if (!Array.isArray(p.faq)) err('faq manquante');
  for (const [i, q] of (p.faq || []).entries()) if (!str(q.question) || !str(q.answer)) err(`faq[${i}] incomplète`);
  if (p.unverified && !(Array.isArray(p.unverified) && p.unverified.every(str))) err('unverified invalide');

  for (const s of p.sources || []) if (!used.has(s.id)) warn(`source ${s.id} jamais citée`);

  // Liens partenaires : chacun des trois apparaît dans le corps du texte
  // (sections ou FAQ), une ou deux fois, et nulle part ailleurs.
  const body = JSON.stringify([p.sections, p.faq]);
  const elsewhere = JSON.stringify([p.lead, p.keyFacts, p.status, p.seo, p.horaires, p.tarifs, p.unverified]);
  for (const m of JSON.stringify(p).matchAll(/\]\(aff:([^)\s]*)\)/g)) {
    if (!AFFILIATES.includes(m[1])) err(`partenaire inconnu : aff:${m[1]}`);
  }
  for (const key of AFFILIATES) {
    const n = body.split(`](aff:${key})`).length - 1;
    if (n === 0) err(`lien partenaire manquant dans le texte : aff:${key}`);
    if (n > 2) err(`lien partenaire aff:${key} répété ${n} fois (2 maximum)`);
  }
  if (/\]\(aff:/.test(elsewhere)) err('lien partenaire hors des sections et de la FAQ');

  // Liens internes : doivent pointer vers une fiche ou une page existante du site.
  const text = JSON.stringify(p);
  for (const m of text.matchAll(/\]\((\/[^)\s]*)\)/g)) {
    const target = m[1].split(/[?#]/)[0].replace(/^\//, '');
    if (!target.includes('/') && target && !baseSlugs.has(target) && !KNOWN_PAGES.has(target)) warn(`lien interne inconnu : /${target}`);
  }
  return { errors, warnings };
}

// Pages hors fiches clubs pouvant être citées en lien interne sans avertissement.
const KNOWN_PAGES = new Set([
  'club-libertin', 'sauna-libertin', 'spa-libertin', 'restaurant-libertin', 'bar-libertin', 'club-sm-fetish',
  'club-gay-friendly', 'cinema-libertin', 'discotheque-libertine', 'hebergement-libertin', 'conseils',
  'lieu-de-drague', 'comparatif-sites-libertins', 'ou-faire-rencontres-libertines-2026',
]);

function main() {
  const args = process.argv.slice(2);
  const checkOnly = args[0] === '--check';
  fs.mkdirSync(DIR, { recursive: true });
  // En mode --check, on accepte des slugs (cherchés dans profiles/) ou des chemins de fichiers (brouillons).
  const files = checkOnly && args.length > 1
    ? args.slice(1).map((a) => (a.endsWith('.json') ? a : path.join(DIR, `${a}.json`)))
    : fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => path.join(DIR, f));

  const out = {};
  let failed = 0;
  for (const file of files.sort()) {
    const f = path.basename(file);
    let p;
    try { p = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) {
      console.error(`✗ ${f} : JSON illisible (${e.message})`); failed++; continue;
    }
    const { errors, warnings } = validateProfile(p, file);
    if (errors.length) {
      failed++;
      console.error(`✗ ${f}\n${errors.map((e) => `    erreur : ${e}`).join('\n')}`);
    }
    if (warnings.length) console.warn(`${errors.length ? '' : '⚠ ' + f + '\n'}${warnings.map((w) => `    attention : ${w}`).join('\n')}`);
    if (!errors.length) out[p.slug] = p;
  }

  if (!checkOnly) {
    fs.writeFileSync(OUT, JSON.stringify(out));
    console.log(`${Object.keys(out).length} fiches publiées dans ${OUT}${failed ? `, ${failed} en erreur` : ''}`);
  } else {
    console.log(`${files.length - failed}/${files.length} fiches valides`);
  }
  if (failed) process.exit(1);
}

main();
