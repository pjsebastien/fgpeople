/**
 * Page Clubs par Ville - Server Component
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getClubsByVille,
  getVilleBySlug,
  getAllVilleSlugs,
  getRelatedVilles,
  getAllTypeCategories,
} from '@/lib/data/clubs';
import SearchFilters from '@/components/clubs/SearchFilters';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks from '@/components/navigation/RelatedLinks';
import LibertinCTA from '@/components/ui/LibertinCTA';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export async function generateStaticParams() {
  const slugs = await getAllVilleSlugs();
  return slugs.map((ville) => ({ ville }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ville: string }>;
}): Promise<Metadata> {
  const { ville } = await params;
  const villeData = await getVilleBySlug(ville);

  if (!villeData) {
    return { title: 'Ville non trouvée' };
  }

  return {
    title: `Club libertin à ${villeData.nom} (${villeData.departement_code}) : ${villeData.clubCount} établissement${villeData.clubCount > 1 ? 's' : ''}`,
    description: `Découvrez ${villeData.clubCount} club${villeData.clubCount > 1 ? 's' : ''} libertin${villeData.clubCount > 1 ? 's' : ''} à ${villeData.nom} (${villeData.departement_code}). Liste complète avec adresses, horaires et tarifs en ${villeData.departement}.`,
    alternates: { canonical: `/ville/${villeData.slug}` },
  };
}

export default async function VillePage({
  params,
}: {
  params: Promise<{ ville: string }>;
}) {
  const { ville } = await params;
  const villeData = await getVilleBySlug(ville);

  if (!villeData) {
    notFound();
  }

  const [clubs, relatedVilles, typeCategories] = await Promise.all([
    getClubsByVille(ville),
    getRelatedVilles(villeData.departementSlug, ville, 12),
    getAllTypeCategories(),
  ]);

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: villeData.region, url: `/region/${villeData.regionSlug}` },
    { name: `${villeData.departement} (${villeData.departement_code})`, url: `/departement/${villeData.departementSlug}` },
    { name: villeData.nom, url: `/ville/${villeData.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Club libertin à {villeData.nom}
              <span className="text-accent-primary ml-2">({villeData.departement_code})</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl">
              Découvrez {villeData.clubCount === 1 ? 'le club libertin' : `${villeData.clubCount} clubs libertins`} à {villeData.nom},
              dans le département {villeData.departement} en {villeData.region}.
            </p>
          </header>

          {/* CTA Rencontres */}
          <div className="mb-10">
            <LibertinCTA location={villeData.nom} variant="compact" />
          </div>

          {/* Recherche et filtres */}
          <SearchFilters
            clubs={clubs}
            typeCategories={typeCategories}
            hideRegionFilter={true}
            hideDepartementFilter={true}
            hideVilleFilter={true}
            title={`${villeData.clubCount === 1 ? 'Le club libertin de' : 'Clubs libertins à'} ${villeData.nom}`}
            subtitle={`${villeData.clubCount === 1 ? 'Découvrez l\'établissement' : `Utilisez les filtres pour explorer les ${clubs.length} établissements`} de ${villeData.nom}`}
          />

          {/* Autres villes du département */}
          {relatedVilles.length > 0 && (
            <RelatedLinks
              title={`Autres villes en ${villeData.departement}`}
              links={relatedVilles}
              variant="grid"
            />
          )}

          {/* Liens retour */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/departement/${villeData.departementSlug}`}
              className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour à {villeData.departement}
            </Link>
            <Link
              href={`/region/${villeData.regionSlug}`}
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
            >
              Voir {villeData.region}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
            >
              Accueil
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
