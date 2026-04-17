'use client';

/**
 * DelayedPopup - Popup d'affiliation déclenchée après 20 secondes
 * Path-aware : variant gay sur /lieu-de-drague/*, variant libertin ailleurs
 * Affiché 1 fois par session par variant (sessionStorage)
 */

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const LIBERTIN_URL = 'https://k.related-dating.com/?abc=7338b1b95caf2acd&xa=n&acme=wid.94576&media=seo&tpls=3';
const GAY_URL = 'https://k.related-dating.com/?abc=b9653873036f3fd1&xa=n&acme=wid.94576&media=seo&tpls=1';

const DELAY_MS = 20000; // 20 secondes

export default function DelayedPopup() {
  const pathname = usePathname();
  const isDrague = pathname?.startsWith('/lieu-de-drague') ?? false;
  const variantKey = isDrague ? 'gay' : 'libertin';
  const storageKey = `delayedPopup_dismissed_${variantKey}`;

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Déjà fermé dans cette session pour ce variant ? on n'affiche pas
    if (sessionStorage.getItem(storageKey) === 'true') return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, [mounted, storageKey]);

  // Re-vérifier quand on change de variant (changement d'URL drague <-> autre)
  useEffect(() => {
    if (!mounted) return;
    setIsOpen(false);
  }, [variantKey, mounted]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem(storageKey, 'true');
  };

  if (!mounted || !isOpen) return null;

  // Contenu selon le variant
  const config = isDrague
    ? {
        url: GAY_URL,
        accent: 'purple',
        title: 'Rencontres gay & bi près de chez vous',
        baseline: 'Profils géolocalisés actifs maintenant',
        description:
          "Avant de vous déplacer, échangez en ligne avec des hommes près de chez vous. Profils vérifiés, messagerie discrète, géolocalisation précise.",
        bullets: ['Profils géolocalisés', '100 % discret', 'Inscription gratuite'],
        cta: 'Voir les profils maintenant',
        ribbonText: 'NOUVEAU',
      }
    : {
        url: LIBERTIN_URL,
        accent: 'red',
        title: 'Des libertins vous attendent',
        baseline: 'Couples et célibataires actifs maintenant',
        description:
          "Ne partez pas seul(e) au club. Rencontrez des couples et célibataires libertins près de chez vous, échangez et organisez vos soirées en toute discrétion.",
        bullets: ['Profils vérifiés', '100 % discret', 'Inscription gratuite'],
        cta: 'Voir les profils maintenant',
        ribbonText: 'GRATUIT',
      };

  // Classes dynamiques selon couleur
  const ringColor = config.accent === 'purple' ? 'border-purple-500/50' : 'border-red-500/50';
  const headerBg =
    config.accent === 'purple'
      ? 'bg-gradient-to-br from-purple-600/40 via-pink-500/20 to-bg-secondary'
      : 'bg-gradient-to-br from-red-600/40 via-red-500/20 to-bg-secondary';
  const btnBg = config.accent === 'purple' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-red-500 hover:bg-red-600';
  const btnShadow = config.accent === 'purple' ? 'shadow-purple-500/40' : 'shadow-red-500/40';
  const checkColor = config.accent === 'purple' ? 'text-pink-400' : 'text-yellow-400';
  const ribbonBg = config.accent === 'purple' ? 'bg-pink-500' : 'bg-yellow-500';
  const ribbonText = config.accent === 'purple' ? 'text-white' : 'text-bg-primary';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-md bg-bg-secondary rounded-2xl border-2 ${ringColor} shadow-2xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bandeau coloré */}
        <div className={`relative ${headerBg} p-6 pb-12`}>
          {/* Ribbon */}
          <div className={`absolute top-3 left-3 ${ribbonBg} ${ribbonText} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded`}>
            {config.ribbonText}
          </div>

          {/* Bouton fermer */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Fermer la popup"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Indicateur actif */}
          <div className="flex items-center gap-2 mt-4 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-white/80 text-xs uppercase tracking-wider font-semibold">
              {config.baseline}
            </span>
          </div>

          {/* Titre */}
          <h3 className="text-2xl font-bold text-white leading-tight">{config.title}</h3>
        </div>

        {/* Corps */}
        <div className="p-6 -mt-6 relative">
          <div className="bg-bg-primary rounded-xl p-5 border border-border">
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              {config.description}
            </p>

            <ul className="space-y-2 mb-5">
              {config.bullets.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-text-secondary text-sm">
                  <svg className={`w-5 h-5 ${checkColor} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>

            <a
              href={config.url}
              target="_blank"
              rel="nofollow sponsored noopener"
              onClick={handleClose}
              className={`group flex items-center justify-center gap-2 w-full px-6 py-3.5 ${btnBg} rounded-xl transition-all hover:scale-[1.02] shadow-lg ${btnShadow}`}
            >
              <span className="text-white font-bold text-base">{config.cta}</span>
              <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>

            <button
              onClick={handleClose}
              className="block w-full mt-3 text-center text-text-muted hover:text-text-primary text-xs transition-colors"
            >
              Non merci, fermer
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
