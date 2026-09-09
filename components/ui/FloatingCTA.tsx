'use client';

/**
 * FloatingCTA - Bouton flottant affilié
 * Path-aware : utilise le lien gay sur les pages /lieu-de-drague/*, libertin ailleurs
 */

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { affiliateForPath } from '@/lib/config/affiliates';
import { trackAffiliateClick } from '@/lib/utils/track-affiliate';

/**
 * Pages d'avis / comparatif : elles portent déjà le lien d'affiliation du site
 * testé. Y superposer ce CTA générique mettrait deux offres concurrentes à
 * l'écran et diluerait la conversion — on s'efface.
 */
function isSiteReviewPage(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname.startsWith('/avis-') || pathname === '/comparatif-sites-libertins';
}

export default function FloatingCTA() {
  const pathname = usePathname();
  const isDrague = pathname?.startsWith('/lieu-de-drague') ?? false;
  const hidden = isSiteReviewPage(pathname);

  const partner = affiliateForPath(pathname);
  const affiliateUrl = partner.url;

  const expandedTitle = isDrague
    ? 'Hommes gay & bi près de chez vous'
    : 'Des libertins vous attendent près de chez vous';
  // Côté libertin, l'argument qui déclenche le clic vient du partenaire du
  // jour : « sans carte bancaire » pour Gleese, « gratuit femmes et couples »
  // pour Carré Libertin. Promettre le mauvais ferait rebondir le visiteur.
  const expandedSubtitle = isDrague ? 'Profils géolocalisés disponibles maintenant' : partner.hook;
  const minimizedTitle = isDrague ? 'Rencontres gay près de chez vous' : partner.hook;
  // Sur mobile la pastille réduite n'affiche que la marque : l'accroche
  // complète y débordait et occupait un tiers de l'écran.
  const minimizedShort = isDrague ? 'Rencontres gay' : partner.label;
  const buttonLabel = isDrague ? 'Voir les profils' : partner.ctaLabel;

  // Couleurs adaptées
  const accentBg = isDrague ? 'bg-purple-500' : 'bg-accent-primary';
  const accentBgHover = isDrague ? 'hover:bg-purple-600' : 'hover:brightness-110';
  const accentBorder = isDrague ? 'border-purple-500/50' : 'border-accent-primary/50';
  const accentBg20 = isDrague ? 'bg-purple-500/20' : 'bg-accent-primary/20';
  const accentBorder30 = isDrague ? 'border-purple-500/30' : 'border-accent-primary/30';
  const accentGradient = isDrague
    ? 'bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-purple-500/10'
    : 'bg-gradient-to-r from-accent-primary/10 via-accent-primary/5 to-accent-primary/10';
  const accentShadow = isDrague ? 'shadow-purple-500/25' : 'shadow-accent-primary/25';
  const minimizedFromTo = isDrague ? 'from-purple-500 to-purple-600' : 'from-accent-primary to-accent-hover';

  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const wasMinimized = sessionStorage.getItem('floatingCTA_minimized');
      if (wasMinimized === 'true') {
        setIsMinimized(true);
      }
    }
  }, []);

  const handleMinimize = () => {
    setIsMinimized(true);
    sessionStorage.setItem('floatingCTA_minimized', 'true');
  };

  const handleReopen = () => {
    setIsMinimized(false);
    sessionStorage.removeItem('floatingCTA_minimized');
  };

  if (!mounted || hidden) return null;

  // Bouton minimisé
  if (isMinimized) {
    return (
      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-[150]">
        <button
          onClick={handleReopen}
          className={`group relative flex items-center gap-1.5 sm:gap-3 pl-2.5 pr-3 py-2 sm:px-5 sm:py-3.5 bg-gradient-to-r ${minimizedFromTo} text-white rounded-full sm:rounded-xl shadow-lg ${accentShadow} hover:shadow-xl transition-all hover:scale-105 border border-white/20 opacity-90 hover:opacity-100`}
          aria-label={`Rouvrir l'offre ${minimizedShort}`}
        >
          <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-green-500"></span>
          </span>
          {/* Mobile : la marque seule. Desktop : l'accroche complète. */}
          <span className="sm:hidden font-semibold text-xs whitespace-nowrap">{minimizedShort}</span>
          <span className="hidden sm:inline font-bold text-base">{minimizedTitle}</span>
          <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    );
  }

  // Barre complète
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[150] p-3 sm:p-4">
      <div className="container-custom">
        <div className={`relative bg-gradient-to-r from-bg-secondary via-bg-tertiary to-bg-secondary rounded-xl border-2 ${accentBorder} shadow-2xl shadow-black/50 overflow-hidden`}>
          <div className={`absolute inset-0 ${accentGradient} pointer-events-none`} />

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5">
            <button
              onClick={handleMinimize}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 text-text-muted hover:text-text-primary transition-colors rounded-full hover:bg-white/10"
              aria-label="Fermer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 sm:gap-4 pr-8 sm:pr-0">
              <div className={`hidden sm:flex items-center justify-center w-12 h-12 ${accentBg20} rounded-full border ${accentBorder30} flex-shrink-0`}>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>

              <div>
                <p className="text-text-primary font-bold text-sm sm:text-base">{expandedTitle}</p>
                <p className="text-text-secondary text-xs sm:text-sm">{expandedSubtitle}</p>
              </div>
            </div>

            <a
              href={affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener"
              onClick={() => trackAffiliateClick(partner.target, 'floating-cta')}
              className={`flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 ${accentBg} ${accentBgHover} rounded-lg transition-all hover:scale-105 shadow-lg ${accentShadow} whitespace-nowrap`}
            >
              <span className="text-white font-bold">{buttonLabel}</span>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
