/**
 * Page hub principale "Lieux de drague en France"
 * Server Component
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getAllDragueRegions,
  getTopDragueDepartements,
  getTopDragueVilles,
  getDragueStats,
  getDragueTypeCategories,
} from '@/lib/data/dragues';
import {
  generateDragueRegionIntro,
  generateDragueFAQ,
  dragueHubTitle,
  dragueHubMeta,
  currentYear,
} from '@/lib/utils/drague-seo-content';
import Breadcrumb from '@/components/ui/Breadcrumb';
import DragueDisclaimer from '@/components/drague/DragueDisclaimer';
import GayCTA from '@/components/ui/GayCTA';
import {
  DragueBreadcrumbJsonLd,
  DragueItemListJsonLd,
  DragueFAQJsonLd,
} from '@/components/seo/DragueJsonLd';

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getDragueStats();
  return {
    title: dragueHubTitle(stats.totalLieux),
    description: dragueHubMeta(stats.totalLieux, stats.totalRegions),
    alternates: { canonical: '/lieu-de-drague' },
    openGraph: {
      type: 'website',
      url: 'https://www.fgpeople.com/lieu-de-drague',
      title: `Lieux de drague en France : ${stats.totalLieux} spots en ${currentYear()}`,
      description: dragueHubMeta(stats.totalLieux, stats.totalRegions),
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Lieux de drague en France',
        },
      ],
    },
  };
}

export default async function DragueHubPage() {
  const [regions, topDepts, topVilles, stats, types] = await Promise.all([
    getAllDragueRegions(),
    getTopDragueDepartements(10),
    getTopDragueVilles(12),
    getDragueStats(),
    getDragueTypeCategories(),
  ]);

  const breadcrumbItems = [{ name: 'Lieux de drague', url: '/lieu-de-drague' }];

  const intro = generateDragueRegionIntro('France', stats.totalLieux, 'hub-france');
  const faq = generateDragueFAQ('France', 'hub-france', 8);

  // Pour le JSON-LD ItemList des régions
  const regionItems = regions.map((r) => ({
    name: r.nom,
    url: `https://www.fgpeople.com/lieu-de-drague/region/${r.slug}`,
  }));

  return (
    <>
      <DragueBreadcrumbJsonLd items={[{ name: 'Accueil', url: '/' }, ...breadcrumbItems]} />
      <DragueItemListJsonLd
        items={regionItems}
        name={`Lieux de drague en France par région — ${currentYear()}`}
        description={`Annuaire des ${stats.totalLieux} lieux de drague en France répartis sur ${stats.totalRegions} régions`}
      />
      <DragueFAQJsonLd faq={faq} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Lieux de drague en France
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl mb-6">{intro}</p>

            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
                <span className="text-accent-primary font-bold">{stats.totalLieux}</span>
                <span className="text-text-secondary ml-2">lieux</span>
              </div>
              <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
                <span className="text-accent-primary font-bold">{stats.totalRegions}</span>
                <span className="text-text-secondary ml-2">régions</span>
              </div>
              <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
                <span className="text-accent-primary font-bold">{stats.totalDepartements}</span>
                <span className="text-text-secondary ml-2">départements</span>
              </div>
              <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
                <span className="text-accent-primary font-bold">{stats.totalVilles}</span>
                <span className="text-text-secondary ml-2">villes</span>
              </div>
            </div>
          </header>

          {/* Disclaimer */}
          <div className="mb-10">
            <DragueDisclaimer slug="hub-france" />
          </div>

          {/* CTA rencontres gay/bi */}
          <div className="mb-12">
            <GayCTA location="France" variant="compact" />
          </div>

          {/* Régions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Lieux de drague par région</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {regions.map((r) => (
                <Link
                  key={r.slug}
                  href={`/lieu-de-drague/region/${r.slug}`}
                  className="group p-5 bg-bg-tertiary rounded-xl border border-border hover:border-accent-primary/30 transition-all"
                >
                  <h3 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                    {r.nom}
                  </h3>
                  <p className="text-text-muted text-sm mt-1">
                    {r.lieuCount} lieu{r.lieuCount > 1 ? 'x' : ''} · {r.villeCount} ville{r.villeCount > 1 ? 's' : ''}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Départements populaires */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Départements les plus actifs</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {topDepts.map((d) => (
                <Link
                  key={d.slug}
                  href={`/lieu-de-drague/departement/${d.slug}`}
                  className="group p-4 bg-bg-secondary rounded-xl border border-border hover:border-accent-primary/30 transition-all text-center"
                >
                  <span className="block text-accent-primary font-bold text-xl mb-1">{d.code}</span>
                  <span className="block text-text-primary group-hover:text-accent-primary text-sm font-medium truncate">
                    {d.nom}
                  </span>
                  <span className="text-text-muted text-xs">{d.lieuCount} lieux</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Villes populaires */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Villes les plus actives</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {topVilles.map((v) => (
                <Link
                  key={v.slug}
                  href={`/lieu-de-drague/ville/${v.slug}`}
                  className="group p-3 bg-bg-tertiary rounded-xl border border-border hover:border-accent-primary/30 transition-all text-center"
                >
                  <span className="block text-text-primary group-hover:text-accent-primary font-medium truncate">
                    {v.nom}
                  </span>
                  <span className="text-text-muted text-xs">{v.lieuCount} lieux</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Types */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Types de lieux référencés</h2>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <span
                  key={t.slug}
                  className="px-3 py-1.5 bg-bg-tertiary text-text-secondary text-sm rounded-full border border-border"
                >
                  {t.label} <span className="text-text-muted">({t.count})</span>
                </span>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12 bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Questions fréquentes</h2>
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

          {/* Noscript : liste complète des régions et villes */}
          <noscript>
            <section className="mt-8">
              <h2 className="text-xl font-bold mb-4">Toutes les régions</h2>
              <ul>
                {regions.map((r) => (
                  <li key={r.slug}>
                    <a href={`/lieu-de-drague/region/${r.slug}`}>
                      {r.nom} ({r.lieuCount} lieux)
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </noscript>

          {/* Lien retour */}
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
            >
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
