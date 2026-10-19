/**
 * Prochains départements à balayer pour trouver les lieux absents de la base.
 *
 * Usage :
 *   node scripts/discovery-next.mjs <n>            départements à balayer (JSON)
 *   node scripts/discovery-next.mjs --done <code>… marque des départements comme balayés
 */
import fs from 'node:fs';

const FILE = 'data/clubs/discovery.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const args = process.argv.slice(2);
const today = new Date().toISOString().slice(0, 10);

if (args[0] === '--done') {
  for (const d of data.departements) if (args.slice(1).includes(d.code)) d.sweptAt = today;
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
  console.log(`${args.length - 1} département(s) marqué(s) balayé(s)`);
} else {
  const stale = (d) => !d.sweptAt || (Date.now() - Date.parse(d.sweptAt)) / 86_400_000 > 90;
  console.log(JSON.stringify(data.departements.filter(stale).slice(0, Number(args[0] || 10)).map(({ code, nom }) => ({ code, nom }))));
}
