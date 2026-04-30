/**
 * Section avis "mise en avant" — pour les pages détail (clubs).
 * Server component : tout est rendu côté serveur (HTML indexable).
 *
 * Différences avec LieuReviews (compact) :
 * - Note moyenne très visible (large)
 * - Breakdown détaillé des tags (pourcentages par catégorie)
 * - Liste des avis affichée (pas de <details>)
 * - Formulaire ouvert par défaut
 * - CTA prominent
 */

import Stars from './Stars';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import ReviewCTA from './ReviewCTA';
import TagsSummary, { TagsBreakdown } from './TagsSummary';
import type { LieuReviewsBundle, EntityType } from '@/lib/types/reviews';

interface EntityReviewsSectionProps {
  entityType: EntityType;
  entityId: string;
  entitySlug: string;
  villeSlug: string;
  entityName: string;
  bundle: LieuReviewsBundle;
  /** ID HTML du conteneur, pour navigation par ancre (#avis) */
  anchorId?: string;
}

export default function EntityReviewsSection({
  entityType,
  entityId,
  entitySlug,
  villeSlug,
  entityName,
  bundle,
  anchorId = 'avis',
}: EntityReviewsSectionProps) {
  const { aggregate, reviews, tagStats } = bundle;
  const formId = `avis-form-${entityId}`;
  const entityLabel = entityType === 'club' ? 'ce club' : 'ce lieu';
  const hasReviews = aggregate.count > 0;

  return (
    <section id={anchorId} className="scroll-mt-24" aria-labelledby={`avis-h-${entityId}`}>
      <header className="mb-6">
        <h2 id={`avis-h-${entityId}`} className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
          Avis & notes
        </h2>
        <p className="text-text-secondary text-sm">
          Retours d&apos;expérience laissés par d&apos;autres visiteurs — anonymes et modérés.
        </p>
      </header>

      {/* Bloc score résumé en grand */}
      <div className="bg-bg-secondary border border-border rounded-2xl p-6 mb-6">
        <div className="grid md:grid-cols-[auto,1fr] gap-6 items-center">
          {/* Note */}
          <div className="text-center md:border-r md:border-border md:pr-6">
            {hasReviews ? (
              <>
                <div className="text-5xl font-bold text-text-primary leading-none">
                  {aggregate.average.toFixed(1)}
                </div>
                <div className="text-text-muted text-xs mt-1">/ 5</div>
                <div className="my-2 flex justify-center">
                  <Stars value={aggregate.average} size={22} />
                </div>
                <div className="text-text-secondary text-sm">
                  {aggregate.count} avis
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold text-text-muted leading-none">—</div>
                <div className="my-2 flex justify-center">
                  <Stars value={0} size={22} />
                </div>
                <div className="text-text-secondary text-sm">Pas encore d&apos;avis</div>
              </>
            )}
          </div>

          {/* Profil dominant */}
          <div>
            {hasReviews && Object.keys(tagStats).length > 0 ? (
              <>
                <h3 className="text-text-primary text-sm font-semibold mb-2">Profil dominant</h3>
                <TagsSummary tagStats={tagStats} totalReviews={aggregate.count} variant="compact" />
                <div className="mt-4">
                  <details className="group">
                    <summary className="cursor-pointer list-none text-xs text-accent-primary hover:underline">
                      Voir le détail par catégorie →
                    </summary>
                    <div className="mt-3">
                      <TagsBreakdown tagStats={tagStats} totalReviews={aggregate.count} />
                    </div>
                  </details>
                </div>
              </>
            ) : (
              <div className="text-text-muted text-sm">
                <p className="mb-2">
                  Les avis permettent de qualifier le lieu sur plusieurs critères : ambiance, type de
                  clientèle, tranche d&apos;âge, niveau, discrétion, fréquentation.
                </p>
                <p>Sois le premier à donner ton ressenti.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA d'incitation */}
      <div className="mb-6">
        <ReviewCTA totalReviews={aggregate.count} formId={formId} entityLabel={entityLabel} />
      </div>

      {/* Liste des avis */}
      {hasReviews && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-text-primary mb-3">
            Ce que disent les visiteurs ({aggregate.count})
          </h3>
          <ReviewList reviews={reviews} initialLimit={5} />
        </div>
      )}

      {/* Formulaire — visible par défaut */}
      <div id={formId} className="scroll-mt-24">
        <h3 className="text-xl font-bold text-text-primary mb-3">
          {hasReviews ? 'Laisser ton avis' : 'Écrire le premier avis'}
        </h3>
        <ReviewForm
          entityType={entityType}
          lieuId={entityId}
          lieuSlug={entitySlug}
          villeSlug={villeSlug}
          lieuName={entityName}
        />
      </div>
    </section>
  );
}
