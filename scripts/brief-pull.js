#!/usr/bin/env node
/**
 * Récupère un brief d'avis pour que je puisse le lire et rédiger l'article.
 *
 *   npm run brief:pull avis-wyylde     → un brief précis
 *   npm run brief:pull                 → liste les briefs disponibles
 *
 * Produit dans .briefs/<slug>/ :
 *   brief.md          le brief mis en forme, lisible d'un coup d'œil
 *   assets.json       les métadonnées de chaque média (URL Cloudinary comprise)
 *   assets/           les images téléchargées, pour que je les analyse visuellement
 *
 * Le dossier .briefs/ est ignoré par git : c'est un espace de travail local.
 * Les URLs référencées dans l'article final restent celles de Cloudinary.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_ROOT = path.join(ROOT, '.briefs');

// ============================================
// Chargement de .env.local (sans dépendance)
// ============================================
function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    for (const raw of fs.readFileSync(p, 'utf8').split('\n')) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('✖ SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants dans .env.local');
  console.error('  Astuce : npx vercel env pull .env.local');
  process.exit(1);
}

// ============================================
// Accès PostgREST
// ============================================
async function query(table, params) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${params}`;
  const res = await fetch(url, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Supabase ${res.status} sur ${table} : ${await res.text()}`);
  }
  return res.json();
}

// ============================================
// Mise en forme
// ============================================
function section(title, body) {
  if (!body || !String(body).trim()) return '';
  return `\n## ${title}\n\n${String(body).trim()}\n`;
}

function buildMarkdown(brief, assets) {
  const lines = [];
  lines.push(`# Brief — ${brief.site_name}`);
  lines.push('');
  lines.push(`- **Slug de la page** : \`${brief.slug}\` → https://www.fgpeople.com/${brief.slug}`);
  lines.push(`- **Statut** : ${brief.status}`);
  if (brief.site_url) lines.push(`- **Site officiel** : ${brief.site_url}`);
  lines.push(
    `- **Lien d'affiliation** : ${brief.affiliate_url || '⚠ MANQUANT — à demander avant publication'}`
  );
  if (brief.target_keywords) lines.push(`- **Mots-clés visés** : ${brief.target_keywords}`);
  lines.push(`- **Dernière modification** : ${brief.updated_at}`);
  lines.push('');

  lines.push(section('Instructions personnelles', brief.instructions));
  lines.push(section('Expérience vécue du site', brief.personal_experience));
  lines.push(section('Points forts constatés', brief.pros_notes));
  lines.push(section('Points faibles constatés', brief.cons_notes));
  lines.push(section('Tarifs relevés', brief.pricing_notes));
  lines.push(section('Chiffres clés', brief.key_facts));

  lines.push(`\n## Médias (${assets.length})\n`);
  if (assets.length === 0) {
    lines.push('_Aucun média fourni._\n');
  } else {
    assets.forEach((a, i) => {
      const num = String(i + 1).padStart(2, '0');
      lines.push(`### ${num} · ${a.kind}${a.label ? ` — ${a.label}` : ''}`);
      lines.push('');
      lines.push(`- URL : ${a.url}`);
      if (a.localPath) lines.push(`- Fichier local à analyser : \`${a.localPath}\``);
      if (a.width && a.height) lines.push(`- Dimensions : ${a.width}×${a.height}`);
      if (a.instruction) lines.push(`- **Consigne de placement** : ${a.instruction}`);
      if (!a.label) lines.push(`- _Non annoté → identifier le contenu depuis l'image._`);
      lines.push('');
    });
  }

  return lines.filter(Boolean).join('\n');
}

// ============================================
// Téléchargement des médias
// ============================================
async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

// ============================================
// Programme
// ============================================
async function main() {
  const slug = process.argv[2];

  if (!slug) {
    const briefs = await query('site_briefs', 'select=slug,site_name,status,updated_at&order=updated_at.desc');
    if (briefs.length === 0) {
      console.log('Aucun brief. Crée-en un sur /admin/sites.');
      return;
    }
    console.log('\nBriefs disponibles :\n');
    for (const b of briefs) {
      console.log(`  ${b.slug.padEnd(28)} ${b.site_name.padEnd(20)} [${b.status}]`);
    }
    console.log('\nUsage : npm run brief:pull <slug>\n');
    return;
  }

  const [brief] = await query('site_briefs', `slug=eq.${encodeURIComponent(slug)}&select=*`);
  if (!brief) {
    console.error(`✖ Aucun brief avec le slug « ${slug} »`);
    process.exit(1);
  }

  const assets = await query(
    'site_brief_assets',
    `brief_id=eq.${brief.id}&select=*&order=sort_order.asc,created_at.asc`
  );

  const outDir = path.join(OUT_ROOT, slug);
  const assetDir = path.join(outDir, 'assets');
  fs.mkdirSync(assetDir, { recursive: true });

  // Téléchargement des images et vidéos (pas les liens YouTube)
  let downloaded = 0;
  for (let i = 0; i < assets.length; i++) {
    const a = assets[i];
    if (a.kind === 'youtube') continue;
    const ext = a.format ? `.${a.format}` : path.extname(new URL(a.url).pathname) || '.bin';
    const name = `${String(i + 1).padStart(2, '0')}-${a.kind}${ext}`;
    const dest = path.join(assetDir, name);
    try {
      const bytes = await download(a.url, dest);
      a.localPath = path.relative(ROOT, dest).replace(/\\/g, '/');
      downloaded++;
      console.log(`  ✓ ${name} (${Math.round(bytes / 1024)} Ko)`);
    } catch (err) {
      console.warn(`  ✖ ${name} : ${err.message}`);
    }
  }

  fs.writeFileSync(path.join(outDir, 'brief.md'), buildMarkdown(brief, assets), 'utf8');
  fs.writeFileSync(path.join(outDir, 'assets.json'), JSON.stringify(assets, null, 2), 'utf8');

  const rel = path.relative(ROOT, outDir).replace(/\\/g, '/');
  console.log(`\n✓ Brief « ${brief.site_name} » récupéré`);
  console.log(`  ${assets.length} média(s), ${downloaded} téléchargé(s)`);
  console.log(`\n  Dis-moi simplement : « rédige l'avis ${slug} »`);
  console.log(`  (je lirai ${rel}/brief.md et j'analyserai les images de ${rel}/assets/)\n`);
}

main().catch((err) => {
  console.error('✖', err.message);
  process.exit(1);
});
