/**
 * Script pour ajouter des équipements par défaut selon le type d'établissement
 *
 * Les équipements sont ajoutés uniquement s'ils ne sont pas déjà présents
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../data/fgpeople_clubs_enrichis.json');
const OUTPUT_FILE = INPUT_FILE;

// Équipements par défaut selon le type d'établissement
const EQUIPEMENTS_PAR_TYPE = {
  'sauna libertin': ['Sauna', 'Douches', 'Vestiaires', 'Casiers'],
  'sauna gay': ['Sauna', 'Douches', 'Vestiaires', 'Casiers', 'Cabines'],
  'sauna': ['Sauna', 'Douches', 'Vestiaires'],
  'spa libertin': ['Spa', 'Jacuzzi', 'Douches', 'Vestiaires'],
  'bar libertin': ['Bar', 'Vestiaires'],
  'bar': ['Bar'],
  'club libertin': ['Bar', 'Vestiaires', 'Douches'],
  'strip club': ['Bar', 'Vestiaires'],
  'etablissement libertin': ['Bar', 'Vestiaires', 'Douches']
};

// Équipements additionnels basés sur les types normalisés
const EQUIPEMENTS_PAR_TYPE_NORMALISE = {
  'Sauna': ['Sauna'],
  'Spa & Wellness': ['Spa', 'Douches'],
  'Bar': ['Bar'],
  'Club': ['Vestiaires'],
  'Discothèque': ['Bar', 'Vestiaires'],
  'Hébergement': ['Chambres'],
  'SM / Fétish': ['Espace BDSM'],
  'Gay friendly': [],
  'Restaurant': ['Restaurant']
};

let stats = {
  clubsModifies: 0,
  equipementsAjoutes: 0
};

/**
 * Ajoute les équipements manquants à un club
 */
function ajouterEquipements(club) {
  const equipementsActuels = new Set(club.equipements || []);
  const equipementsAjoutes = [];

  // 1. Ajouter selon le type principal
  const typeKey = (club.type || '').toLowerCase();
  const defaultEquip = EQUIPEMENTS_PAR_TYPE[typeKey] || [];

  for (const eq of defaultEquip) {
    if (!equipementsActuels.has(eq)) {
      equipementsActuels.add(eq);
      equipementsAjoutes.push(eq);
    }
  }

  // 2. Ajouter selon les types normalisés
  if (club.types_normalises) {
    for (const typeNorm of club.types_normalises) {
      const extraEquip = EQUIPEMENTS_PAR_TYPE_NORMALISE[typeNorm] || [];
      for (const eq of extraEquip) {
        if (!equipementsActuels.has(eq)) {
          equipementsActuels.add(eq);
          equipementsAjoutes.push(eq);
        }
      }
    }
  }

  // Mettre à jour si des équipements ont été ajoutés
  if (equipementsAjoutes.length > 0) {
    club.equipements = Array.from(equipementsActuels);
    console.log(`  ${club.id} ${club.nom} (${club.type}): +${equipementsAjoutes.join(', ')}`);
    stats.clubsModifies++;
    stats.equipementsAjoutes += equipementsAjoutes.length;
  }
}

// Main
console.log('='.repeat(60));
console.log('Ajout des équipements par défaut');
console.log('='.repeat(60));

const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
console.log(`\nFichier chargé: ${data.total_clubs} clubs\n`);

for (const club of data.clubs) {
  ajouterEquipements(club);
}

// Sauvegarder
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf-8');

console.log('\n' + '='.repeat(60));
console.log('Résumé:');
console.log('='.repeat(60));
console.log(`Clubs modifiés: ${stats.clubsModifies}`);
console.log(`Équipements ajoutés: ${stats.equipementsAjoutes}`);
console.log(`\nFichier sauvegardé: ${OUTPUT_FILE}`);
