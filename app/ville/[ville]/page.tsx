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
import { BreadcrumbJsonLd, ItemListJsonLd, FAQPageJsonLd } from '@/components/seo/JsonLd';
import {
  generateVilleIntroRich,
  generateWhyVisitVille,
  generateVilleFAQ,
  currentYear,
} from '@/lib/utils/location-seo';

/** Formate un nom de ville : PARIS → Paris, SAINT-ÉTIENNE → Saint-Étienne */
function formatVilleName(name: string): string {
  if (!name) return name;
  return name
    .toLowerCase()
    .split(/(-|\s)/)
    .map((part) =>
      part.length > 0 && part !== '-' && part !== ' '
        ? part.charAt(0).toUpperCase() + part.slice(1)
        : part
    )
    .join('');
}

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

  const villeName = formatVilleName(villeData.nom);
  const year = currentYear();
  const title = `Club libertin à ${villeName} (${villeData.departement_code}) : ${villeData.clubCount} établissement${villeData.clubCount > 1 ? 's' : ''} en ${year}`;
  const description = `Annuaire ${year} des ${villeData.clubCount} club${villeData.clubCount > 1 ? 's' : ''} libertin${villeData.clubCount > 1 ? 's' : ''} à ${villeName} (${villeData.departement_code}). Adresses, horaires, tarifs, équipements et avis en ${villeData.departement}.`;

  return {
    title,
    description,
    alternates: { canonical: `/ville/${villeData.slug}` },
    openGraph: {
      title,
      description,
      url: `/ville/${villeData.slug}`,
      type: 'website',
      images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: `Clubs libertins à ${villeName}` }],
    },
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

  const villeName = formatVilleName(villeData.nom);

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: villeData.region, url: `/region/${villeData.regionSlug}` },
    { name: `${villeData.departement} (${villeData.departement_code})`, url: `/departement/${villeData.departementSlug}` },
    { name: villeName, url: `/ville/${villeData.slug}` },
  ];

  const introRich = generateVilleIntroRich(villeName, villeData.departement, villeData.region, villeData.clubCount, villeData.slug);
  const whyVisit = generateWhyVisitVille(villeName, villeData.clubCount, villeData.slug);
  const faq = generateVilleFAQ(villeName, villeData.clubCount, villeData.slug, 6);

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {clubs.length > 0 && (
        <ItemListJsonLd
          clubs={clubs}
          name={`Clubs libertins à ${villeName}`}
          description={`Liste des clubs libertins à ${villeName} (${villeData.departement_code})`}
        />
      )}
      <FAQPageJsonLd faq={faq} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Club libertin à {villeName}
              <span className="text-accent-primary ml-2">({villeData.departement_code})</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl leading-relaxed">
              {introRich}
            </p>
          </header>

          {/* CTA Rencontres */}
          <div className="mb-10">
            <LibertinCTA location={villeName} variant="compact" />
          </div>

          {/* Recherche et filtres */}
          <SearchFilters
            clubs={clubs}
            typeCategories={typeCategories}
            hideRegionFilter={true}
            hideDepartementFilter={true}
            hideVilleFilter={true}
            title={`${villeData.clubCount === 1 ? 'Le club libertin de' : 'Clubs libertins à'} ${villeName}`}
            subtitle={`${villeData.clubCount === 1 ? 'Découvrez l\'établissement' : `Utilisez les filtres pour explorer les ${clubs.length} établissements`} de ${villeName}`}
          />

          {/* Liste complète pour les crawlers (SEO) */}
          <noscript>
            <section className="mt-8">
              <h2 className="text-xl font-bold mb-4">Liste des clubs libertins à {villeName}</h2>
              <ul>
                {clubs.map((club) => (
                  <li key={club.id}>
                    <a href={`/${club.slug}`}>{club.nom} – {club.ville}</a>
                  </li>
                ))}
              </ul>
            </section>
          </noscript>

          {/* Pourquoi visiter ? */}
          <section className="mb-12 bg-bg-secondary rounded-2xl border border-border p-6 md:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Pourquoi choisir un club libertin à {villeName} ?
            </h2>
            <p className="text-text-secondary leading-relaxed">{whyVisit}</p>
          </section>

          {/* Autres villes du département */}
          {relatedVilles.length > 0 && (
            <RelatedLinks
              title={`Autres villes en ${villeData.departement}`}
              links={relatedVilles}
              variant="grid"
            />
          )}

          {/* FAQ */}
          <section className="my-12 bg-bg-secondary rounded-2xl border border-border p-6 md:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Questions fréquentes sur les clubs libertins à {villeName}
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
              href={`/departement/${villeData.departementSlug}`}
              className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
