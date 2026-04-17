/**
 * Page ville "Lieux de drague à [Ville]"
 * Server Component
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getDragueVilleBySlug,
  getAllDragueVilleSlugs,
  getRelatedDragueVilles,
  getLieuxByVille,
} from '@/lib/data/dragues';
import {
  generateDragueVilleIntro,
  generateDragueFAQ,
  dragueVilleTitle,
  dragueVilleMeta,
  currentYear,
} from '@/lib/utils/drague-seo-content';
import Breadcrumb from '@/components/ui/Breadcrumb';
import DragueDisclaimer from '@/components/drague/DragueDisclaimer';
import DragueList from '@/components/drague/DragueList';
import DragueFilters from '@/components/drague/DragueFilters';
import GayCTA from '@/components/ui/GayCTA';
import {
  DragueBreadcrumbJsonLd,
  DraguePlaceListJsonLd,
  DragueFAQJsonLd,
} from '@/components/seo/DragueJsonLd';

export async function generateStaticParams() {
  const slugs = await getAllDragueVilleSlugs();
  return slugs.map((ville) => ({ ville }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ville: string }>;
}): Promise<Metadata> {
  const { ville } = await params;
  const v = await getDragueVilleBySlug(ville);
  if (!v) return { title: 'Ville introuvable | FG People' };

  return {
    title: dragueVilleTitle(v.nom, v.code_postal, v.lieuCount),
    description: dragueVilleMeta(v.nom, v.lieuCount, v.departement),
    alternates: { canonical: `/lieu-de-drague/ville/${v.slug}` },
    openGraph: {
      type: 'website',
      url: `https://www.fgpeople.com/lieu-de-drague/ville/${v.slug}`,
      title: `Lieux de drague à ${v.nom} : ${v.lieuCount} spot${v.lieuCount > 1 ? 's' : ''} en ${currentYear()}`,
      description: dragueVilleMeta(v.nom, v.lieuCount, v.departement),
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `Lieux de drague à ${v.nom}`,
        },
      ],
    },
  };
}

export default async function DragueVillePage({
  params,
}: {
  params: Promise<{ ville: string }>;
}) {
  const { ville } = await params;
  const v = await getDragueVilleBySlug(ville);
  if (!v) notFound();

  const [lieux, relatedVilles] = await Promise.all([
    getLieuxByVille(v.slug),
    getRelatedDragueVilles(v.departementSlug, v.slug, 8),
  ]);

  // Stats par type
  const typeStats = new Map<string, number>();
  for (const l of lieux) {
    typeStats.set(l.typeLabel, (typeStats.get(l.typeLabel) || 0) + 1);
  }
  const types = Array.from(typeStats.entries()).sort((a, b) => b[1] - a[1]);

  const breadcrumbItems = [
    { name: 'Lieux de drague', url: '/lieu-de-drague' },
    { name: v.region, url: `/lieu-de-drague/region/${v.regionSlug}` },
    { name: `${v.departement} (${v.departement_code})`, url: `/lieu-de-drague/departement/${v.departementSlug}` },
    { name: v.nom, url: `/lieu-de-drague/ville/${v.slug}` },
  ];

  const intro = generateDragueVilleIntro(v.nom, v.code_postal, v.lieuCount, v.departement, v.slug);
  const faq = generateDragueFAQ(v.nom, v.slug, 6);

  return (
    <>
      <DragueBreadcrumbJsonLd items={[{ name: 'Accueil', url: '/' }, ...breadcrumbItems]} />
      <DraguePlaceListJsonLd
        lieux={lieux}
        name={`Lieux de drague à ${v.nom} — ${currentYear()}`}
        description={dragueVilleMeta(v.nom, v.lieuCount, v.departement)}
      />
      <DragueFAQJsonLd faq={faq} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Lieux de drague à {v.nom}{v.code_postal && ` (${v.code_postal})`}
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl mb-6">{intro}</p>

            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
                <span className="text-accent-primary font-bold">{v.lieuCount}</span>
                <span className="text-text-secondary ml-2">lieu{v.lieuCount > 1 ? 'x' : ''}</span>
              </div>
              <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
                <span className="text-text-secondary">{v.departement} ({v.departement_code})</span>
              </div>
              <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
                <span className="text-text-secondary">{v.region}</span>
              </div>
            </div>

            {types.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {types.map(([label, count]) => (
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
            <DragueDisclaimer slug={v.slug} showSafetyTips />
          </div>

          {/* CTA rencontres gay/bi (partenaire affilié) */}
          <div className="mb-10">
            <GayCTA location={v.nom} variant="compact" />
          </div>

          {/* Liste des lieux */}
          <section className="mb-12">
            {lieux.length >= 4 ? (
              <>
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Tous les lieux de drague à {v.nom}
                </h2>
                <DragueFilters lieux={lieux} defaultOpenCount={3} />
              </>
            ) : (
              <DragueList
                lieux={lieux}
                title={`Lieux de drague à ${v.nom}`}
                subtitle={`${v.lieuCount} spot${v.lieuCount > 1 ? 's' : ''} référencé${v.lieuCount > 1 ? 's' : ''} dans la commune`}
                defaultOpenCount={Math.min(lieux.length, 5)}
              />
            )}
          </section>

          {/* Villes voisines */}
          {relatedVilles.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-text-primary mb-4">
                Autres villes en {v.departement}
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedVilles.map((rv) => (
                  <Link
                    key={rv.slug}
                    href={rv.url}
                    className="px-4 py-2 bg-bg-tertiary text-text-secondary text-sm rounded-full border border-border hover:border-accent-primary/30 hover:text-accent-primary transition-all"
                  >
                    {rv.nom}{rv.count != null && ` (${rv.count})`}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="mb-12 bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Questions sur les lieux de drague à {v.nom}
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

          {/* Noscript */}
          <noscript>
            <section className="mt-8">
              <h2 className="text-xl font-bold mb-4">Liste des lieux à {v.nom}</h2>
              <ul>
                {lieux.map((l) => (
                  <li key={l.id}>
                    <strong>{l.nom}</strong> — {l.typeLabel}
                    {l.localisation.adresse_ou_description && <> — {l.localisation.adresse_ou_description}</>}
                  </li>
                ))}
              </ul>
            </section>
          </noscript>

          {/* Liens retour */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/lieu-de-drague/departement/${v.departementSlug}`}
              className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
            >
              ← Lieux en {v.departement}
            </Link>
            <Link
              href={`/lieu-de-drague/region/${v.regionSlug}`}
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
            >
              Lieux en {v.region}
            </Link>
            <Link
              href="/lieu-de-drague"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
            >
              Tous les lieux
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
