'use client';

/**
 * Créas Gleese cliquables.
 *
 * Toutes les variantes partagent les mêmes garanties :
 *   - lien d'affiliation depuis lib/config/affiliates.ts
 *   - rel="sponsored nofollow noopener" + target="_blank"
 *   - clic compté (bloc distinct par emplacement)
 *   - next/image, donc redimensionnement et AVIF/WebP automatiques
 *
 * Ce dernier point n'est pas cosmétique : les carrés fournis par l'annonceur
 * pèsent ~1 Mo en 3375 px. Servis bruts sur les pages villes et clubs, ils
 * feraient s'effondrer le LCP — et donc le référencement qui amène le trafic
 * que ces bannières sont censées monétiser.
 */

import Image from 'next/image';
import { LIBERTIN_AFFILIATE, GLEESE_ASSETS } from '@/lib/config/affiliates';
import { trackAffiliateClick } from '@/lib/utils/track-affiliate';
import GleeseReviewLink from '@/components/site-reviews/GleeseReviewLink';

const { url: AFFILIATE_URL, target: TARGET } = LIBERTIN_AFFILIATE;

/** Attributs imposés sur chaque lien sortant rémunéré. */
const LINK_PROPS = {
  href: AFFILIATE_URL,
  target: '_blank' as const,
  rel: 'sponsored nofollow noopener',
};

// ============================================
// LOGO
// ============================================

/**
 * Logo seul, à poser dans un bloc CTA existant.
 * Une marque identifiable convertit mieux qu'un bouton anonyme : le visiteur
 * sait où il va avant de cliquer, ce qui améliore la qualité du clic.
 */
export function GleeseLogo({
  className = '',
  height = 28,
  block = 'logo',
}: {
  className?: string;
  height?: number;
  block?: string;
}) {
  const { src, width, height: h } = GLEESE_ASSETS.logo;
  return (
    <Image
      src={src}
      alt="Gleese"
      width={Math.round((width / h) * height)}
      height={height}
      className={className}
      sizes={`${Math.round((width / h) * height)}px`}
      data-block={block}
    />
  );
}

// ============================================
// BANNIÈRE CARRÉE
// ============================================

/**
 * Créa carrée de l'annonceur, cliquable en entier.
 * `angle` choisit le message : 'ouvert' cible les couples (« Vous êtes
 * ouvert ? Notre site aussi ! »), 'pimente' est plus généraliste.
 */
export function GleeseSquare({
  block,
  angle = 'ouvert',
  className = '',
  imageClassName = '',
  /**
   * Largeur d'affichage RÉELLE de l'image, au format de l'attribut `sizes`.
   * À renseigner sérieusement : c'est elle qui détermine la variante que le
   * navigateur télécharge. Une valeur trop large fait tirer un fichier de
   * 1920 px pour un encart de 340 px.
   */
  sizes = '(max-width: 640px) 100vw, 360px',
}: {
  block: string;
  angle?: 'ouvert' | 'pimente';
  className?: string;
  imageClassName?: string;
  sizes?: string;
}) {
  const asset = angle === 'ouvert' ? GLEESE_ASSETS.squareOpen : GLEESE_ASSETS.squareSpicy;
  const alt =
    angle === 'ouvert'
      ? 'Gleese : essai 100% gratuit, sans carte bancaire'
      : 'Gleese : rencontres libertines, essai gratuit sans carte bancaire';

  return (
    <a
      {...LINK_PROPS}
      onClick={() => trackAffiliateClick(TARGET, block)}
      className={`block group overflow-hidden ${className}`}
      aria-label="Découvrir Gleese (lien partenaire, ouvre un nouvel onglet)"
    >
      <Image
        src={asset.src}
        alt={alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        className={`w-full h-auto group-hover:scale-[1.02] transition-transform duration-300 ${imageClassName}`}
        loading="lazy"
      />
    </a>
  );
}

// ============================================
// FORMAT VERTICAL
// ============================================

/** Créa 9:16, pensée pour la popup mobile. */
export function GleeseStory({
  block,
  className = '',
}: {
  block: string;
  className?: string;
}) {
  const asset = GLEESE_ASSETS.story;
  return (
    <a
      {...LINK_PROPS}
      onClick={() => trackAffiliateClick(TARGET, block)}
      className={`block overflow-hidden rounded-xl ${className}`}
      aria-label="Découvrir Gleese (lien partenaire, ouvre un nouvel onglet)"
    >
      <Image
        src={asset.src}
        alt="Gleese : fais des rencontres très pimentées"
        width={asset.width}
        height={asset.height}
        sizes="(max-width: 640px) 100vw, 320px"
        className="w-full h-auto"
        loading="lazy"
      />
    </a>
  );
}

// ============================================
// ENCART LATÉRAL
// ============================================

/**
 * Bloc compact pour une colonne : créa + offre + bouton.
 * Volontairement sobre — sur une fiche club, l'information principale reste
 * le club ; la publicité doit se voir sans manger la page.
 */
export function GleeseSidebarCard({ block = 'colonne-club' }: { block?: string }) {
  return (
    <aside className="bg-bg-secondary border border-border rounded-2xl overflow-hidden">
      <p className="px-4 pt-3 pb-2 text-text-muted text-[10px] uppercase tracking-widest">
        Partenaire
      </p>

      {/* La colonne fait ~340 px sur desktop, pleine largeur sous lg */}
      <GleeseSquare
        block={block}
        angle="ouvert"
        sizes="(max-width: 1024px) 100vw, 340px"
      />

      <div className="p-4">
        <p className="text-text-primary text-sm font-semibold mb-1">
          Essai 100 % gratuit, sans carte bancaire
        </p>
        <p className="text-text-muted text-xs mb-3">
          Vérification par téléphone · puis à partir de 3,75 €/mois
        </p>
        <a
          {...LINK_PROPS}
          onClick={() => trackAffiliateClick(TARGET, `${block}-bouton`)}
          className="group flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-gradient-gold text-bg-primary font-bold text-sm hover:brightness-110 transition-all"
        >
          Créer mon profil
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
        </a>
        <p className="mt-3 text-xs text-center">
          <GleeseReviewLink seed={`sidebar-${block}`} />
        </p>
      </div>
    </aside>
  );
}
