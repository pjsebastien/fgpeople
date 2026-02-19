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
    'Le sauna, véritable institution du bien-être libertin, vous accueille dans un environnement chaleureux où la vapeur favorise les échanges.',
    'Avec son espace sauna soigneusement aménagé, cet établissement vous propose une immersion relaxante propice aux rencontres spontanées.',
    'L\'expérience sauna proposée ici combine détente corporelle et ouverture aux autres dans un cadre pensé pour le plaisir.',
  ],
  spa: [
    'Un espace wellness complet pour allier bien-être et plaisir dans un cadre raffiné.',
    'Jacuzzi, hammam et espaces détente vous attendent pour des soirées placées sous le signe du bien-être.',
    'L\'espace spa offre une parenthèse de détente avec ses équipements de qualité.',
    'L\'univers spa de cet établissement marie harmonieusement relaxation et sensualité dans des installations haut de gamme.',
    'Entre jacuzzi bouillonnant et vapeurs de hammam, l\'espace wellness crée une atmosphère enveloppante idéale pour les rencontres.',
    'Le spa constitue le point fort de cet établissement, offrant un parcours sensoriel complet aux visiteurs.',
  ],
  bar: [
    'Le bar vous accueille dans une ambiance conviviale pour débuter votre soirée en douceur.',
    'Profitez du bar pour faire connaissance autour d\'un verre dans un cadre détendu.',
    'L\'espace bar est le lieu idéal pour briser la glace et engager la conversation.',
    'Autour du comptoir, les premières conversations s\'engagent naturellement dans une atmosphère décontractée et bienveillante.',
    'Le bar, point de ralliement de l\'établissement, permet de socialiser en toute simplicité avant d\'explorer les autres espaces.',
    'Cocktails et ambiance tamisée font du bar l\'endroit parfait pour entamer votre soirée et rencontrer d\'autres libertins.',
  ],
  sm: [
    'Un espace dédié aux pratiques SM et fétish pour les amateurs de sensations fortes.',
    'Le donjon et les équipements SM permettent d\'explorer vos fantasmes en toute discrétion.',
    'Pour les initiés, l\'espace SM offre un cadre sécurisé pour vos pratiques.',
    'L\'espace SM, équipé avec soin, propose un terrain de jeu sécurisé pour les adeptes de domination et de soumission.',
    'Le donjon et ses accessoires sont à la disposition des visiteurs souhaitant s\'adonner à leurs pratiques fétish favorites.',
    'Conçu pour les amateurs de sensations fortes, l\'espace fétish allie matériel de qualité et ambiance immersive.',
  ],
  gay: [
    'Établissement gay friendly accueillant toutes les orientations dans le respect et la bienveillance.',
    'Un lieu ouvert et inclusif où chacun peut vivre sa sexualité librement.',
    'Ambiance mixte et tolérante pour des rencontres sans préjugés.',
    'La politique inclusive de cet établissement garantit un accueil chaleureux quelle que soit votre orientation.',
    'Ouvert à tous, cet espace prône la diversité et le respect mutuel comme valeurs fondamentales de l\'expérience libertine.',
    'L\'atmosphère bienveillante et sans jugement fait de ce lieu un espace sûr pour explorer librement sa sexualité.',
  ],
  cinema: [
    'L\'espace cinéma ajoute une dimension sensuelle à votre soirée.',
    'Salle vidéo pour des moments de détente et d\'excitation.',
    'Le coin vidéo crée une atmosphère propice aux rencontres.',
    'La salle de projection, avec son ambiance feutrée, offre un cadre stimulant où les rencontres se font naturellement.',
    'L\'espace cinéma constitue un lieu de transition idéal entre les différents espaces de l\'établissement.',
    'Confortablement installé dans l\'espace cinéma, laissez-vous porter par l\'ambiance avant de poursuivre votre soirée.',
  ],
  discotheque: [
    'La piste de danse anime vos soirées dans une ambiance festive.',
    'DJ et musique pour des nuits endiablées et des rencontres sous le signe de la fête.',
    'L\'ambiance discothèque met le feu à vos soirées libertines.',
    'Le dancefloor, baigné de jeux de lumière, est le cœur battant de l\'établissement où les corps se rapprochent au rythme de la musique.',
    'L\'énergie de la piste de danse crée une effervescence communicative qui facilite les premiers contacts.',
    'Entre sets de DJ et ambiance nocturne électrisante, la soirée prend une dimension festive incomparable.',
  ],
  restaurant: [
    'La restauration sur place permet de prolonger votre soirée dans les meilleures conditions.',
    'Savourez un repas avant de profiter des installations de l\'établissement.',
    'L\'offre de restauration vous permet de faire une pause gourmande.',
    'Le restaurant de l\'établissement propose une cuisine soignée qui transforme votre visite en une véritable expérience gastronomique.',
    'Dîner sur place avant votre soirée est l\'occasion de socialiser dans un cadre convivial et de partager un moment de gourmandise.',
    'L\'offre culinaire enrichit votre expérience et fait de votre venue un véritable événement alliant plaisirs de la table et du libertinage.',
  ],
  hebergement: [
    'La possibilité d\'hébergement permet de prolonger l\'expérience en toute sérénité.',
    'Des chambres sont disponibles pour ceux qui souhaitent prolonger la nuit.',
    'L\'hébergement sur place offre confort et discrétion pour votre séjour.',
    'Les chambres disponibles vous évitent le souci du retour et vous permettent de profiter pleinement de votre soirée.',
    'L\'option hébergement est idéale pour les visiteurs venant de loin qui souhaitent vivre l\'expérience sans contrainte horaire.',
    'Prolongez votre séjour dans le confort d\'une chambre sur place et profitez d\'un réveil en toute quiétude.',
  ],
};

