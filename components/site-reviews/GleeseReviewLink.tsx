/**
 * Lien interne vers /avis-gleese, avec ancre variable.
 *
 * Le même lien répété avec la même ancre sur 800 pages ressemble à du
 * netlinking mécanique — et ne couvre qu'une seule requête. On fait tourner
 * des ancres calées sur les intentions réelles de recherche (« avis gleese »,
 * « gleese fiable », « gleese gratuit », « gleese ou wyylde »…) et sur les
 * questions « Autres questions posées » de Google.
 *
 * Le choix est DÉTERMINISTE : dérivé de `seed` (le chemin ou le nom de la
 * page), pour que chaque page garde la même ancre d'un build à l'autre —
 * indispensable en SSG, et plus sain pour Google qu'une rotation aléatoire.
 */

import Link from 'next/link';

/** Ancres alignées sur les requêtes et People Also Ask autour de Gleese. */
const ANCHORS = [
  'Notre avis complet sur Gleese, le nouveau site libertin',
  'Gleese est-il fiable ? On a testé pendant plusieurs semaines',
  'Gleese : que vaut vraiment le site libertin gratuit sans CB ?',
  'Avis Gleese 2026 : notre test complet du réseau social libertin',
  'Gleese ou Wyylde ? Notre comparatif détaillé',
  'Combien coûte Gleese ? Tarifs et essai gratuit décryptés',
  'Gleese, le site libertin qui monte : notre verdict',
  'On a testé Gleese : profils vérifiés, lives HD et essai sans CB',
];

function pickAnchor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return ANCHORS[Math.abs(h) % ANCHORS.length];
}

interface GleeseReviewLinkProps {
  /** Chaîne stable propre à la page (chemin, nom de ville…). */
  seed: string;
  /** compact : simple lien texte · card : encart avec badge note. */
  variant?: 'text' | 'card';
  className?: string;
}

export default function GleeseReviewLink({
  seed,
  variant = 'text',
  className = '',
}: GleeseReviewLinkProps) {
  const anchor = pickAnchor(seed);

  if (variant === 'card') {
    return (
      <Link
        href="/avis-gleese"
        className={`group flex items-center gap-4 bg-bg-secondary border border-border rounded-xl p-4 hover:border-accent-primary transition-colors ${className}`}
      >
        <span className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-accent-primary/15 border border-accent-primary/30">
          <span className="text-accent-primary font-bold text-lg leading-none">9,1</span>
          <span className="text-text-muted text-[9px] mt-0.5">/10</span>
        </span>
        <span className="min-w-0">
          <span className="block text-text-primary font-semibold text-sm leading-snug group-hover:text-accent-primary transition-colors">
            {anchor}
          </span>
          <span className="block text-text-muted text-xs mt-1">
            Lire le test complet →
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/avis-gleese"
      className={`text-accent-primary hover:text-accent-hover underline decoration-accent-primary/40 hover:decoration-accent-hover underline-offset-2 transition-colors ${className}`}
    >
      {anchor}
    </Link>
  );
}
