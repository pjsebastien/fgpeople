/**
 * Faits partenaires à utiliser dans une fiche club, par rotation.
 *
 * Les audits de lot ont montré que chaque fiche reprenait le même trio de
 * faits (Gleese « fin 2024 + sans carte bancaire », Carré Libertin « trois
 * photos », Wyylde « compte gratuit »). Ce script propose, pour chaque
 * partenaire, le fait vérifié le MOINS employé dans le corpus (fiches
 * publiées et brouillons), départagé par le slug. Tous les faits viennent de
 * nos avis (data/site_reviews/) et de lib/config/affiliates.ts.
 *
 * Usage : node scripts/partner-facts.mjs <slug>
 */
import fs from 'node:fs';
import path from 'node:path';

const slug = process.argv[2];
if (!slug) throw new Error('Usage: node scripts/partner-facts.mjs <slug>');

// Chaque fait : un libellé à reprendre (reformulé librement) et les mots
// qui permettent de repérer son emploi dans une fiche.
const POOL = {
  wyylde: [
    { fact: 'ex-Netéchangisme, en ligne depuis 2001, rebaptisé Wyylde en 2018', marks: ['netéchangisme', '2001', '2018'] },
    { fact: 'revendique 7 millions de membres, la plus grosse base libertine française', marks: ['7 millions'] },
    { fact: "agenda des soirées des clubs, consultable avec un compte gratuit", marks: ['agenda'] },
    { fact: 'certification des profils, facultative, qui limite les faux comptes', marks: ['certifi'] },
    { fact: "abonnement dès 8,33 €/mois en annuel (12 mois payés d'avance), reconduction automatique à désactiver", marks: ['8,33', 'reconduction'] },
  ],
  'carre-libertin': [
    { fact: 'en ligne depuis 2007', marks: ['2007'] },
    { fact: 'plus de 500 000 inscrits', marks: ['500 000'] },
    { fact: 'environ 20 000 membres actifs chaque semaine', marks: ['20 000'] },
    { fact: 'environ 60 % de femmes et de couples selon les chiffres annoncés', marks: ['60 %', 'six membres sur dix', 'six sur dix'] },
    { fact: 'accès complet gratuit pour les femmes et les couples, avec trois photos de profil', marks: ['trois photos', '3 photos'] },
  ],
  gleese: [
    { fact: 'réseau libertin français lancé fin 2024', marks: ['fin 2024'] },
    { fact: 'inscription sans carte bancaire', marks: ['carte bancaire'] },
    { fact: 'profils vérifiés par numéro de téléphone', marks: ['téléphone'] },
    { fact: 'photos de profil modérées une à une, à la main', marks: ['à la main', 'une à une', 'modéré'] },
    { fact: 'lives HD quotidiens et messages vocaux', marks: ['live', 'vocaux'] },
    { fact: 'à partir de 3,75 €/mois en annuel, sans engagement', marks: ['3,75'] },
  ],
};

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

// Phrases qui portent un lien partenaire, dans tout le corpus sauf la fiche courante.
const sentences = { wyylde: [], 'carre-libertin': [], gleese: [] };
for (const dir of ['data/clubs/profiles', 'data/clubs/drafts']) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json') && x !== `${slug}.json`)) {
    let text;
    // Les espaces insécables (« 60 % ») sont ramenées à des espaces simples pour le repérage.
    try { text = JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))).toLowerCase().replace(/[  ]/g, ' '); } catch { continue; }
    for (const key of Object.keys(sentences)) {
      // Le paragraphe autour du lien : 400 caractères de part et d'autre.
      for (const m of text.matchAll(new RegExp(`\\(aff:${key}\\)`, 'g'))) sentences[key].push(text.slice(Math.max(0, m.index - 400), m.index + 400));
    }
  }
}

console.log(`Faits partenaires proposés pour ${slug} (les moins employés dans le corpus) :\n`);
for (const [key, pool] of Object.entries(POOL)) {
  const scored = pool.map((p, i) => ({
    ...p,
    uses: sentences[key].filter((s) => p.marks.some((m) => s.includes(m))).length,
    tie: hash(`${slug}:${key}:${i}`),
  })).sort((a, b) => a.uses - b.uses || a.tie - b.tie);
  // Des fiches rédigées en parallèle voient le même corpus : sans hasard,
  // elles retiendraient toutes le même fait « à privilégier ». On tire donc
  // le fait proposé parmi les trois moins employés, selon le slug.
  const pick = hash(`${slug}:${key}`) % Math.min(3, scored.length);
  [scored[0], scored[pick]] = [scored[pick], scored[0]];
  const total = sentences[key].length || 1;
  console.log(`${key} :`);
  console.log(`   à privilégier : ${scored[0].fact} (déjà dans ${scored[0].uses}/${total} fiches)`);
  console.log(`   autre possible : ${scored[1].fact} (${scored[1].uses}/${total})`);
  const saturated = scored.filter((s) => s.uses > total / 2).map((s) => s.fact);
  if (saturated.length) console.log(`   saturés, à éviter : ${saturated.join(' ; ')}`);
}
console.log('\nReformule librement, rattache le fait à la situation du club, et n\'en ajoute aucun qui ne figure pas dans data/site_reviews/.');
