/**
 * Script d'intégration des nouveaux clubs fgpeople
 *
 * - Supprime les 4 doublons de l'ancien fichier
 * - Ajoute les 72 nouveaux clubs avec leur slug_fgpeople
 * - Fusionne dans clubs_libertins_verified.json
 */

const fs = require('fs');
const path = require('path');

const OLD_FILE = path.join(__dirname, '../data/clubs_libertins_verified.json');
const NEW_FILE = path.join(__dirname, '../data/fgpeople_clubs_enrichis.json');
const OUTPUT_FILE = OLD_FILE;

// IDs des doublons à supprimer de l'ancien fichier
const DUPLICATE_OLD_IDS = ['705', '15253', '506', '801'];

// Charger les fichiers
console.log('='.repeat(60));
console.log('Intégration des clubs fgpeople');
console.log('='.repeat(60));

const oldData = JSON.parse(fs.readFileSync(OLD_FILE, 'utf-8'));
const newData = JSON.parse(fs.readFileSync(NEW_FILE, 'utf-8'));

console.log(`\nAncien fichier: ${oldData.clubs.length} clubs`);
console.log(`Nouveau fichier: ${newData.clubs.length} clubs`);

// 1. Supprimer les doublons de l'ancien fichier
console.log(`\nSuppression des ${DUPLICATE_OLD_IDS.length} doublons...`);
const oldClubsFiltered = oldData.clubs.filter(club => {
  if (DUPLICATE_OLD_IDS.includes(club.id)) {
    console.log(`  - Supprimé: ${club.id} ${club.nom}`);
    return false;
  }
  return true;
});

console.log(`  Clubs restants: ${oldClubsFiltered.length}`);

// 2. Transformer les nouveaux clubs pour ajouter le slug
console.log(`\nPréparation des ${newData.clubs.length} nouveaux clubs...`);
const newClubsTransformed = newData.clubs.map(club => {
  // Utiliser slug_fgpeople comme slug
  const slug = club.slug_fgpeople;

  // Créer le club avec la structure attendue
  return {
    id: club.id,
    slug: slug, // Slug personnalisé depuis fgpeople
    nom: club.nom,
    type: club.type,
    types_normalises: club.types_normalises,
    adresse: club.adresse,
    code_postal: club.code_postal,
    ville: club.ville,
    departement_code: club.departement_code,
    departement_nom: club.departement_nom,
    region: club.region,
    pays: club.pays,
    telephone: club.telephone,
    email: club.email,
    site_web: club.site_web,
    description: club.description,
    equipements: club.equipements,
    horaires: club.horaires,
    tarifs: club.tarifs,
    // Ajouter une structure de vérification par défaut
    verification: {
      status: 'incertain',
      website_check: {
        accessible: club.site_web ? null : false,
        reason: club.site_web ? 'non_verifie' : 'pas_de_site'
      },
      data_quality: {
        score: calculateQualityScore(club),
        details: getQualityDetails(club)
      }
    },
    // Métadonnées source
    source: 'fgpeople.com',
    scraped_at: club.scraped_at
  };
});

// Calculer le score de qualité
function calculateQualityScore(club) {
  let score = 0;
  if (club.telephone) score += 2;
  if (club.email) score += 2;
  if (club.site_web) score += 2;
  if (club.adresse) score += 1;
  if (club.description && club.description.length > 50) score += 2;
  if (club.equipements && club.equipements.length > 0) score += 1;
  if (club.horaires && Object.keys(club.horaires).length > 0) score += 1;
  if (club.tarifs && Object.keys(club.tarifs).length > 0) score += 1;
  return score;
}

function getQualityDetails(club) {
  const details = [];
  if (club.telephone) details.push('telephone_present');
  if (club.email) details.push('email_present');
  if (club.site_web) details.push('site_web_present');
  if (club.adresse) details.push('adresse_presente');
  if (club.description) details.push('description_presente');
  return details;
}

// 3. Fusionner les clubs
const mergedClubs = [...oldClubsFiltered, ...newClubsTransformed];

// 4. Mettre à jour les statistiques
const stats = {
  total: mergedClubs.length,
  france: mergedClubs.filter(c => c.pays === 'France').length,
  belgique: mergedClubs.filter(c => c.pays === 'Belgique').length,
  suisse: mergedClubs.filter(c => c.pays === 'Suisse').length,
  luxembourg: mergedClubs.filter(c => c.pays === 'Luxembourg').length,
  espagne: mergedClubs.filter(c => c.pays === 'Espagne').length,
  avec_telephone: mergedClubs.filter(c => c.telephone).length,
  avec_email: mergedClubs.filter(c => c.email).length,
  avec_site_web: mergedClubs.filter(c => c.site_web).length,
  avec_adresse: mergedClubs.filter(c => c.adresse).length
};

// 5. Créer le fichier de sortie
const output = {
  source: 'sauna-club-libertin.com + fgpeople.com',
  scraped_at: new Date().toISOString(),
  total_clubs: mergedClubs.length,
  statistiques: stats,
  clubs: mergedClubs
};

// 6. Sauvegarder
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');

// Afficher le résumé
console.log('\n' + '='.repeat(60));
console.log('Résumé de l\'intégration:');
console.log('='.repeat(60));
console.log(`Clubs avant: ${oldData.clubs.length}`);
console.log(`Doublons supprimés: ${DUPLICATE_OLD_IDS.length}`);
console.log(`Nouveaux clubs ajoutés: ${newClubsTransformed.length}`);
console.log(`Total après fusion: ${mergedClubs.length}`);
console.log(`\nStatistiques:`);
console.log(`  France: ${stats.france}`);
console.log(`  Belgique: ${stats.belgique}`);
console.log(`  Avec téléphone: ${stats.avec_telephone}`);
console.log(`  Avec email: ${stats.avec_email}`);
console.log(`  Avec site web: ${stats.avec_site_web}`);
console.log(`\nFichier sauvegardé: ${OUTPUT_FILE}`);

// Afficher quelques exemples de slugs
console.log('\nExemples de slugs des nouveaux clubs:');
newClubsTransformed.slice(0, 5).forEach(c => {
  console.log(`  ${c.id}: ${c.slug}`);
});
