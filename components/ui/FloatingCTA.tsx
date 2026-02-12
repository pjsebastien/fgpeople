'use client';

/**
 * FloatingCTA - Bouton flottant affilié
 * Barre fixe en bas de page avec possibilité de fermer/rouvrir
 */

import { useState, useEffect } from 'react';

const AFFILIATE_URL = 'https://k.related-dating.com/?abc=195e2ca4adfa68e9&xa=n&acme=wid.94576&media=seo&tpls=1&v=sexy';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Vérifier si l'utilisateur a déjà fermé le CTA dans cette session
    const wasMinimized = sessionStorage.getItem('floatingCTA_minimized');
    if (wasMinimized === 'true') {
      setIsMinimized(true);
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

  // Ne pas afficher côté serveur
  if (!mounted) return null;

  // Bouton minimisé pour rouvrir
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-[150]">
        <button
          onClick={handleReopen}
          className="group relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-accent-primary to-accent-hover text-white rounded-xl shadow-xl shadow-accent-primary/40 hover:shadow-accent-primary/60 transition-all hover:scale-105 border border-white/20"
          aria-label="Voir les profils libertins"
        >
          {/* Indicateur actif */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>

          {/* Texte */}
          <span className="font-bold text-base">Des libertins vous attendent</span>

          {/* Flèche */}
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    );
  }

  // Barre complète
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[150] p-3 sm:p-4">
      <div className="container-custom">
        <div className="relative bg-gradient-to-r from-bg-secondary via-bg-tertiary to-bg-secondary rounded-xl border-2 border-accent-primary/50 shadow-2xl shadow-black/50 overflow-hidden">
          {/* Effet de glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/10 via-accent-primary/5 to-accent-primary/10 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5">
            {/* Bouton fermer */}
            <button
              onClick={handleMinimize}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 text-text-muted hover:text-text-primary transition-colors rounded-full hover:bg-white/10"
              aria-label="Fermer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Contenu */}
            <div className="flex items-center gap-3 sm:gap-4 pr-8 sm:pr-0">
              {/* Indicateur actif */}
              <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-accent-primary/20 rounded-full border border-accent-primary/30 flex-shrink-0">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>

              <div>
                <p className="text-text-primary font-bold text-sm sm:text-base">
                  Des libertins vous attendent près de chez vous
                </p>
                <p className="text-text-secondary text-xs sm:text-sm">
                  Couples et célibataires disponibles maintenant
                </p>
              </div>
            </div>

            {/* Bouton CTA */}
            <a
              href={AFFILIATE_URL}
              target="_blank"
              rel="nofollow sponsored"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-accent-primary rounded-lg hover:brightness-110 transition-all hover:scale-105 shadow-lg shadow-accent-primary/25 whitespace-nowrap"
            >
              <span className="text-white font-bold">Voir les profils</span>
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
