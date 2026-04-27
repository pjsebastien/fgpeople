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
import { BreadcrumbJsonLd, ItemListJsonLd, FAQPageJsonLd } from '@/components/seo/JsonLd';
import { generateDeptIntroRich, generateDeptFAQ, currentYear } from '@/lib/utils/location-seo';

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

  const year = currentYear();
  const title = `Club libertin ${deptData.nom} (${deptData.code}) : ${deptData.clubCount} établissement${deptData.clubCount > 1 ? 's' : ''} en ${year}`;
  const description = `Annuaire ${year} : ${deptData.clubCount} club${deptData.clubCount > 1 ? 's' : ''} libertin${deptData.clubCount > 1 ? 's' : ''} et échangiste${deptData.clubCount > 1 ? 's' : ''} dans le ${deptData.nom} (${deptData.code}). Par ville, adresses, horaires et tarifs.`;

  return {
    title,
    description,
    alternates: { canonical: `/departement/${deptData.slug}` },
    openGraph: {
      title,
      description,
      url: `/departement/${deptData.slug}`,
      type: 'website',
      images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: `Clubs libertins dans le ${deptData.nom}` }],
    },
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

  const introRich = generateDeptIntroRich(deptData.nom, deptData.code, deptData.region, deptData.clubCount, villes.length, deptData.slug);
  const faq = generateDeptFAQ(deptData.nom, deptData.clubCount, deptData.slug, 7);

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
      <FAQPageJsonLd faq={faq} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Club libertin {deptData.nom}
              <span className="text-accent-primary ml-2">({deptData.code})</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl leading-relaxed">
              {introRich}
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

          {/* Liste complète des clubs pour les crawlers (SEO) */}
          <noscript>
            <section className="mt-8">
              <h2 className="text-xl font-bold mb-4">Tous les clubs libertins du {deptData.nom}</h2>
              <ul>
                {clubs.map((club) => (
                  <li key={club.id}>
                    <a href={`/${club.slug}`}>{club.nom} - {club.ville}</a>
                  </li>
                ))}
              </ul>
            </section>
          </noscript>

          {/* Autres départements de la région */}
          {relatedDepts.length > 0 && (
            <RelatedLinks
              title={`Autres départements en ${deptData.region}`}
              links={relatedDepts}
              variant="grid"
            />
          )}

          {/* FAQ */}
          <section className="my-12 bg-bg-secondary rounded-2xl border border-border p-6 md:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Questions fréquentes — {deptData.nom} ({deptData.code})
            </h2>
            <div className="space-y-3">
              {faq.map((q, i) => (
                <details key={i} className="group bg-bg-tertiary rounded-lg border border-border">
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                    <h3 className="text-text-primary font-medium pr-4">{q.question}</h3>
                    <svg className="w-5 h-5 text-text-muted transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-text-secondary leading-relaxed">{q.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

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
