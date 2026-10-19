/**
 * Marque un brouillon de fiche comme vérifié, en gardant l'empreinte de
 * son contenu : si le brouillon est modifié ensuite, la marque ne vaut
 * plus et la fiche repasse en vérification.
 *
 * Appelé par l'agent vérificateur en toute fin de travail.
 *
 * Usage :
 *   node scripts/mark-verified.mjs <slug> --scores '{"exactitude":5,...}' --publishable true|false
 *   node scripts/mark-verified.mjs <slug> --after-repair   (reprise mineure : conserve les notes)
 */
import fs from 'node:fs';
import crypto from 'node:crypto';

const [slug, ...rest] = process.argv.slice(2);
if (!slug) throw new Error('Usage: node scripts/mark-verified.mjs <slug> --scores <json> --publishable <bool>');

const draft = `data/clubs/drafts/${slug}.json`;
const marker = `data/clubs/verified/${slug}.json`;
if (!fs.existsSync(draft)) throw new Error(`Aucun brouillon : ${draft}`);

const arg = (name) => {
  const i = rest.indexOf(name);
  return i >= 0 ? rest[i + 1] : undefined;
};

export const hashDraft = (file) => crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex');

let data;
if (rest.includes('--after-repair')) {
  if (!fs.existsSync(marker)) throw new Error('Aucune vérification antérieure : lancer une vérification complète');
  data = { ...JSON.parse(fs.readFileSync(marker, 'utf8')), repairedAt: new Date().toISOString() };
} else {
  const scores = JSON.parse(arg('--scores') || 'null');
  const keys = ['exactitude', 'specificite', 'profondeur', 'requetes', 'utilite', 'honnetete'];
  if (!scores || !keys.every((k) => typeof scores[k] === 'number')) throw new Error(`--scores doit contenir ${keys.join(', ')}`);
  const vals = keys.map((k) => scores[k]);
  // Un dossier fait sans recherche web (quota épuisé) manque de presse, de notes et de concurrence :
  // il ne peut pas être déclaré publiable tant qu'une recherche complémentaire n'y figure pas.
  const dossier = fs.existsSync(`data/clubs/research/${slug}.md`) ? fs.readFileSync(`data/clubs/research/${slug}.md`, 'utf8') : '';
  const noSearch = /websearch (indisponible|épuisé|non disponible)|quota (websearch|de recherche)|quota.{0,20}épuisé|budget websearch/i.test(dossier);
  if (noSearch && !/^## Recherche complémentaire \(/m.test(dossier) && arg('--publishable') === 'true') {
    console.error(`${slug} : dossier fait sans recherche web et sans « ## Recherche complémentaire » : publication refusée. Faire d'abord la recherche complémentaire.`);
    process.exit(1);
  }
  data = {
    slug,
    scores,
    average: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100,
    publishable: arg('--publishable') === 'true',
    verifiedAt: new Date().toISOString(),
  };
}
data.draftHash = hashDraft(draft);

fs.mkdirSync('data/clubs/verified', { recursive: true });
fs.writeFileSync(marker, JSON.stringify(data, null, 2) + '\n');
console.log(`${slug} : vérification enregistrée (moyenne ${data.average}, publiable : ${data.publishable})`);
