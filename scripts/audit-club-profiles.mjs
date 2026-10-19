/**
 * Contrôle qualité transversal des fiches clubs.
 *
 * Détecte ce qu'un relecteur fiche par fiche ne voit pas :
 *  - le retour du « texte à trous » : séquences de 7 mots identiques
 *    présentes dans plusieurs fiches ;
 *  - les formules creuses interdites par le playbook ;
 *  - les fiches trop maigres au regard de leurs sources ;
 *  - l'évolution des indicateurs d'un lot à l'autre (dérive de qualité).
 *
 * Usage : node scripts/audit-club-profiles.mjs [slug...]
 *   Sans argument : toutes les fiches. Avec des slugs : ces fiches, comparées
 *   à l'ensemble des autres.
 */
import fs from 'node:fs';
import path from 'node:path';

// Fiches publiées et brouillons en cours : un brouillon est comparé à tout le corpus.
const DIRS = ['data/clubs/profiles', 'data/clubs/drafts'];
const bySlug = new Map();
for (const dir of DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    try {
      const p = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      bySlug.set(p.slug, p);
    } catch {
      console.error(`JSON illisible : ${dir}/${f}`);
    }
  }
}
const profiles = [...bySlug.values()];
const focus = new Set(process.argv.slice(2).filter((a) => !a.startsWith('--')));

// Formules creuses : elles ne disent rien d'un club en particulier.
const BANNED = [
  'cadre raffiné', 'accueil chaleureux', 'ambiance chaleureuse', 'incontournable', "n'hésitez pas",
  'adresse de choix', 'véritable institution', 'lieu idéal', 'cadre idyllique', 'moments inoubliables',
  'expérience unique', 'dans le respect et la discrétion', 'un must', 'havre de paix', 'ne manquez pas',
  'que vous soyez', 'pour tous les goûts', 'en toute discrétion', 'à couper le souffle', 'écrin',
  'propice aux rencontres', 'atmosphère propice', 'nul doute', 'il va sans dire', 'en somme',
  // FG People ne parle pas de sa propre base dans la fiche (règle 5) :
  'notre ancienne fiche', "l'annuaire dont provient notre fiche", 'qui figurait dans notre annuaire',
];

function texts(p) {
  const out = [p.lead];
  for (const s of p.sections) {
    out.push(s.title);
    for (const b of s.blocks) {
      if (b.body) out.push(b.body);
      if (b.items) out.push(...b.items.map((i) => (typeof i === 'string' ? i : i.text)));
      if (b.rows) out.push(...b.rows.flat());
    }
  }
  out.push(...p.faq.flatMap((q) => [q.question, q.answer]));
  return out.filter(Boolean).join('\n');
}

const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

function shingles(t, p) {
  // Le nom et la ville du club sont neutralisés : « Le X à Y propose » et
  // « Le Z à W propose » sont la même tournure.
  let n = norm(t);
  for (const w of [p.slug.replace(/-/g, ' ')].concat(p.slug.split('-').filter((x) => x.length > 3))) {
    n = n.split(w).join(' _ ');
  }
  const words = n.split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + 7 <= words.length; i++) set.add(words.slice(i, i + 7).join(' '));
  return set;
}

const data = profiles.map((p) => {
  const t = texts(p);
  return {
    p,
    text: t,
    words: t.split(/\s+/).length,
    sh: shingles(t, p),
  };
});

const freq = new Map();
for (const d of data) for (const s of d.sh) freq.set(s, (freq.get(s) || 0) + 1);

const rows = [];
for (const d of data) {
  if (focus.size && !focus.has(d.p.slug)) continue;
  const shared = [...d.sh].filter((s) => freq.get(s) >= 3);
  const lower = d.text.toLowerCase();
  const banned = BANNED.filter((b) => lower.includes(b));
  const types = new Set(d.p.sources.map((s) => s.type));
  rows.push({
    slug: d.p.slug,
    status: d.p.status.value,
    words: d.words,
    sections: d.p.sections.length,
    sources: d.p.sources.length,
    sourceTypes: types.size,
    faq: d.p.faq.length,
    unverified: (d.p.unverified || []).length,
    sharedPct: d.sh.size ? Math.round((shared.length / d.sh.size) * 1000) / 10 : 0,
    sharedSample: shared.slice(0, 3),
    banned,
    thin: d.p.sources.length >= 6 && d.words < 600,
  });
}

