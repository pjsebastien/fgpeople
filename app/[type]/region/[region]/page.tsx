/**
 * Page Type + Région - Server Component
 * Ex: /sauna-libertin/region/ile-de-france
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getTypeCategoryByUrlSlug,
  getClubsByTypeAndRegion,
  getTypeRegionParams,
  getRegionBySlug,
  getDepartementsByTypeAndRegion,
  getRegionsByType,
} from '@/lib/data/clubs';
import ClubList from '@/components/clubs/ClubList';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks from '@/components/navigation/RelatedLinks';
import LibertinCTA from '@/components/ui/LibertinCTA';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export async function generateStaticParams() {
  return getTypeRegionParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; region: string }>;
}): Promise<Metadata> {
  const { type, region } = await params;
  const category = await getTypeCategoryByUrlSlug(type);
  const regionData = await getRegionBySlug(region);

  if (!category || !regionData) {
    return { title: 'Page non trouvée' };
  }

  const clubs = await getClubsByTypeAndRegion(category.slug, region);

  return {
    title: `${category.seoTitle} en ${regionData.nom} : ${clubs.length} établissements`,
    description: `Découvrez ${clubs.length} ${category.seoTitle.toLowerCase()}s en ${regionData.nom}. Liste complète par département avec adresses, horaires et tarifs.`,
    alternates: { canonical: `/${category.urlSlug}/region/${regionData.slug}` },
  };
}

export default async function TypeRegionPage({
  params,
}: {
  params: Promise<{ type: string; region: string }>;
}) {
  const { type, region } = await params;
  const category = await getTypeCategoryByUrlSlug(type);
  const regionData = await getRegionBySlug(region);

  if (!category || !regionData) {
    notFound();
  }

  const [clubs, departements, allRegions] = await Promise.all([
    getClubsByTypeAndRegion(category.slug, region),
    getDepartementsByTypeAndRegion(category.slug, region),
    getRegionsByType(category.slug),
  ]);

  if (clubs.length === 0) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: category.labelPlural, url: `/${category.urlSlug}` },
    { name: regionData.nom, url: `/${category.urlSlug}/region/${regionData.slug}` },
  ];

  // Liens vers les départements de cette région
  const deptLinks = departements.map(d => ({
    nom: `${d.nom} (${d.code})`,
    slug: d.slug,
    url: `/${category.urlSlug}/departement/${d.slug}`,
    count: d.clubCount,
  }));

  // Autres régions
  const otherRegions = allRegions
    .filter(r => r.slug !== region)
    .slice(0, 8)
    .map(r => ({
      nom: r.nom,
      slug: r.slug,
      url: `/${category.urlSlug}/region/${r.slug}`,
      count: r.clubCount,
    }));

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {category.seoTitle} en {regionData.nom}
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl">
              Découvrez {clubs.length} {category.seoTitle.toLowerCase()}s en {regionData.nom}.
              Parcourez par département ou explorez tous les établissements de la région.
            </p>
          </header>

          {/* CTA Rencontres */}
          <div className="mb-10">
            <LibertinCTA location={regionData.nom} variant="compact" />
          </div>

          {/* Navigation par département */}
          {deptLinks.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Par département en {regionData.nom}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {deptLinks.map((dept) => (
                  <Link
                    key={dept.slug}
                    href={dept.url}
                    className="p-3 bg-bg-secondary rounded-lg border border-border hover:border-accent-primary/30 transition-all text-center group"
                  >
                    <span className="block text-text-primary group-hover:text-accent-primary text-sm font-medium truncate">
                      {dept.nom}
                    </span>
                    <span className="text-text-muted text-xs">
                      {dept.count} établissement{dept.count > 1 ? 's' : ''}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Liste des clubs */}
          <ClubList
            clubs={clubs}
            title={`Tous les ${category.labelPlural.toLowerCase()} en ${regionData.nom}`}
            columns={3}
          />

          {/* Autres régions */}
          {otherRegions.length > 0 && (
            <RelatedLinks
              title={`${category.labelPlural} dans d'autres régions`}
              links={otherRegions}
              variant="grid"
            />
          )}

          {/* Liens retour */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/${category.urlSlug}`}
              className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Tous les {category.labelPlural.toLowerCase()}
            </Link>
            <Link
              href={`/region/${regionData.slug}`}
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
            >
              Tous les clubs en {regionData.nom}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
