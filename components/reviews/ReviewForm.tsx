'use client';

/**
 * Formulaire de soumission d'avis (client component).
 * - Étoiles interactives (clavier + souris)
 * - Critères structurés (cases à cocher) optionnels
 * - Honeypot caché (`website`)
 * - Timestamp de chargement (`_t`) pour bloquer les soumissions trop rapides
 * - Server Action pour la soumission
 */

import { useState, useTransition, useRef } from 'react';
import { submitReviewAction } from '@/app/actions/reviews';
import { CRITERIA, type CriterionCategory } from '@/lib/utils/review-criteria';
import type { SubmitReviewResult, EntityType } from '@/lib/types/reviews';

interface ReviewFormProps {
  entityType: EntityType;
  lieuId: string;
  lieuSlug: string;
  villeSlug: string;
  lieuName: string;
}

const STARS = [1, 2, 3, 4, 5] as const;

function tagId(category: string, value: string) {
  return `${category}:${value}`;
}

export default function ReviewForm({
  entityType,
  lieuId,
  lieuSlug,
  villeSlug,
  lieuName,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [tags, setTags] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<SubmitReviewResult | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const formLoadedAt = useRef<number>(Date.now());

  const displayed = hover || rating;
  const charCount = comment.length;

  const toggleTag = (cat: CriterionCategory, optionValue: string) => {
    setTags((prev) => {
      const next = new Set(prev);
      const id = tagId(cat.key, optionValue);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (cat.singleSelect) {
          // Retirer toutes les autres options de la même catégorie
          for (const t of Array.from(next)) {
            if (t.startsWith(`${cat.key}:`)) next.delete(t);
          }
        }
        next.add(id);
      }
      return next;
    });
  };

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
    // Append tags
    fd.delete('tags');
    Array.from(tags).forEach((t) => fd.append('tags', t));
    startTransition(async () => {
      const res = await submitReviewAction(fd);
      setResult(res);
      if (res.ok) {
        setRating(0);
        setComment('');
        setPseudo('');
        setTags(new Set());
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
      <input type="hidden" name="entityType" value={entityType} />
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
          placeholder="Partage ton expérience : ambiance, accueil, conseils..."
          className="w-full bg-bg-tertiary border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:border-accent-primary focus:outline-none placeholder:text-text-muted"
        />
        <p className="text-text-muted text-xs mt-1">
          {charCount}/2000 caractères{' '}
          {charCount < 10 && <span className="text-yellow-500">— minimum 10 caractères</span>}
        </p>
      </div>

      {/* Critères structurés (cases à cocher, optionnels) */}
      <details className="group bg-bg-tertiary rounded-lg border border-border">
        <summary className="cursor-pointer list-none px-3 py-2 text-sm flex items-center justify-between">
          <span className="text-text-primary font-medium">
            Préciser le profil du lieu <span className="text-text-muted font-normal">(optionnel)</span>
          </span>
          <svg className="w-4 h-4 text-text-muted transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="px-3 pb-3 pt-1 space-y-3 border-t border-border">
          {CRITERIA.map((cat) => (
            <fieldset key={cat.key}>
              <legend className="text-text-secondary text-xs font-medium mb-1">
                {cat.label}
                {cat.hint && <span className="text-text-muted font-normal ml-1">— {cat.hint}</span>}
              </legend>
              <div className="flex flex-wrap gap-1.5">
                {cat.options.map((opt) => {
                  const id = tagId(cat.key, opt.value);
                  const checked = tags.has(id);
                  return (
                    <label
                      key={id}
                      className={`px-2.5 py-1 text-xs rounded-full border cursor-pointer transition-colors select-none ${
                        checked
                          ? 'bg-accent-primary/20 border-accent-primary/50 text-accent-primary'
                          : 'bg-bg-secondary border-border text-text-secondary hover:border-accent-primary/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => toggleTag(cat, opt.value)}
                      />
                      {opt.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      </details>

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