const avg = (k) => Math.round(rows.reduce((a, r) => a + r[k], 0) / Math.max(rows.length, 1) * 10) / 10;
console.log(`Fiches auditées : ${rows.length} (sur ${profiles.length})`);
console.log(`Moyennes — mots ${avg('words')}, sections ${avg('sections')}, sources ${avg('sources')}, types de sources ${avg('sourceTypes')}, FAQ ${avg('faq')}, texte partagé ${avg('sharedPct')} %`);

// ------------------------------------------------------------
// Liens partenaires et quasi-paraphrases
// ------------------------------------------------------------
// Les séquences exactes ne suffisent pas : deux rédacteurs qui suivent le
// même réflexe écrivent la même phrase avec trois mots changés. On compare
// donc, entre fiches, les phrases les plus exposées au moule (phrases portant
// un lien partenaire, résumés de statut) par similarité de
// trigrammes de mots.
const BRANDS = { wyylde: 'wyylde', 'carre-libertin': 'carre libertin', gleese: 'gleese' };

function neutral(t, p) {
  let n = norm(t.replace(/\]\([^)]*\)/g, ']'));
  for (const w of p.slug.split('-').filter((x) => x.length > 3)) n = n.split(w).join(' _ ');
  return n;
}
function trigrams(n) {
  const w = n.split(/\s+/).filter(Boolean);
  const s = new Set();
  for (let i = 0; i + 3 <= w.length; i++) s.add(w.slice(i, i + 3).join(' '));
  return s;
}
const jaccard = (a, b) => {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
};

function exposedSentences(p) {
  const out = [];
  const all = texts(p).split(/(?<=[.!?])\s+|\n+/);
  for (const s of all) if (/\]\(aff:/.test(s)) out.push({ kind: 'partenaire', text: s });
  // Les questions de FAQ ne sont pas comparées : elles reprennent des requêtes réelles,
  // forcément communes d'un club à l'autre ; ce sont les réponses qui doivent différer.
  out.push({ kind: 'statut', text: p.status.summary });
  return out.map((x) => ({ ...x, tg: trigrams(neutral(x.text, p)) })).filter((x) => x.tg.size >= 3);
}

const AFF_LINK = /\[([^[\]]+)\]\(aff:([^)\s]+)\)/g;
const anchors = new Map(); // ancre normalisée -> [slugs]
const exposed = new Map(profiles.map((p) => [p.slug, exposedSentences(p)]));
for (const p of profiles) {
  for (const m of texts(p).matchAll(AFF_LINK)) {
    const k = `${m[2]}|${norm(m[1])}`;
    anchors.set(k, [...(anchors.get(k) || []), p.slug]);
  }
}

for (const r of rows) {
  const p = bySlug.get(r.slug);
  r.partner = [];
  for (const m of texts(p).matchAll(AFF_LINK)) {
    const a = norm(m[1]);
    if (a === BRANDS[m[2]] || a.split(' ').length < 3) r.partner.push(`ancre trop courte ou réduite à la marque : « ${m[1]} »`);
    const others = anchors.get(`${m[2]}|${a}`).filter((s) => s !== r.slug);
    if (others.length) r.partner.push(`ancre « ${m[1]} » déjà utilisée par ${others.slice(0, 3).join(', ')}`);
  }
  r.paraphrases = [];
  for (const mine of exposed.get(r.slug)) {
    for (const [slug, theirs] of exposed) {
      if (slug === r.slug) continue;
      const hit = theirs.find((t) => t.kind === mine.kind && jaccard(mine.tg, t.tg) >= 0.35);
      if (hit) {
        r.paraphrases.push(`${mine.kind} trop proche de ${slug} : « ${mine.text.slice(0, 110)} » ≈ « ${hit.text.slice(0, 110)} »`);
        break;
      }
    }
  }
}

