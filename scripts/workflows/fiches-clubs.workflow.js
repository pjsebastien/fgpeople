export const meta = {
  name: 'fiches-clubs',
  description: 'Fiches clubs personnalisées : qualification des nouveaux lieux, recherche, rédaction, vérification, audit qualité',
  phases: [
    { title: 'Recherche', detail: 'dossier sourcé, ou qualification d\'un nouveau lieu' },
    { title: 'Rédaction', detail: 'fiche JSON personnalisée' },
    { title: 'Vérification', detail: 'contre-vérification adversariale, reprise, verdict enregistré' },
    { title: 'Audit', detail: 'contrôle de dérive qualité sur le lot' },
  ],
}

// Lancé par le travail de nuit (data/clubs/NIGHTLY.md) avec la sortie de
// `node scripts/club-queue.mjs --next <n>` : chaque élément reprend à
// l'étape où il s'était arrêté. L'état vit dans les fichiers (dossier,
// brouillon, marque de vérification), jamais dans ce script : un lot
// interrompu se relance sans rien perdre.

const REPO = 'C:/Users/pjseb/OneDrive/Desktop/fgpeople'
const { items, today, gold = [] } = args

const RESEARCH = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    status: { type: 'string', enum: ['ouvert', 'ferme', 'fermeture_probable', 'incertain'] },
    sourceCount: { type: 'number' },
    duplicates: {
      type: 'array',
      description: 'Autres fiches de NOTRE base qui désignent le même lieu, avec la preuve',
      items: { type: 'object', properties: { slug: { type: 'string' }, evidence: { type: 'string' } }, required: ['slug', 'evidence'] },
    },
  },
  required: ['slug', 'status', 'sourceCount', 'duplicates'],
}
const QUALIFY = {
  type: 'object',
  properties: {
    decision: { type: 'string', enum: ['added', 'rejected'] },
    slug: { type: 'string', description: 'Slug de la fiche créée (si added)' },
    reason: { type: 'string' },
  },
  required: ['decision', 'reason'],
}
const WRITE = {
  type: 'object',
  properties: { slug: { type: 'string' }, words: { type: 'number' }, valid: { type: 'boolean' } },
  required: ['slug', 'words', 'valid'],
}
const SCORE = { type: 'number', minimum: 1, maximum: 5 }
const VERIFY = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    scores: {
      type: 'object',
      properties: { exactitude: SCORE, specificite: SCORE, profondeur: SCORE, requetes: SCORE, utilite: SCORE, honnetete: SCORE },
      required: ['exactitude', 'specificite', 'profondeur', 'requetes', 'utilite', 'honnetete'],
    },
    remainingIssues: { type: 'array', items: { type: 'string' } },
    publishable: { type: 'boolean' },
    marked: { type: 'boolean', description: 'mark-verified.mjs a bien été exécuté avec succès' },
  },
  required: ['slug', 'scores', 'remainingIssues', 'publishable', 'marked'],
}
const AUDIT = {
  type: 'object',
  properties: {
    batchScore: { type: 'number' },
    drift: { type: 'string' },
    issues: {
      type: 'array',
      items: { type: 'object', properties: { slug: { type: 'string' }, problem: { type: 'string' }, severity: { type: 'string', enum: ['bloquant', 'mineur'] } }, required: ['slug', 'problem', 'severity'] },
    },
    playbookSuggestions: { type: 'array', items: { type: 'string' } },
  },
  required: ['batchScore', 'drift', 'issues', 'playbookSuggestions'],
}
const DONE = { type: 'object', properties: { ok: { type: 'boolean' }, notes: { type: 'string' } }, required: ['ok', 'notes'] }

const COMMON = `Projet : fgpeople.com, annuaire français de clubs libertins (établissements légaux pour adultes). Dépôt : ${REPO} (travaille depuis ce dossier). Date du jour : ${today}.
Le standard à suivre est data/clubs/PLAYBOOK.md : lis-le en entier avant toute chose et respecte ses règles absolues (rien d'inventé, pas de copie, pas de données personnelles, pas d'accès privé, FG People jamais source).`

const draftPath = (slug) => `data/clubs/drafts/${slug}.json`
const LIGHT = 'Club sans aucun trafic Search Console : recherche ALLÉGÉE. Vise 5 à 10 sources, en allant à l\'essentiel : statut (ouvert ou fermé, preuves datées), site officiel ou ses archives, registre des entreprises, horaires, tarifs, public admis, ce qui distingue le lieu. Ne t\'acharne pas sur les pistes secondaires.'

