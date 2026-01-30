/**
 * Script pour réécrire les descriptions des clubs
 * Génère un contenu unique pour chaque établissement
 */

const fs = require('fs');
const path = require('path');

// Charger le JSON
const dataPath = path.join(__dirname, '../data/clubs_libertins_verified.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// ============================================
// UTILITAIRES
// ============================================

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/Ã©/g, 'é')
    .replace(/Ã¨/g, 'è')
    .replace(/Ãª/g, 'ê')
    .replace(/Ã /g, 'à')
    .replace(/Ã¢/g, 'â')
    .replace(/Ã´/g, 'ô')
    .replace(/Ã®/g, 'î')
    .replace(/Ã¹/g, 'ù')
    .replace(/Ã§/g, 'ç')
    .replace(/Ã«/g, 'ë')
    .replace(/Ã¯/g, 'ï')
    .replace(/Ã¼/g, 'ü')
    .replace(/â¬/g, '€')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function capitalize(str) {
  if (!str) return '';
  // Garder les acronymes en majuscules
  if (str === str.toUpperCase() && str.length <= 4) return str;
  // Capitaliser normalement
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatVille(ville) {
  if (!ville) return '';

  // D'abord tout mettre en minuscule pour partir d'une base propre
  const words = ville.toLowerCase().split(/[\s-]+/);

  const formatted = words.map((word, index) => {
    // Articles courts en minuscule sauf en début de nom
    const lowercaseWords = ['le', 'la', 'les', 'du', 'de', 'des', 'sur', 'sous', 'en', 'd'];
    if (index > 0 && lowercaseWords.includes(word)) {
      return word;
    }
    // Capitaliser le mot
    if (word.length === 0) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).filter(w => w.length > 0).join(' ');

  // Remplacer certains patterns
  return formatted
    .replace(/\s+/g, ' ')
    .replace(/D /g, "d'")
    .trim();
}

// Hash simple pour la cohérence
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function pickFromArray(arr, seed, index = 0) {
  const hash = hashCode(seed + String(index));
  return arr[hash % arr.length];
}

// ============================================
// TEMPLATES DE DESCRIPTIONS
// ============================================

const INTRO_TEMPLATES = [
  "{nom} est un établissement libertin situé à {ville}, dans le département {departement}.",
  "Situé à {ville} ({departement_code}), {nom} vous accueille dans un cadre dédié au libertinage.",
  "{nom} ouvre ses portes à {ville}, en {region}, pour des moments de plaisir et de convivialité.",
  "À {ville}, {nom} propose un espace de rencontres libertines dans le {departement}.",
  "Découvrez {nom}, établissement libertin implanté à {ville} en {region}.",
  "En plein coeur de {ville}, {nom} est une adresse incontournable pour les amateurs de libertinage en {region}.",
  "{nom} accueille les couples et célibataires à {ville}, dans le {departement} ({departement_code}).",
  "Situé dans le {departement}, {nom} est un lieu de rencontres libertines à {ville}.",
  "Les portes de {nom} s'ouvrent à {ville} pour vous faire vivre des expériences libertines uniques.",
  "{nom}, situé à {ville} en {region}, est un établissement dédié au plaisir et aux rencontres.",
];

const AMBIANCE_PHRASES = [
  "L'établissement propose une ambiance chaleureuse et conviviale, idéale pour les couples et les célibataires souhaitant explorer le monde du libertinage.",
  "Dans un cadre soigné et discret, l'équipe vous accueille pour des soirées placées sous le signe du plaisir partagé.",
  "L'atmosphère de cet établissement allie élégance et sensualité pour des moments inoubliables.",
  "Un lieu pensé pour le confort et l'intimité des visiteurs, où le respect et la discrétion sont de mise.",
  "L'ambiance feutrée et les espaces bien pensés favorisent les rencontres et les échanges complices.",
  "Cet espace de libertinage conjugue confort moderne et atmosphère intime pour vos soirées.",
  "Le cadre raffiné et l'accueil chaleureux de l'équipe créent les conditions idéales pour des rencontres mémorables.",
  "L'établissement se distingue par son ambiance à la fois conviviale et sensuelle.",
  "Ici, l'intimité et le respect sont au coeur de chaque rencontre, dans un cadre élégant.",
  "Un espace de liberté où règnent bienveillance et plaisir partagé.",
];

const TYPE_DESCRIPTIONS = {
  sauna: [
    "L'espace sauna permet de se détendre dans une atmosphère propice aux rencontres.",
    "Le sauna offre un moment de relaxation idéal avant de profiter des autres espaces.",
    "Profitez du sauna pour un moment de bien-être et de convivialité.",
  ],
  spa: [
    "Les équipements wellness (jacuzzi, hammam) ajoutent une dimension détente à votre visite.",
    "L'espace bien-être comprend des installations de qualité pour votre confort.",
    "Le spa et les espaces de relaxation complètent parfaitement l'offre de l'établissement.",
  ],
  bar: [
    "Le bar vous accueille pour débuter la soirée dans une ambiance décontractée.",
    "L'espace bar permet de faire connaissance autour d'un verre avant d'explorer les lieux.",
    "Retrouvez-vous au bar pour engager la conversation dans un cadre convivial.",
  ],
  sm: [
    "Un espace dédié aux pratiques SM est disponible pour les amateurs.",
    "Les équipements SM permettent aux initiés d'explorer leurs fantasmes.",
    "L'espace fétish offre un cadre adapté aux pratiques BDSM.",
  ],
  gay: [
    "L'établissement est ouvert et accueillant envers toutes les orientations.",
    "Cet espace gay-friendly favorise les rencontres dans le respect de chacun.",
    "Un lieu inclusif où chacun peut s'exprimer librement.",
  ],
  cinema: [
    "La salle vidéo ajoute une touche de sensualité à l'atmosphère.",
    "L'espace cinéma propose des projections dans une ambiance intime.",
    "Un coin vidéo est disponible pour les amateurs de contenus adultes.",
  ],
  discotheque: [
    "La piste de danse anime les soirées dans une ambiance festive.",
    "Profitez de la musique et de la danse pour des nuits endiablées.",
    "Le dancefloor est au coeur de l'animation pour des soirées mémorables.",
  ],
  restaurant: [
    "Une offre de restauration permet de prolonger la soirée confortablement.",
    "Le restaurant propose de quoi se restaurer avant ou pendant la soirée.",
    "Profitez d'un repas sur place pour une expérience complète.",
  ],
  hebergement: [
    "Des chambres sont disponibles pour prolonger l'expérience en toute intimité.",
    "L'hébergement sur place offre la possibilité de rester pour la nuit.",
    "Pour plus de confort, des options d'hébergement sont proposées.",
  ],
};

const EQUIPEMENTS_INTRO = [
  "Parmi les équipements disponibles, vous trouverez : ",
  "L'établissement met à disposition : ",
  "Les installations comprennent notamment : ",
  "Vous pourrez profiter de : ",
];

const CLOSING_PHRASES = [
  "N'hésitez pas à contacter l'établissement pour plus d'informations sur les conditions d'accès et les événements à venir.",
  "Pour découvrir cet établissement, nous vous conseillons de vérifier les horaires et les modalités d'entrée.",
  "Renseignez-vous sur les soirées thématiques et les conditions d'accès auprès de l'établissement.",
  "L'équipe vous accueille pour vous faire découvrir les lieux dans les meilleures conditions.",
];

// ============================================
// GÉNÉRATEUR DE DESCRIPTION
// ============================================

function generateDescription(club) {
  const nom = cleanText(club.nom);
  const ville = formatVille(cleanText(club.ville));
  const departement = cleanText(club.departement_nom) || 'son département';
  const departement_code = club.departement_code || '';
  const region = cleanText(club.region) || 'sa région';
  const types = club.types_normalises || [];
  const equipements = club.equipements || [];
  const seed = nom + ville + club.id;

  const parts = [];

  // 1. Introduction avec nom et localisation
  const introTemplate = pickFromArray(INTRO_TEMPLATES, seed, 0);
  const intro = introTemplate
    .replace('{nom}', nom)
    .replace('{ville}', ville)
    .replace('{departement}', departement)
    .replace('{departement_code}', departement_code)
    .replace('{region}', region);
  parts.push(intro);

  // 2. Phrase d'ambiance
  parts.push(pickFromArray(AMBIANCE_PHRASES, seed, 1));

  // 3. Descriptions par type (max 2)
  const typeDescriptions = [];
  const typeMapping = {
    'Sauna': 'sauna',
    'Spa & Wellness': 'spa',
    'Bar': 'bar',
    'SM / Fétish': 'sm',
    'Gay friendly': 'gay',
    'Cinéma': 'cinema',
    'Discothèque': 'discotheque',
    'Restaurant': 'restaurant',
    'Hébergement': 'hebergement',
  };

  let typeCount = 0;
  for (const type of types) {
    const key = typeMapping[type];
    if (key && TYPE_DESCRIPTIONS[key] && typeCount < 2) {
      typeDescriptions.push(pickFromArray(TYPE_DESCRIPTIONS[key], seed, typeCount + 10));
      typeCount++;
    }
  }

  if (typeDescriptions.length > 0) {
    parts.push(typeDescriptions.join(' '));
  }

  // 4. Équipements (si disponibles)
  if (equipements.length > 0) {
    const equipIntro = pickFromArray(EQUIPEMENTS_INTRO, seed, 20);
    const selectedEquipements = equipements.slice(0, 5).map(e => cleanText(e).toLowerCase());
    parts.push(equipIntro + selectedEquipements.join(', ') + (equipements.length > 5 ? ', et bien d\'autres installations.' : '.'));
  }

  // 5. Phrase de clôture
  parts.push(pickFromArray(CLOSING_PHRASES, seed, 30));

  return parts.join('\n\n');
}

// ============================================
// TRAITEMENT DU JSON
// ============================================

console.log(`Traitement de ${data.clubs.length} clubs...`);

let processed = 0;
let withDescription = 0;

data.clubs = data.clubs.map(club => {
  // Nettoyer les champs existants
  club.nom = cleanText(club.nom);
  club.ville = cleanText(club.ville);
  club.adresse = cleanText(club.adresse);
  club.departement_nom = cleanText(club.departement_nom);
  club.region = cleanText(club.region);

  // Sauvegarder l'ancienne description si elle existe et est significative
  const oldDescription = cleanText(club.description);
  if (oldDescription && oldDescription.length > 20 && !oldDescription.startsWith('Prestations')) {
    club.description_originale = oldDescription;
  }

  // Générer la nouvelle description
  club.description = generateDescription(club);

  processed++;
  if (club.description) withDescription++;

  if (processed % 50 === 0) {
    console.log(`  ${processed}/${data.clubs.length} clubs traités...`);
  }

  return club;
});

// Sauvegarder le JSON modifié
const outputPath = path.join(__dirname, '../data/clubs_libertins_verified.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`\nTerminé !`);
console.log(`  - ${processed} clubs traités`);
console.log(`  - ${withDescription} descriptions générées`);
console.log(`  - Fichier sauvegardé : ${outputPath}`);
