/**
 * Script de nettoyage des données fgpeople_clubs_enrichis.json
 *
 * Corrige les incohérences dans les champs:
 * - tarifs: vide si contient du texte web au lieu de vrais tarifs
 * - horaires: vide si mal formaté
 * - adresse: vide ou nettoie si fragments de texte scrapé
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../data/fgpeople_clubs_enrichis.json');
const OUTPUT_FILE = INPUT_FILE; // Écrase le fichier original

// Jours valides pour les horaires
const JOURS_VALIDES = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

// Clés valides pour les tarifs
const TARIFS_KEYS_VALIDES = ['Couple', 'Homme', 'Femme', 'Homme seul', 'Entrée', 'Consommation', 'Célibataire', 'Single'];

// Mots-clés d'adresse valide
const ADRESSE_MOTS_CLES = ['rue', 'avenue', 'boulevard', 'blvd', 'place', 'chemin', 'allée', 'impasse', 'passage', 'quai', 'cours', 'route'];

// Mots indiquant une adresse invalide (ou nécessitant un nettoyage)
const ADRESSE_INVALIDE_MOTS = [
  'métro', '!', '…', 'Kubrick', 'mauvaise humeur', 'ennui', 'élégant', 'PLAN METRO',
  'décoration', 'jungle', 'Terrasse extérieure', 'Téléphone',
  'Lyon 1er', 'Paris 1er', 'symptomati', 'RER',
  'écoute bienveillante', 'Respecter', 'consentement', 'Échangiste',
  'fromage', 'plateau français', 'Ambiance musicale', 'apaisante et discrète',
  'substances illicites', '| Club'
];

let stats = {
  tarifsNettoyes: 0,
  horairesNettoyes: 0,
  adressesNettoyees: 0,
  clubsTraites: 0
};

/**
 * Vérifie si un objet tarifs est valide
 */