// Tournures devenues réflexes autour des partenaires et des fermetures :
// signalées dès qu'elles apparaissent dans plus d'une fiche du corpus.
const FROZEN = [
  'moins fournie que celle des sites', 'demande en revanche un abonnement', 'ne permet pas de répondre aux messages',
  'dès trois photos de profil publiées', 'où aller à la place', 'compte gratuit, mais répondre',
];
const corpusText = new Map(data.map((d) => [d.p.slug, d.text.toLowerCase()]));
for (const r of rows) {
  const mine = corpusText.get(r.slug);
  r.frozen = FROZEN.filter((f) => mine.includes(f) && [...corpusText.values()].filter((t) => t.includes(f)).length > 1);
  // Dates relatives recopiées d'un affichage (« il y a environ 3 ans ») : périment dès la publication.
  const rel = mine.match(/il y a (environ |plus de |près de )?(\d+|un|une|deux|trois|quelques) (an|ans|mois|semaine|semaines|jour|jours)\b/);
  if (rel) r.frozen.push(`date relative « ${rel[0]} » : écrire une date (« vers 2023 », « relevé le JJ/MM/AAAA »)`);
  // Matière pauvre : sans aucune source officielle sur le lieu, une fiche longue délaye forcément.
  const p = bySlug.get(r.slug);
  if (!p.sources.some((s) => s.type === 'officiel') && r.words > 900) r.thin = true;
}

// Fins de titres de section (après les deux-points) qui reviennent dans 3 fiches ou plus.
const suffixes = new Map();
for (const p of profiles) {
  for (const s of p.sections) {
    const i = s.title.indexOf(':');
    if (i < 0) continue;
    const k = norm(s.title.slice(i + 1)).split(' ').slice(0, 4).join(' ');
    if (k.split(' ').length >= 3) suffixes.set(k, new Set([...(suffixes.get(k) || []), p.slug]));
  }
}
for (const r of rows) {
  if (/la requête « |les recherches « /.test(corpusText.get(r.slug))) r.frozen.push('requête de recherche citée dans le texte : servir la requête, ne pas la citer');
  for (const s of bySlug.get(r.slug).sections) {
    const i = s.title.indexOf(':');
    if (i < 0) continue;
    const k = norm(s.title.slice(i + 1)).split(' ').slice(0, 4).join(' ');
    // Fins de titre génériques, même isolées : elles ne portent aucun fait.
    if (/^(ce que (dit|disent|montre|montrent|change|impose|revele|revelent)|ce qui (a change|prouve)|la chronologie|lire la grille|les grilles successives|le programme (affiche|publie)|qui entrait|ou sortir|le reglement|l inventaire|la semaine du club|qui entre|l acces|les espaces listes)\b/.test(norm(s.title.slice(i + 1)))) {
      r.frozen.push(`fin de titre générique « …: ${s.title.slice(i + 1).trim()} » : la partie après les deux-points doit porter un fait`);
      continue;
    }
    if ((suffixes.get(k)?.size || 0) >= 3) r.frozen.push(`fin de titre répandue « …: ${s.title.slice(i + 1).trim()} » (${suffixes.get(k).size} fiches) : la partie après les deux-points doit porter un fait`);
  }
}