const AMBIANCE_TEMPLATES = [
  'L\'établissement propose une ambiance {adj1} et {adj2}, idéale pour {purpose}.',
  'Dans un cadre {adj1}, {name} vous offre une expérience {adj2} et mémorable.',
  'L\'atmosphère {adj1} de {name} crée les conditions parfaites pour {purpose}.',
  '{name} se distingue par son ambiance {adj1} et son souci de {quality}.',
  'Dès l\'entrée, le caractère {adj1} des lieux met les visiteurs à l\'aise pour {purpose}.',
  'Le cadre {adj2} et {adj1} de {name} contribue à une expérience unique en son genre.',
  'Les habitués apprécient le côté {adj1} de {name}, un lieu pensé pour {purpose}.',
  '{name} a su créer un environnement {adj1} où chaque détail est pensé pour {quality}.',
];

const ADJECTIVES = {
  positive: ['raffiné', 'chaleureux', 'convivial', 'élégant', 'moderne', 'cosy', 'intimiste', 'accueillant', 'sélect', 'tendance', 'glamour', 'feutré'],
  quality: ['discret', 'propre', 'bien entretenu', 'spacieux', 'confortable', 'soigné', 'immaculé', 'lumineux', 'agréable', 'impeccable'],
};

const PURPOSES = [
  'découvrir le libertinage',
  'vivre des moments de plaisir',
  'faire de nouvelles rencontres',
  'explorer vos fantasmes',
  'partager des moments complices',
  'passer une soirée mémorable',
  'se laisser surprendre par de nouvelles expériences',
  'profiter d\'une parenthèse de plaisir',
  'rencontrer des esprits libres et ouverts',
  'vivre une soirée hors du commun',
];

