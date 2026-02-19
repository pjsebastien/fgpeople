/**
 * Types principaux pour l'annuaire FG People
 * Basé sur le JSON clubs_libertins_verified.json
 */

// ============================================
// TYPES DE CLUBS NORMALISÉS
// ============================================
export type ClubTypeSlug =
  | 'club'
  | 'sauna'
  | 'spa'
  | 'restaurant'
  | 'bar'
  | 'hebergement'
  | 'sm'
  | 'gay'
  | 'cinema'
  | 'discotheque';

export interface ClubType {
  slug: ClubTypeSlug;
  label: string;
}

// Configuration complète d'un type pour les pages
export interface TypeCategory {
  slug: ClubTypeSlug;
  urlSlug: string; // Slug SEO-friendly pour l'URL
  label: string;
  labelPlural: string;
  seoTitle: string; // Titre optimisé pour le SEO
  description: string;
  clubCount: number;
}

// ============================================
// TYPE PRINCIPAL : CLUB
// ============================================
// FAQ pour le SEO
export interface FAQItem {
  question: string;
  answer: string;
}

export interface Club {
  id: string;
  slug: string;
  nom: string;
  type: string;
  types: ClubType[]; // Types normalisés détectés automatiquement
  adresse: string;
  code_postal: string;
  ville: string;
  villeSlug: string;
  departement_code: string;
  departement_nom: string;
  departementSlug: string;
  region: string;
  regionSlug: string;
  pays: string;
  paysSlug: string;
  telephone?: string;
  email?: string;
  site_web?: string;
  websiteAccessible: boolean | null; // null si pas de site, true si accessible, false sinon
  description: string;
  shortDescription: string;
  equipements: string[];
  horaires?: Record<string, string>;
  tarifs?: Record<string, string>;
  status: 'actif' | 'incertain' | 'probablement_ferme';
  qualityScore: number;
  // Contenu SEO généré
  seo: {
    title: string;
    metaDescription: string;
    introText: string;
    ambianceText: string;
    accessText: string;
    faq: FAQItem[];
  };
}

// ============================================
// TYPES POUR LA NAVIGATION
// ============================================
export interface Region {
  nom: string;
  slug: string;
  departements: string[]; // slugs des départements
  clubCount: number;
}

export interface Departement {
  code: string;
  nom: string;
  slug: string;
  region: string;
  regionSlug: string;
  villes: string[]; // slugs des villes
  clubCount: number;
}

export interface Ville {
  nom: string;
  slug: string;
  code_postal: string;
  departement: string;
  departementSlug: string;
  departement_code: string;
  region: string;
  regionSlug: string;
  clubCount: number;
}

export interface Pays {
  nom: string;
  slug: string;
  clubCount: number;
  isEtranger: boolean;
}

// ============================================
// TYPES POUR LE SEO
// ============================================
export interface BreadcrumbItem {
  name: string;
  url: string;
}

// ============================================
// TYPES POUR LES STATS
// ============================================
export interface Stats {
  total: number;
  france: number;
  etranger: number;
  regions: number;
  departements: number;
  villes: number;
}

// ============================================
// TYPE POUR LES LIENS CONNEXES
// ============================================
export interface RelatedLink {
  nom: string;
  slug: string;
  url: string;
  count?: number;
}

// ============================================
// TYPES POUR LE BLOG
// ============================================
export type ArticleCategory = 'pratiques' | 'rencontres' | 'conseils' | 'securite' | 'couple';

export interface ArticleSection {
  id: string;
  title: string;
  content: string;
  image?: {
    src: string;
    alt: string;
  };
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: ArticleSection[];
  category: ArticleCategory;
  tags: string[];
  relatedSlugs: string[];
  faq: FAQItem[];
  heroImage: {
    src: string;
    alt: string;
  };
  datePublished?: string;
  dateModified?: string;
}
