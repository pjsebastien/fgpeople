/**
 * JSON-LD des pages d'avis sur les sites.
 *
 * Type WebApplication : c'est celui que Google accepte pour un service en
 * ligne, et il porte à la fois notre note éditoriale (`review`) et la note
 * moyenne des visiteurs (`aggregateRating`). Les deux échelles diffèrent, d'où
 * les bestRating/worstRating explicites sur chacune.
 */

import type { SiteReview } from '@/lib/types/site-review';
import type { LieuReviewsBundle } from '@/lib/types/reviews';

const BASE_URL = 'https://www.fgpeople.com';

export default function SiteReviewJsonLd({
  review,
  reviewsBundle,
}: {
  review: SiteReview;
  reviewsBundle?: LieuReviewsBundle;
}) {
  const cheapest = review.pricing.plans
    .map((p) => parseFloat(p.pricePerMonth.replace(/[^\d,.]/g, '').replace(',', '.')))
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b)[0];

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: review.siteName,
    url: review.siteUrl,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    description: review.meta.description,
    ...(review.logo ? { image: review.logo.src } : {}),

    review: {
      '@type': 'Review',
      author: { '@type': 'Organization', name: 'FG People', url: BASE_URL },
      datePublished: review.publishedAt,
      dateModified: review.updatedAt,
      name: review.meta.title,
      reviewBody: review.verdict.oneLiner,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.editorScore,
        bestRating: 10,
        worstRating: 0,
      },
    },
  };

  if (cheapest !== undefined) {
    data.offers = {
      '@type': 'Offer',
      price: cheapest.toFixed(2),
      priceCurrency: 'EUR',
      url: review.siteUrl,
    };
  }

  // Note moyenne des visiteurs — uniquement si de vrais avis existent
  if (reviewsBundle && reviewsBundle.aggregate.count > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: reviewsBundle.aggregate.average,
      reviewCount: reviewsBundle.aggregate.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