// Fiches de lieux fermés : deux fiches ne partagent pas la même suite de
// pictogrammes sur leurs trois premières sections (le « moule » preuves de
// fermeture > voisins > histoire).
const isClosed = (p) => ['ferme', 'fermeture_probable'].includes(p.status.value);
const openings = new Map();
for (const p of profiles.filter(isClosed)) {
  const k = p.sections.slice(0, 3).map((s) => s.icon || '?').join(' > ');
  openings.set(k, [...(openings.get(k) || []), p.slug]);
}
// Statut des fiches liées, pour vérifier qu'un lien vers un lieu fermé le dit.
const statusOf = new Map(profiles.map((p) => [p.slug, p.status.value]));
for (const r of rows) {
  const p = bySlug.get(r.slug);
  if (isClosed(p)) {
    const k = p.sections.slice(0, 3).map((s) => s.icon || '?').join(' > ');
    const same = openings.get(k).filter((s) => s !== r.slug);
    if (same.length) r.frozen.push(`ouverture de fiche fermée identique à ${same.slice(0, 2).join(', ')} (${k}) : changer l'ordre des premières sections`);
  }
  for (const sentence of texts(p).split(/(?<=[.!?])\s+|\n+/)) {
    for (const m of sentence.matchAll(/\]\(\/([a-z0-9-]+)\)/g)) {
      if (['ferme', 'fermeture_probable'].includes(statusOf.get(m[1])) && !/ferm/i.test(sentence)) {
        r.frozen.push(`lien vers /${m[1]} : ce lieu est fermé selon sa fiche, la phrase doit le dire`);
      }
    }
  }
  for (const l of p.officialLinks || []) {
    if (/\.(run\.app|firebaseapp\.com|web\.app|wixsite\.com|netlify\.app|vercel\.app|herokuapp\.com|github\.io)\b/.test(l.url)) {
      r.frozen.push(`lien officiel vers un hébergeur (${l.url}) : donner le domaine du club`);
    }
  }
}

// Squelettes communs : titres SEO de toutes les fiches, questions de FAQ des
// fiches fermées (nom et ville neutralisés), comparés par trigrammes.
for (const r of rows) {
  const p = bySlug.get(r.slug);
  const myTitle = trigrams(neutral(p.seo.title, p));
  const twin = profiles.find((o) => o.slug !== p.slug && jaccard(myTitle, trigrams(neutral(o.seo.title, o))) >= 0.5);
  if (twin) r.frozen.push(`titre SEO bâti comme celui de ${twin.slug} : « ${p.seo.title} » ≈ « ${twin.seo.title} »`);
  if (isClosed(p)) {
    // « Est-il encore ouvert ? » est la question légitime de tout visiteur d'un lieu fermé : elle n'est pas comptée.
    for (const q of p.faq.filter((x) => !/ouvert|ferm|tarif|prix|co[uû]t|combien|horaire|adresse|où se trouv/i.test(x.question))) {
      const mine = trigrams(neutral(q.question, p));
      const same = profiles.filter((o) => o.slug !== p.slug && isClosed(o) && o.faq.some((x) => jaccard(mine, trigrams(neutral(x.question, o))) >= 0.6));
      if (same.length >= 3) r.frozen.push(`question de FAQ commune à ${same.length} autres fiches fermées : « ${q.question} »`);
    }
  }
}

// Chapô ouvert sur l'adresse : signalé (l'adresse est déjà dans l'en-tête).
for (const r of rows) {
  if (/^(au|aux)\s+\d+/i.test(bySlug.get(r.slug).lead.trim())) r.frozen.push('chapô ouvert sur l\'adresse : ouvrir sur le fait distinctif du lieu');
}

// Alerte de lot (non bloquante) : un même fait partenaire dans plus de la moitié des fiches auditées.
if (focus.size >= 5) {
  const firstCal = rows.filter((r) => bySlug.get(r.slug).sections[0]?.icon === 'calendar').length;
  if (firstCal > rows.length * 0.6) console.log(`Alerte de lot : ${firstCal} fiches sur ${rows.length} s'ouvrent sur une section calendrier. Varier l'ouverture.`);
  const lastStar = rows.filter((r) => bySlug.get(r.slug).sections.at(-1)?.icon === 'star').length;
  if (lastStar > rows.length * 0.4) console.log(`Alerte de lot : ${lastStar} fiches sur ${rows.length} finissent par la section avis. Varier la fin.`);
  const FACTS = ['fin 2024', 'carte bancaire', 'trois photos', '3 photos', 'compte gratuit', 'netéchangisme', '7 millions', '500 000', '2018', 'à la main'];
  for (const f of FACTS) {
    const n = rows.filter((r) => corpusText.get(r.slug).includes(f)).length;
    if (n > rows.length / 2) console.log(`Alerte de lot : le fait partenaire « ${f} » figure dans ${n} fiches sur ${rows.length}. Faire tourner les faits.`);
  }
}