function researchPrompt(slug, depth) {
  return `${COMMON}

Ta mission : la RECHERCHE documentaire (Phase 1 du playbook) pour le club \`${slug}\`. Tu ne rédiges pas la fiche.
${depth === 'light' ? LIGHT : 'Recherche COMPLÈTE : un club documenté doit donner 8 à 20 sources ; pour un club obscur, épuise les pistes (téléphone, adresse, ancien nom, société) avant de conclure.'}

1. \`node scripts/club-context.mjs ${slug}\` : fiche brute de la base (non vérifiée), requêtes Search Console, clubs proches, doublons possibles.
2. Cherche avec les outils du playbook (WebSearch en mode extended, WebFetch, registre via curl, archives Wayback). Charge WebSearch/WebFetch avec ToolSearch ("select:WebSearch,WebFetch").
3. Tranche le statut selon les règles de décision du playbook.
4. Doublons dans notre base : établis-les sur preuve uniquement (section « Doublons » du dossier).
5. Écris le dossier data/clubs/research/${slug}.md au format du playbook, ET data/clubs/research/${slug}.missing.json : les lieux libertins proches absents de notre base ([] si aucun ; vérifie avec \`node scripts/find-club.mjs\`).
N'écris aucun autre fichier.
Si WebSearch refuse plus de deux de tes requêtes (quota), écris dans le dossier la mention exacte « WebSearch indisponible » et la liste des requêtes non faites : le club repassera en recherche complémentaire.`
}

function complementPrompt(slug, published) {
  const file = published ? `data/clubs/profiles/${slug}.json` : draftPath(slug)
  return `${COMMON}

Ta mission : la RECHERCHE COMPLÉMENTAIRE du club \`${slug}\`. Son dossier data/clubs/research/${slug}.md a été constitué sans recherche web (quota WebSearch épuisé le 16/10/2026) : il y manque ce que seule une recherche fait remonter (presse régionale, notes et avis publics, concurrence locale, annonces de fermeture ou de reprise, réseaux sociaux, ancien nom).
${published ? 'La fiche est DÉJÀ PUBLIÉE' : 'La fiche est un brouillon'} : ${file}.

1. Lis le dossier et la fiche. Charge WebSearch/WebFetch (ToolSearch "select:WebSearch,WebFetch").
2. Lance au moins 6 requêtes WebSearch en mode extended, aux angles différents : « <nom> <ville> », « <nom> avis », « <nom> <ville> » + quotidien régional, « <nom> fermé / fermeture / reprise », « club libertin <ville> » (concurrence et alternatives), « <adresse> », et ce que le dossier liste en « pistes sans résultat ». Ouvre les résultats pertinents.
3. Ajoute à la fin du dossier une section qui commence exactement par « ## Recherche complémentaire (${today}) » : requêtes lancées, nouvelles sources (numérotées à la suite des existantes), faits nouveaux avec niveau de confiance, et contradictions avec la fiche.
4. Intègre dans la fiche les faits nouveaux utiles au visiteur (compléments, corrections, nouvelles sources, glance/highlights si pertinent). Un fait nouveau qui contredit la fiche (statut, adresse, tarifs) la corrige. Rien d'inventé ; respecte le playbook (lisibilité, liens partenaires inchangés sauf nécessité).
5. Ajoute les lieux libertins nouveaux repérés et absents de notre base à data/clubs/research/${slug}.missing.json (\`node scripts/find-club.mjs\` pour vérifier).
6. Valide : \`REQUIRE_SKIM=1 node scripts/build-club-profiles.mjs --check ${file}\` et \`node scripts/audit-club-profiles.mjs ${slug}\`.
S'il n'y a vraiment rien de nouveau, écris-le dans la section du dossier (requêtes et résultats nuls) : c'est une information.
Si WebSearch refuse plus de deux de tes requêtes (quota), intitule la section « ## Recherche complémentaire partielle (${today}) » : le club repassera plus tard pour les requêtes manquantes, que tu listes.`
}

