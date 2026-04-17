/**
 * Page région "Lieux de drague en [Region]"
 * Server Component
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getDragueRegionBySlug,
  getAllDragueRegionSlugs,
  getDragueDepartementsByRegion,
  getDragueVillesByDepartement,
  getRelatedDragueRegions,
  getLieuxByRegion,
  getAllDragueRegions,
} from '@/lib/data/dragues';
import {
  generateDragueRegionIntro,
  generateDragueFAQ,
  dragueRegionTitle,
  dragueRegionMeta,
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

export async function generateStaticParams() {
  const slugs = await getAllDragueRegionSlugs();
  return slugs.map((region) => ({ region }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const r = await getDragueRegionBySlug(region);
  if (!r) return { title: 'Région introuvable | FG People' };

  return {
    title: dragueRegionTitle(r.nom, r.lieuCount),
    description: dragueRegionMeta(r.nom, r.lieuCount, r.departementSlugs.length),
    alternates: { canonical: `/lieu-de-drague/region/${r.slug}` },
    openGraph: {
      type: 'website',
      url: `https://www.fgpeople.com/lieu-de-drague/region/${r.slug}`,
      title: `Lieux de drague en ${r.nom} : ${r.lieuCount} spots en ${currentYear()}`,
      description: dragueRegionMeta(r.nom, r.lieuCount, r.departementSlugs.length),
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Lieux de drague en ${r.nom}`,
        },
      ],
    },
  };
}

export default async function DragueRegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const r = await getDragueRegionBySlug(region);
  if (!r) notFound();

  const [departements, lieux, related, allRegions] = await Promise.all([
    getDragueDepartementsByRegion(r.slug),
    getLieuxByRegion(r.slug),
    getRelatedDragueRegions(r.slug, 5),
    getAllDragueRegions(),
  ]);

  // Top 6 villes de la région (somme des lieux par ville)
  const villeMap = new Map<string, { nom: string; slug: string; cp: string; count: number }>();
  for (const l of lieux) {
    const k = l.localisation.villeSlug;
    if (!villeMap.has(k)) {
      villeMap.set(k, {
        nom: l.localisation.ville,
        slug: l.localisation.villeSlug,
        cp: l.localisation.code_postal,
        count: 0,
      });
    }
    villeMap.get(k)!.count++;
  }
  const topVilles = Array.from(villeMap.values()).sort((a, b) => b.count - a.count).slice(0, 8);

  const breadcrumbItems = [
    { name: 'Lieux de drague', url: '/lieu-de-drague' },
    { name: r.nom, url: `/lieu-de-drague/region/${r.slug}` },
  ];

  const intro = generateDragueRegionIntro(r.nom, r.lieuCount, r.slug);
  const faq = generateDragueFAQ(r.nom, r.slug, 6);

  // Items pour JSON-LD : départements de la région
  const deptItems = departements.map((d) => ({
    name: `${d.nom} (${d.code})`,
    url: `https://www.fgpeople.com/lieu-de-drague/departement/${d.slug}`,
  }));

  return (
    <>
      <DragueBreadcrumbJsonLd items={[{ name: 'Accueil', url: '/' }, ...breadcrumbItems]} />
      <DragueItemListJsonLd
        items={deptItems}
        name={`Lieux de drague en ${r.nom} par département — ${currentYear()}`}
        description={dragueRegionMeta(r.nom, r.lieuCount, r.departementSlugs.length)}
      />
      <DragueFAQJsonLd faq={faq} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Lieux de drague en {r.nom}
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl mb-6">{intro}</p>

            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
                <span className="text-accent-primary font-bold">{r.lieuCount}</span>
                <span className="text-text-secondary ml-2">lieux</span>
              </div>
              <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
                <span className="text-accent-primary font-bold">{departements.length}</span>
                <span className="text-text-secondary ml-2">départements</span>
              </div>
              <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
                <span className="text-accent-primary font-bold">{r.villeCount}</span>
                <span className="text-text-secondary ml-2">villes</span>
              </div>
            </div>
          </header>

          <div className="mb-10">
            <DragueDisclaimer slug={r.slug} />
          </div>

          {/* Départements */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Départements en {r.nom}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {departements.map((d) => (
                <Link
                  key={d.slug}
                  href={`/lieu-de-drague/departement/${d.slug}`}
                  className="group p-5 bg-bg-tertiary rounded-xl border border-border hover:border-accent-primary/30 transition-all"
                >
                  <span className="block text-accent-primary font-bold text-lg mb-1">{d.code}</span>
                  <h3 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                    {d.nom}
                  </h3>
                  <p className="text-text-muted text-sm mt-1">
                    {d.lieuCount} lieu{d.lieuCount > 1 ? 'x' : ''}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA rencontres gay/bi */}
          <div className="mb-10">
            <GayCTA location={r.nom} variant="compact" />
          </div>

          {/* Top villes */}
          {topVilles.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Villes les plus actives en {r.nom}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {topVilles.map((v) => (
                  <Link
                    key={v.slug}
                    href={`/lieu-de-drague/ville/${v.slug}`}
                    className="group p-3 bg-bg-secondary rounded-xl border border-border hover:border-accent-primary/30 transition-all text-center"
                  >
                    <span className="block text-text-primary group-hover:text-accent-primary font-medium truncate">
                      {v.nom}
                    </span>
                    <span className="text-text-muted text-xs">
                      {v.count} lieu{v.count > 1 ? 'x' : ''}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Autres régions */}
          {related.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-bold text-text-primary mb-4">Autres régions</h2>
              <div className="flex flex-wrap gap-2">
                {related.map((rl) => (
                  <Link
                    key={rl.slug}
                    href={rl.url}
                    className="px-4 py-2 bg-bg-tertiary text-text-secondary text-sm rounded-full border border-border hover:border-accent-primary/30 hover:text-accent-primary transition-all"
                  >
                    {rl.nom}{rl.count != null && ` (${rl.count})`}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="mb-12 bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Questions sur les lieux de drague en {r.nom}
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

          {/* Noscript : liste exhaustive départements + lieux */}
          <noscript>
            <section className="mt-8">
              <h2 className="text-xl font-bold mb-4">Tous les départements de {r.nom}</h2>
              <ul>
                {departements.map((d) => (
                  <li key={d.slug}>
                    <a href={`/lieu-de-drague/departement/${d.slug}`}>
                      {d.nom} ({d.code}) — {d.lieuCount} lieux
                    </a>
                  </li>
                ))}
              </ul>
              <h2 className="text-xl font-bold mb-4 mt-6">Liste complète des lieux en {r.nom}</h2>
              <ul>
                {lieux.map((l) => (
                  <li key={l.id}>
                    {l.nom} — {l.typeLabel} à {l.localisation.ville} ({l.localisation.departement_code})
                  </li>
                ))}
              </ul>
            </section>
          </noscript>

          {/* Liens retour */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/lieu-de-drague"
              className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
            >
              ← Tous les lieux de drague
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
