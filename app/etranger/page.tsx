/**
 * Page Clubs à l'Étranger - Server Component
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getPaysEtrangers, getClubsEtranger, getAllTypeCategories } from '@/lib/data/clubs';
import SearchFilters from '@/components/clubs/SearchFilters';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Clubs libertins à l\'étranger - Belgique, Suisse, Luxembourg, Espagne',
  description: 'Découvrez les clubs libertins et échangistes en Europe : Belgique, Suisse, Luxembourg et Espagne. Liste complète des établissements hors France.',
  alternates: { canonical: '/etranger' },
};

export default async function EtrangerPage() {
  const [pays, clubs, typeCategories] = await Promise.all([
    getPaysEtrangers(),
    getClubsEtranger(),
    getAllTypeCategories(),
  ]);

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: 'À l\'étranger', url: '/etranger' },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Clubs libertins à l'étranger
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl mb-6">
              Explorez les {clubs.length} clubs libertins et échangistes situés hors de France.
              Belgique, Suisse, Luxembourg et Espagne vous attendent pour des expériences uniques.
            </p>

            {/* Stats par pays */}
            <div className="flex flex-wrap gap-3">
              {pays.map((p) => (
                <div
                  key={p.slug}
                  className="px-4 py-2 bg-bg-secondary rounded-lg border border-border"
                >
                  <span className="text-accent-primary font-bold">{p.clubCount}</span>
                  <span className="text-text-secondary ml-2">clubs en {p.nom}</span>
                </div>
              ))}
            </div>
          </header>

          {/* Navigation par pays */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Parcourir par pays
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {pays.map((p) => (
                <Link
                  key={p.slug}
                  href={`/etranger/${p.slug}`}
                  className="p-6 bg-bg-secondary rounded-xl border border-border hover:border-accent-primary/30 transition-all text-center group"
                >
                  <span className="block text-2xl mb-2">
                    {p.nom === 'Belgique' && '🇧🇪'}
                    {p.nom === 'Suisse' && '🇨🇭'}
                    {p.nom === 'Luxembourg' && '🇱🇺'}
                    {p.nom === 'Espagne' && '🇪🇸'}
                    {!['Belgique', 'Suisse', 'Luxembourg', 'Espagne'].includes(p.nom) && '🌍'}
                  </span>
                  <span className="block text-text-primary group-hover:text-accent-primary font-semibold text-lg">
                    {p.nom}
                  </span>
                  <span className="text-text-muted text-sm">
                    {p.clubCount} club{p.clubCount > 1 ? 's' : ''}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Recherche et filtres */}
          <SearchFilters
            clubs={clubs}
            typeCategories={typeCategories}
            hideRegionFilter={true}
            hideDepartementFilter={true}
            title="Rechercher un club à l'étranger"
            subtitle={`Utilisez les filtres pour explorer les ${clubs.length} établissements hors de France`}
          />

          {/* Lien retour */}
          <div className="mt-8">
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