function verifyPublishedPrompt(slug) {
  return `${COMMON}

Ta mission : CONTRE-VÉRIFIER les ajouts faits aujourd'hui à la fiche PUBLIÉE data/clubs/profiles/${slug}.json par une recherche complémentaire (section « ## Recherche complémentaire » à la fin de data/clubs/research/${slug}.md). Tu es un contradicteur.
1. Repère ce qui a changé dans la fiche (\`git diff -- data/clubs/profiles/${slug}.json\`).
2. Rouvre les sources de chaque fait ajouté ou modifié. Une source qui ne dit pas ce que la fiche lui attribue → corrige ou supprime ; un fait douteux → requalifie (a_verifier + réserve).
3. Vérifie que les ajouts respectent le playbook (lisibilité, pas de formule creuse, liens partenaires corrects).
4. Valide : \`REQUIRE_SKIM=1 node scripts/build-club-profiles.mjs --check data/clubs/profiles/${slug}.json\` et \`node scripts/audit-club-profiles.mjs ${slug}\` sans erreur ni alerte.`
}

function qualifyPrompt(c, key) {
  return `${COMMON}

Ta mission : QUALIFIER un lieu repéré pendant nos recherches et absent de notre base, selon la section « Ajouter un lieu absent de la base » du playbook.
Lieu : « ${c.nom} », ${c.ville}${c.url ? `, ${c.url}` : ''} (repéré dans le dossier de ${c.foundIn.join(', ')}). Fichier de file : data/clubs/candidates/${key}.json.

1. Doublon ? \`node scripts/find-club.mjs\` par nom, par ville, puis par adresse et téléphone une fois connus. Regarde aussi les autres fichiers de data/clubs/candidates/ (même lieu sous un autre libellé).
2. Recherche Phase 1 complète (WebSearch extended, WebFetch, registre, archives) : existence, activité, périmètre.
3. Décision :
   - Rejeté (doublon, fermé, introuvable, hors périmètre) : mets à jour data/clubs/candidates/${key}.json avec "status": "rejected", "reason" (et "duplicateOf" si doublon). N'écris rien d'autre.
   - Retenu : écris data/clubs/new/<slug>.json (format du playbook, libellés de \`node scripts/find-club.mjs --dept <code>\`), le dossier data/clubs/research/<slug>.md et data/clubs/research/<slug>.missing.json, puis mets la file à "status": "added", "slug": "<slug>". Vérifie que \`node scripts/club-context.mjs <slug>\` fonctionne.
Tu ne rédiges pas la fiche personnalisée.
Si WebSearch refuse tes requêtes (quota), n'écarte JAMAIS le lieu faute de résultats : laisse la file en "status": "todo", ajoute "retry": "<raison>", et réponds decision "rejected" avec la raison « recherche impossible, à reprendre ».`
}

function writePrompt(slug, depth) {
  return `${COMMON}

Ta mission : RÉDIGER la fiche personnalisée du club \`${slug}\` (Phase 2 du playbook).
Dossier de recherche : data/clubs/research/${slug}.md. Lance \`node scripts/club-context.mjs ${slug}\` (requêtes Search Console, liens internes possibles) et \`node scripts/audit-club-profiles.mjs --anchors\` (ancres partenaires déjà employées, à ne pas reprendre). Schéma : lib/types/club-profile.ts. Ne t'inspire d'aucune autre fiche existante.
${depth === 'light' ? 'Club sans trafic : vise une fiche courte et dense (250 à 900 mots selon la matière).' : ''}

- N'utilise que les faits du dossier ; si tu rouvres une source, ajoute ce que tu trouves au dossier.
- Plan, titres, longueur et angle dictés par la matière et les requêtes de CE club. Renseigne \`display\` si la base a le nom ou la ville en capitales ou sans accents.
- Lisibilité (section du playbook) : \`glance\`, \`audience\` (club ouvert), \`highlights\`, et pour chaque section \`icon\` + \`summary\` ; paragraphes courts, listes et tableaux plutôt que des pavés.
- Écris le JSON dans ${draftPath(slug)}.
- Valide avec \`REQUIRE_SKIM=1 node scripts/build-club-profiles.mjs --check ${draftPath(slug)}\` et \`node scripts/audit-club-profiles.mjs ${slug}\` jusqu'à zéro erreur et zéro alerte.`
}

