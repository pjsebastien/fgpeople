/**
 * JsonLd - Server Component
 *
 * Injection de données structurées JSON-LD pour le SEO.
 */

import type { Club, BreadcrumbItem, FAQItem, BlogArticle } from '@/lib/types';

// ============================================
// LOCAL BUSINESS (Club)
// ============================================
interface LocalBusinessJsonLdProps {
  club: Club;
}

export function LocalBusinessJsonLd({ club }: LocalBusinessJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://www.fgpeople.com/${club.slug}`,
    name: club.nom,
    description: club.shortDescription,
    address: {
      '@type': 'PostalAddress',
      streetAddress: club.adresse,
      addressLocality: club.ville,
      addressRegion: club.region,
      postalCode: club.code_postal,
      addressCountry: club.pays === 'France' ? 'FR' : club.pays,
    },
    ...(club.telephone && { telephone: club.telephone }),
    ...(club.site_web && { url: club.site_web }),
    ...(club.email && { email: club.email }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ============================================
// BREADCRUMB LIST (Fil d'ariane)
// ============================================
interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://www.fgpeople.com${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ============================================
// ITEM LIST (Liste de clubs)
// ============================================
interface ItemListJsonLdProps {
  clubs: Club[];
  name: string;
  description?: string;
}

export function ItemListJsonLd({ clubs, name, description }: ItemListJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    ...(description && { description }),
    numberOfItems: clubs.length,
    itemListElement: clubs.map((club, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LocalBusiness',
        '@id': `https://www.fgpeople.com/${club.slug}`,
        name: club.nom,
        description: club.shortDescription,
        address: {
          '@type': 'PostalAddress',
          addressLocality: club.ville,
          addressRegion: club.region,
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ============================================
// WEBSITE (Page d'accueil)
// ============================================
export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.fgpeople.com/#website',
    url: 'https://www.fgpeople.com',
    name: 'FG People',
    description: 'Tous les clubs libertins et échangistes en France et en Europe',
    publisher: {
      '@type': 'Organization',
      name: 'FG People',
      url: 'https://www.fgpeople.com',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.fgpeople.com/clubs?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ============================================
// ORGANIZATION
// ============================================
export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.fgpeople.com/#organization',
    name: 'FG People',
    url: 'https://www.fgpeople.com',
    logo: 'https://www.fgpeople.com/images/logo.png',
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ============================================
// FAQ PAGE (Questions fréquentes)
// ============================================
interface FAQPageJsonLdProps {
  faq: FAQItem[];
}

export function FAQPageJsonLd({ faq }: FAQPageJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ============================================
// ARTICLE (Blog)
// ============================================
interface ArticleJsonLdProps {
  article: BlogArticle;
}

export function ArticleJsonLd({ article }: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `https://www.fgpeople.com/${article.slug}`,
    headline: article.title,
    description: article.metaDescription,
    image: `https://www.fgpeople.com${article.heroImage.src}`,
    author: {
      '@type': 'Organization',
      name: 'FG People',
      url: 'https://www.fgpeople.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'FG People',
      url: 'https://www.fgpeople.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.fgpeople.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.fgpeople.com/${article.slug}`,
    },
    articleSection: article.category,
    keywords: article.tags.join(', '),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
