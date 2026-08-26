'use client';

/**
 * Encart d'offre fixe en bas de l'ecran, propre aux pages d'avis.
 *
 * Version discrete du FloatingCTA des autres pages : une petite carte en bas
 * a droite, fermable, et qui laisse une pastille pour la rouvrir. Elle
 * n'apparait qu'apres un debut de scroll : le lecteur qui vient d'arriver a
 * deja le CTA de l'en-tete sous les yeux, inutile de doubler.
 *
 * L'etat ferme est memorise par site pour la session (sessionStorage), la
 * pastille reste toujours disponible pour rouvrir.
 */

import { useEffect, useState } from 'react';
import { trackAffiliateClick } from '@/lib/utils/track-affiliate';
import { scoreColor } from './Scores';

interface ReviewStickyBarProps {
  siteName: string;
  editorScore: number;
  affiliateUrl: string;
  /** Partenaire credite dans /admin/clics. */
  target: string;
  /** Argument court affiche sous le nom (ex : « Essai gratuit, sans CB »). */
  hook?: string;
}

const SCROLL_THRESHOLD = 500;

export default function ReviewStickyBar({
  siteName,
  editorScore,
  affiliateUrl,
  target,
  hook,
}: ReviewStickyBarProps) {
  const storageKey = `reviewStickyBar_closed_${target}`;
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (sessionStorage.getItem(storageKey) === 'true') setClosed(true);
    } catch {
      // stockage indisponible : on garde le comportement par defaut
    }

    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [storageKey]);

  const close = () => {
    setClosed(true);
    try {
      sessionStorage.setItem(storageKey, 'true');
    } catch {}
  };

  const reopen = () => {
    setClosed(false);
    try {
      sessionStorage.removeItem(storageKey);
    } catch {}
  };

  if (!mounted || !visible) return null;

  const score = editorScore.toFixed(1).replace('.', ',');

  // Pastille de reouverture : note + nom, le plus discret possible
  if (closed) {
    return (
      <button
        type="button"
        onClick={reopen}
        className="fixed bottom-4 right-4 z-[140] flex items-center gap-2 pl-2.5 pr-3.5 py-2 rounded-full bg-bg-secondary/95 backdrop-blur border border-border shadow-lg hover:border-accent-primary transition-colors"
        aria-label={`Rouvrir l'offre ${siteName}`}
      >
        <span className={`font-bold text-sm tabular-nums ${scoreColor(editorScore)}`}>{score}</span>
        <span className="text-text-secondary text-xs font-medium">{siteName}</span>
        <svg
          className="w-3.5 h-3.5 text-text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:right-4 z-[140] sm:w-80">
      <div className="relative bg-bg-secondary/95 backdrop-blur border border-accent-primary/40 rounded-2xl shadow-2xl shadow-black/40 p-4">
        <button
          type="button"
          onClick={close}
          className="absolute top-2 right-2 p-1.5 text-text-muted hover:text-text-primary rounded-full hover:bg-white/10 transition-colors"
          aria-label="Fermer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-3 pr-6">
          <span className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-accent-primary/15 border border-accent-primary/30">
            <span className={`font-bold text-base leading-none tabular-nums ${scoreColor(editorScore)}`}>
              {score}
            </span>
            <span className="text-text-muted text-[9px] mt-0.5">/10</span>
          </span>
          <div className="min-w-0">
            <p className="text-text-primary font-bold text-sm leading-tight">{siteName}</p>
            {hook && <p className="text-text-secondary text-xs mt-0.5">{hook}</p>}
          </div>
        </div>

        <a
          href={affiliateUrl}
          target="_blank"
          rel="sponsored nofollow noopener"
          onClick={() => trackAffiliateClick(target, 'avis-barre-fixe')}
          className="group mt-3 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gradient-gold text-bg-primary font-bold text-sm hover:brightness-110 transition-all"
        >
          Essayer {siteName} gratuitement
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

        <p className="text-text-muted text-[10px] text-center mt-2">
          Lien partenaire. Votre prix ne change pas.
        </p>
      </div>
    </div>
  );
}
