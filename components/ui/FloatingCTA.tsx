'use client';

/**
 * FloatingCTA - Barre flottante partenaire Wyylde
 * Fixe en bas de page avec possibilité de fermer/rouvrir
 */

import { useState, useEffect } from 'react';

const WYYLDE_URL = 'https://lb.affilae.com/r/?p=63072a4ce188f131d6d1c7fe&af=530&lp=https%3A%2F%2Fapp.wyylde.com%2Ffr-fr%2Fregister%3Futm_source%3Daffiliation%26utm_medium%3DaffilaeFR%26utm_campaign%3Dfg-people';

export default function FloatingCTA() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) return null;

  // Bouton minimisé
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-[150]">
        <button
          onClick={handleReopen}
          className="group relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-[#e63946] to-[#c1121f] text-white rounded-xl shadow-xl shadow-red-500/30 hover:shadow-red-500/50 transition-all hover:scale-105 border border-white/20"
          aria-label="Voir l'offre Wyylde"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
          </span>
          <span className="font-bold text-base">1 mois offert sur Wyylde</span>
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
        <div className="relative bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] rounded-xl border-2 border-[#e63946]/50 shadow-2xl shadow-black/50 overflow-hidden">
          {/* Effet de glow rouge */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#e63946]/10 via-[#e63946]/5 to-[#e63946]/10 pointer-events-none" />

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
              {/* Badge partenaire */}
              <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 bg-[#e63946]/20 rounded-full border border-[#e63946]/30 flex-shrink-0">
                <span className="text-[#e63946] text-[10px] font-semibold uppercase tracking-wide">Partenaire</span>
              </div>

              <div>
                <p className="text-text-primary font-bold text-sm sm:text-base">
                  Wyylde — 1<sup>re</sup> communauté libertine de France
                </p>
                <p className="text-yellow-400 text-xs sm:text-sm font-medium">
                  1 mois d&apos;abonnement offert pour toute nouvelle inscription
                </p>
              </div>
            </div>

            {/* Bouton CTA */}
            <a
              href={WYYLDE_URL}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-[#e63946] rounded-lg hover:bg-[#c1121f] transition-all hover:scale-105 shadow-lg shadow-[#e63946]/25 whitespace-nowrap"
            >
              <span className="text-white font-bold">S&apos;inscrire sur Wyylde</span>
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
