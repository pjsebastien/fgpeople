/**
 * Script pour comparer les doublons entre les deux fichiers
 */

const oldData = require('../data/clubs_libertins_verified.json');
const newData = require('../data/fgpeople_clubs_enrichis.json');

const duplicates = [
  { newId: 'FG021', oldId: '705' },
  { newId: 'FG030', oldId: '15253' },
  { newId: 'FG031', oldId: '506' },
  { newId: 'FG065', oldId: '801' }
];

for (const dup of duplicates) {
  const newClub = newData.clubs.find(c => c.id === dup.newId);
  const oldClub = oldData.clubs.find(c => c.id === dup.oldId);

  console.log('='.repeat(70));
  console.log(`${dup.newId} vs ${dup.oldId} : ${newClub.nom}`);
  console.log('='.repeat(70));

  // Comparer chaque champ
  const fields = ['adresse', 'telephone', 'email', 'site_web'];

  for (const field of fields) {
    const newVal = newClub[field] || '';
    const oldVal = oldClub[field] || '';

    const newEmpty = newVal === '' || newVal === null || newVal === undefined;
    const oldEmpty = oldVal === '' || oldVal === null || oldVal === undefined;

    if (newEmpty && !oldEmpty) {
      console.log(`  [${field}] NOUVEAU VIDE → récupérer: "${oldVal}"`);
    } else if (!newEmpty && oldEmpty) {
      console.log(`  [${field}] nouveau ok ("${newVal.substring(0, 40)}")`);
    } else if (newVal !== oldVal && !newEmpty && !oldEmpty) {
      console.log(`  [${field}] DIFFÉRENT:`);
      console.log(`    nouveau: "${newVal.substring(0, 50)}"`);
      console.log(`    ancien:  "${oldVal.substring(0, 50)}"`);
    }
  }

  // Horaires
  const newHoraires = JSON.stringify(newClub.horaires || {});
  const oldHoraires = JSON.stringify(oldClub.horaires || {});
  if (newHoraires === '{}' && oldHoraires !== '{}') {
    console.log(`  [horaires] NOUVEAU VIDE → récupérer: ${oldHoraires.substring(0, 60)}`);
  }

  // Tarifs
  const newTarifs = JSON.stringify(newClub.tarifs || {});
  const oldTarifs = JSON.stringify(oldClub.tarifs || {});
  if (newTarifs === '{}' && oldTarifs !== '{}') {
    console.log(`  [tarifs] NOUVEAU VIDE → récupérer: ${oldTarifs.substring(0, 60)}`);
  }

  // Comparer equipements
  const newEq = newClub.equipements || [];
  const oldEq = oldClub.equipements || [];
  const missingInNew = oldEq.filter(e => !newEq.includes(e));
  if (missingInNew.length > 0) {
    console.log(`  [equipements] À AJOUTER: ${missingInNew.join(', ')}`);
  }

  console.log('');
}
