/**
 * Page Type + Département - Server Component
 * Ex: /sauna-libertin/departement/paris
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getTypeCategoryByUrlSlug,
  getClubsByTypeAndDepartement,
  getTypeDepartementParams,
  getDepartementBySlug,
  getVillesByTypeAndDepartement,
  getDepartementsByType,
} from '@/lib/data/clubs';
import ClubList from '@/components/clubs/ClubList';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks from '@/components/navigation/RelatedLinks';
import LibertinCTA from '@/components/ui/LibertinCTA';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export async function generateStaticParams() {
  return getTypeDepartementParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; departement: string }>;
}): Promise<Metadata> {
  const { type, departement } = await params;
  const category = await getTypeCategoryByUrlSlug(type);
  const deptData = await getDepartementBySlug(departement);

  if (!category || !deptData) {
    return { title: 'Page non trouvée' };
  }

  const clubs = await getClubsByTypeAndDepartement(category.slug, departement);

  return {
    title: `${category.seoTitle} ${deptData.nom} (${deptData.code}) : ${clubs.length} établissements`,
    description: `Découvrez ${clubs.length} ${category.seoTitle.toLowerCase()}s dans le ${deptData.nom} (${deptData.code}). Liste complète par ville avec adresses, horaires et tarifs.`,
    alternates: { canonical: `/${category.urlSlug}/departement/${deptData.slug}` },
  };
}

export default async function TypeDepartementPage({
  params,
}: {
  params: Promise<{ type: string; departement: string }>;
}) {
  const { type, departement } = await params;
  const category = await getTypeCategoryByUrlSlug(type);
  const deptData = await getDepartementBySlug(departement);

  if (!category || !deptData) {
    notFound();
  }

  const [clubs, villes, allDepts] = await Promise.all([
    getClubsByTypeAndDepartement(category.slug, departement),
    getVillesByTypeAndDepartement(category.slug, departement),
    getDepartementsByType(category.slug),
  ]);

  if (clubs.length === 0) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: category.labelPlural, url: `/${category.urlSlug}` },
    { name: deptData.region, url: `/${category.urlSlug}/region/${deptData.regionSlug}` },
    { name: `${deptData.nom} (${deptData.code})`, url: `/${category.urlSlug}/departement/${deptData.slug}` },
  ];

  // Liens vers les villes de ce département
  const villeLinks = villes.map(v => ({
    nom: v.nom,
    slug: v.slug,
    url: `/${category.urlSlug}/ville/${v.slug}`,
    count: v.clubCount,
  }));

  // Autres départements de la même région
  const otherDepts = allDepts
    .filter(d => d.slug !== departement && d.regionSlug === deptData.regionSlug)
    .slice(0, 8)
    .map(d => ({
      nom: `${d.nom} (${d.code})`,
      slug: d.slug,
      url: `/${category.urlSlug}/departement/${d.slug}`,
      count: d.clubCount,
    }));

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {category.seoTitle} {deptData.nom}
              <span className="text-accent-primary ml-2">({deptData.code})</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl">
              Découvrez {clubs.length} {category.seoTitle.toLowerCase()}s dans le {deptData.nom},
              en {deptData.region}. Parcourez par ville ou explorez tous les établissements du département.
            </p>
          </header>

          {/* CTA Rencontres */}
          <div className="mb-10">
            <LibertinCTA location={deptData.nom} variant="compact" />
          </div>

          {/* Navigation par ville */}
          {villeLinks.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Villes du {deptData.nom}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {villeLinks.map((ville) => (
                  <Link
                    key={ville.slug}
                    href={ville.url}
                    className="p-3 bg-bg-secondary rounded-lg border border-border hover:border-accent-primary/30 transition-all text-center group"
                  >
                    <span className="block text-text-primary group-hover:text-accent-primary text-sm font-medium truncate">
                      {ville.nom}
                    </span>
                    <span className="text-text-muted text-xs">
                      {ville.count} établissement{ville.count > 1 ? 's' : ''}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Liste des clubs */}
          <ClubList
            clubs={clubs}
            title={`Tous les ${category.labelPlural.toLowerCase()} du ${deptData.nom}`}
            columns={3}
          />

          {/* Autres départements de la région */}
          {otherDepts.length > 0 && (
            <RelatedLinks
              title={`Autres départements en ${deptData.region}`}
              links={otherDepts}
              variant="grid"
            />
          )}

          {/* Liens retour */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/${category.urlSlug}/region/${deptData.regionSlug}`}
              className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {category.labelPlural} en {deptData.region}
            </Link>
            <Link
              href={`/departement/${deptData.slug}`}
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
            >
              Tous les clubs du {deptData.nom}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
