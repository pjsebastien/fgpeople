/**
 * Page Clubs par Pays - Server Component
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getClubsByPays,
  getPaysBySlug,
  getAllPaysSlugsEtranger,
  getPaysEtrangers,
} from '@/lib/data/clubs';
import ClubList from '@/components/clubs/ClubList';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks from '@/components/navigation/RelatedLinks';
import LibertinCTA from '@/components/ui/LibertinCTA';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export async function generateStaticParams() {
  const slugs = await getAllPaysSlugsEtranger();
  return slugs.map((pays) => ({ pays }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pays: string }>;
}): Promise<Metadata> {
  const { pays } = await params;
  const paysData = await getPaysBySlug(pays);

  if (!paysData) {
    return { title: 'Pays non trouvé' };
  }

  return {
    title: `Clubs libertins en ${paysData.nom} - ${paysData.clubCount} établissements`,
    description: `Découvrez les ${paysData.clubCount} clubs libertins et échangistes en ${paysData.nom}. Liste complète avec informations, horaires et tarifs.`,
    alternates: { canonical: `/etranger/${paysData.slug}` },
    openGraph: {
      title: `Clubs libertins en ${paysData.nom} - ${paysData.clubCount} établissements`,
      description: `Découvrez les clubs libertins et échangistes en ${paysData.nom}.`,
      url: `/etranger/${paysData.slug}`,
      type: 'website',
      images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: `Clubs libertins en ${paysData.nom}` }],
    },
  };
}

export default async function PaysPage({
  params,
}: {
  params: Promise<{ pays: string }>;
}) {
  const { pays } = await params;
  const paysData = await getPaysBySlug(pays);

  if (!paysData || !paysData.isEtranger) {
    notFound();
  }

  const [clubs, autresPays] = await Promise.all([
    getClubsByPays(pays),
    getPaysEtrangers(),
  ]);

  // Transformer les autres pays en RelatedLinks
  const relatedPays = autresPays
    .filter((p) => p.slug !== pays)
    .map((p) => ({
      nom: p.nom,
      slug: p.slug,
      url: `/etranger/${p.slug}`,
      count: p.clubCount,
    }));

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: 'À l\'étranger', url: '/etranger' },
    { name: paysData.nom, url: `/etranger/${paysData.slug}` },
  ];

  // Emoji drapeau
  const flag = paysData.nom === 'Belgique' ? '🇧🇪' :
               paysData.nom === 'Suisse' ? '🇨🇭' :
               paysData.nom === 'Luxembourg' ? '🇱🇺' :
               paysData.nom === 'Espagne' ? '🇪🇸' : '🌍';

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              <span className="mr-3">{flag}</span>
              Clubs libertins en {paysData.nom}
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl">
              Découvrez {paysData.clubCount === 1 ? 'le club libertin' : `les ${paysData.clubCount} clubs libertins`} en {paysData.nom}.
              Des établissements de qualité pour vos soirées échangistes.
            </p>
          </header>

          {/* CTA Rencontres */}
          <div className="mb-10">
            <LibertinCTA location={paysData.nom} variant="compact" />
          </div>

          {/* Liste des clubs */}
          <ClubList
            clubs={clubs}
            title={`${paysData.clubCount === 1 ? 'Le club de' : 'Tous les clubs en'} ${paysData.nom}`}
            columns={3}
          />

          {/* Autres pays */}
          {relatedPays.length > 0 && (
            <RelatedLinks
              title="Autres pays"
              links={relatedPays}
              variant="grid"
            />
          )}

          {/* Liens retour */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/etranger"
              className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Tous les clubs à l'étranger
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
