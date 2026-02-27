/**
 * Page dynamique - Server Component
 *
 * Cette route gère trois cas :
 * 1. Types de clubs : /sauna-libertin, /spa-libertin, /restaurant-libertin
 * 2. Articles de blog : /avis-wyylde, /tenue-club-libertin, etc.
 * 3. Fiches clubs : /le-98-sauna-le-havre, etc.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getTypeCategoryByUrlSlug,
  getClubsByTypeUrlSlug,
  getAllTypeUrlSlugs,
  getRegionsByType,
  getDepartementsByType,
  getAllTypeCategories,
  getClubBySlug,
  getAllClubSlugs,
  getClubsProximite,
} from '@/lib/data/clubs';
import { isArticleSlug, getArticleBySlug, getAllArticleSlugs } from '@/lib/data/blog';
import SearchFilters from '@/components/clubs/SearchFilters';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks from '@/components/navigation/RelatedLinks';
import ArticlePage from '@/components/blog/ArticlePage';
import ClubDetailPage from '@/components/clubs/ClubDetailPage';
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/JsonLd';
import WyyldeBanner from '@/components/ui/WyyldeBanner';

export async function generateStaticParams() {
  // Combiner les slugs de types, articles ET clubs
  const typeSlugs = await getAllTypeUrlSlugs();
  const articleSlugs = getAllArticleSlugs();
  const clubSlugs = await getAllClubSlugs();

  const allSlugs = [...typeSlugs, ...articleSlugs, ...clubSlugs];
  return allSlugs.map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;

  // 1. Vérifier si c'est un article de blog
  if (isArticleSlug(type)) {
    const article = getArticleBySlug(type);
    if (article) {
      return {
        title: article.metaTitle,
        description: article.metaDescription,
        alternates: { canonical: `/${article.slug}` },
        openGraph: {
          title: article.metaTitle,
          description: article.metaDescription,
          type: 'article',
          images: [{ url: article.heroImage.src, alt: article.heroImage.alt }],
        },
      };
    }
  }

  // 2. Vérifier si c'est une page de type
  const category = await getTypeCategoryByUrlSlug(type);
  if (category) {
    const typeTitle = `${category.seoTitle} en France : ${category.clubCount} établissements`;
    const typeDesc = `Découvrez ${category.clubCount} ${category.seoTitle.toLowerCase()}s en France. ${category.description}. Liste complète avec adresses, horaires et tarifs.`;
    return {
      title: typeTitle,
      description: typeDesc,
      alternates: { canonical: `/${category.urlSlug}` },
      openGraph: {
        title: typeTitle,
        description: typeDesc,
        url: `/${category.urlSlug}`,
        type: 'website',
        images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: `${category.seoTitle} en France` }],
      },
    };
  }

  // 3. Vérifier si c'est une fiche club
  const club = await getClubBySlug(type);
  if (club) {
    return {
      title: club.seo.title,
      description: club.seo.metaDescription,
      alternates: { canonical: `/${club.slug}` },
      openGraph: {
        title: club.seo.title,
        description: club.seo.metaDescription,
        type: 'website',
        url: `/${club.slug}`,
        images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: club.seo.title }],
      },
    };
  }

  return { title: 'Page non trouvée' };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  // 1. Vérifier si c'est un article de blog
  if (isArticleSlug(type)) {
    const article = getArticleBySlug(type);
    if (article) {
      return <ArticlePage article={article} />;
    }
  }

  // 2. Vérifier si c'est une page de type
  const category = await getTypeCategoryByUrlSlug(type);
  if (category) {
    const [clubs, regions, departements, allTypes] = await Promise.all([
      getClubsByTypeUrlSlug(type),
      getRegionsByType(category.slug),
      getDepartementsByType(category.slug),
      getAllTypeCategories(),
    ]);

    const breadcrumbItems = [
      { name: 'Accueil', url: '/' },
      { name: category.labelPlural, url: `/${category.urlSlug}` },
    ];

    const regionLinks = regions.slice(0, 12).map(r => ({
      nom: r.nom,
      slug: r.slug,
      url: `/${category.urlSlug}/region/${r.slug}`,
      count: r.clubCount,
    }));

    const deptLinks = departements.slice(0, 12).map(d => ({
      nom: `${d.nom} (${d.code})`,
      slug: d.slug,
      url: `/${category.urlSlug}/departement/${d.slug}`,
      count: d.clubCount,
    }));

    const otherTypes = allTypes
      .filter(t => t.slug !== category.slug)
      .slice(0, 8)
      .map(t => ({
        nom: t.labelPlural,
        slug: t.urlSlug,
        url: `/${t.urlSlug}`,
        count: t.clubCount,
      }));

    return (
      <>
        <BreadcrumbJsonLd items={breadcrumbItems} />
        <ItemListJsonLd
          clubs={clubs}
          name={`${category.seoTitle} en France`}
          description={`Liste des ${category.clubCount} ${category.seoTitle.toLowerCase()}s en France`}
        />

        <main className="py-8 md:py-12">
          <div className="container-custom">
            <Breadcrumb items={breadcrumbItems} />

            <header className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                {category.seoTitle} en France
              </h1>
              <p className="text-text-secondary text-lg max-w-3xl mb-6">
                Découvrez {category.clubCount} {category.seoTitle.toLowerCase()}s en France. {category.description}.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
                  <span className="text-accent-primary font-bold">{category.clubCount}</span>
                  <span className="text-text-secondary ml-2">{category.labelPlural.toLowerCase()}</span>
                </div>
                <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
                  <span className="text-accent-primary font-bold">{regions.length}</span>
                  <span className="text-text-secondary ml-2">régions</span>
                </div>
                <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
                  <span className="text-accent-primary font-bold">{departements.length}</span>
                  <span className="text-text-secondary ml-2">départements</span>
                </div>
              </div>
            </header>

            {/* Bannière partenaire Wyylde */}
            <div className="mb-8">
              <WyyldeBanner variant="leaderboard" />
            </div>

            {regionLinks.length > 0 && (
              <RelatedLinks
                title={`${category.labelPlural} par région`}
                links={regionLinks}
                variant="grid"
              />
            )}

            {deptLinks.length > 0 && (
              <RelatedLinks
                title={`Départements populaires`}
                links={deptLinks}
                variant="grid"
              />
            )}

            <SearchFilters
              clubs={clubs}
              regions={regions}
              departements={departements}
              hideTypeFilter={true}
              title={`Rechercher parmi les ${category.labelPlural.toLowerCase()}`}
              subtitle="Filtrez par région, département, ville ou équipements"
            />

            {/* Liste complète des clubs pour les crawlers (SEO) */}
            <noscript>
              <section className="mt-8">
                <h2 className="text-xl font-bold mb-4">Liste complète des {category.labelPlural.toLowerCase()}</h2>
                <ul>
                  {clubs.map((club) => (
                    <li key={club.id}>
                      <a href={`/${club.slug}`}>{club.nom} - {club.ville} ({club.departement_code})</a>
                    </li>
                  ))}
                </ul>
              </section>
            </noscript>

            {otherTypes.length > 0 && (
              <RelatedLinks
                title="Autres types d'établissements"
                links={otherTypes}
                variant="grid"
              />
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // 3. Vérifier si c'est une fiche club
  const club = await getClubBySlug(type);
  if (club) {
    const clubsProximite = await getClubsProximite(club, 9);
    return <ClubDetailPage club={club} clubsProximite={clubsProximite} />;
  }

  // 4. Aucun match trouvé
  notFound();
}
