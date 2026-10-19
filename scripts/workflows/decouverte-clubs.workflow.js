export const meta = {
  name: 'decouverte-clubs',
  description: 'Balayage département par département des lieux libertins absents de notre base',
  phases: [{ title: 'Balayage', detail: 'un agent par département' }],
}

// Lancé par le travail de nuit (data/clubs/NIGHTLY.md) quand la file des
// nouveaux lieux est presque vide. Chaque agent recense les lieux de son
// département et écrit ceux qui manquent dans
// data/clubs/research/_dept-<code>.missing.json, que
// scripts/collect-candidates.mjs verse ensuite dans la file de qualification.

const REPO = 'C:/Users/pjseb/OneDrive/Desktop/fgpeople'
const { departements, today } = args

const RESULT = {
  type: 'object',
  properties: { code: { type: 'string' }, found: { type: 'number' }, missing: { type: 'number' } },
  required: ['code', 'found', 'missing'],
}

const results = await parallel(departements.map((d) => () => agent(`Projet : fgpeople.com, annuaire français de clubs libertins (établissements légaux pour adultes). Dépôt : ${REPO}. Date du jour : ${today}.
Lis la section « Ajouter un lieu absent de la base » de data/clubs/PLAYBOOK.md (périmètre) et ses règles absolues.

Ta mission : RECENSER tous les lieux libertins en activité du département ${d.nom} (${d.code}), pour que notre annuaire n'en manque aucun.

1. \`node scripts/find-club.mjs --dept ${d.code}\` puis \`node scripts/find-club.mjs "${d.nom}"\` : ce que notre base connaît déjà.
2. Cherche largement (ToolSearch "select:WebSearch,WebFetch" ; WebSearch en mode extended) : « club libertin ${d.nom} », « club échangiste <chef-lieu et grandes villes> », « sauna libertin / mixte / gay <villes> », « spa libertin », « bar libertin », « club BDSM », « camping libertin » ; pages Pages Jaunes « clubs libertins » du département ; annuaires spécialisés (sources faibles, servent à repérer) ; registre des entreprises (NAF 93.29Z, 96.04Z, 56.30Z) pour les enseignes explicites.
3. Pour chaque lieu repéré : est-il dans notre base sous ce nom ou un autre (\`node scripts/find-club.mjs\` par nom, ville, téléphone) ? Est-il dans le périmètre ? Y a-t-il un signe d'activité récent ?
4. Écris data/clubs/research/_dept-${d.code}.missing.json : tableau [{"nom", "ville", "url", "foundIn": "_dept-${d.code}"}] des lieux ABSENTS de notre base, dans le périmètre et apparemment actifs ([] si aucun). Ne crée aucun autre fichier : la qualification détaillée sera faite ensuite.`, { label: `dept:${d.code}`, phase: 'Balayage', schema: RESULT })))

return results.filter(Boolean)
