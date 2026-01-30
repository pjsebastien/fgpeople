/**
 * Génération de contenu SEO unique pour chaque club
 * Basé sur les attributs du club (type, localisation, équipements)
 */

import type { ClubType } from '../types';

// ============================================
// TEMPLATES DE CONTENU PAR TYPE
// ============================================

const TYPE_INTROS: Record<string, string[]> = {
  sauna: [
    'Profitez d\'un espace détente avec sauna pour des moments de relaxation et de convivialité.',
    'L\'espace sauna vous invite à la détente dans une atmosphère chaleureuse et propice aux rencontres.',
    'Le sauna de cet établissement offre un cadre idéal pour se relaxer et faire de nouvelles connaissances.',
  ],
  spa: [
    'Un espace wellness complet pour allier bien-être et plaisir dans un cadre raffiné.',
    'Jacuzzi, hammam et espaces détente vous attendent pour des soirées placées sous le signe du bien-être.',
    'L\'espace spa offre une parenthèse de détente avec ses équipements de qualité.',
  ],
  bar: [
    'Le bar vous accueille dans une ambiance conviviale pour débuter votre soirée en douceur.',
    'Profitez du bar pour faire connaissance autour d\'un verre dans un cadre détendu.',
    'L\'espace bar est le lieu idéal pour briser la glace et engager la conversation.',
  ],
  sm: [
    'Un espace dédié aux pratiques SM et fétish pour les amateurs de sensations fortes.',
    'Le donjon et les équipements SM permettent d\'explorer vos fantasmes en toute discrétion.',
    'Pour les initiés, l\'espace SM offre un cadre sécurisé pour vos pratiques.',
  ],
  gay: [
    'Établissement gay friendly accueillant toutes les orientations dans le respect et la bienveillance.',
    'Un lieu ouvert et inclusif où chacun peut vivre sa sexualité librement.',
    'Ambiance mixte et tolérante pour des rencontres sans préjugés.',
  ],
  cinema: [
    'L\'espace cinéma ajoute une dimension sensuelle à votre soirée.',
    'Salle vidéo pour des moments de détente et d\'excitation.',
    'Le coin vidéo crée une atmosphère propice aux rencontres.',
  ],
  discotheque: [
    'La piste de danse anime vos soirées dans une ambiance festive.',
    'DJ et musique pour des nuits endiablées et des rencontres sous le signe de la fête.',
    'L\'ambiance discothèque met le feu à vos soirées libertines.',
  ],
  restaurant: [
    'La restauration sur place permet de prolonger votre soirée dans les meilleures conditions.',
    'Savourez un repas avant de profiter des installations de l\'établissement.',
    'L\'offre de restauration vous permet de faire une pause gourmande.',
  ],
  hebergement: [
    'La possibilité d\'hébergement permet de prolonger l\'expérience en toute sérénité.',
    'Des chambres sont disponibles pour ceux qui souhaitent prolonger la nuit.',
    'L\'hébergement sur place offre confort et discrétion pour votre séjour.',
  ],
};

const AMBIANCE_TEMPLATES = [
  'L\'établissement propose une ambiance {adj1} et {adj2}, idéale pour {purpose}.',
  'Dans un cadre {adj1}, {name} vous offre une expérience {adj2} et mémorable.',
  'L\'atmosphère {adj1} de {name} crée les conditions parfaites pour {purpose}.',
  '{name} se distingue par son ambiance {adj1} et son souci de {quality}.',
];

const ADJECTIVES = {
  positive: ['raffiné', 'chaleureux', 'convivial', 'élégant', 'moderne', 'cosy', 'intimiste', 'accueillant'],
  quality: ['discret', 'propre', 'bien entretenu', 'spacieux', 'confortable', 'soigné'],
};

const PURPOSES = [
  'découvrir le libertinage',
  'vivre des moments de plaisir',
  'faire de nouvelles rencontres',
  'explorer vos fantasmes',
  'partager des moments complices',
  'passer une soirée mémorable',
];

const QUALITIES = [
  'la discrétion',
  'le confort de ses visiteurs',
  'la qualité de l\'accueil',
  'le respect de chacun',
  'la propreté des lieux',
];

// ============================================
// FAQ PAR CONTEXTE
// ============================================

interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQ(
  clubName: string,
  city: string,
  region: string,
  types: ClubType[],
  equipements: string[],
  hasPhone: boolean,
  hasWebsite: boolean
): FAQItem[] {
  const faq: FAQItem[] = [];
  const typeLabels = types.map(t => t.label.toLowerCase());

  // Question sur l'adresse
  faq.push({
    question: `Où se trouve ${clubName} ?`,
    answer: `${clubName} est situé à ${city}, en région ${region}. L'adresse exacte est disponible en haut de cette page. Nous vous recommandons de vérifier les horaires d'ouverture avant votre visite.`,
  });

  // Question sur le type d'établissement
  const mainType = types[0]?.label || 'club libertin';
  faq.push({
    question: `Quel type d'établissement est ${clubName} ?`,
    answer: `${clubName} est un ${mainType.toLowerCase()}${types.length > 1 ? ` proposant également ${types.slice(1, 3).map(t => t.label.toLowerCase()).join(', ')}` : ''}. C'est un lieu dédié aux rencontres libertines dans un cadre respectueux et convivial.`,
  });

  // Question sur les équipements si présents
  if (equipements.length > 0) {
    const topEquipements = equipements.slice(0, 5).join(', ');
    faq.push({
      question: `Quels équipements propose ${clubName} ?`,
      answer: `${clubName} dispose de nombreux équipements pour votre confort : ${topEquipements}${equipements.length > 5 ? ', et bien d\'autres' : ''}. Consultez la liste complète des équipements sur cette page.`,
    });
  }

  // Question sur la réservation
  faq.push({
    question: `Faut-il réserver pour aller à ${clubName} ?`,
    answer: hasPhone || hasWebsite
      ? `Nous vous conseillons de contacter ${clubName} directement pour connaître leurs conditions d'accès et savoir si une réservation est nécessaire, notamment pour les soirées spéciales.`
      : `Pour les conditions d'accès et la réservation éventuelle, nous vous recommandons de vous renseigner directement auprès de l'établissement.`,
  });

  // Question sur le dress code
  faq.push({
    question: `Y a-t-il un dress code à ${clubName} ?`,
    answer: `La plupart des établissements libertins ont un dress code pour maintenir une ambiance agréable. Contactez ${clubName} pour connaître leurs exigences vestimentaires spécifiques.`,
  });

  // Question spécifique au sauna si présent
  if (typeLabels.includes('sauna') || equipements.some(e => e.toLowerCase().includes('sauna'))) {
    faq.push({
      question: `${clubName} dispose-t-il d'un sauna ?`,
      answer: `Oui, ${clubName} propose un espace sauna pour la détente de ses visiteurs. C'est l'endroit idéal pour se relaxer et faire des rencontres dans une atmosphère détendue.`,
    });
  }

  // Question sur les couples
  faq.push({
    question: `${clubName} accepte-t-il les couples ?`,
    answer: `Les établissements libertins accueillent généralement les couples. Pour connaître les conditions d'accès spécifiques (tarifs, soirées dédiées), contactez directement ${clubName}.`,
  });

  return faq.slice(0, 7); // Maximum 7 FAQ
}

// ============================================
// GÉNÉRATION DE CONTENU
// ============================================

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function pickFromArray<T>(arr: T[], seed: string, index = 0): T {
  const hash = hashCode(seed + index);
  return arr[hash % arr.length];
}

export function generateIntroText(
  clubName: string,
  types: ClubType[],
  city: string,
  region: string,
  equipements: string[]
): string {
  const seed = clubName + city;
  const typesSlugs = types.map(t => t.slug);

  // Introduction générale
  let intro = `${clubName} est un établissement libertin situé à ${city}, en ${region}. `;

  // Ajout de descriptions par type
  const typeIntros: string[] = [];
  for (const type of types.slice(0, 3)) {
    const templates = TYPE_INTROS[type.slug];
    if (templates) {
      typeIntros.push(pickFromArray(templates, seed + type.slug));
    }
  }

  if (typeIntros.length > 0) {
    intro += typeIntros.join(' ');
  } else {
    intro += `Cet établissement vous accueille dans un cadre propice aux rencontres et au libertinage.`;
  }

  // Mention des équipements
  if (equipements.length > 3) {
    intro += ` Parmi les équipements disponibles : ${equipements.slice(0, 4).join(', ')}.`;
  }

  return intro;
}

export function generateAmbianceText(
  clubName: string,
  types: ClubType[],
  equipements: string[]
): string {
  const seed = clubName;

  const template = pickFromArray(AMBIANCE_TEMPLATES, seed);
  const adj1 = pickFromArray(ADJECTIVES.positive, seed, 1);
  const adj2 = pickFromArray(ADJECTIVES.quality, seed, 2);
  const purpose = pickFromArray(PURPOSES, seed, 3);
  const quality = pickFromArray(QUALITIES, seed, 4);

  return template
    .replace('{name}', clubName)
    .replace('{adj1}', adj1)
    .replace('{adj2}', adj2)
    .replace('{purpose}', purpose)
    .replace('{quality}', quality);
}

export function generateAccessText(
  city: string,
  region: string,
  departement: string,
  codePostal: string
): string {
  return `${city} se situe dans le département ${departement}, en région ${region}. ` +
    `Pour vous rendre à l'établissement, utilisez le code postal ${codePostal} dans votre GPS. ` +
    `Nous vous recommandons de vérifier les horaires d'ouverture et les conditions d'accès avant votre visite.`;
}

export function generateMetaDescription(
  clubName: string,
  type: string,
  city: string,
  departementCode: string,
  equipements: string[]
): string {
  const topEquipements = equipements.slice(0, 3).join(', ');
  const equipementText = topEquipements ? ` Équipements : ${topEquipements}.` : '';

  return `${clubName}, ${type} à ${city} (${departementCode}).${equipementText} Adresse, horaires, tarifs et avis.`;
}

export function generateSEOTitle(
  clubName: string,
  type: string,
  city: string,
  departementCode: string
): string {
  // Capitaliser correctement le type
  const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  return `${clubName} - ${typeCapitalized} à ${city} (${departementCode})`;
}

// ============================================
// GÉNÉRATION DE CONSEILS
// ============================================

export function generateTipsForFirstTime(): string[] {
  return [
    'Renseignez-vous sur le dress code avant votre visite',
    'Arrivez de préférence en début de soirée pour vous familiariser avec les lieux',
    'Le respect des autres clients est primordial : un non est toujours un non',
    'N\'hésitez pas à discuter avec le personnel qui pourra vous guider',
    'Prévoyez des préservatifs, même si l\'établissement en fournit généralement',
    'Restez naturel et prenez le temps de vous acclimater à l\'ambiance',
  ];
}

export function generateEtiquetteRules(): string[] {
  return [
    'Respectez toujours le consentement de chacun',
    'Maintenez une hygiène irréprochable',
    'Évitez de fixer ou de photographier les autres clients',
    'Rangez votre téléphone dans votre casier',
    'Sachez accepter un refus avec élégance',
    'Participez à maintenir la propreté des espaces communs',
  ];
}
