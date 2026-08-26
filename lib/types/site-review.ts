/**
 * Types — Avis sur les sites de rencontre libertins
 *
 * Un SiteReview est un contenu STATIQUE, versionné dans data/site_reviews/.
 * Il est rédigé à partir d'un brief saisi dans /admin/sites (voir ./brief.ts).
 *
 * Le corps de l'article est une liste ordonnée de `ReviewBlock` : c'est ce qui
 * permet de placer une capture d'écran, une vidéo ou le tableau des tarifs
 * exactement au bon moment dans la lecture.
 */

import type { FAQItem } from './index';

// ============================================
// BRIQUES DE BASE
// ============================================

export interface ReviewMedia {
  /** URL Cloudinary (https://res.cloudinary.com/...) ou chemin local /images/... */
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/** Un critère noté par la rédaction, sur 10. */
export interface ScoreCriterion {
  key: string;
  label: string;
  /** 0 à 10, une décimale. */
  score: number;
  /** Justification courte affichée au survol / sous la barre. */
  comment?: string;
}

/** Chiffre clé affiché dans le bandeau de faits. */
export interface QuickFact {
  label: string;
  value: string;
  /** Emoji ou pictogramme court. */
  icon?: string;
}

export interface PricingPlan {
  name: string;
  duration: string;
  /** Prix ramené au mois, tel qu'affiché ("8,33 €"). */
  pricePerMonth: string;
  /** Montant réellement débité ("99,90 €"). */
  total?: string;
  /** Économie par rapport à la formule la plus courte ("-64 %"). */
  savings?: string;
  /** Met la colonne en avant (meilleure offre). */
  highlight?: boolean;
  features?: string[];
}

export interface PricingInfo {
  plans: PricingPlan[];
  /** Ce qu'on peut faire sans payer. */
  freeTier?: string;
  /** Avertissement (reconduction automatique, frais cachés…). */
  warning?: string;
  note?: string;
}

// ============================================
// BLOCS DE CONTENU
// ============================================

/**
 * Champs communs à tous les blocs.
 * `id` + `heading` renseignés ⇒ le bloc apparaît dans le sommaire ancré.
 */
interface BlockBase {
  id?: string;
  heading?: string;
}

export type ReviewBlock =
  /** Paragraphes. Supporte **gras**, [liens](url) et listes "- " (cf. parseTextWithFormatting). */
  | (BlockBase & { type: 'text'; body: string })
  /** Une capture d'écran plein cadre avec sa légende. clickable ⇒ toute l'image devient un lien affilié tracké. */
  | (BlockBase & { type: 'screenshot'; media: ReviewMedia; caption?: string; body?: string; clickable?: boolean })
  /** Plusieurs captures côte à côte. clickable ⇒ chaque image devient un lien affilié tracké. */
  | (BlockBase & { type: 'gallery'; items: (ReviewMedia & { caption?: string })[]; body?: string; clickable?: boolean })
  /** Vidéo YouTube (facade légère : miniature puis iframe au clic). */
  | (BlockBase & { type: 'youtube'; videoId: string; title: string; caption?: string; body?: string })
  /** Vidéo courte hébergée sur Cloudinary (démo d'interface, muette et en boucle). */
  | (BlockBase & { type: 'video'; src: string; poster?: string; caption?: string; body?: string })
  /** Encadré mis en valeur. */
  | (BlockBase & { type: 'callout'; variant: 'tip' | 'warning' | 'info'; title: string; body: string })
  /** Tutoriel numéroté (inscription pas à pas), chaque étape peut porter une capture. */
  | (BlockBase & { type: 'steps'; items: { title: string; body: string; media?: ReviewMedia }[] })
  /** Rend le tableau des tarifs défini au niveau du SiteReview. */
  | (BlockBase & { type: 'pricing' })
  /** Rend les listes pros / cons définies au niveau du SiteReview. */
  | (BlockBase & { type: 'proscons' })
  /** Rend le détail des notes par critère. */
  | (BlockBase & { type: 'scores' })
  /** Bouton d'affiliation intercalé dans le texte. */
  | (BlockBase & { type: 'cta'; title: string; body?: string; label?: string })
  /** Citation (avis Trustpilot, témoignage…). */
  | (BlockBase & { type: 'quote'; text: string; author?: string; source?: string })
  /** Tableau libre (comparaison de fonctionnalités…). */
  | (BlockBase & { type: 'table'; columns: string[]; rows: string[][]; body?: string });

export type ReviewBlockType = ReviewBlock['type'];

// ============================================
// L'AVIS COMPLET
// ============================================

export interface SiteReviewVerdict {
  /** Une phrase qui résume tout, affichée en gros. */
  oneLiner: string;
  /** Profils pour qui le site est adapté. */
  bestFor: string[];
  /** Profils qui devraient passer leur chemin. */
  notFor: string[];
  /** Paragraphe de conclusion. */
  body: string;
}

export interface SiteReviewAlternative {
  /** Slug d'un autre avis du site, si on l'a rédigé. */
  slug?: string;
  name: string;
  why: string;
  affiliateUrl?: string;
}

export interface SiteReview {
  /** Slug de la page, à la racine : 'avis-wyylde' → /avis-wyylde */
  slug: string;
  siteName: string;
  /** URL officielle (jamais affichée en dur, sert au JSON-LD). */
  siteUrl: string;
  /** Lien d'affiliation : tous les CTA de la page pointent dessus. */
  affiliateUrl: string;

  logo?: ReviewMedia;
  hero: ReviewMedia;

  /** Accroche courte sous le titre. */
  tagline: string;
  excerpt: string;

  /** Note globale de la rédaction, sur 10. */
  editorScore: number;
  scores: ScoreCriterion[];
  quickFacts: QuickFact[];

  verdict: SiteReviewVerdict;
  pros: string[];
  cons: string[];
  pricing: PricingInfo;

  /** Le corps de l'article. */
  blocks: ReviewBlock[];

  faq: FAQItem[];
  alternatives: SiteReviewAlternative[];
  /** Slugs d'articles de blog à mettre en lien. */
  relatedSlugs?: string[];

  meta: { title: string; description: string };

  publishedAt: string;
  updatedAt: string;

  /** Position dans le classement du comparatif (1 = premier). */
  rank?: number;
  /** Étiquette affichée sur la carte du comparatif. */
  badge?: string;
  /** false ⇒ la page existe mais reste hors du comparatif et du sitemap. */
  published?: boolean;
}

/** Entrée du sommaire ancré, dérivée des blocs. */
export interface TocEntry {
  id: string;
  label: string;
}
