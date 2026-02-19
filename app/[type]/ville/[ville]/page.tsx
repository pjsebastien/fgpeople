/**
 * Page Type + Ville - Server Component
 * Ex: /sauna-libertin/ville/paris
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getTypeCategoryByUrlSlug,
  getClubsByTypeAndVille,
  getTypeVilleParams,
  getVilleBySlug,
  getVillesByTypeAndDepartement,
} from '@/lib/data/clubs';
import ClubList from '@/components/clubs/ClubList';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks from '@/components/navigation/RelatedLinks';
import LibertinCTA from '@/components/ui/LibertinCTA';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export async function generateStaticParams() {
  return getTypeVilleParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; ville: string }>;
}): Promise<Metadata> {
  const { type, ville } = await params;
  const category = await getTypeCategoryByUrlSlug(type);
  const villeData = await getVilleBySlug(ville);

  if (!category || !villeData) {
    return { title: 'Page non trouvée' };
  }

  const clubs = await getClubsByTypeAndVille(category.slug, ville);

  const title = `${category.seoTitle} à ${villeData.nom} (${villeData.departement_code}) : ${clubs.length} établissement${clubs.length > 1 ? 's' : ''}`;
  const description = `Découvrez ${clubs.length} ${category.seoTitle.toLowerCase()}${clubs.length > 1 ? 's' : ''} à ${villeData.nom} (${villeData.departement_code}). Liste complète avec adresses, horaires et tarifs.`;

  return {
    title,
    description,
    alternates: { canonical: `/${category.urlSlug}/ville/${villeData.slug}` },
    openGraph: { title, description, url: `/${category.urlSlug}/ville/${villeData.slug}`, type: 'website' },
    ...(clubs.length <= 1 && { robots: { index: false, follow: true } }),
  };
}

export default async function TypeVillePage({
  params,
}: {
  params: Promise<{ type: string; ville: string }>;
}) {
  const { type, ville } = await params;
  const category = await getTypeCategoryByUrlSlug(type);
  const villeData = await getVilleBySlug(ville);

  if (!category || !villeData) {
    notFound();
  }

  const [clubs, otherVilles] = await Promise.all([
    getClubsByTypeAndVille(category.slug, ville),
    getVillesByTypeAndDepartement(category.slug, villeData.departementSlug),
  ]);

  if (clubs.length === 0) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: category.labelPlural, url: `/${category.urlSlug}` },
    { name: villeData.region, url: `/${category.urlSlug}/region/${villeData.regionSlug}` },
    { name: `${villeData.departement} (${villeData.departement_code})`, url: `/${category.urlSlug}/departement/${villeData.departementSlug}` },
    { name: villeData.nom, url: `/${category.urlSlug}/ville/${villeData.slug}` },
  ];

  // Autres villes du département
  const relatedVilles = otherVilles
    .filter(v => v.slug !== ville)
    .slice(0, 12)
    .map(v => ({
      nom: v.nom,
      slug: v.slug,
      url: `/${category.urlSlug}/ville/${v.slug}`,
      count: v.clubCount,
    }));

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {category.seoTitle} à {villeData.nom}
              <span className="text-accent-primary ml-2">({villeData.departement_code})</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl">
              Découvrez {clubs.length} {category.seoTitle.toLowerCase()}{clubs.length > 1 ? 's' : ''} à {villeData.nom},
              dans le département {villeData.departement} en {villeData.region}.
            </p>
          </header>

          {/* CTA Rencontres */}
          <div className="mb-10">
            <LibertinCTA location={villeData.nom} variant="compact" />
          </div>

          {/* Liste des clubs */}
          <ClubList
            clubs={clubs}
            title={`${clubs.length === 1 ? `Le ${category.label.toLowerCase()} de` : `Tous les ${category.labelPlural.toLowerCase()} de`} ${villeData.nom}`}
            columns={3}
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
              href={`/${category.urlSlug}/departement/${villeData.departementSlug}`}
              className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {category.labelPlural} dans le {villeData.departement}
            </Link>
            <Link
              href={`/${category.urlSlug}/region/${villeData.regionSlug}`}
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
            >
              {category.labelPlural} en {villeData.region}
            </Link>
            <Link
              href={`/ville/${villeData.slug}`}
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
            >
              Tous les clubs à {villeData.nom}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
