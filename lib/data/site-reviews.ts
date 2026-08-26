/**
 * Data layer — Avis sur les sites de rencontre.
 *
 * Contenu statique importé depuis data/site_reviews/. Aucun accès réseau :
 * ces pages se rendent aussi vite que les fiches clubs.
 */

import { siteReviews } from '@/data/site_reviews';
import type { SiteReview } from '@/lib/types/site-review';

const bySlug = new Map(siteReviews.map((r) => [r.slug, r]));

/** Un avis est publié sauf mention contraire explicite. */
function isPublished(review: SiteReview): boolean {
  return review.published !== false;
}

export function isSiteReviewSlug(slug: string): boolean {
  return bySlug.has(slug);
}

export function getSiteReviewBySlug(slug: string): SiteReview | null {
  return bySlug.get(slug) || null;
}

export function getAllSiteReviews(): SiteReview[] {
  return siteReviews;
}

export function getAllSiteReviewSlugs(): string[] {
  return siteReviews.map((r) => r.slug);
}

/** Avis publiés, classés : rank explicite d'abord, puis note décroissante. */
export function getRankedSiteReviews(): SiteReview[] {
  return siteReviews
    .filter(isPublished)
    .slice()
    .sort((a, b) => {
      if (a.rank != null && b.rank != null) return a.rank - b.rank;
      if (a.rank != null) return -1;
      if (b.rank != null) return 1;
      return b.editorScore - a.editorScore;
    });
}

/** Les autres avis, pour le bloc « alternatives » en bas de page. */
export function getOtherSiteReviews(currentSlug: string, limit = 3): SiteReview[] {
  return getRankedSiteReviews()
    .filter((r) => r.slug !== currentSlug)
    .slice(0, limit);
}

/** Moyenne des notes rédactionnelles, affichée sur le hub. */
export function getSiteReviewStats() {
  const published = getRankedSiteReviews();
  const total = published.length;
  const average =
    total > 0
      ? Math.round((published.reduce((s, r) => s + r.editorScore, 0) / total) * 10) / 10
      : 0;
  return { total, average };
}

/**
 * Identifiant du partenaire dans les statistiques de clics.
 * 'avis-wyylde' → 'wyylde', pour un tableau de bord lisible.
 */
export function siteReviewTarget(review: SiteReview): string {
  return review.slug.replace(/^avis-/, '');
}
