/**
 * Publie des brouillons de fiches clubs : validation, déplacement de
 * data/clubs/drafts/ vers data/clubs/profiles/, puis régénération de
 * data/clubs/profiles.generated.json.
 *
 * Un brouillon invalide reste dans drafts/ et fait échouer le script.
 *
 * Usage : node scripts/promote-club-drafts.mjs [--force] <slug...>
 *   --force : publie sans marque de vérification (fiches vérifiées avant la mise en place des marques).
 */
import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const force = process.argv.includes('--force');
const slugs = process.argv.slice(2).filter((a) => a !== '--force');
if (!slugs.length) throw new Error('Usage: node scripts/promote-club-drafts.mjs [--force] <slug...>');

const promoted = [];
let failed = 0;
for (const slug of slugs) {
  const draft = `data/clubs/drafts/${slug}.json`;
  if (!fs.existsSync(draft)) {
    console.error(`✗ ${slug} : aucun brouillon`);
    failed++;
    continue;
  }
  // Seule une fiche vérifiée dans son état actuel est publiée (voir mark-verified.mjs).
  const marker = `data/clubs/verified/${slug}.json`;
  const m = fs.existsSync(marker) ? JSON.parse(fs.readFileSync(marker, 'utf8')) : null;
  const current = crypto.createHash('sha1').update(fs.readFileSync(draft)).digest('hex');
  if (!force && (!m || !m.publishable || m.draftHash !== current)) {
    console.error(`✗ ${slug} : ${!m ? 'jamais vérifiée' : !m.publishable ? 'jugée non publiable' : 'modifiée depuis sa vérification'}`);
    failed++;
    continue;
  }
  try {
    execFileSync(process.execPath, ['scripts/build-club-profiles.mjs', '--check', draft], { stdio: 'pipe' });
  } catch (e) {
    console.error(`✗ ${slug} : brouillon invalide\n${e.stdout}${e.stderr}`);
    failed++;
    continue;
  }
  fs.renameSync(draft, `data/clubs/profiles/${slug}.json`);
  promoted.push(slug);
}

execFileSync(process.execPath, ['scripts/build-club-profiles.mjs'], { stdio: 'inherit' });
console.log(`${promoted.length} fiche(s) publiée(s) : ${promoted.join(', ')}`);
if (failed) process.exit(1);
