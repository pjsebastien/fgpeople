/**
 * Affichage d'étoiles (server component).
 * Utilise du SVG pur pour un rendu net et accessible.
 */

interface StarsProps {
  /** 0..5 (peut être décimal pour la moyenne) */
  value: number;
  /** Taille en px */
  size?: number;
  /** Aria label personnalisé */
  ariaLabel?: string;
  className?: string;
}

export default function Stars({ value, size = 16, ariaLabel, className }: StarsProps) {
  const v = Math.max(0, Math.min(5, value));
  const filledFull = Math.floor(v);
  const partial = v - filledFull; // 0..1
  const stars = [0, 1, 2, 3, 4];

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className || ''}`}
      role="img"
      aria-label={ariaLabel || `${v.toFixed(1)} sur 5`}
    >
      {stars.map((i) => {
        let fill = 0;
        if (i < filledFull) fill = 1;
        else if (i === filledFull) fill = partial;
        return <Star key={i} size={size} fill={fill} />;
      })}
    </span>
  );
}

function Star({ size, fill }: { size: number; fill: number }) {
  // fill: 0..1 (proportion remplie en partant de la gauche)
  const id = `star-${Math.random().toString(36).slice(2, 8)}`;
  const path =
    'M10 1.5l2.6 5.27 5.81.84-4.2 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.2-4.1 5.81-.84L10 1.5z';
  if (fill >= 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
        <path d={path} fill="#facc15" />
      </svg>
    );
  }
  if (fill <= 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
        <path d={path} fill="none" stroke="#52525b" strokeWidth="1.2" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="#facc15" />
          <stop offset={`${fill * 100}%`} stopColor="transparent" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={path} fill={`url(#${id})`} stroke="#52525b" strokeWidth="1.2" />
    </svg>
  );
}
