/**
 * Affiche la moyenne + le nombre d'avis (server component).
 */

import Stars from './Stars';
import type { ReviewAggregate } from '@/lib/types/reviews';

interface ReviewSummaryProps {
  aggregate: ReviewAggregate;
  size?: number;
  variant?: 'inline' | 'large';
  /** Texte affiché s'il n'y a aucun avis */
  emptyLabel?: string;
}

export default function ReviewSummary({
  aggregate,
  size = 16,
  variant = 'inline',
  emptyLabel = 'Aucun avis',
}: ReviewSummaryProps) {
  if (aggregate.count === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-text-muted text-xs">
        <Stars value={0} size={size} ariaLabel="Pas encore d'avis" />
        <span>{emptyLabel}</span>
      </span>
    );
  }

  if (variant === 'large') {
    return (
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-text-primary">{aggregate.average.toFixed(1)}</span>
        <div className="flex flex-col">
          <Stars value={aggregate.average} size={size} ariaLabel={`${aggregate.average} sur 5`} />
          <span className="text-text-muted text-xs">
            {aggregate.count} avis{aggregate.count > 1 ? '' : ''}
          </span>
        </div>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <Stars value={aggregate.average} size={size} ariaLabel={`${aggregate.average} sur 5`} />
      <span className="text-text-secondary font-medium">{aggregate.average.toFixed(1)}</span>
      <span className="text-text-muted">
        ({aggregate.count} avis)
      </span>
    </span>
  );
}
