/**
 * Carte d'offre qui suit la lecture (colonne de droite, desktop uniquement).
 *
 * Volontairement PAS une barre basse : FloatingCTA occupe déjà le bas de
 * l'écran sur tout le site. Une colonne sticky garde le CTA visible pendant
 * toute la lecture sans empiler deux bandeaux.
 */

import AffiliateButton from './AffiliateButton';
import CloudImage from './CloudImage';
import { ScoreBadge, scoreLabel } from './Scores';
import { siteReviewTarget } from '@/lib/data/site-reviews';
import type { SiteReview } from '@/lib/types/site-review';

export default function StickyOffer({ review }: { review: SiteReview }) {
  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-24 bg-bg-secondary border border-border rounded-2xl p-5 text-center">
        {review.logo && (
          <CloudImage
            media={review.logo}
            className="h-10 w-auto mx-auto mb-4 object-contain"
            sizes="200px"
          />
        )}

        <div className="flex justify-center mb-3">
          <ScoreBadge score={review.editorScore} size="md" />
        </div>

        <p className="text-text-primary font-bold mb-1">{review.siteName}</p>
        <p className="text-text-muted text-xs mb-4">{scoreLabel(review.editorScore)}</p>

        <AffiliateButton
          href={review.affiliateUrl}
          target={siteReviewTarget(review)}
          block="avis-colonne"
          className="w-full"
          size="md"
        >
          Essayer {review.siteName}
        </AffiliateButton>

        <ul className="mt-4 space-y-1.5 text-left">
          {review.verdict.bestFor.slice(0, 3).map((item, i) => (
            <li key={i} className="flex gap-2 text-text-secondary text-xs leading-snug">
              <span className="text-green-400 shrink-0" aria-hidden="true">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-text-muted text-[10px] mt-4 pt-3 border-t border-border">
          Lien partenaire. Cela ne change rien à votre prix.
        </p>
      </div>
    </aside>
  );
}
