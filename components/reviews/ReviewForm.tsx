'use client';

/**
 * Formulaire de soumission d'avis (client component).
 * - Étoiles interactives (clavier + souris)
 * - Honeypot caché (`website`)
 * - Timestamp de chargement (`_t`) pour bloquer les soumissions trop rapides
 * - Server Action pour la soumission
 */

import { useState, useTransition, useRef } from 'react';
import { submitReviewAction } from '@/app/actions/reviews';
import type { SubmitReviewResult } from '@/lib/types/reviews';

interface ReviewFormProps {
  lieuId: string;
  lieuSlug: string;
  villeSlug: string;
  lieuName: string;
}

const STARS = [1, 2, 3, 4, 5] as const;

export default function ReviewForm({ lieuId, lieuSlug, villeSlug, lieuName }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<SubmitReviewResult | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const formLoadedAt = useRef<number>(Date.now());

  const displayed = hover || rating;
  const charCount = comment.length;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult(null);
    if (rating < 1) {
      setResult({ ok: false, error: 'Choisis une note (1 à 5 étoiles).' });
      return;
    }
    const fd = new FormData(e.currentTarget);
    fd.set('rating', String(rating));
    fd.set('_t', String(formLoadedAt.current));
    startTransition(async () => {
      const res = await submitReviewAction(fd);
      setResult(res);
      if (res.ok) {
        setRating(0);
        setComment('');
        setPseudo('');
        formRef.current?.reset();
      }
    });
  };

  if (result?.ok) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-sm">
        <p className="text-green-300 font-medium mb-1">Merci pour ton avis !</p>
        <p className="text-text-secondary">
          Il sera publié après vérification par un modérateur (généralement sous 24h).
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="bg-bg-secondary border border-border rounded-lg p-4 space-y-4"
      aria-label={`Laisser un avis sur ${lieuName}`}
    >
      <input type="hidden" name="lieuId" value={lieuId} />
      <input type="hidden" name="lieuSlug" value={lieuSlug} />
      <input type="hidden" name="villeSlug" value={villeSlug} />
      <input type="hidden" name="lieuName" value={lieuName} />
      {/* Honeypot — caché aux humains, rempli par les bots */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}>
        <label>
          Site web
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Note */}
      <div>
        <label className="block text-text-primary text-sm font-semibold mb-2">
          Ta note <span className="text-red-400">*</span>
        </label>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Note de 1 à 5 étoiles">
          {STARS.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onFocus={() => setHover(n)}
              onBlur={() => setHover(0)}
              onClick={() => setRating(n)}
              className="p-1 rounded transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 20 20"
                aria-hidden="true"
                className={n <= displayed ? 'text-yellow-400' : 'text-text-muted'}
              >
                <path
                  d="M10 1.5l2.6 5.27 5.81.84-4.2 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.2-4.1 5.81-.84L10 1.5z"
                  fill={n <= displayed ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-text-secondary text-sm">{rating}/5</span>
          )}
        </div>
      </div>

      {/* Commentaire */}
      <div>
        <label htmlFor={`comment-${lieuId}`} className="block text-text-primary text-sm font-semibold mb-2">
          Ton commentaire <span className="text-red-400">*</span>
        </label>
        <textarea
          id={`comment-${lieuId}`}
          name="comment"
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partage ton expérience : ambiance, fréquentation, conseils..."
          className="w-full bg-bg-tertiary border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:border-accent-primary focus:outline-none placeholder:text-text-muted"
        />
        <p className="text-text-muted text-xs mt-1">
          {charCount}/2000 caractères{' '}
          {charCount < 10 && <span className="text-yellow-500">— minimum 10 caractères</span>}
        </p>
      </div>

      {/* Pseudo (optionnel) */}
      <div>
        <label htmlFor={`pseudo-${lieuId}`} className="block text-text-primary text-sm font-semibold mb-2">
          Pseudo <span className="text-text-muted font-normal">(optionnel)</span>
        </label>
        <input
          id={`pseudo-${lieuId}`}
          name="pseudo"
          type="text"
          maxLength={30}
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          placeholder="Anonyme"
          autoComplete="off"
          className="w-full bg-bg-tertiary border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:border-accent-primary focus:outline-none placeholder:text-text-muted"
        />
        <p className="text-text-muted text-xs mt-1">
          Aucune adresse email ni inscription requise. Tu peux rester totalement anonyme.
        </p>
      </div>

      {/* Erreur */}
      {result && !result.ok && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
          {result.error || 'Une erreur est survenue.'}
        </div>
      )}

      {/* Bouton submit */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-text-muted text-xs">
          Ton avis sera vérifié avant publication.
        </p>
        <button
          type="submit"
          disabled={pending || rating < 1 || comment.trim().length < 10}
          className="px-5 py-2 bg-accent-primary text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? 'Envoi…' : 'Envoyer mon avis'}
        </button>
      </div>
    </form>
  );
}
