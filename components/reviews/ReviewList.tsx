/**
 * Liste des avis approuvés pour un lieu (server component).
 * Rendu côté serveur → contenu présent dans le HTML pour le SEO.
 */

import Stars from './Stars';
import type { Review } from '@/lib/types/reviews';

interface ReviewListProps {
  reviews: Review[];
  /** Nb d'avis affichés par défaut, le reste reste accessible mais hors fold */
  initialLimit?: number;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function ReviewList({ reviews, initialLimit = 5 }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-text-muted text-sm italic">
        Aucun avis pour le moment. Sois le premier à partager ton expérience !
      </p>
    );
  }

  const visible = reviews.slice(0, initialLimit);
  const hidden = reviews.slice(initialLimit);

  return (
    <ul className="space-y-3" aria-label="Avis utilisateurs">
      {visible.map((r) => (
        <ReviewItem key={r.id} review={r} />
      ))}
      {hidden.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer list-none text-sm text-accent-primary hover:underline">
            Voir les {hidden.length} avis suivant{hidden.length > 1 ? 's' : ''}
          </summary>
          <ul className="space-y-3 mt-3">
            {hidden.map((r) => (
              <ReviewItem key={r.id} review={r} />
            ))}
          </ul>
        </details>
      )}
    </ul>
  );
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <li
      className="bg-bg-tertiary rounded-lg border border-border p-3"
      itemProp="review"
      itemScope
      itemType="https://schema.org/Review"
    >
      <meta itemProp="datePublished" content={review.created_at.slice(0, 10)} />
      <div
        className="flex items-center justify-between gap-2 flex-wrap"
        itemProp="reviewRating"
        itemScope
        itemType="https://schema.org/Rating"
      >
        <div className="flex items-center gap-2">
          <Stars value={review.rating} size={14} ariaLabel={`${review.rating} sur 5`} />
          <meta itemProp="ratingValue" content={String(review.rating)} />
          <meta itemProp="bestRating" content="5" />
          <meta itemProp="worstRating" content="1" />
          <span
            className="text-text-secondary text-sm font-medium"
            itemProp="author"
            itemScope
            itemType="https://schema.org/Person"
          >
            <span itemProp="name">{review.pseudo || 'Anonyme'}</span>
          </span>
        </div>
        <time className="text-text-muted text-xs" dateTime={review.created_at}>
          {formatDate(review.created_at)}
        </time>
      </div>
      <p
        className="text-text-secondary text-sm mt-2 leading-relaxed whitespace-pre-line"
        itemProp="reviewBody"
      >
        {review.comment}
      </p>
    </li>
  );
}
