/**
 * Bloc "Avis & note" — variante compacte (server component).
 * Utilisé dans les cartes de lieux/clubs en listing.
 *
 * Pour la variante "mise en avant" (page détail), voir EntityReviewsSection.tsx.
 */

import ReviewSummary from './ReviewSummary';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import ReviewCTA from './ReviewCTA';
import TagsSummary from './TagsSummary';
import type { LieuReviewsBundle, EntityType } from '@/lib/types/reviews';

interface LieuReviewsProps {
  entityType?: EntityType;
  lieuId: string;
  lieuSlug: string;
  villeSlug: string;
  lieuName: string;
  bundle: LieuReviewsBundle;
}

export default function LieuReviews({
  entityType = 'lieu',
  lieuId,
  lieuSlug,
  villeSlug,
  lieuName,
  bundle,
}: LieuReviewsProps) {
  const { aggregate, reviews, tagStats } = bundle;
  const formId = `avis-form-${lieuId}`;
  const entityLabel = entityType === 'club' ? 'ce club' : 'ce lieu';

  return (
    <section
      className="bg-bg-secondary/50 border border-border rounded-lg p-4"
      aria-labelledby={`avis-${lieuId}`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <h4 id={`avis-${lieuId}`} className="text-text-primary text-sm font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          Avis & note
        </h4>
        <ReviewSummary aggregate={aggregate} variant="inline" size={14} />
      </div>

      <div className="space-y-4">
        {/* Profil dominant agrégé (si on a des tags) */}
        {aggregate.count > 0 && Object.keys(tagStats).length > 0 && (
          <TagsSummary tagStats={tagStats} totalReviews={aggregate.count} variant="compact" />
        )}

        {/* CTA d'incitation (toujours visible) */}
        <ReviewCTA totalReviews={aggregate.count} formId={formId} entityLabel={entityLabel} />

        {/* Liste des avis approuvés (rendue côté serveur) */}
        {aggregate.count > 0 && <ReviewList reviews={reviews} initialLimit={3} />}

        {/* Formulaire (replié par défaut, ouvert via le lien d'ancre) */}
        <details className="group" id={formId}>
          <summary className="cursor-pointer list-none inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary text-sm font-medium rounded-lg border border-accent-primary/20 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m-1-1v2m6 6h-2m1-1v2m-7 6H6a2 2 0 01-2-2v-7a2 2 0 012-2h7a2 2 0 012 2v1" />
            </svg>
            <span>Laisser un avis</span>
            <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="mt-3">
            <ReviewForm
              entityType={entityType}
              lieuId={lieuId}
              lieuSlug={lieuSlug}
              villeSlug={villeSlug}
              lieuName={lieuName}
            />
          </div>
        </details>
      </div>
    </section>
  );
}
