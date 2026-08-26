'use client';

/**
 * Enveloppe un média (capture, visuel) dans un lien d'affiliation tracké.
 *
 * Utilisé quand un bloc d'avis est marqué `clickable` : l'image entière
 * devient une surface de clic — sur mobile, c'est la plus grande cible de la
 * page. Le survol l'annonce clairement (léger zoom + libellé), pour que le
 * clic reste un choix et pas un piège.
 */

import { trackAffiliateClick } from '@/lib/utils/track-affiliate';

export default function AffiliateMediaLink({
  href,
  target,
  block,
  label,
  children,
  className = '',
}: {
  href: string;
  /** Partenaire crédité dans /admin/clics. */
  target: string;
  /** Emplacement, ex : 'avis-capture-lives'. */
  block: string;
  /** Libellé affiché au survol (défaut : « Voir sur le site → »). */
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={() => trackAffiliateClick(target, block)}
      className={`group/media relative block overflow-hidden rounded-xl ${className}`}
      aria-label="Ouvrir le site (lien partenaire, nouvel onglet)"
    >
      {children}
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3 opacity-0 translate-y-2 group-hover/media:opacity-100 group-hover/media:translate-y-0 transition-all duration-200"
        aria-hidden="true"
      >
        <span className="px-3.5 py-1.5 rounded-full bg-bg-primary/90 backdrop-blur border border-accent-primary/50 text-accent-primary text-xs font-semibold shadow-lg">
          {label || 'Voir sur le site →'}
        </span>
      </span>
    </a>
  );
}
