/**
 * Publie des brouillons de fiches clubs : validation, déplacement de
 * data/clubs/drafts/ vers data/clubs/profiles/, puis régénération de
 * data/clubs/profiles.generated.json.
 *
 * Un brouillon invalide reste dans drafts/ et fait échouer le script.
 *
 * Usage : node scripts/promote-club-drafts.mjs <slug...>
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const slugs = process.argv.slice(2);
if (!slugs.length) throw new Error('Usage: node scripts/promote-club-drafts.mjs <slug...>');

const promoted = [];
let failed = 0;
for (const slug of slugs) {
  const draft = `data/clubs/drafts/${slug}.json`;
  if (!fs.existsSync(draft)) {
    console.error(`✗ ${slug} : aucun brouillon`);
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
