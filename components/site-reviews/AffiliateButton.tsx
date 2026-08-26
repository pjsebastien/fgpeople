'use client';

/**
 * Bouton d'affiliation.
 *
 * rel="sponsored nofollow noopener" : exigé par Google pour les liens
 * rémunérés, et protège du tabnabbing sur target="_blank".
 *
 * Le clic est compté via sendBeacon avant l'ouverture du lien — voir
 * lib/utils/track-affiliate.ts. Chaque emplacement passe un `block` distinct
 * pour qu'on sache lequel rapporte.
 */

import { trackAffiliateClick, type AffiliateBlock } from '@/lib/utils/track-affiliate';

interface AffiliateButtonProps {
  href: string;
  children: React.ReactNode;
  /** Identifiant du partenaire dans les statistiques (slug du site testé). */
  target: string;
  /** Emplacement du bouton dans la page. */
  block: AffiliateBlock | string;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg';
  className?: string;
  /** Petite ligne rassurante sous le bouton. */
  note?: string;
}

const VARIANTS = {
  primary:
    'bg-gradient-gold text-bg-primary hover:brightness-110 shadow-lg shadow-accent-primary/20 hover:shadow-xl hover:shadow-accent-primary/30 hover:-translate-y-0.5',
  secondary:
    'bg-bg-tertiary text-accent-primary border border-accent-primary/40 hover:bg-accent-primary/10 hover:border-accent-primary',
};

const SIZES = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export default function AffiliateButton({
  href,
  children,
  target,
  block,
  variant = 'primary',
  size = 'md',
  className = '',
  note,
}: AffiliateButtonProps) {
  return (
    <span className={`inline-flex flex-col items-center gap-1.5 ${className}`}>
      <a
        href={href}
        target="_blank"
        rel="sponsored nofollow noopener"
        onClick={() => trackAffiliateClick(target, block)}
        className={`group inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 ${VARIANTS[variant]} ${SIZES[size]}`}
      >
        {children}
        <svg
          className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </a>
      {note && <span className="text-text-muted text-xs">{note}</span>}
    </span>
  );
}
