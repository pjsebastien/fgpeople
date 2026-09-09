/**
 * Lien interne vers l'avis d'un partenaire, avec ancre variable.
 *
 * Le même lien répété avec la même ancre sur 800 pages ressemble à du
 * netlinking mécanique, et ne couvre qu'une seule requête. On fait tourner des
 * ancres calées sur les intentions réelles de recherche (« avis X », « X
 * fiable », « X gratuit », « X ou Wyylde »...) et sur les questions « Autres
 * questions posées » de Google.
 *
 * Le choix est DÉTERMINISTE : dérivé de `seed` (le chemin ou le nom de la
 * page), pour que chaque page garde la même ancre d'un build à l'autre.
 * Indispensable en rendu statique, et plus sain pour Google qu'une rotation
 * aléatoire à chaque affichage.
 */

import Link from 'next/link';
import { getSiteReviewBySlug } from '@/lib/data/site-reviews';

/** Jeux d'ancres par avis, alignés sur les requêtes de chaque marque. */
const ANCHORS: Record<string, string[]> = {
  'avis-gleese': [
    'Notre avis complet sur Gleese, le nouveau site libertin',
    'Gleese est-il fiable ? On a testé pendant plusieurs semaines',
    'Gleese : que vaut vraiment le site libertin gratuit sans CB ?',
    'Avis Gleese 2026 : notre test complet du réseau social libertin',
    'Gleese ou Wyylde ? Notre comparatif détaillé',
    'Combien coûte Gleese ? Tarifs et essai gratuit décryptés',
    'Gleese, le site libertin qui monte : notre verdict',
    'On a testé Gleese : profils vérifiés, lives HD et essai sans CB',
  ],
  'avis-carre-libertin': [
    'Notre avis complet sur Carré Libertin, testé de fond en comble',
    'Carré Libertin est-il fiable ou une arnaque ? Notre test',
    'Carré Libertin : pourquoi il y a plus de femmes qu’ailleurs',
    'Avis Carré Libertin 2026 : tarifs réels et verdict honnête',
    'Carré Libertin est-il vraiment gratuit pour les femmes et les couples ?',
    'Combien coûte Carré Libertin ? Le détail des abonnements',
    'Carré Libertin ou Wyylde ? Notre comparaison détaillée',
    'Carré Libertin, la valeur sûre depuis 2007 : notre verdict',
  ],
  'avis-wyylde': [
    'Notre avis complet sur Wyylde, le poids lourd du libertinage',
    'Wyylde est-il fiable ? Notre test sans complaisance',
    'Avis Wyylde 2026 : tarifs réels et pièges à éviter',
    'Combien coûte vraiment Wyylde ? Le détail des abonnements',
    'Wyylde vaut-il encore son abonnement ? Notre verdict',
  ],
};

function pickAnchor(slug: string, seed: string): string {
  const list = ANCHORS[slug];
  if (!list || list.length === 0) return 'Lire notre test complet';
  // Hash FNV-1a : bien mieux réparti que le polynomial en base 31 sur des
  // graines courtes et proches, où plusieurs villes tombaient sur la même ancre.
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return list[h % list.length];
}

interface PartnerReviewLinkProps {
  /** Slug de l'avis visé, ex : 'avis-gleese'. */
  slug: string;
  /** Chaîne stable propre à la page (chemin, nom de ville...). */
  seed: string;
  /** text : simple lien · card : encart avec la note. */
  variant?: 'text' | 'card';
  className?: string;
}

export default function PartnerReviewLink({
  slug,
  seed,
  variant = 'text',
  className = '',
}: PartnerReviewLinkProps) {
  const review = getSiteReviewBySlug(slug);
  if (!review) return null;

  const anchor = pickAnchor(slug, seed);

  if (variant === 'card') {
    return (
      <Link
        href={`/${slug}`}
        className={`group flex items-center gap-4 bg-bg-secondary border border-border rounded-xl p-4 hover:border-accent-primary transition-colors ${className}`}
      >
        <span className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-accent-primary/15 border border-accent-primary/30">
          <span className="text-accent-primary font-bold text-lg leading-none">
            {review.editorScore.toFixed(1).replace('.', ',')}
          </span>
          <span className="text-text-muted text-[9px] mt-0.5">/10</span>
        </span>
        <span className="min-w-0">
          <span className="block text-text-primary font-semibold text-sm leading-snug group-hover:text-accent-primary transition-colors">
            {anchor}
          </span>
          <span className="block text-text-muted text-xs mt-1">Lire le test complet →</span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/${slug}`}
      className={`text-accent-primary hover:text-accent-hover underline decoration-accent-primary/40 hover:decoration-accent-hover underline-offset-2 transition-colors ${className}`}
    >
      {anchor}
    </Link>
  );
}
