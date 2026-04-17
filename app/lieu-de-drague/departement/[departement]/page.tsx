/**
 * Page département "Lieux de drague en [Dept]"
 * Server Component - intègre les filtres + liste complète
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getDragueDepartementBySlug,
  getAllDragueDepartementSlugs,
  getDragueVillesByDepartement,
  getRelatedDragueDepartements,
  getLieuxByDepartement,
} from '@/lib/data/dragues';
import {
  generateDragueDeptIntro,
  generateDragueFAQ,
  dragueDeptTitle,
  dragueDeptMeta,
  currentYear,
} from '@/lib/utils/drague-seo-content';
import Breadcrumb from '@/components/ui/Breadcrumb';
import DragueDisclaimer from '@/components/drague/DragueDisclaimer';
import DragueFilters from '@/components/drague/DragueFilters';
import GayCTA from '@/components/ui/GayCTA';
import {
  DragueBreadcrumbJsonLd,
  DraguePlaceListJsonLd,
  DragueFAQJsonLd,
} from '@/components/seo/DragueJsonLd';

export async function generateStaticParams() {
  const slugs = await getAllDragueDepartementSlugs();
  return slugs.map((departement) => ({ departement }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ departement: string }>;
}): Promise<Metadata> {
  const { departement } = await params;
  const d = await getDragueDepartementBySlug(departement);
  if (!d) return { title: 'Département introuvable | FG People' };

  return {
    title: dragueDeptTitle(d.nom, d.code, d.lieuCount),
    description: dragueDeptMeta(d.nom, d.code, d.lieuCount, d.villeSlugs.length),
    alternates: { canonical: `/lieu-de-drague/departement/${d.slug}` },
    openGraph: {
      type: 'website',
      url: `https://www.fgpeople.com/lieu-de-drague/departement/${d.slug}`,
      title: `Lieux de drague en ${d.nom} (${d.code}) : ${d.lieuCount} spots en ${currentYear()}`,
      description: dragueDeptMeta(d.nom, d.code, d.lieuCount, d.villeSlugs.length),
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Lieux de drague en ${d.nom}`,
        },
      ],
    },
  };
}

export default async function DragueDeptPage({
  params,
}: {
  params: Promise<{ departement: string }>;
}) {
  const { departement } = await params;
  const d = await getDragueDepartementBySlug(departement);
  if (!d) notFound();

  const [villes, lieux, relatedDepts] = await Promise.all([
    getDragueVillesByDepartement(d.slug),
    getLieuxByDepartement(d.slug),
    getRelatedDragueDepartements(d.regionSlug, d.slug, 8),
  ]);

  // Stats par type pour ce département
  const typeStats = new Map<string, number>();
  for (const l of lieux) {
    typeStats.set(l.typeLabel, (typeStats.get(l.typeLabel) || 0) + 1);
  }
  const topTypes = Array.from(typeStats.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const breadcrumbItems = [
    { name: 'Lieux de drague', url: '/lieu-de-drague' },
    { name: d.region, url: `/lieu-de-drague/region/${d.regionSlug}` },
    { name: `${d.nom} (${d.code})`, url: `/lieu-de-drague/departement/${d.slug}` },
  ];

  const intro = generateDragueDeptIntro(d.nom, d.code, d.lieuCount, d.region, d.slug);
  const faq = generateDragueFAQ(d.nom, d.slug, 7);

  return (
    <>
      <DragueBreadcrumbJsonLd items={[{ name: 'Accueil', url: '/' }, ...breadcrumbItems]} />
      <DraguePlaceListJsonLd
        lieux={lieux}
        name={`Lieux de drague en ${d.nom} (${d.code}) — ${currentYear()}`}
        description={dragueDeptMeta(d.nom, d.code, d.lieuCount, d.villeSlugs.length)}
      />
      <DragueFAQJsonLd faq={faq} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Lieux de drague en {d.nom} ({d.code})
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl mb-6">{intro}</p>

            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
                <span className="text-accent-primary font-bold">{d.lieuCount}</span>
                <span className="text-text-secondary ml-2">lieux</span>
              </div>
              <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
                <span className="text-accent-primary font-bold">{villes.length}</span>
                <span className="text-text-secondary ml-2">villes</span>
              </div>
              <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
                <span className="text-accent-primary font-bold">{topTypes.length}</span>
                <span className="text-text-secondary ml-2">types</span>
              </div>
            </div>

            {topTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {topTypes.map(([label, count]) => (
                  <span
                    key={label}
                    className="px-3 py-1 bg-bg-tertiary text-text-secondary text-sm rounded-full border border-border"
                  >
                    {label} <span className="text-text-muted">({count})</span>
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="mb-10">
            <DragueDisclaimer slug={d.slug} showSafetyTips />
          </div>

          {/* Villes du dept */}
          {villes.length > 1 && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Villes du département {d.nom}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {villes.map((v) => (
                  <Link
                    key={v.slug}
                    href={`/lieu-de-drague/ville/${v.slug}`}
                    className="group p-3 bg-bg-secondary rounded-xl border border-border hover:border-accent-primary/30 transition-all text-center"
                  >
                    <span className="block text-text-primary group-hover:text-accent-primary font-medium truncate">
                      {v.nom}
                    </span>
                    <span className="text-text-muted text-xs">
                      {v.lieuCount} lieu{v.lieuCount > 1 ? 'x' : ''}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA rencontres gay/bi */}
          <div className="mb-10">
            <GayCTA location={d.nom} variant="compact" />
          </div>

          {/* Liste des lieux avec filtres */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Tous les lieux de drague en {d.nom}
            </h2>
            <DragueFilters lieux={lieux} showVilleFilter={villes.length > 1} defaultOpenCount={3} />
          </section>

          {/* Autres départements */}
          {relatedDepts.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-text-primary mb-4">
                Autres départements en {d.region}
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedDepts.map((rd) => (
                  <Link
                    key={rd.slug}
                    href={rd.url}
                    className="px-4 py-2 bg-bg-tertiary text-text-secondary text-sm rounded-full border border-border hover:border-accent-primary/30 hover:text-accent-primary transition-all"
                  >
                    {rd.nom}{rd.count != null && ` (${rd.count})`}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="mb-12 bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Questions fréquentes — {d.nom}
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

          {/* Noscript : liste exhaustive */}
          <noscript>
            <section className="mt-8">
              <h2 className="text-xl font-bold mb-4">Liste complète des lieux ({lieux.length})</h2>
              <ul>
                {lieux.map((l) => (
                  <li key={l.id}>
                    <strong>{l.nom}</strong> — {l.typeLabel} à {l.localisation.ville} ({l.localisation.code_postal})
                    {l.description && <> — {l.description}</>}
                  </li>
                ))}
              </ul>
            </section>
          </noscript>

          {/* Liens retour */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/lieu-de-drague/region/${d.regionSlug}`}
              className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
            >
              ← Lieux en {d.region}
            </Link>
            <Link
              href="/lieu-de-drague"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
            >
              Tous les lieux de drague
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
