/**
 * Affichage des notes de la rédaction (échelle sur 10).
 *
 * Les avis des visiteurs restent sur 5 étoiles (système existant) : les deux
 * échelles cohabitent sur la page, chacune explicitement libellée.
 */

import type { ScoreCriterion } from '@/lib/types/site-review';

/** Couleur selon le niveau de la note — même seuils partout dans la page. */
export function scoreColor(score: number): string {
  if (score >= 8.5) return 'text-green-400';
  if (score >= 7) return 'text-accent-primary';
  if (score >= 5) return 'text-orange-400';
  return 'text-red-400';
}

function scoreBarColor(score: number): string {
  if (score >= 8.5) return 'bg-green-400';
  if (score >= 7) return 'bg-accent-primary';
  if (score >= 5) return 'bg-orange-400';
  return 'bg-red-400';
}

export function scoreLabel(score: number): string {
  if (score >= 9) return 'Exceptionnel';
  if (score >= 8) return 'Très bon';
  if (score >= 7) return 'Bon';
  if (score >= 6) return 'Correct';
  if (score >= 5) return 'Moyen';
  return 'À éviter';
}

/** Pastille de note globale, en gros. */
export function ScoreBadge({
  score,
  size = 'lg',
}: {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dims = {
    sm: { box: 'w-14 h-14', num: 'text-lg', den: 'text-[10px]' },
    md: { box: 'w-20 h-20', num: 'text-2xl', den: 'text-xs' },
    lg: { box: 'w-28 h-28', num: 'text-4xl', den: 'text-sm' },
  }[size];

  // Arc de progression : 2πr avec r=45 sur un viewBox 100×100
  const circumference = 2 * Math.PI * 45;
  const offset = circumference * (1 - score / 10);

  return (
    <div className={`relative ${dims.box} shrink-0`}>
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={scoreColor(score)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold leading-none ${dims.num} ${scoreColor(score)}`}>
          {score.toFixed(1).replace('.', ',')}
        </span>
        <span className={`text-text-muted leading-none mt-0.5 ${dims.den}`}>/10</span>
      </div>
    </div>
  );
}

/** Détail des notes par critère, en barres. */
export function ScoreBreakdown({ scores }: { scores: ScoreCriterion[] }) {
  return (
    <ul className="space-y-4">
      {scores.map((c) => (
        <li key={c.key}>
          <div className="flex items-baseline justify-between gap-3 mb-1.5">
            <span className="text-text-primary text-sm font-medium">{c.label}</span>
            <span className={`text-sm font-bold tabular-nums ${scoreColor(c.score)}`}>
              {c.score.toFixed(1).replace('.', ',')}
            </span>
          </div>
          <div
            className="h-2 bg-bg-tertiary rounded-full overflow-hidden"
            role="img"
            aria-label={`${c.label} : ${c.score} sur 10`}
          >
            <div
              className={`h-full rounded-full ${scoreBarColor(c.score)}`}
              style={{ width: `${Math.max(0, Math.min(100, c.score * 10))}%` }}
            />
          </div>
          {c.comment && <p className="text-text-muted text-xs mt-1.5">{c.comment}</p>}
        </li>
      ))}
    </ul>
  );
}