function verifyPrompt(slug, second) {
  return `${COMMON}

Ta mission : CONTRE-VÉRIFIER la fiche ${draftPath(slug)} (Phase 3 du playbook). Tu es un contradicteur : pars du principe qu'elle contient des erreurs, des affirmations non sourcées, des tournures creuses ou interchangeables.${second ? ' (Deuxième passage après reprise : vérifie que les problèmes signalés sont réglés.)' : ''}
Dossier : data/clubs/research/${slug}.md.

1. Rouvre (WebFetch, curl) les sources des faits qui comptent : statut, tarifs, horaires, dates, chiffres, notes. Une source qui ne dit pas ce que la fiche lui attribue → corrige ou supprime.
2. Chaque phrase factuelle doit s'appuyer sur une source listée ; sinon supprime-la ou requalifie-la (a_verifier + réserve écrite).
3. Statut conforme aux règles de décision ; aucune copie, formule interdite ou phrase interchangeable ; requêtes Search Console principales servies (\`node scripts/club-context.mjs ${slug}\`) ; trois liens partenaires utiles et conformes à nos avis ; blocs de lecture rapide (glance, audience, highlights, summary de chaque section) exacts et fidèles au texte ; \`display\` renseigné si la base a le nom ou la ville en capitales.
4. Corrige toi-même le JSON (et le dossier si besoin). Relance \`REQUIRE_SKIM=1 node scripts/build-club-profiles.mjs --check ${draftPath(slug)}\` et \`node scripts/audit-club-profiles.mjs ${slug}\`.
5. Note la fiche APRÈS corrections selon la grille du playbook (1 à 5, exigeant). publishable = true seulement si plus aucun fait non sourcé ni problème bloquant.
6. DERNIÈRE ACTION, obligatoire, après toute modification : \`node scripts/mark-verified.mjs ${slug} --scores '<tes notes en JSON>' --publishable <true|false>\`.`
}

function repairPrompt(slug, issues, minorOnly) {
  return `${COMMON}

Ta mission : REPRENDRE la fiche ${draftPath(slug)} pour régler ces problèmes relevés par la vérification ou l'audit qualité :
${issues.map((i) => `- ${i}`).join('\n')}

Dossier : data/clubs/research/${slug}.md. Tu peux compléter la recherche (WebSearch/WebFetch via ToolSearch, curl) si un problème vient d'un manque de matière ; ajoute alors les sources au dossier. Ne règle jamais un problème en inventant.
Valide avec \`REQUIRE_SKIM=1 node scripts/build-club-profiles.mjs --check ${draftPath(slug)}\` et \`node scripts/audit-club-profiles.mjs ${slug}\`.${minorOnly ? `
Ces reprises sont mineures (formulation, ancres, ordre) : une fois terminées et validées, lance \`node scripts/mark-verified.mjs ${slug} --after-repair\`.` : ''}`
}

const avg = (s) => (s.exactitude + s.specificite + s.profondeur + s.requetes + s.utilite + s.honnetete) / 6
const weak = (v) => !v.publishable || avg(v.scores) < 4 || Object.values(v.scores).some((x) => x < 3)

const results = await pipeline(
  items,
  // Étape 1 : qualification d'un nouveau lieu, ou recherche.
  async (it) => {
    const label = it.slug || it.key
    if (it.from === 'qualify') {
      const q = await agent(qualifyPrompt(it.candidate, it.key), { label: `qualification:${label}`, phase: 'Recherche', schema: QUALIFY })
      if (!q || q.decision !== 'added' || !q.slug) return { ...it, stop: q ? `écarté : ${q.reason}` : 'qualification échouée' }
      return { ...it, slug: q.slug, from: 'write', added: true }
    }
    if (it.from === 'complement' || it.from === 'complement-published') {
      const published = it.from === 'complement-published'
      const c = await agent(complementPrompt(it.slug, published), { label: `complément:${label}`, phase: 'Recherche', schema: DONE })
      if (!c) return { ...it, stop: 'recherche complémentaire échouée' }
      return { ...it, from: published ? 'verify-published' : it.hasDraft ? 'verify' : 'write' }
    }
    if (it.from === 'research') {
      const r = await agent(researchPrompt(it.slug, it.depth), { label: `recherche:${label}`, phase: 'Recherche', schema: RESEARCH })
      if (!r) return { ...it, stop: 'recherche échouée' }
      return { ...it, from: 'write', duplicates: r.duplicates, researchStatus: r.status }
    }
    return it
  },
  // Étape 2 : rédaction.
  async (it) => {
    if (it.stop || it.from !== 'write') return it
    const w = await agent(writePrompt(it.slug, it.depth), { label: `rédaction:${it.slug}`, phase: 'Rédaction', schema: WRITE })
    if (!w) return { ...it, stop: 'rédaction échouée' }
    return { ...it, from: 'verify', words: w.words }
  },
  // Étape 3 : vérification, reprise si nécessaire, verdict enregistré sur disque.
  async (it) => {
    if (!it.stop && it.from === 'verify-published') {
      const v = await agent(verifyPublishedPrompt(it.slug), { label: `vérif-publiée:${it.slug}`, phase: 'Vérification', schema: DONE, effort: 'high' })
      return v ? { ...it, published: true } : { ...it, stop: 'vérification de la fiche publiée échouée' }
    }
    if (it.stop || it.from !== 'verify') return it
    let v = await agent(verifyPrompt(it.slug, false), { label: `vérif:${it.slug}`, phase: 'Vérification', schema: VERIFY, effort: 'high' })
    if (!v) return { ...it, stop: 'vérification échouée' }
    if (weak(v)) {
      const issues = v.remainingIssues.length ? v.remainingIssues : [`Notes insuffisantes : ${JSON.stringify(v.scores)}. Relève le niveau sur les critères faibles.`]
      await agent(repairPrompt(it.slug, issues, false), { label: `reprise:${it.slug}`, phase: 'Vérification', schema: DONE })
      v = await agent(verifyPrompt(it.slug, true), { label: `vérif2:${it.slug}`, phase: 'Vérification', schema: VERIFY, effort: 'high' })
      if (!v) return { ...it, stop: 'seconde vérification échouée' }
    }
    return { ...it, verify: v }
  },
)

const all = results.filter(Boolean)
const verified = all.filter((r) => r.verify && r.verify.publishable)
log(`${verified.length} fiche(s) vérifiée(s) publiable(s) sur ${items.length} élément(s)`)

let audit = null
let auditRepairs = []
if (verified.length >= 2) {
  phase('Audit')
  audit = await agent(`${COMMON}

