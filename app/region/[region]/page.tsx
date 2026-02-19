/**
 * Page Clubs par Région - Server Component
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getClubsByRegion,
  getRegionBySlug,
  getAllRegionSlugs,
  getDepartementsByRegion,
  getRelatedRegions,
  getAllTypeCategories,
} from '@/lib/data/clubs';
import SearchFilters from '@/components/clubs/SearchFilters';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks from '@/components/navigation/RelatedLinks';
import LibertinCTA from '@/components/ui/LibertinCTA';
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd';

export async function generateStaticParams() {
  const slugs = await getAllRegionSlugs();
  return slugs.map((region) => ({ region }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const regionData = await getRegionBySlug(region);

  if (!regionData) {
    return { title: 'Région non trouvée' };
  }

  const title = `Club libertin en ${regionData.nom} : ${regionData.clubCount} établissements`;
  const description = `Découvrez ${regionData.clubCount} clubs libertins et échangistes en ${regionData.nom}. Liste complète par département avec adresses, horaires et tarifs.`;

  return {
    title,
    description,
    alternates: { canonical: `/region/${regionData.slug}` },
    openGraph: {
      title,
      description,
      url: `/region/${regionData.slug}`,
      type: 'website',
      images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: `Clubs libertins en ${regionData.nom}` }],
    },
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const regionData = await getRegionBySlug(region);

  if (!regionData) {
    notFound();
  }

  const [clubs, departements, relatedRegions, typeCategories] = await Promise.all([
    getClubsByRegion(region),
    getDepartementsByRegion(region),
    getRelatedRegions(region, 6),
    getAllTypeCategories(),
  ]);

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: regionData.nom, url: `/region/${regionData.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ItemListJsonLd
        clubs={clubs}
        name={`Clubs libertins en ${regionData.nom}`}
        description={`Liste des ${regionData.clubCount} clubs libertins et échangistes en ${regionData.nom}`}
      />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Club libertin en {regionData.nom}
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl">
              Découvrez {regionData.clubCount} clubs libertins et échangistes en {regionData.nom}.
              Parcourez par département ou explorez la liste complète ci-dessous.
            </p>
          </header>

          {/* CTA Rencontres */}
          <div className="mb-10">
            <LibertinCTA location={regionData.nom} variant="compact" />
          </div>

          {/* Navigation par département */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Départements de {regionData.nom}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {departements.map((dept) => (
                <Link
                  key={dept.slug}
                  href={`/departement/${dept.slug}`}
                  className="p-4 bg-bg-secondary rounded-lg border border-border hover:border-accent-primary/30 transition-all text-center group"
                >
                  <span className="block text-accent-primary font-bold text-lg">
                    {dept.code}
                  </span>
                  <span className="block text-text-primary group-hover:text-accent-primary text-sm font-medium truncate">
                    {dept.nom}
                  </span>
                  <span className="text-text-muted text-xs">
                    {dept.clubCount} club{dept.clubCount > 1 ? 's' : ''}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Recherche et filtres */}
          <SearchFilters
            clubs={clubs}
            departements={departements}
            typeCategories={typeCategories}
            hideRegionFilter={true}
            title={`Rechercher un club en ${regionData.nom}`}
            subtitle={`Utilisez les filtres pour trouver l'établissement idéal parmi les ${clubs.length} clubs de la région`}
          />

          {/* Liste complète des clubs pour les crawlers (SEO) */}
          <noscript>
            <section className="mt-8">
              <h2 className="text-xl font-bold mb-4">Tous les clubs libertins en {regionData.nom}</h2>
              <ul>
                {clubs.map((club) => (
                  <li key={club.id}>
                    <a href={`/${club.slug}`}>{club.nom} - {club.ville} ({club.departement_code})</a>
                  </li>
                ))}
              </ul>
            </section>
          </noscript>

          {/* Autres régions */}
          <RelatedLinks
            title="Autres régions"
            links={relatedRegions}
            variant="grid"
          />

          {/* Lien retour */}
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
