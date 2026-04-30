/**
 * Types — Système d'avis utilisateurs
 */

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  lieu_id: string;
  lieu_slug: string;
  ville_slug: string;
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

export interface LieuReviewsBundle {
  aggregate: ReviewAggregate;
  reviews: Review[]; // approuvés uniquement, triés par date desc
}

/** Map<lieuId, bundle> pour les pages qui listent plusieurs lieux. */
export type ReviewsByLieuId = Record<string, LieuReviewsBundle>;

export interface SubmitReviewInput {
  lieuId: string;
  lieuSlug: string;
  villeSlug: string;
  rating: number;
  comment: string;
  pseudo?: string;
  // Anti-bot
  honeypot?: string; // doit rester vide
  formLoadedAt?: number; // timestamp ms côté client (pour vérifier délai mini)
}

export interface SubmitReviewResult {
  ok: boolean;
  error?: string;
}