Ta mission : AUDIT QUALITÉ du lot de fiches clubs qui vient d'être vérifié, pour détecter toute baisse de qualité ou dérive vers un gabarit.
Fiches du lot (brouillons) : ${verified.map((d) => draftPath(d.slug)).join(', ')}.
Fiches de référence déjà publiées (niveau attendu, et points de comparaison pour détecter un plan type commun) : ${gold.map((g) => `data/clubs/profiles/${g}.json`).join(', ')}.
Notes de la vérification : ${JSON.stringify(verified.map((d) => ({ slug: d.slug, scores: d.verify.scores })))}

1. \`node scripts/audit-club-profiles.mjs ${verified.map((d) => d.slug).join(' ')}\` (séquences communes, formules creuses, ancres partenaires réutilisées, quasi-paraphrases).
2. Lis en entier au moins ${Math.min(verified.length, 5)} fiches du lot (les moins bien notées et d'autres au hasard), avec leurs dossiers. Pour chacune, rouvre au moins 2 sources pour vérifier des faits au hasard.
3. Les titres, chapôs et l'ordre des sections convergent-ils vers un plan type, entre elles ou avec les références ? La profondeur exploite-t-elle toute la matière du dossier ?
4. Ne signale que des problèmes réels et précis (bloquant = fait faux ou non sourcé, statut mal tranché, copie, fiche interchangeable ou nettement sous le niveau ; mineur = le reste). Ne modifie aucun fichier.`, { label: 'audit:lot', phase: 'Audit', schema: AUDIT, effort: 'high' })

  if (audit) {
    const bySlug = {}
    for (const i of audit.issues.filter((x) => verified.find((d) => d.slug === x.slug))) {
      (bySlug[i.slug] = bySlug[i.slug] || { issues: [], blocking: false }).issues.push(`[${i.severity}] ${i.problem}`)
      if (i.severity === 'bloquant') bySlug[i.slug].blocking = true
    }
    // Problème mineur : reprise puis verdict conservé. Problème bloquant :
    // reprise puis nouvelle vérification complète.
    auditRepairs = await parallel(Object.entries(bySlug).map(([slug, x]) => async () => {
      await agent(repairPrompt(slug, x.issues, !x.blocking), { label: `reprise-audit:${slug}`, phase: 'Audit', schema: DONE })
      if (x.blocking) await agent(verifyPrompt(slug, true), { label: `vérif-audit:${slug}`, phase: 'Audit', schema: VERIFY, effort: 'high' })
      return slug
    }))
  }
}

return {
  done: all.map((r) => ({
    slug: r.slug || r.key,
    kind: r.kind,
    added: !!r.added,
    stop: r.stop || null,
    scores: r.verify ? r.verify.scores : null,
    publishable: r.verify ? r.verify.publishable : null,
    duplicates: r.duplicates && r.duplicates.length ? r.duplicates : undefined,
  })),
  audit: audit ? { batchScore: audit.batchScore, drift: audit.drift, issues: audit.issues.length, suggestions: audit.playbookSuggestions } : null,
  auditRepairs: auditRepairs.filter(Boolean),
}
