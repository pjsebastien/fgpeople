/**
 * Encart partenaire de la colonne latérale des fiches clubs.
 *
 * Composant SERVEUR, piloté par le partenaire du jour (rotation Carré
 * Libertin / Gleese).
 *
 * L'encart s'adapte à ce que l'annonceur fournit : Gleese a une créa carrée,
 * on l'affiche en tête de carte ; Carré Libertin n'en a pas d'exploitable
 * (uniquement des slots publicitaires en JavaScript tiers, qu'on n'embarque
 * pas), donc la carte se replie sur un bandeau de marque. Dans les deux cas
 * l'offre et le bouton restent identiques en structure.
 */

import Image from 'next/image';
import { getLibertinPartner, GLEESE_ASSETS } from '@/lib/config/affiliates';
import Link from 'next/link';
import TrackedAffiliateLink from './TrackedAffiliateLink';
import PartnerBrand from './PartnerBrand';
import AlternativePartnerLink from './AlternativePartnerLink';
import PartnerReviewLink from '@/components/site-reviews/PartnerReviewLink';

export default function PartnerSidebarCard({ block = 'colonne-club' }: { block?: string }) {
  const partner = getLibertinPartner();
  const hasCreative = partner.target === 'gleese';

  return (
    <aside className="bg-bg-secondary border border-border rounded-2xl overflow-hidden">
      <p className="px-4 pt-3 pb-2 text-text-muted text-[10px] uppercase tracking-widest">
        Partenaire
      </p>

      {hasCreative ? (
        <TrackedAffiliateLink
          href={partner.url}
          target={partner.target}
          block={block}
          className="block group overflow-hidden"
          ariaLabel={`Découvrir ${partner.label} (lien partenaire, ouvre un nouvel onglet)`}
        >
          <Image
            src={GLEESE_ASSETS.squareOpen.src}
            alt={`${partner.label} : essai 100 % gratuit, sans carte bancaire`}
            width={GLEESE_ASSETS.squareOpen.width}
            height={GLEESE_ASSETS.squareOpen.height}
            /* La colonne fait ~340 px sur desktop, pleine largeur sous lg */
            sizes="(max-width: 1024px) 100vw, 340px"
            className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
        </TrackedAffiliateLink>
      ) : (
        <TrackedAffiliateLink
          href={partner.url}
          target={partner.target}
          block={block}
          className="flex items-center justify-center gap-3 px-4 py-8 bg-gradient-to-br from-accent-primary/20 to-bg-tertiary hover:from-accent-primary/30 transition-colors"
          ariaLabel={`Découvrir ${partner.label} (lien partenaire, ouvre un nouvel onglet)`}
        >
          <PartnerBrand partner={partner} height={30} />
        </TrackedAffiliateLink>
      )}

      <div className="p-4">
        <p className="text-text-primary text-sm font-semibold mb-1">{partner.hook}</p>
        <p className="text-text-muted text-xs mb-3">{partner.priceNote}</p>

        <TrackedAffiliateLink
          href={partner.url}
          target={partner.target}
          block={`${block}-bouton`}
          className="group flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-gradient-gold text-bg-primary font-bold text-sm hover:brightness-110 transition-all"
        >
          {partner.ctaLabel}
          <svg
            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </TrackedAffiliateLink>

        <AlternativePartnerLink block={block} className="mt-2 text-center" />

        <p className="mt-3 text-xs text-center">
          {partner.reviewSlug ? (
            <PartnerReviewLink slug={partner.reviewSlug} seed={`sidebar-${block}`} />
          ) : (
            <Link
              href="/comparatif-sites-libertins"
              className="text-accent-primary hover:text-accent-hover underline underline-offset-2"
            >
              Notre comparatif des sites libertins
            </Link>
          )}
        </p>
      </div>
    </aside>
  );
}
