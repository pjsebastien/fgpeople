/**
 * Liens partenaires insérés dans le texte rédactionnel.
 *
 * Les fiches clubs écrivent `[ancre](aff:wyylde)` plutôt qu'une URL de
 * tracking : le texte reste lisible, et changer de lien d'affiliation ne
 * demande qu'une modification ici (ou dans la source citée), jamais une
 * réécriture des 500 fiches.
 *
 * Rendu par lib/utils/rich-text.tsx via TrackedAffiliateLink.
 */

import { CARRE_LIBERTIN_AFFILIATE, GLEESE_AFFILIATE } from './affiliates';
import { wyylde } from '@/data/site_reviews/wyylde';

export interface InlineAffiliate {
  /** Partenaire crédité dans /admin/clics. */
  target: string;
  label: string;
  url: string;
}

export const INLINE_AFFILIATES: Record<string, InlineAffiliate> = {
  wyylde: { target: 'wyylde', label: 'Wyylde', url: wyylde.affiliateUrl },
  'carre-libertin': { target: CARRE_LIBERTIN_AFFILIATE.target, label: CARRE_LIBERTIN_AFFILIATE.label, url: CARRE_LIBERTIN_AFFILIATE.url },
  gleese: { target: GLEESE_AFFILIATE.target, label: GLEESE_AFFILIATE.label, url: GLEESE_AFFILIATE.url },
};

/** Emplacement enregistré dans les statistiques de clics. */
export const INLINE_AFFILIATE_BLOCK = 'texte-fiche-club';