function isTarifsValide(tarifs) {
  if (!tarifs || typeof tarifs !== 'object') return true; // Vide = ok

  const keys = Object.keys(tarifs);
  if (keys.length === 0) return true;

  // Si contient "info", c'est probablement du texte scrapé
  if (keys.includes('info')) {
    return false;
  }

  // Vérifier que les clés sont des types de tarifs valides et les valeurs contiennent €
  for (const key of keys) {
    const value = tarifs[key];

    // La clé doit être un type de tarif connu ou ressembler à un type de tarif
    const isKeyValid = TARIFS_KEYS_VALIDES.some(k =>
      key.toLowerCase().includes(k.toLowerCase())
    ) || /^(femme|homme|couple|entrée|single)/i.test(key);

    // La valeur doit contenir € ou être un prix (nombre + €)
    const isValueValid = typeof value === 'string' &&
      (value.includes('€') || /^\d+\s*€?$/.test(value.trim()));

    if (!isKeyValid || !isValueValid) {
      // Vérifier si c'est du texte long (probablement scrapé)
      if (typeof value === 'string' && value.length > 50) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Vérifie si un objet horaires est valide
 */
function isHorairesValide(horaires) {
  if (!horaires || typeof horaires !== 'object') return true;

  const keys = Object.keys(horaires);
  if (keys.length === 0) return true;

  // Si contient "info", c'est du texte scrapé
  if (keys.includes('info')) {
    return false;
  }

  // Vérifier que les clés sont des jours de la semaine
  for (const key of keys) {
    if (!JOURS_VALIDES.includes(key)) {
      return false;
    }

    const value = horaires[key];
    // La valeur doit être "ouvert", "fermé", ou un format horaire
    const isValidValue = typeof value === 'string' && (
      value.toLowerCase() === 'ouvert' ||
      value.toLowerCase() === 'fermé' ||
      /^\d{1,2}h/.test(value) || // Commence par une heure
      /^\d{1,2}:\d{2}/.test(value) // Format HH:MM
    );

    if (!isValidValue) {
      return false;
    }
  }

  return true;
}

/**
 * Vérifie si une adresse est valide
 */
function isAdresseValide(adresse) {
  if (!adresse || typeof adresse !== 'string') return true;
  if (adresse.trim() === '') return true;

  const adresseLower = adresse.toLowerCase();

  // Vérifier les mots indiquant une adresse invalide
  for (const mot of ADRESSE_INVALIDE_MOTS) {
    if (adresse.includes(mot)) {
      return false;
    }
  }

  // Une adresse valide commence par un numéro ou contient un mot-clé d'adresse
  const startsWithNumber = /^\d+/.test(adresse.trim());
  const containsAddressKeyword = ADRESSE_MOTS_CLES.some(mot => adresseLower.includes(mot));

  // Si ni l'un ni l'autre, probablement invalide
  if (!startsWithNumber && !containsAddressKeyword) {
    return false;
  }

  // Vérifier si c'est trop long ou contient des phrases
  if (adresse.length > 100 || adresse.split(' ').length > 15) {
    return false;
  }

  return true;
}

/**
 * Nettoie une adresse (retire le texte superflu)
 */
function nettoyerAdresse(adresse) {
  if (!adresse) return '';

  let cleaned = adresse;

  // Retirer tout après "PLAN" ou "METRO" en majuscules
  cleaned = cleaned.replace(/\s*(PLAN|METRO).*$/i, '');

  // Retirer "RER" et ce qui suit (avec ou sans parenthèse)
  cleaned = cleaned.replace(/\s*RER\s*[A-Z)(\s]*$/i, '');

  // Retirer le code postal et ville s'ils sont présents (avec tiret ou tiret long)
  cleaned = cleaned.replace(/\s*[-–]\s*\d{5}\s+[A-Za-z]+.*$/i, '');

  // Retirer "Téléphone" et ce qui suit
  cleaned = cleaned.replace(/\s*Téléphone\s*:?\s*.*$/i, '');

  // Retirer tout après le premier tiret long "–" suivi de code postal
  cleaned = cleaned.replace(/\s*–\s*\d{5}.*$/i, '');

  // Retirer les parenthèses orphelines
  cleaned = cleaned.replace(/[()]/g, '');

  // Retirer la virgule finale
  cleaned = cleaned.replace(/,\s*$/, '');

  return cleaned.trim();
}

/**
 * Nettoie un club
 */
function nettoyerClub(club) {
  let modified = false;

  // Nettoyer tarifs
  if (!isTarifsValide(club.tarifs)) {
    console.log(`  [tarifs] ${club.id} ${club.nom}: "${JSON.stringify(club.tarifs).substring(0, 60)}..." → {}`);
    club.tarifs = {};
    stats.tarifsNettoyes++;
    modified = true;
  }

  // Nettoyer horaires
  if (!isHorairesValide(club.horaires)) {
    console.log(`  [horaires] ${club.id} ${club.nom}: "${JSON.stringify(club.horaires).substring(0, 60)}..." → {}`);
    club.horaires = {};
    stats.horairesNettoyes++;
    modified = true;
  }

  // Nettoyer adresse
  if (!isAdresseValide(club.adresse)) {
    const cleaned = nettoyerAdresse(club.adresse);
    if (cleaned && isAdresseValide(cleaned)) {
      console.log(`  [adresse] ${club.id} ${club.nom}: "${club.adresse}" → "${cleaned}"`);
      club.adresse = cleaned;
    } else {
      console.log(`  [adresse] ${club.id} ${club.nom}: "${club.adresse}" → ""`);
      club.adresse = '';
    }
    stats.adressesNettoyees++;
    modified = true;
  }

  return modified;
}

// Main
console.log('='.repeat(60));
console.log('Nettoyage des données fgpeople_clubs_enrichis.json');
console.log('='.repeat(60));

// Lire le fichier
const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
console.log(`\nFichier chargé: ${data.total_clubs} clubs\n`);

// Nettoyer chaque club
for (const club of data.clubs) {
  nettoyerClub(club);
  stats.clubsTraites++;
}

// Sauvegarder
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf-8');

// Afficher les stats
console.log('\n' + '='.repeat(60));
console.log('Résumé du nettoyage:');
console.log('='.repeat(60));
console.log(`Clubs traités: ${stats.clubsTraites}`);
console.log(`Tarifs nettoyés: ${stats.tarifsNettoyes}`);
console.log(`Horaires nettoyés: ${stats.horairesNettoyes}`);
console.log(`Adresses nettoyées: ${stats.adressesNettoyees}`);
console.log(`\nFichier sauvegardé: ${OUTPUT_FILE}`);
