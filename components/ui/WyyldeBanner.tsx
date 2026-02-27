/**
 * WyyldeBanner - Bannière partenaire Wyylde
 * Affiche les bannières d'affiliation avec le bon format selon le variant
 */

import Image from 'next/image';

const WYYLDE_HOME_URL = 'https://lb.affilae.com/r/?p=63072a4ce188f131d6d1c7fe&af=530&lp=https%3A%2F%2Fwww.wyylde.com%2Ffr-fr%2F%3Futm_source%3Daffiliation%26utm_medium%3DaffilaeFR%26utm_campaign%3Dfg-people';

interface WyyldeBannerProps {
  variant: 'leaderboard' | 'large' | 'sidebar' | 'square';
}

const BANNER_CONFIG = {
  leaderboard: { src: '/images/banners/wyylde-970x250.jpg', width: 970, height: 250, alt: 'Wyylde — 1 mois offert — Partenaire FG People' },
  large: { src: '/images/banners/wyylde-740x480.jpg', width: 740, height: 480, alt: 'Wyylde — 1 mois offert — Partenaire FG People' },
  sidebar: { src: '/images/banners/wyylde-300x600.jpg', width: 300, height: 600, alt: 'Wyylde — 1 mois offert — Partenaire FG People' },
  square: { src: '/images/banners/wyylde-250x250.jpg', width: 250, height: 250, alt: 'Wyylde — 1 mois offert — Partenaire FG People' },
} as const;

export default function WyyldeBanner({ variant }: WyyldeBannerProps) {
  const config = BANNER_CONFIG[variant];

  // Le leaderboard affiche le carré sur mobile, le leaderboard sur desktop
  if (variant === 'leaderboard') {
    const squareConfig = BANNER_CONFIG.square;
    return (
      <div className="flex flex-col items-center">
        <span className="text-text-muted text-xs mb-2 uppercase tracking-wider">Partenaire</span>
        {/* Desktop : leaderboard */}
        <a
          href={WYYLDE_HOME_URL}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="hidden md:block rounded-lg overflow-hidden border border-border/50 hover:border-[#e63946]/30 transition-colors"
        >
          <Image
            src={config.src}
            alt={config.alt}
            width={config.width}
            height={config.height}
            className="w-auto h-auto max-w-full"
          />
        </a>
        {/* Mobile : carré */}
        <a
          href={WYYLDE_HOME_URL}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="md:hidden rounded-lg overflow-hidden border border-border/50 hover:border-[#e63946]/30 transition-colors"
        >
          <Image
            src={squareConfig.src}
            alt={squareConfig.alt}
            width={squareConfig.width}
            height={squareConfig.height}
            className="w-auto h-auto max-w-full"
          />
        </a>
      </div>
    );
  }

  // Large : centré dans le contenu
  if (variant === 'large') {
    return (
      <div className="flex flex-col items-center">
        <span className="text-text-muted text-xs mb-2 uppercase tracking-wider">Partenaire</span>
        <a
          href={WYYLDE_HOME_URL}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="rounded-lg overflow-hidden border border-border/50 hover:border-[#e63946]/30 transition-colors"
        >
          <Image
            src={config.src}
            alt={config.alt}
            width={config.width}
            height={config.height}
            className="w-auto h-auto max-w-full"
          />
        </a>
      </div>
    );
  }

  // Sidebar et square : affichage vertical
  return (
    <div className="flex flex-col items-center">
      <span className="text-text-muted text-xs mb-2 uppercase tracking-wider">Partenaire</span>
      <a
        href={WYYLDE_HOME_URL}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="rounded-lg overflow-hidden border border-border/50 hover:border-[#e63946]/30 transition-colors"
      >
        <Image
          src={config.src}
          alt={config.alt}
          width={config.width}
          height={config.height}
          className="w-auto h-auto max-w-full"
        />
      </a>
    </div>
  );
}
