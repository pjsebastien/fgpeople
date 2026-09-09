'use client';

/**
 * Lien d'affiliation tracké, sans style imposé.
 *
 * Seul ce composant a besoin d'être client : il porte le onClick qui compte
 * le clic. Les blocs qui l'entourent restent des composants serveur, ce qui
 * évite d'expédier leur balisage au navigateur et supprime tout risque
 * d'écart entre le rendu serveur et l'hydratation.
 *
 * Garanties communes à tous les liens rémunérés du site :
 * rel="sponsored nofollow noopener" et ouverture dans un nouvel onglet.
 */

import { trackAffiliateClick } from '@/lib/utils/track-affiliate';

export default function TrackedAffiliateLink({
  href,
  target,
  block,
  children,
  className = '',
  ariaLabel,
}: {
  href: string;
  /** Partenaire crédité dans /admin/clics. */
  target: string;
  /** Emplacement du lien, ex : 'bloc-libertin'. */
  block: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={() => trackAffiliateClick(target, block)}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
