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
import { BreadcrumbJsonLd, ItemListJsonLd, FAQPageJsonLd } from '@/components/seo/JsonLd';
import { generateDeptIntroRich, generateDeptFAQ, currentYear } from '@/lib/utils/location-seo';

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

  const year = currentYear();
  const title = `${category.seoTitle} ${deptData.nom} (${deptData.code}) : ${clubs.length} établissement${clubs.length > 1 ? 's' : ''} en ${year}`;
  const description = `Annuaire ${year} des ${clubs.length} ${category.seoTitle.toLowerCase()}${clubs.length > 1 ? 's' : ''} dans le ${deptData.nom} (${deptData.code}). Par ville, adresses, horaires et tarifs.`;

  return {
    title,
    description,
    alternates: { canonical: `/${category.urlSlug}/departement/${deptData.slug}` },
    openGraph: { title, description, url: `/${category.urlSlug}/departement/${deptData.slug}`, type: 'website', images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: `${category.seoTitle} dans le ${deptData.nom}` }] },
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

  // Contenu SEO enrichi (anti thin-content)
  const introRich = generateDeptIntroRich(deptData.nom, deptData.code, deptData.region, clubs.length, villes.length, `${category.slug}-${deptData.slug}`);
  const faq = generateDeptFAQ(deptData.nom, clubs.length, `${category.slug}-${deptData.slug}`, 6);
  // (location=nom du dept seulement pour que la FAQ parle bien du département)

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ItemListJsonLd
        clubs={clubs}
        name={`${category.seoTitle} dans le ${deptData.nom}`}
        description={`Liste des ${clubs.length} ${category.seoTitle.toLowerCase()}s dans le ${deptData.nom} (${deptData.code})`}
      />
      <FAQPageJsonLd faq={faq} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {category.seoTitle} {deptData.nom}
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

          {/* FAQ */}
          <section className="my-12 bg-bg-secondary rounded-2xl border border-border p-6 md:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Questions fréquentes — {category.labelPlural} dans le {deptData.nom}
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
