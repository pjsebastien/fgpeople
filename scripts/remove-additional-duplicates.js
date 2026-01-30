/**
 * Suppression des doublons additionnels
 * On garde les clubs FG (nouveaux) et on supprime les anciens doublons
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../data/clubs_libertins_verified.json');

// IDs des anciens clubs à supprimer (doublons des nouveaux FG)
const DUPLICATES_TO_REMOVE = [
  // FG045 "Le Bossuet" = #1130 "SAUNA LE BOSSUET" (Dijon)
  '1130',
  // FG022 "Odyssée Club" = #597 "L'ODYSSEE CLUB" (Bordeaux)
  '597',
  // FG050 "La Petite Cheminée" = #113 "LA PETITE CHEMINEE"
  '113',
  // FG020 "RDV Club" = #605 "RDV CLUB BAR" (Rouen)
  '605',
  // FG060 "L'Eden Club Louvres" = #622 "L 'EDEN" (Louvres)
  '622',
  // FG063 "Club Hylas Valence" = #1309 "Hylas Sauna Club"
  '1309',
  // FG008 "S 64 Sauna" = #1094 "S64" (Bayonne)
  '1094',
  // FG025 "Le Déstressium Perpignan" = #15338 "EDEN PLAISIR"
  '15338',
  // FG012 "Taken-Club" = #222 "AU LYS DE L'ISLE" (Paris)
  '222',
  // FG052 "La Marquise" = #1250 "LIBERTY CLUB" (Paris)
  '1250',
  // FG038 "L'Hippocampe" = #431 "L'HYPPOCAMPE"
  '431',
  // FG072 "Angély's Club" = #15565 "ANGELYS CLUB"
  '15565',
  // FG018 "S Club Lombers" = #15611 "S CLUB"
  '15611',
  // FG034 "Le Rouge & Noir Dénat" = #247 "LE ROUGE ET NOIR"
  '247',
  // FG069 "Club Aphrodite Avignon" = #258 "L'APHRODITE"
  '258',
  // FG066 "Euphoria Spa" = #120 "LIBERTY'S" (Bénesse-Maremne)
  '120',
  // FG055 "L'Intim" = #1338 "LE LIBERTIN" (Metz)
  '1338',
  // FG056 "L'Insolite" = #674 "LA DIFFERENCE" (Décines)
  '674',
  // FG039 "Le Jardin d'Eden" = #15471 "L'OLYMPE" (Marseille)
  '15471',
];

console.log('='.repeat(60));
console.log('Suppression des doublons additionnels');
console.log('='.repeat(60));

const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
console.log(`\nClubs avant: ${data.clubs.length}`);

// Supprimer les doublons
const removed = [];
data.clubs = data.clubs.filter(club => {
  if (DUPLICATES_TO_REMOVE.includes(club.id)) {
    removed.push(`${club.id} "${club.nom}" (${club.ville})`);
    return false;
  }
  return true;
});

console.log(`\nClubs supprimés: ${removed.length}`);
removed.forEach(r => console.log(`  - ${r}`));

// Mettre à jour les stats
data.total_clubs = data.clubs.length;
data.statistiques = {
  total: data.clubs.length,
  france: data.clubs.filter(c => c.pays === 'France').length,
  belgique: data.clubs.filter(c => c.pays === 'Belgique').length,
  suisse: data.clubs.filter(c => c.pays === 'Suisse').length,
  luxembourg: data.clubs.filter(c => c.pays === 'Luxembourg').length,
  espagne: data.clubs.filter(c => c.pays === 'Espagne').length,
  avec_telephone: data.clubs.filter(c => c.telephone).length,
  avec_email: data.clubs.filter(c => c.email).length,
  avec_site_web: data.clubs.filter(c => c.site_web).length,
  avec_adresse: data.clubs.filter(c => c.adresse).length
};

// Sauvegarder
fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8');

console.log(`\nClubs après: ${data.clubs.length}`);
console.log(`\nFichier sauvegardé: ${FILE}`);