// Ancres Carré Libertin bâties sur la même formule (« … des couples … sur Carré Libertin »).
const formula = (a) => /des couples/.test(a) && /sur carre libertin$/.test(a);
const formulaCount = [...anchors.keys()].filter((k) => k.startsWith('carre-libertin|') && formula(k.split('|')[1])).length;
if (formulaCount > 3) {
  for (const r of rows) {
    for (const m of texts(bySlug.get(r.slug)).matchAll(AFF_LINK)) {
      if (m[2] === 'carre-libertin' && formula(norm(m[1]))) r.partner.push(`ancre Carré Libertin sur une formule répandue (${formulaCount} fiches) : « ${m[1]} »`);
    }
  }
}

const flagged = rows.filter((r) => r.sharedPct > 4 || r.banned.length || r.thin || r.partner.length || r.paraphrases.length || r.frozen.length);

// Alerte de lot (non bloquante) : trop de fiches finissent par la même paire de sections.
if (focus.size >= 5) {
  const ends = new Map();
  for (const r of rows) {
    const icons = bySlug.get(r.slug).sections.map((s) => s.icon || '?');
    const key = icons.slice(-2).join(' > ');
    ends.set(key, (ends.get(key) || 0) + 1);
  }
  for (const [key, n] of ends) {
    if (n > rows.length / 3) console.log(`\nAlerte de lot : ${n} fiches sur ${rows.length} finissent par la même paire de sections (${key}). Varier l'ordre.`);
  }
}
for (const r of flagged) {
  console.log(`\n⚠ ${r.slug}`);
  if (r.sharedPct > 4) console.log(`   ${r.sharedPct} % de séquences communes à 3+ fiches, ex. « ${r.sharedSample.join(' » / « ')} »`);
  if (r.banned.length) console.log(`   formules creuses : ${r.banned.join(', ')}`);
  if (r.thin) console.log(`   longueur à revoir : ${r.words} mots pour ${r.sources} sources${bySlug.get(r.slug).sources.some((s) => s.type === 'officiel') ? '' : ' (aucune source officielle : 900 mots maximum)'}`);
  for (const f of r.frozen) console.log(f.includes(' : ') ? `   ${f}` : `   tournure figée, déjà présente dans une autre fiche : « ${f} »`);
  for (const x of r.partner) console.log(`   lien partenaire : ${x}`);
  for (const x of r.paraphrases) console.log(`   quasi-paraphrase : ${x}`);
}
if (flagged.length) process.exitCode = 1;

// Pour aider le rédacteur à ne pas reprendre ce qui existe : ancres partenaires déjà employées.
if (process.argv.includes('--anchors')) {
  console.log('\nAncres partenaires déjà employées (à ne pas reprendre) :');
  for (const key of Object.keys(BRANDS)) {
    const list = [...anchors.keys()].filter((k) => k.startsWith(`${key}|`)).map((k) => k.split('|')[1]);
    console.log(`   ${key} (${list.length}) : ${list.slice(-60).join(' / ')}`);
  }
}
if (!flagged.length) console.log('\nAucune alerte.');

// Tournures récurrentes à l'échelle du corpus : signe que les rédacteurs convergent vers un gabarit.
const common = [...freq.entries()].filter(([, n]) => n >= Math.max(4, profiles.length * 0.15)).sort((a, b) => b[1] - a[1]).slice(0, 15);
if (common.length) {
  console.log('\nTournures les plus répétées dans le corpus :');
  for (const [s, n] of common) console.log(`   ${n}× « ${s} »`);
}