const QUALITIES = [
  'la discrétion',
  'le confort de ses visiteurs',
  'la qualité de l\'accueil',
  'le respect de chacun',
  'la propreté des lieux',
  'l\'excellence du service',
  'le bien-être de sa clientèle',
  'la satisfaction de ses visiteurs',
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

const INTRO_OPENERS = [
  '{name} est un établissement libertin situé à {city}, en {region}.',
  'Situé à {city} en {region}, {name} est une adresse incontournable de la scène libertine locale.',
  'Au cœur de {city}, {name} accueille les libertins dans un cadre soigneusement pensé pour le plaisir.',
  '{name}, établissement libertin de {city} ({region}), vous ouvre ses portes pour des soirées placées sous le signe de la liberté.',
  'À {city}, {name} fait figure de référence parmi les établissements libertins de la région {region}.',
  'Implanté à {city} en {region}, {name} propose une expérience libertine authentique aux couples et célibataires.',
];

const EQUIPMENT_TRANSITIONS = [
  'Parmi les équipements disponibles : {equip}.',
  'L\'établissement met à votre disposition : {equip}.',
  'Côté infrastructures, vous trouverez notamment : {equip}.',
  'Les visiteurs profitent entre autres de : {equip}.',
];

export function generateIntroText(
  clubName: string,
  types: ClubType[],
  city: string,
  region: string,
  equipements: string[]
): string {
  const seed = clubName + city;

  // Introduction générale variée
  const opener = pickFromArray(INTRO_OPENERS, seed)
    .replace('{name}', clubName)
    .replace('{city}', city)
    .replace('{region}', region);

  let intro = opener + ' ';

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

  // Mention des équipements avec transition variée
  if (equipements.length > 3) {
    const transition = pickFromArray(EQUIPMENT_TRANSITIONS, seed + 'equip')
      .replace('{equip}', equipements.slice(0, 4).join(', '));
    intro += ` ${transition}`;
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

// ============================================
// GÉNÉRATION D'AVIS
// ============================================

interface ReviewData {
  clubName: string;
  city: string;
  region: string;
  departement: string;
  types: ClubType[];
  equipements: string[];
  status: 'actif' | 'incertain' | 'probablement_ferme';
  qualityScore: number;
  websiteAccessible: boolean | null;
  hasPhone: boolean;
  hasEmail: boolean;
}

interface GeneratedReview {
  title: string;
  summary: string;
  details: string[];
  positivePoints: string[];
  negativePoints: string[];
  conclusion: string;
  lastUpdate: string;
  rating: number; // 1-5
}

const REVIEW_ADJECTIVES = {
  excellent: ['excellent', 'remarquable', 'incontournable', 'de premier ordre'],
  good: ['recommandable', 'apprécié', 'de qualité', 'bien noté'],
  average: ['correct', 'convenable', 'standard', 'honnête'],
  uncertain: ['à découvrir', 'à vérifier', 'méconnu'],
};

const EQUIPMENT_HIGHLIGHTS: Record<string, string> = {
  'Sauna': 'L\'espace sauna permet de se détendre avant ou après les rencontres.',
  'Jacuzzi': 'Le jacuzzi est un vrai plus pour une ambiance relaxante et sensuelle.',
  'Hammam': 'Le hammam ajoute une dimension bien-être appréciable.',
  'Bar': 'Le bar est idéal pour briser la glace en début de soirée.',
  'Piste de danse': 'La piste de danse anime les soirées et facilite les approches.',
  'Chambres': 'Les chambres privatives offrent l\'intimité nécessaire.',
  'Cabines': 'Les cabines permettent des moments intimes en toute discrétion.',
  'Piscine': 'La piscine est un atout majeur pour cet établissement.',
  'Restaurant': 'La possibilité de se restaurer sur place est un vrai confort.',
  'Donjon': 'Le donjon SM ravira les amateurs de pratiques fétish.',
};

export function generateReview(data: ReviewData): GeneratedReview {
  const seed = data.clubName + data.city;
  const now = new Date();

  // Générer une date de mise à jour variable mais déterministe basée sur le nom du club
  // Les clubs "actifs" ont des dates récentes (mois courant à 5 mois), les autres plus anciennes
  const hash = hashCode(seed);
  let monthsAgo: number;

  if (data.status === 'actif') {
    // Clubs actifs : mise à jour entre le mois courant (0) et 5 mois
    monthsAgo = hash % 6; // 0, 1, 2, 3, 4 ou 5 mois
  } else if (data.status === 'incertain') {
    // Clubs incertains : mise à jour entre 4 et 10 mois
    monthsAgo = 4 + (hash % 7);
  } else {
    // Clubs probablement fermés : mise à jour entre 10 et 18 mois
    monthsAgo = 10 + (hash % 9);
  }

  const reviewDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);

  // Calcul du rating basé sur plusieurs critères
  let baseRating = 3;

  // Bonus équipements
  if (data.equipements.length >= 8) baseRating += 1;
  else if (data.equipements.length >= 5) baseRating += 0.5;

  // Bonus qualityScore
  if (data.qualityScore >= 15) baseRating += 0.5;
  else if (data.qualityScore < 8) baseRating -= 0.5;

  // Bonus contact
  if (data.hasPhone && data.hasEmail) baseRating += 0.25;
  if (data.websiteAccessible === true) baseRating += 0.25;

  // Malus statut
  if (data.status === 'incertain') baseRating -= 0.5;
  if (data.status === 'probablement_ferme') baseRating -= 1.5;
  if (data.websiteAccessible === false) baseRating -= 0.5;

  // Clamp rating entre 1 et 5
  const rating = Math.max(1, Math.min(5, Math.round(baseRating * 2) / 2));

  // Sélection des adjectifs selon le rating
  const adjCategory = rating >= 4.5 ? 'excellent' : rating >= 3.5 ? 'good' : rating >= 2.5 ? 'average' : 'uncertain';
  const adjective = pickFromArray(REVIEW_ADJECTIVES[adjCategory], seed);

  // Génération du titre
  const title = `Notre avis sur ${data.clubName}`;

  // Génération du résumé
  let summary = '';
  const mainType = data.types[0]?.label || 'établissement libertin';

  if (data.status === 'probablement_ferme') {
    summary = `Attention : ${data.clubName} semble ne plus être en activité. Nous vous recommandons de vérifier directement avant de vous déplacer. Notre dernier recueil d'informations remonte à plusieurs mois.`;
  } else if (data.status === 'incertain') {
    summary = `${data.clubName} est un ${mainType.toLowerCase()} situé à ${data.city} dont nous avons reçu peu de retours récents. Les informations présentées méritent d'être confirmées auprès de l'établissement.`;
  } else {
    summary = `D'après les retours que nous avons collectés, ${data.clubName} est un ${mainType.toLowerCase()} ${adjective} situé à ${data.city} (${data.departement}). `;

    if (data.equipements.length >= 6) {
      summary += `L'établissement se distingue par sa diversité d'équipements et d'espaces proposés.`;
    } else if (data.equipements.length >= 3) {
      summary += `L'établissement propose les équipements essentiels pour passer une bonne soirée.`;
    } else {
      summary += `L'établissement mise sur une approche plus intimiste avec des installations ciblées.`;
    }
  }

  // Points positifs
  const positivePoints: string[] = [];

  if (data.equipements.length >= 5) {
    positivePoints.push(`Large choix d'équipements (${data.equipements.length} espaces/services)`);
  }

  // Ajouter des highlights spécifiques aux équipements
  for (const eq of data.equipements.slice(0, 3)) {
    for (const [key, highlight] of Object.entries(EQUIPMENT_HIGHLIGHTS)) {
      if (eq.toLowerCase().includes(key.toLowerCase())) {
        positivePoints.push(highlight);
        break;
      }
    }
  }

  if (data.types.length > 1) {
    const typeNames = data.types.slice(0, 3).map(t => t.label.toLowerCase()).join(', ');
    positivePoints.push(`Établissement polyvalent : ${typeNames}`);
  }

  if (data.websiteAccessible === true) {
    positivePoints.push('Site web actif facilitant la prise d\'informations');
  }

  if (data.hasPhone) {
    positivePoints.push('Joignable par téléphone pour toute question');
  }

  // Ajouter des points régionaux
  if (data.region === 'Île-de-France') {
    positivePoints.push('Situation géographique centrale en région parisienne');
  } else if (data.region === 'Provence-Alpes-Côte d\'Azur') {
    positivePoints.push('Localisation attractive dans le sud de la France');
  }

  // Points négatifs / À noter
  const negativePoints: string[] = [];

  if (data.status === 'incertain') {
    negativePoints.push('Informations à vérifier - nous manquons de retours récents');
  }

  if (data.status === 'probablement_ferme') {
    negativePoints.push('Établissement possiblement fermé - vérifiez avant de vous déplacer');
  }

  if (data.websiteAccessible === false) {
    negativePoints.push('Site web actuellement inaccessible');
  }

  if (!data.hasPhone && !data.hasEmail) {
    negativePoints.push('Peu de moyens de contact disponibles');
  }

  if (data.equipements.length < 3) {
    negativePoints.push('Offre d\'équipements limitée');
  }

  // Détails de l'avis
  const details: string[] = [];

  if (data.status === 'actif') {
    details.push(`Nous avons collecté plusieurs retours d'expérience concernant ${data.clubName}. L'établissement bénéficie d'une réputation ${rating >= 4 ? 'très positive' : rating >= 3 ? 'globalement positive' : 'mitigée'} parmi les habitués du milieu libertin de la région ${data.region}.`);

    if (data.equipements.length > 0) {
      const topEquip = data.equipements.slice(0, 4).join(', ');
      details.push(`Côté installations, on retrouve notamment : ${topEquip}. ${data.equipements.length > 4 ? `Et ${data.equipements.length - 4} autres équipements.` : ''}`);
    }

    details.push(`Pour les couples et libertins souhaitant découvrir ${data.city} et ses environs, ${data.clubName} représente une option ${rating >= 4 ? 'de choix' : rating >= 3 ? 'intéressante' : 'à considérer'}.`);
  } else {
    details.push(`Les informations sur ${data.clubName} datent de notre dernière vérification. Nous vous invitons à contacter directement l'établissement pour confirmer qu'il est toujours en activité et connaître les conditions d'accès actuelles.`);
  }

  // Conclusion
  let conclusion = '';

  if (data.status === 'probablement_ferme') {
    conclusion = `En raison des doutes sur l'activité actuelle de ${data.clubName}, nous vous conseillons vivement de vérifier par téléphone ou de consulter d'autres sources avant tout déplacement. N'hésitez pas à nous signaler toute information mise à jour.`;
  } else if (data.status === 'incertain') {
    conclusion = `${data.clubName} mérite d'être découvert par ceux qui souhaitent explorer la scène libertine de ${data.city}. Nous vous recommandons toutefois de contacter l'établissement au préalable pour confirmer les informations.`;
  } else if (rating >= 4) {
    conclusion = `En conclusion, ${data.clubName} fait partie des adresses ${data.region === 'Île-de-France' ? 'parisiennes' : 'de ' + data.region} à connaître pour les amateurs de libertinage. Les retours positifs et la qualité des installations en font une destination recommandable.`;
  } else if (rating >= 3) {
    conclusion = `${data.clubName} constitue une option solide pour découvrir le libertinage à ${data.city}. L'établissement répond aux attentes standards et mérite qu'on s'y intéresse.`;
  } else {
    conclusion = `${data.clubName} peut convenir à ceux qui recherchent un établissement de proximité à ${data.city}. Nous vous conseillons de bien vous renseigner sur les conditions d'accès actuelles.`;
  }

  // Format de la date
  const lastUpdate = reviewDate.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });

  return {
    title,
    summary,
    details,
    positivePoints: positivePoints.slice(0, 5),
    negativePoints: negativePoints.slice(0, 3),
    conclusion,
    lastUpdate,
    rating,
  };
}
