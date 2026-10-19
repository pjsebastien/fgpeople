/**
 * Fiche club personnalisée.
 *
 * Une fiche remplace, pour un club donné, tout le contenu généré par
 * lib/utils/seo-content.ts. Elle est rédigée à partir d'une recherche
 * documentée : chaque section renvoie aux sources qui la justifient, et tout
 * ce qui n'a pas pu être confirmé est signalé comme tel.
 *
 * Fichiers : data/clubs/profiles/<slug>.json (index généré par
 * scripts/build-club-profiles.mjs). Règles de rédaction :
 * data/clubs/PLAYBOOK.md.
 */

/** Degré de certitude d'une information. */
export type Confidence =
  /** Recoupé par au moins deux sources indépendantes, ou affirmé par le club lui-même et récent. */
  | 'confirme'
  /** Une seule source, crédible mais non recoupée. */
  | 'source_unique'
  /** Information ancienne, contradictoire ou de seconde main : affichée avec réserve. */
  | 'a_verifier';

export type SourceType =
  | 'officiel'
  | 'reseau_social'
  | 'registre'
  | 'annuaire'
  | 'presse'
  | 'avis'
  | 'carte'
  | 'forum'
  | 'autre';

export interface ProfileSource {
  /** Identifiant court, référencé par les sections : "s1", "s2"… */
  id: string;
  label: string;
  url: string;
  type: SourceType;
  /** Date de consultation, AAAA-MM-JJ. */
  consulted: string;
}

export interface ProfileFact {
  label: string;
  value: string;
  confidence: Confidence;
  sources: string[];
}

export type ProfileBlock =
  /** Texte en markdown allégé (voir lib/utils/rich-text.tsx). */
  | { kind: 'text'; body: string }
  | { kind: 'list'; title?: string; items: string[] }
  | { kind: 'table'; caption?: string; headers: string[]; rows: string[][] }
  | { kind: 'callout'; tone: 'info' | 'warning' | 'tip'; title?: string; body: string }
  | { kind: 'timeline'; items: { date: string; text: string }[] };

/** Pictogrammes disponibles (components/clubs/profile/Icon.tsx). */
export type ProfileIcon =
  | 'calendar' | 'clock' | 'euro' | 'users' | 'couple' | 'sparkles' | 'map' | 'building'
  | 'history' | 'star' | 'shield' | 'info' | 'warning' | 'camera' | 'music' | 'drink'
  | 'food' | 'spa' | 'flame' | 'water' | 'bed' | 'car' | 'lock' | 'ticket' | 'heart'
  | 'mask' | 'closed' | 'ruler' | 'phone' | 'globe';

export interface ProfileSection {
  /** Ancre HTML (kebab-case). */
  id: string;
  /** Titre H2, propre au club. */
  title: string;
  /** Pictogramme de la section. */
  icon?: ProfileIcon;
  /**
   * La réponse de la section en une phrase (180 caractères max), toujours
   * visible ; le texte complet se déplie à la demande.
   */
  summary?: string;
  blocks: ProfileBlock[];
  sources: string[];
  confidence?: Confidence;
}

/** Tuile « en un coup d'œil » : un fait court, lisible en une seconde. */
export interface GlanceItem {
  icon: ProfileIcon;
  /** 24 caractères max : « Ouvert », « Entrée couple », « Depuis »… */
  label: string;
  /** 45 caractères max : « Tous les jours dès 14 h », « 20 € (sauna) »… */
  value: string;
  confidence?: Confidence;
}

/** Conditions d'accès d'un public : la question n° 1 des visiteurs. */
export interface AudienceItem {
  who: 'couples' | 'femmes' | 'hommes' | 'trans';
  /** oui = admis ; selon = certains jours ou sous conditions ; non = refusé. */
  status: 'oui' | 'non' | 'selon' | 'inconnu';
  /** 90 caractères max : « Tous les jours ; samedi soir côté club privé ». */
  detail: string;
  /** Prix court : « 20 € », « 35 à 50 € ». */
  price?: string;
}

export type ProfileStatus = 'ouvert' | 'ferme' | 'fermeture_probable' | 'incertain';

export interface ExternalRating {
  platform: string;
  rating: number;
  scale: number;
  count: number;
  /** Date du relevé, AAAA-MM-JJ. */
  date: string;
  url: string;
}

export interface OfficialLink {
  label: string;
  url: string;
  kind: 'site' | 'facebook' | 'instagram' | 'x' | 'galerie' | 'agenda' | 'reservation' | 'autre';
}

export interface ClubProfile {
  slug: string;
  clubId: string;
  /** Date de la recherche, AAAA-MM-JJ. */
  researchedAt: string;

  /**
   * Graphie correcte du nom et de la ville, la base les ayant souvent en
   * capitales (« LE LIB », « ALES »). N'affecte pas les URLs.
   */
  display?: { nom?: string; ville?: string };

  status: {
    value: ProfileStatus;
    /** Phrase affichée au visiteur, ex. « Fermé depuis l'été 2024 selon… ». */
    summary: string;
    sources: string[];
  };

  seo: {
    title: string;
    metaDescription: string;
    /** Sous-titre sous le H1 (remplace « club libertin à Ville »). */
    subtitle?: string;
    /** Requêtes visées, pour le suivi éditorial (non affichées). */
    targetQueries: string[];
  };

  /** Chapô : 2 à 4 phrases, ce qui distingue ce lieu. */
  lead: string;

  /** 4 à 6 tuiles « en un coup d'œil », sous l'en-tête. */
  glance?: GlanceItem[];
  /** Qui peut entrer (couples, femmes seules, hommes seuls…). */
  audience?: AudienceItem[];
  /** 3 à 5 points « À savoir avant d'y aller » (160 caractères max chacun). */
  highlights?: string[];

  /** Fiche d'identité affichée en encadré (ouverture, public admis, surface…). */
  keyFacts: ProfileFact[];

  sections: ProfileSection[];

  /** Remplacent les horaires et tarifs de la base, s'ils ont été trouvés. */
  horaires?: { rows: Record<string, string>; note?: string; confidence: Confidence; sources: string[] };
  tarifs?: { rows: Record<string, string>; note?: string; confidence: Confidence; sources: string[] };
  /** Remplace la liste d'équipements de la base. */
  equipements?: string[];

  externalRatings?: ExternalRating[];
  officialLinks?: OfficialLink[];

  /** Corrections des coordonnées de la base, justifiées par des sources. */
  corrections?: {
    adresse?: string;
    code_postal?: string;
    telephone?: string;
    email?: string;
    site_web?: string;
    sources: string[];
  };

  faq: { question: string; answer: string }[];

  /** Ce que nous n'avons pas pu vérifier, affiché tel quel. */
  unverified?: string[];

  sources: ProfileSource[];
}
