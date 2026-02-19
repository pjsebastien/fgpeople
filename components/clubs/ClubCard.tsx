/**
 * ClubCard - Server Component
 * Card d'affichage d'un club avec image de vignette
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Club } from '@/lib/types';

// Liste des images disponibles (exportée pour réutilisation)
export const CLUB_IMAGES = [
  '/images/club-libertin-ambiance-1.jpg',
  '/images/club-libertin-ambiance-2.jpg',
  '/images/club-libertin-ambiance-3.jpg',
  '/images/club-libertin-ambiance-4.jpg',
  '/images/club-libertin-ambiance-5.jpg',
  '/images/club-libertin-ambiance-6.jpg',
  '/images/club-libertin-ambiance-7.jpg',
  '/images/club-libertin-ambiance-8.jpg',
  '/images/club-libertin-ambiance-9.jpg',
  '/images/club-libertin-ambiance-10.jpg',
  '/images/club-libertin-ambiance-11.jpg',
  '/images/club-libertin-ambiance-12.jpg',
];

interface ClubCardProps {
  club: Club;
  imageIndex?: number;
}

// Génère un index d'image basé sur le nom du club (pseudo-aléatoire mais déterministe)
export function getImageIndexForClub(clubName: string): number {
  const hash = clubName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % CLUB_IMAGES.length;
}

export default function ClubCard({ club, imageIndex }: ClubCardProps) {
  // Utiliser l'index fourni ou calculer un index basé sur le nom
  const imgIndex = imageIndex !== undefined ? imageIndex : getImageIndexForClub(club.nom);
  const imageSrc = CLUB_IMAGES[imgIndex % CLUB_IMAGES.length];

  return (
    <article className="card group h-full flex flex-col">
      {/* Vignette avec image */}
      <Link
        href={`/${club.slug}`}
        className="block relative aspect-[16/10] overflow-hidden rounded-t-xl"
      >
        <Image
          src={imageSrc}
          alt={`${club.nom} - Club libertin`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Badge status */}
        {club.status === 'actif' && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-green-500/90 text-white text-xs font-medium rounded-full">
              Vérifié
            </span>
          </div>
        )}

        {/* Types en badges */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
          {club.types.slice(0, 2).map((t) => (
            <span
              key={t.slug}
              className="px-2 py-0.5 bg-accent-primary/90 text-white text-xs font-medium rounded-full backdrop-blur-sm"
            >
              {t.label}
            </span>
          ))}
          {club.types.length > 2 && (
            <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full backdrop-blur-sm">
              +{club.types.length - 2}
            </span>
          )}
        </div>
      </Link>

      {/* Contenu */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Nom du club */}
        <h3 className="text-lg font-semibold text-text-primary mb-1 group-hover:text-accent-primary transition-colors line-clamp-2">
          <Link href={`/${club.slug}`}>{club.nom}</Link>
        </h3>

        {/* Localisation */}
        <p className="text-text-secondary text-sm mb-3 flex items-center gap-1">
          <svg className="w-4 h-4 text-accent-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">
            {club.ville} ({club.departement_code})
          </span>
        </p>

        {/* Description courte */}
        {club.shortDescription && (
          <p className="text-text-muted text-sm line-clamp-2 mb-3 flex-1">
            {club.shortDescription}
          </p>
        )}

        {/* Équipements (max 3) */}
        {club.equipements.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {club.equipements.slice(0, 3).map((eq) => (
              <span
                key={eq}
                className="px-2 py-0.5 bg-bg-tertiary text-text-secondary text-xs rounded-full border border-border"
              >
                {eq}
              </span>
            ))}
            {club.equipements.length > 3 && (
              <span className="px-2 py-0.5 bg-bg-tertiary text-text-muted text-xs rounded-full border border-border">
                +{club.equipements.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
          <span className="text-text-muted text-xs">
            {club.region}
          </span>
          <Link
            href={`/${club.slug}`}
            className="text-sm font-medium text-accent-primary hover:text-accent-hover transition-colors inline-flex items-center gap-1"
          >
            Voir
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
