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

export interface ProfileSection {
  /** Ancre HTML (kebab-case). */
  id: string;
  /** Titre H2, propre au club. */
  title: string;
  blocks: ProfileBlock[];
  sources: string[];
  confidence?: Confidence;
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
