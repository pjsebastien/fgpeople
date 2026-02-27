/**
 * Page Conseils - Liste de tous les articles de blog
 * Server Component SEO optimisé
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllArticles, getCategories } from '@/lib/data/blog';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import WyyldeBanner from '@/components/ui/WyyldeBanner';

export const metadata: Metadata = {
  title: 'Conseils Libertins : Articles et Astuces | FG People',
  description: 'Découvrez nos conseils pour le milieu libertin : tenue en club, échangisme, rencontres, sécurité et bien plus. Articles pratiques pour débutants et initiés.',
  alternates: { canonical: '/conseils' },
};

export default async function ConseilsPage() {
  const articles = getAllArticles();
  const categories = getCategories();

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: 'Conseils', url: '/conseils' },
  ];

  // Grouper les articles par catégorie
  const categoryLabels: Record<string, string> = {
    pratiques: 'Pratiques & Échangisme',
    rencontres: 'Rencontres',
    conseils: 'Conseils Pratiques',
    securite: 'Sécurité',
    couple: 'Vie de Couple',
  };

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Conseils et articles sur le libertinage
            </h1>
            <p className="text-text-secondary text-lg max-w-3xl">
              Retrouvez tous nos articles pour vous accompagner dans votre découverte du milieu libertin.
              Que vous soyez novice ou expérimenté, nos conseils pratiques vous aideront à vivre
              vos expériences en toute sérénité.
            </p>
          </header>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-10">
            <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
              <span className="text-accent-primary font-bold">{articles.length}</span>
              <span className="text-text-secondary ml-2">articles</span>
            </div>
            <div className="px-4 py-2 bg-bg-secondary rounded-lg border border-border">
              <span className="text-accent-primary font-bold">{categories.length}</span>
              <span className="text-text-secondary ml-2">catégories</span>
            </div>
          </div>

          {/* Categories filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <span
                key={cat.category}
                className="px-3 py-1.5 bg-bg-secondary text-text-secondary rounded-full text-sm border border-border"
              >
                {categoryLabels[cat.category] || cat.label} ({cat.count})
              </span>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-bg-secondary rounded-xl border border-border overflow-hidden hover:border-accent-primary/50 transition-colors group"
              >
                <Link href={`/${article.slug}`} className="block">
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={article.heroImage.src}
                      alt={article.heroImage.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Category badge */}
                    <span className="absolute top-3 left-3 px-2 py-1 bg-accent-primary/90 text-white text-xs rounded-full">
                      {categoryLabels[article.category] || article.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent-primary transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-text-secondary text-sm line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-bg-tertiary text-text-muted text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Bannière partenaire Wyylde */}
          <div className="mb-12">
            <WyyldeBanner variant="leaderboard" />
          </div>

          {/* CTA vers l'annuaire */}
          <section className="bg-bg-secondary rounded-xl border border-border p-8 text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Prêt à passer à la pratique ?
            </h2>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Découvrez notre annuaire complet des clubs libertins en France.
              Plus de 470 établissements référencés avec adresses, horaires et avis.
            </p>
            <Link
              href="/#regions"
              className="inline-flex items-center gap-2 btn-primary"
            >
              Explorer les clubs
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </section>

          {/* Liens retour */}
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
