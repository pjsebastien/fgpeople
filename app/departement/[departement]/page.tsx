/**
 * Page Clubs par Département - Server Component
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getClubsByDepartement,
  getDepartementBySlug,
  getAllDepartementSlugs,
  getVillesByDepartement,
  getRelatedDepartements,
  getAllTypeCategories,
} from '@/lib/data/clubs';
import SearchFilters from '@/components/clubs/SearchFilters';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks from '@/components/navigation/RelatedLinks';
import LibertinCTA from '@/components/ui/LibertinCTA';
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd';

export async function generateStaticParams() {
  const slugs = await getAllDepartementSlugs();
  return slugs.map((departement) => ({ departement }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ departement: string }>;
}): Promise<Metadata> {
  const { departement } = await params;
  const deptData = await getDepartementBySlug(departement);

  if (!deptData) {
    return { title: 'Département non trouvé' };
  }

  const title = `Club libertin ${deptData.nom} (${deptData.code}) : ${deptData.clubCount} établissements`;
  const description = `Découvrez ${deptData.clubCount} clubs libertins et échangistes dans le ${deptData.nom} (${deptData.code}). Liste complète par ville avec adresses, horaires et tarifs.`;

  return {
    title,
    description,
    alternates: { canonical: `/departement/${deptData.slug}` },
    openGraph: {
      title,
      description,
      url: `/departement/${deptData.slug}`,
      type: 'website',
    },
    // Noindex pour les départements avec très peu de clubs
    ...(deptData.clubCount <= 1 && {
      robots: { index: false, follow: true },
    }),
  };
}

export default async function DepartementPage({
  params,
}: {
  params: Promise<{ departement: string }>;
}) {
  const { departement } = await params;
  const deptData = await getDepartementBySlug(departement);

  if (!deptData) {
    notFound();
  }

  const [clubs, villes, relatedDepts, typeCategories] = await Promise.all([
    getClubsByDepartement(departement),
    getVillesByDepartement(departement),
    getRelatedDepartements(deptData.regionSlug, departement, 8),
    getAllTypeCategories(),
  ]);

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: deptData.region, url: `/region/${deptData.regionSlug}` },
    { name: `${deptData.nom} (${deptData.code})`, url: `/departement/${deptData.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {clubs.length > 0 && (
        <ItemListJsonLd
          clubs={clubs}
          name={`Clubs libertins dans le ${deptData.nom}`}
          description={`Liste des ${deptData.clubCount} clubs libertins dans le ${deptData.nom} (${deptData.code})`}
        />
      )}

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Club libertin {deptData.nom}
              <span className="text-accent-primary ml-2">({deptData.code})</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl">
              Découvrez {deptData.clubCount} clubs libertins et échangistes dans le {deptData.nom},
              en {deptData.region}. Parcourez par ville ou explorez tous les clubs du département.
            </p>
          </header>

          {/* CTA Rencontres */}
          <div className="mb-10">
            <LibertinCTA location={deptData.nom} variant="compact" />
          </div>

          {/* Navigation par ville */}
          {villes.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Villes du {deptData.nom}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {villes.map((ville) => (
                  <Link
                    key={ville.slug}
                    href={`/ville/${ville.slug}`}
                    className="p-3 bg-bg-secondary rounded-lg border border-border hover:border-accent-primary/30 transition-all text-center group"
                  >
                    <span className="block text-text-primary group-hover:text-accent-primary text-sm font-medium truncate">
                      {ville.nom}
                    </span>
                    <span className="text-text-muted text-xs">
                      {ville.clubCount} club{ville.clubCount > 1 ? 's' : ''}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Recherche et filtres */}
          <SearchFilters
            clubs={clubs}
            typeCategories={typeCategories}
            hideRegionFilter={true}
            hideDepartementFilter={true}
            title={`Rechercher un club dans le ${deptData.nom}`}
            subtitle={`Utilisez les filtres pour trouver l'établissement idéal parmi les ${clubs.length} clubs du département`}
          />

          {/* Autres départements de la région */}
          {relatedDepts.length > 0 && (
            <RelatedLinks
              title={`Autres départements en ${deptData.region}`}
              links={relatedDepts}
              variant="grid"
            />
          )}

          {/* Lien retour */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/region/${deptData.regionSlug}`}
              className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour à {deptData.region}
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
