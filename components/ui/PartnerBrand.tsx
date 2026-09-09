/**
 * Affichage de la marque d'un partenaire, quel que soit le format de son logo.
 *
 * Gleese fournit un logotype horizontal qui se suffit à lui-même ; Carré
 * Libertin fournit une icône carrée, illisible seule, qu'il faut accompagner
 * du nom écrit. Ce composant absorbe la différence pour que les blocs CTA
 * n'aient pas à s'en soucier.
 */

import Image from 'next/image';
import type { AffiliatePartner } from '@/lib/config/affiliates';

export default function PartnerBrand({
  partner,
  height = 26,
  className = '',
}: {
  partner: AffiliatePartner;
  height?: number;
  className?: string;
}) {
  const logo = partner.logo;

  // Pas de logo fourni : le nom seul, mis en forme
  if (!logo) {
    return (
      <span className={`inline-block font-bold text-text-primary ${className}`}>
        {partner.label}
      </span>
    );
  }

  if (logo.kind === 'wordmark') {
    const width = Math.round((logo.width / logo.height) * height);
    return (
      <Image
        src={logo.src}
        alt={partner.label}
        width={width}
        height={height}
        sizes={`${width}px`}
        className={`object-contain ${className}`}
      />
    );
  }

  // Icône carrée : logo + nom écrit à côté
  const size = Math.round(height * 1.25);
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src={logo.src}
        alt=""
        width={size}
        height={size}
        sizes={`${size}px`}
        className="rounded-lg object-contain"
      />
      <span
        className="font-bold text-text-primary tracking-tight"
        style={{ fontSize: Math.round(height * 0.82) }}
      >
        {partner.label}
      </span>
    </span>
  );
}
