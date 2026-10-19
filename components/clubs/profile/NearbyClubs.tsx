/**
 * Clubs proches, en liste compacte : sur une fiche, le visiteur cherche une
 * alternative, pas une galerie. Les lieux dont l'activité est vérifiée
 * passent en premier.
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Club } from '@/lib/types';
import { CLUB_IMAGES, getImageIndexForClub } from '@/components/clubs/ClubCard';
import Icon from './Icon';

/** « L'ORCHIDEE CLUB » → « L'Orchidee Club » ; un nom déjà en casse mixte reste tel quel. */
export function displayName(nom: string): string {
  if (nom !== nom.toUpperCase()) return nom;
  // Majuscule après un début, une espace, une apostrophe ou un tiret.
  return nom.toLowerCase().split(/([\s'’-])/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
}

/** « près de Lyon », « près d'Alès ». */
export function pres(ville: string): string {
  return /^[aeiouyhéèêàâîôû]/i.test(ville) ? `près d'${ville}` : `près de ${ville}`;
}

// D'abord les lieux vérifiés ouverts, puis ceux que la base donne actifs, puis le reste.
const rank = (c: Club) => (c.hasProfile && c.status === 'actif' ? 0 : c.status === 'actif' ? 1 : 2);

export default function NearbyClubs({ clubs, title, ville, villeSlug, departement, departementSlug }: {
  clubs: Club[];
  title: string;
  ville: string;
  villeSlug: string;
  departement: string;
  departementSlug: string;
}) {
  const sorted = [...clubs].sort((a, b) => rank(a) - rank(b));
  return (
    <section id="alternatives" className="scroll-mt-32">
      <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-4">{title}</h2>
      <ul className="grid sm:grid-cols-2 gap-3">
        {sorted.map((c) => (
          <li key={c.id}>
            <Link href={`/${c.slug}`} className="group flex items-center gap-3 rounded-2xl bg-bg-secondary ring-1 ring-border p-3 hover:ring-accent-primary/40">
              <span className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-xl bg-bg-tertiary">
                <Image src={CLUB_IMAGES[getImageIndexForClub(c.nom)]} alt="" fill sizes="64px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-text-primary truncate group-hover:text-accent-primary">{displayName(c.nom)}</span>
                <span className="block text-sm text-text-secondary truncate">
                  {displayName(c.ville)} · {c.types[0]?.label || 'Club'}
                </span>
                {/* Seule une fiche vérifiée permet d'affirmer qu'un lieu est ouvert. */}
                {c.hasProfile && c.status === 'actif' && (
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Ouvert · fiche vérifiée
                  </span>
                )}
              </span>
              <Icon name="chevron" className="w-4 h-4 -rotate-90 text-text-muted flex-shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link href={`/ville/${villeSlug}`} className="px-3 py-1.5 rounded-full bg-white/5 ring-1 ring-white/10 text-text-secondary hover:text-accent-primary">
          Tous les lieux à {displayName(ville)}
        </Link>
        <Link href={`/departement/${departementSlug}`} className="px-3 py-1.5 rounded-full bg-white/5 ring-1 ring-white/10 text-text-secondary hover:text-accent-primary">
          Clubs en {departement}
        </Link>
      </div>
    </section>
  );
}
