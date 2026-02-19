/**
 * JsonLd - Server Component
 *
 * Injection de données structurées JSON-LD pour le SEO.
 */

import type { Club, BreadcrumbItem, FAQItem, BlogArticle } from '@/lib/types';

// ============================================
// LOCAL BUSINESS (Club) - Enrichi
// ============================================
interface LocalBusinessJsonLdProps {
  club: Club;
}

export function LocalBusinessJsonLd({ club }: LocalBusinessJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://www.fgpeople.com/${club.slug}`,
    name: club.nom,
    description: club.shortDescription || club.seo?.introText,
    url: `https://www.fgpeople.com/${club.slug}`,
    image: `https://www.fgpeople.com/images/club-libertin-ambiance-${((club.nom.split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0) % 12) + 1)}.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: club.adresse || undefined,
      addressLocality: club.ville,
      addressRegion: club.region,
      postalCode: club.code_postal,
      addressCountry: club.pays === 'France' ? 'FR' : club.pays,
    },
    ...(club.telephone && { telephone: club.telephone }),
    ...(club.site_web && club.websiteAccessible !== false && { sameAs: club.site_web }),
    ...(club.email && { email: club.email }),
  };

  // Horaires d'ouverture structurés
  if (club.horaires && Object.keys(club.horaires).length > 0) {
    const dayMapping: Record<string, string> = {
      lundi: 'Monday',
      mardi: 'Tuesday',
      mercredi: 'Wednesday',
      jeudi: 'Thursday',
      vendredi: 'Friday',
      samedi: 'Saturday',
      dimanche: 'Sunday',
    };

    const openingHours: Record<string, unknown>[] = [];
    for (const [jour, horaire] of Object.entries(club.horaires)) {
      const englishDay = dayMapping[jour.toLowerCase()];
      if (englishDay && horaire && horaire.toLowerCase() !== 'fermé') {
        // Tenter d'extraire les heures au format HH:MM - HH:MM
        const timeMatch = (horaire as string).match(/(\d{1,2})[h:](\d{2})?\s*[-àa]\s*(\d{1,2})[h:](\d{2})?/);
        if (timeMatch) {
          const opens = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2] || '00'}`;
          const closes = `${timeMatch[3].padStart(2, '0')}:${timeMatch[4] || '00'}`;
          openingHours.push({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: englishDay,
            opens,
            closes,
          });
        } else {
          // Fallback : utiliser description si le format n'est pas parsable
          openingHours.push({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: englishDay,
            description: horaire as string,
          });
        }
      }
    }

    if (openingHours.length > 0) {
      jsonLd.openingHoursSpecification = openingHours;
    }
  }

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
    itemListElement: clubs.slice(0, 30).map((club, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://www.fgpeople.com/${club.slug}`,
      name: club.nom,
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
// WEBSITE (Page d'accueil) - SearchAction corrigé
// ============================================
export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.fgpeople.com/#website',
    url: 'https://www.fgpeople.com',
    name: 'FG People',
    description: 'Annuaire complet des clubs libertins et échangistes en France et en Europe',
    inLanguage: 'fr-FR',
    publisher: {
      '@id': 'https://www.fgpeople.com/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.fgpeople.com/club-libertin?q={search_term_string}',
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
// ORGANIZATION - Corrigé (suppression sameAs vide)
// ============================================
export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.fgpeople.com/#organization',
    name: 'FG People',
    alternateName: 'For Good People',
    url: 'https://www.fgpeople.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.fgpeople.com/images/logo.png',
      width: 512,
      height: 512,
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
// ARTICLE (Blog) - Avec dates
// ============================================
interface ArticleJsonLdProps {
  article: BlogArticle;
}

export function ArticleJsonLd({ article }: ArticleJsonLdProps) {
  const publishDate = article.datePublished || '2025-01-28';
  const modifiedDate = article.dateModified || publishDate;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `https://www.fgpeople.com/${article.slug}`,
    headline: article.title,
    description: article.metaDescription,
    image: `https://www.fgpeople.com${article.heroImage.src}`,
    datePublished: publishDate,
    dateModified: modifiedDate,
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
    inLanguage: 'fr-FR',
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
