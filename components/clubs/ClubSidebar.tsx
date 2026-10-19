/**
 * Colonne latérale d'une fiche club : contact, liens officiels, navigation
 * géographique et encart partenaire. Partagée entre la fiche standard et la
 * fiche personnalisée.
 */

import Link from 'next/link';
import type { Club } from '@/lib/types';
import type { OfficialLink } from '@/lib/types/club-profile';
import PartnerSidebarCard from '@/components/ui/PartnerSidebarCard';

const TYPE_URL_SLUG: Record<string, string> = {
  club: 'club-libertin',
  sauna: 'sauna-libertin',
  spa: 'spa-libertin',
  bar: 'bar-libertin',
  sm: 'club-sm-fetish',
  gay: 'club-gay-friendly',
  cinema: 'cinema-libertin',
  discotheque: 'discotheque-libertine',
  restaurant: 'restaurant-libertin',
  hebergement: 'hebergement-libertin',
};

const LINK_LABEL: Record<OfficialLink['kind'], string> = {
  site: 'Site',
  facebook: 'Facebook',
  instagram: 'Instagram',
  x: 'X',
  galerie: 'Photos',
  agenda: 'Agenda',
  reservation: 'Réservation',
  autre: 'Lien',
};

const Chevron = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

interface ClubSidebarProps {
  club: Club;
  officialLinks?: OfficialLink[];
}

export default function ClubSidebar({ club, officialLinks = [] }: ClubSidebarProps) {
  // Le site principal est déjà proposé en bouton : on ne le répète pas.
  const extraLinks = officialLinks.filter((l) => l.url !== club.site_web);
  const closed = club.status === 'ferme';

  return (
    <aside className="space-y-6">
      {/* Contact */}
      <div className="bg-bg-secondary rounded-xl border border-border p-6 sticky top-4">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          {closed ? `Coordonnées de ${club.nom}` : `Contacter ${club.nom}`}
        </h2>
        {closed && (
          <p className="text-red-400 text-sm mb-4">
            Établissement fermé : ces coordonnées sont conservées pour mémoire.
          </p>
        )}
        <div className="space-y-4">
          {club.telephone && (
            <a
              href={`tel:${club.telephone}`}
              className="flex items-center gap-3 p-3 bg-bg-tertiary rounded-lg text-text-secondary hover:text-accent-primary hover:border-accent-primary/30 transition-colors border border-border"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-medium">{club.telephone}</span>
            </a>
          )}
          {club.email && (
            <a
              href={`mailto:${club.email}`}
              className="flex items-center gap-3 p-3 bg-bg-tertiary rounded-lg text-text-secondary hover:text-accent-primary hover:border-accent-primary/30 transition-colors border border-border"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{club.email}</span>
            </a>
          )}
          {club.site_web && club.websiteAccessible !== false && (
            <a
              href={club.site_web}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex items-center gap-3 p-3 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="font-medium">Visiter le site web</span>
              <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          {club.site_web && club.websiteAccessible === false && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-yellow-500 text-sm font-medium">Site web indisponible</p>
                  <p className="text-text-muted text-xs mt-1">
                    Le site web de cet établissement n&apos;est plus accessible.
                  </p>
                </div>
              </div>
            </div>
          )}
          {extraLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {extraLinks.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  title={l.label}
                  className="px-3 py-1.5 text-sm bg-bg-tertiary border border-border rounded-full text-text-secondary hover:text-accent-primary hover:border-accent-primary/30 transition-colors"
                >
                  {LINK_LABEL[l.kind]}
                </a>
              ))}
            </div>
          )}
          {!club.telephone && !club.email && !club.site_web && extraLinks.length === 0 && (
            <p className="text-text-muted text-sm p-3 bg-bg-tertiary rounded-lg">
              Aucune information de contact disponible.
            </p>
          )}
        </div>
      </div>

      {/* Navigation rapide */}
      <div className="bg-bg-secondary rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Explorer la région
        </h2>
        <div className="space-y-3">
          <Link
            href={`/ville/${club.villeSlug}`}
            className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg text-text-secondary hover:text-accent-primary transition-colors border border-border"
          >
            <span>Clubs à {club.ville}</span>
            <Chevron />
          </Link>
          <Link
            href={`/departement/${club.departementSlug}`}
            className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg text-text-secondary hover:text-accent-primary transition-colors border border-border"
          >
            <span>Clubs en {club.departement_nom}</span>
            <Chevron />
          </Link>
          <Link
            href={`/region/${club.regionSlug}`}
            className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg text-text-secondary hover:text-accent-primary transition-colors border border-border"
          >
            <span>Clubs en {club.region}</span>
            <Chevron />
          </Link>
        </div>
      </div>

      {/* Par type */}
      {club.types.length > 1 && (
        <div className="bg-bg-secondary rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Établissements similaires
          </h2>
          <div className="space-y-2">
            {club.types.slice(0, 4).map((t) => (
              <Link
                key={t.slug}
                href={`/${TYPE_URL_SLUG[t.slug] || 'club-libertin'}`}
                className="block p-2 text-text-secondary hover:text-accent-primary transition-colors text-sm"
              >
                Tous les {t.label.toLowerCase()}s
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Encart partenaire — en fin de colonne : le visiteur a déjà eu
          les informations du club avant de voir la publicité. */}
      <PartnerSidebarCard block="colonne-club" />
    </aside>
  );
}
