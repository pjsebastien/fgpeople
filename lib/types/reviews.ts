/**
 * Types — Système d'avis utilisateurs
 */

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

/** Type d'entité auquel un avis se rattache. */
export type EntityType = 'lieu' | 'club' | 'site';

export interface Review {
  id: string;
  /** ID unique de l'entité (lieu_id côté DB pour compat historique). */
  lieu_id: string;
  /** Slug de l'entité (utilisé pour affichage admin / debug). */
  lieu_slug: string;
  /** Slug du parent géographique (ville) pour la revalidation de cache. */
  ville_slug: string;
  /** Type d'entité ('lieu' ou 'club'). Par défaut 'lieu' pour les anciennes lignes. */
  entity_type: EntityType;
  /** Tags / critères structurés au format "categorie:valeur" (ex: "ambiance:festive"). */
  tags: string[];
  pseudo: string | null;
  rating: number; // 1..5
  comment: string;
  status: ReviewStatus;
  created_at: string; // ISO
  approved_at: string | null;
}

export interface ReviewAggregate {
  count: number;
  average: number; // 0..5, arrondi à 1 décimale
}

/** Décompte des occurrences d'une valeur de tag. */
export interface TagCount {
  value: string;
  count: number;
}

/** Statistiques agrégées par catégorie de tag. */
export type TagStats = Record<string, TagCount[]>; // categorie → liste triée desc

export interface LieuReviewsBundle {
  aggregate: ReviewAggregate;
  reviews: Review[]; // approuvés uniquement, triés par date desc
  /** Stats agrégées des critères structurés (calculées sur les reviews approuvés). */
  tagStats: TagStats;
}

/** Map<entityId, bundle> pour les pages qui listent plusieurs entités. */
export type ReviewsByLieuId = Record<string, LieuReviewsBundle>;
/** Alias plus parlant pour les clubs (pointe sur le même type). */
export type ReviewsByEntityId = ReviewsByLieuId;

export interface SubmitReviewInput {
  entityType: EntityType;
  lieuId: string; // = entity ID
  lieuSlug: string; // = entity slug
  villeSlug: string;
  rating: number;
  comment: string;
  pseudo?: string;
  tags?: string[];
  // Anti-bot
  honeypot?: string; // doit rester vide
  formLoadedAt?: number; // timestamp ms côté client (pour vérifier délai mini)
}

export interface SubmitReviewResult {
  ok: boolean;
  error?: string;
}
