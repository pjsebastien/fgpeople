/**
 * Script pour fusionner les données utiles de l'ancien fichier
 * vers les clubs en doublon du nouveau fichier
 */

const fs = require('fs');
const path = require('path');

const oldData = require('../data/clubs_libertins_verified.json');
const newData = require('../data/fgpeople_clubs_enrichis.json');

const OUTPUT_FILE = path.join(__dirname, '../data/fgpeople_clubs_enrichis.json');

// Mapping des doublons
const duplicates = {
  'FG021': '705',   // Le Luxor
  'FG030': '15253', // Les Bains de Saint-Aubin
  'FG031': '506',   // Le Vahiné
  'FG065': '801'    // Histoire d'Eau
};

let stats = { equipementsAjoutes: 0, champsRecuperes: 0 };

for (const [newId, oldId] of Object.entries(duplicates)) {
  const newClub = newData.clubs.find(c => c.id === newId);
  const oldClub = oldData.clubs.find(c => c.id === oldId);

  if (!newClub || !oldClub) continue;

  console.log(`\n${newId} ${newClub.nom}:`);

  // 1. Récupérer l'adresse si celle du nouveau est invalide
  if (newId === 'FG031') {
    // "place to be" est du garbage
    console.log(`  [adresse] "${newClub.adresse}" → "${oldClub.adresse}"`);
    newClub.adresse = oldClub.adresse;
    stats.champsRecuperes++;
  }

  // 2. Récupérer les tarifs si vides dans nouveau
  const newTarifsEmpty = !newClub.tarifs || Object.keys(newClub.tarifs).length === 0;
  const oldTarifsValid = oldClub.tarifs && Object.keys(oldClub.tarifs).length > 0;

  if (newTarifsEmpty && oldTarifsValid) {
    // Vérifier que les tarifs sont valides (contiennent €)
    const hasValidPrices = Object.values(oldClub.tarifs).some(v =>
      typeof v === 'string' && v.includes('€')
    );
    if (hasValidPrices) {
      console.log(`  [tarifs] {} → ${JSON.stringify(oldClub.tarifs)}`);
      newClub.tarifs = oldClub.tarifs;
      stats.champsRecuperes++;
    }
  }

  // 3. Ajouter les équipements manquants
  const oldEq = oldClub.equipements || [];
  const newEqSet = new Set(newClub.equipements || []);
  const equipementsToAdd = [];

  for (const eq of oldEq) {
    // Normaliser le nom de l'équipement
    const normalizedEq = normalizeEquipement(eq);
    if (normalizedEq && !hasEquipement(newEqSet, normalizedEq)) {
      newEqSet.add(normalizedEq);
      equipementsToAdd.push(normalizedEq);
    }
  }

  if (equipementsToAdd.length > 0) {
    console.log(`  [equipements] +${equipementsToAdd.join(', ')}`);
    newClub.equipements = Array.from(newEqSet);
    stats.equipementsAjoutes += equipementsToAdd.length;
  }
}

// Normalise un équipement de l'ancien format vers le nouveau
function normalizeEquipement(eq) {
  const mapping = {
    'bdsm': 'Espace BDSM',
    'coin ou backroom sm': 'Espace BDSM',
    'glory hole': 'Glory holes',
    'douche': 'Douches',
    'jacuzzi': 'Jacuzzi',
    'bain à bulles': 'Jacuzzi',
    'piscine': 'Piscine',
    'parking': 'Parking',
    'restauration': 'Restaurant',
    'vestiaire': 'Vestiaires',
    'lit rond': 'Lit rond',
    'piste de dance': 'Piste de danse',
    'musique avec dj': 'DJ',
    'terrasse': 'Terrasse',
    'backroom fermant à clé': 'Cabines',
    'backroom ouvert': 'Cabines',
    'cage d\'exhib': 'Cage SM',
    'barre d\'exhib': 'Barre de pole dance',
    'massage': 'Massage',
    'solarium': 'Solarium',
    'salon ou espace vidéo': 'Vidéo/Écrans',
    'espace détente': 'Lounge',
    'carte de membre': null // On ignore
  };

  const key = eq.toLowerCase();
  if (mapping.hasOwnProperty(key)) {
    return mapping[key];
  }
  // Garder l'équipement tel quel s'il n'est pas dans le mapping
  return eq;
}

// Vérifie si un équipement existe déjà (insensible à la casse)
function hasEquipement(set, eq) {
  if (!eq) return true;
  const eqLower = eq.toLowerCase();
  for (const existing of set) {
    if (existing.toLowerCase() === eqLower) return true;
  }
  return false;
}

// Sauvegarder
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(newData, null, 2), 'utf-8');

console.log('\n' + '='.repeat(60));
console.log('Résumé:');
console.log('='.repeat(60));
console.log(`Champs récupérés: ${stats.champsRecuperes}`);
console.log(`Équipements ajoutés: ${stats.equipementsAjoutes}`);
console.log(`\nFichier sauvegardé: ${OUTPUT_FILE}`);
