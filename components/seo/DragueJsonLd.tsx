/**
 * JSON-LD spécifique aux pages "Lieu de drague"
 * Schemas : ItemList (avec Place + geo) et FAQPage
 */

import type { LieuDrague, FAQItem } from '@/lib/types/drague';
import type { ReviewsByLieuId } from '@/lib/types/reviews';

const BASE_URL = 'https://www.fgpeople.com';

// ItemList générique (régions, départements, villes)
interface DragueListItem {
  url: string;
  name: string;
}
interface DragueItemListJsonLdProps {
  items: DragueListItem[];
  name: string;
  description?: string;
}

export function DragueItemListJsonLd({ items, name, description }: DragueItemListJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    ...(description && { description }),
    numberOfItems: items.length,
    itemListElement: items.slice(0, 50).map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: it.url,
      name: it.name,
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}

// ItemList avec Place + GeoCoordinates pour les pages dept/ville
interface DraguePlaceListJsonLdProps {
  lieux: LieuDrague[];
  name: string;
  description?: string;
  /** Avis indexés par lieu_id pour enrichir avec AggregateRating + Review */
  reviewsByLieuId?: ReviewsByLieuId;
}

export function DraguePlaceListJsonLd({
  lieux,
  name,
  description,
  reviewsByLieuId,
}: DraguePlaceListJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    ...(description && { description }),
    numberOfItems: lieux.length,
    itemListElement: lieux.slice(0, 30).map((l, i) => {
      const place: Record<string, unknown> = {
        '@type': 'Place',
        name: l.nom,
        description: l.description?.slice(0, 200) || `${l.typeLabel} à ${l.localisation.ville}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: l.localisation.ville,
          addressRegion: l.localisation.region,
          postalCode: l.localisation.code_postal || undefined,
          addressCountry: 'FR',
        },
      };
      if (typeof l.localisation.latitude === 'number' && typeof l.localisation.longitude === 'number') {
        place.geo = {
          '@type': 'GeoCoordinates',
          latitude: l.localisation.latitude,
          longitude: l.localisation.longitude,
        };
      }
      // AggregateRating + Review (5 derniers max) si avis disponibles
      const bundle = reviewsByLieuId?.[l.id];
      if (bundle && bundle.aggregate.count > 0) {
        place.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: bundle.aggregate.average,
          reviewCount: bundle.aggregate.count,
          bestRating: 5,
          worstRating: 1,
        };
        place.review = bundle.reviews.slice(0, 5).map((r) => ({
          '@type': 'Review',
          author: {
            '@type': 'Person',
            name: r.pseudo || 'Anonyme',
          },
          datePublished: r.created_at.slice(0, 10),
          reviewRating: {
            '@type': 'Rating',
            ratingValue: r.rating,
            bestRating: 5,
            worstRating: 1,
          },
          reviewBody: r.comment.slice(0, 500),
        }));
      }
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: place,
      };
    }),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}

// FAQPage
interface DragueFAQJsonLdProps {
  faq: FAQItem[];
}

export function DragueFAQJsonLd({ faq }: DragueFAQJsonLdProps) {
  if (!faq || faq.length === 0) return null;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}

// BreadcrumbList
interface DragueBreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export function DragueBreadcrumbJsonLd({ items }: DragueBreadcrumbJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : `${BASE_URL}${it.url}`,
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}
