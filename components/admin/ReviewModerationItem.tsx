'use client';

/**
 * Une ligne d'avis dans le panneau de modération avec les boutons d'action.
 */

import { useState, useTransition } from 'react';
import {
  approveReviewAction,
  rejectReviewAction,
  deleteReviewAction,
} from '@/app/actions/reviews';
import Stars from '@/components/reviews/Stars';
import type { Review } from '@/lib/types/reviews';

interface ReviewModerationItemProps {
  review: Review;
}

const STATUS_BADGE: Record<Review['status'], string> = {
  pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  approved: 'bg-green-500/20 text-green-300 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const STATUS_LABEL: Record<Review['status'], string> = {
  pending: 'En attente',
  approved: 'Approuvé',
  rejected: 'Rejeté',
};

export default function ReviewModerationItem({ review }: ReviewModerationItemProps) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = (
    action: (id: string) => Promise<{ ok: boolean; error?: string }>,
    label: string,
    confirmMsg?: string
  ) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setError(null);
    startTransition(async () => {
      const res = await action(review.id);
      if (res.ok) setDone(label);
      else setError(res.error || 'Erreur');
    });
  };

  return (
    <li className="bg-bg-secondary border border-border rounded-lg p-4">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Stars value={review.rating} size={14} />
          <span className="text-text-primary text-sm font-medium">
            {review.pseudo || <em className="text-text-muted">Anonyme</em>}
          </span>
          <span className={`px-2 py-0.5 text-xs rounded-full border ${STATUS_BADGE[review.status]}`}>
            {STATUS_LABEL[review.status]}
          </span>
        </div>
        <time className="text-text-muted text-xs" dateTime={review.created_at}>
          {new Date(review.created_at).toLocaleString('fr-FR')}
        </time>
      </div>

      <p className="text-text-secondary text-sm whitespace-pre-line mb-3">{review.comment}</p>

      <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-text-muted">
        <span>
          Lieu : <code className="bg-bg-tertiary px-1.5 py-0.5 rounded">{review.lieu_slug}</code> ·{' '}
          <a
            href={`/lieu-de-drague/ville/${review.ville_slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary hover:underline"
          >
            voir la page →
          </a>
        </span>
      </div>

      {/* Actions */}
      {done ? (
        <p className="text-green-400 text-sm mt-3">✓ {done}</p>
      ) : (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
          {review.status !== 'approved' && (
            <button
              type="button"
              disabled={pending}
              onClick={() => run(approveReviewAction, 'Approuvé')}
              className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-300 text-sm rounded border border-green-500/30 disabled:opacity-50"
            >
              Approuver
            </button>
          )}
          {review.status !== 'rejected' && (
            <button
              type="button"
              disabled={pending}
              onClick={() => run(rejectReviewAction, 'Rejeté')}
              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm rounded border border-red-500/30 disabled:opacity-50"
            >
              Rejeter
            </button>
          )}
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              run(deleteReviewAction, 'Supprimé', 'Supprimer définitivement cet avis ?')
            }
            className="px-3 py-1.5 bg-bg-tertiary hover:bg-red-500/10 hover:text-red-300 text-text-muted text-sm rounded border border-border disabled:opacity-50"
          >
            Supprimer
          </button>
        </div>
      )}

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </li>
  );
}
