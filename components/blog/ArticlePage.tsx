/**
 * ArticlePage - Server Component
 * Composant pour afficher un article de blog complet
 */

import Link from 'next/link';
import Image from 'next/image';
import type { BlogArticle } from '@/lib/types';
import { getRelatedArticles } from '@/lib/data/blog';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BreadcrumbJsonLd, ArticleJsonLd } from '@/components/seo/JsonLd';
import WyyldeBanner from '@/components/ui/WyyldeBanner';

interface ArticlePageProps {
  article: BlogArticle;
}

/**
 * Parse le texte pour gérer le gras et les liens Markdown
 * Retourne un tableau de ReactNode
 */
function parseTextWithFormatting(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];

  // Regex pour matcher les liens [text](url) et le gras **text**
  const combinedRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*)/g;

  let lastIndex = 0;
  let match;
  let keyIndex = 0;

  while ((match = combinedRegex.exec(text)) !== null) {
    // Ajouter le texte avant le match
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      // C'est un lien [text](url)
      const linkText = match[2];
      const url = match[3];
      const isExternal = url.startsWith('http');

      if (isExternal) {
        result.push(
          <a
            key={`link-${keyIndex++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary hover:text-accent-hover underline"
          >
            {linkText}
          </a>
        );
      } else {
        result.push(
          <Link
            key={`link-${keyIndex++}`}
            href={url}
            className="text-accent-primary hover:text-accent-hover underline"
          >
            {linkText}
          </Link>
        );
      }
    } else if (match[4]) {
      // C'est du gras **text**
      result.push(
        <strong key={`bold-${keyIndex++}`} className="text-text-primary font-semibold">
          {match[4]}
        </strong>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Ajouter le reste du texte
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}

export default function ArticlePage({ article }: ArticlePageProps) {
  const relatedArticles = getRelatedArticles(article.slug, 3);

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: 'Conseils', url: '/conseils' },
    { name: article.title, url: `/${article.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ArticleJsonLd article={article} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          {/* En-tête de l'article */}
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              {article.title}
            </h1>
            <p className="text-text-secondary text-lg md:text-xl max-w-3xl mb-6">
              {article.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-bg-secondary border border-border rounded-full text-sm text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Image hero */}
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-12">
            <Image
              src={article.heroImage.src}
              alt={article.heroImage.alt}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Contenu de l'article */}
          <article className="max-w-4xl mx-auto">
            {article.content.map((section, index) => (
              <section key={section.id} className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">
                  {section.title}
                </h2>

                {/* Contenu avec formatage markdown basique */}
                <div className="prose prose-invert prose-lg max-w-none">
                  {section.content.split('\n\n').map((paragraph, pIndex) => {
                    // Gestion des titres gras **Titre**
                    if (paragraph.startsWith('**') && paragraph.includes('**\n')) {
                      const [title, ...rest] = paragraph.split('\n');
                      const cleanTitle = title.replace(/\*\*/g, '');
                      return (
                        <div key={pIndex} className="mb-4">
                          <h3 className="text-xl font-semibold text-text-primary mb-2">
                            {cleanTitle}
                          </h3>
                          <p className="text-text-secondary leading-relaxed">
                            {parseTextWithFormatting(rest.join('\n'))}
                          </p>
                        </div>
                      );
                    }

                    // Gestion des listes avec tirets
                    if (paragraph.includes('\n- ')) {
                      const lines = paragraph.split('\n');
                      const intro = lines[0];
                      const items = lines.slice(1).filter(l => l.startsWith('- '));
                      return (
                        <div key={pIndex} className="mb-4">
                          {intro && (
                            <p className="text-text-secondary leading-relaxed mb-2">
                              {parseTextWithFormatting(intro)}
                            </p>
                          )}
                          <ul className="list-disc list-inside space-y-1 text-text-secondary">
                            {items.map((item, iIndex) => (
                              <li key={iIndex}>
                                {parseTextWithFormatting(item.replace('- ', ''))}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }

                    // Paragraphe normal
                    return (
                      <p key={pIndex} className="text-text-secondary leading-relaxed mb-4">
                        {parseTextWithFormatting(paragraph)}
                      </p>
                    );
                  })}
                </div>

                {/* Image de section si présente */}
                {section.image && (
                  <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mt-8">
                    <Image
                      src={section.image.src}
                      alt={section.image.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </section>
            ))}

            {/* Bannière partenaire Wyylde */}
            <div className="mb-12">
              <WyyldeBanner variant="large" />
            </div>

            {/* Section FAQ */}
            {article.faq.length > 0 && (
              <section className="mb-12 bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border">
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-8">
                  Questions fréquentes
                </h2>
                <div className="space-y-6">
                  {article.faq.map((item, index) => (
                    <div key={index} className="border-b border-border pb-6 last:border-0 last:pb-0">
                      <h3 className="text-lg font-semibold text-text-primary mb-3">
                        {item.question}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {parseTextWithFormatting(item.answer)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Articles liés */}
          {relatedArticles.length > 0 && (
            <section className="mt-16 border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
                Articles connexes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/${related.slug}`}
                    className="group block bg-bg-secondary rounded-xl border border-border overflow-hidden hover:border-accent-primary transition-colors"
                  >
                    <div className="relative h-40">
                      <Image
                        src={related.heroImage.src}
                        alt={related.heroImage.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-text-secondary text-sm mt-2 line-clamp-2">
                        {related.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Maillage interne - Pages piliers */}
          <section className="mt-16 bg-bg-secondary rounded-2xl p-6 md:p-8 border border-border">
            <h2 className="text-xl font-bold text-text-primary mb-6">
              Découvrez nos établissements par catégorie
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Link
                href="/club-libertin"
                className="flex flex-col items-center p-4 bg-bg-tertiary rounded-xl hover:bg-accent-primary/10 transition-colors group"
              >
                <span className="text-2xl mb-2">🏠</span>
                <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary">Clubs libertins</span>
              </Link>
              <Link
                href="/sauna-libertin"
                className="flex flex-col items-center p-4 bg-bg-tertiary rounded-xl hover:bg-accent-primary/10 transition-colors group"
              >
                <span className="text-2xl mb-2">🧖</span>
                <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary">Saunas libertins</span>
              </Link>
              <Link
                href="/spa-libertin"
                className="flex flex-col items-center p-4 bg-bg-tertiary rounded-xl hover:bg-accent-primary/10 transition-colors group"
              >
                <span className="text-2xl mb-2">💆</span>
                <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary">Spas libertins</span>
              </Link>
              <Link
                href="/hebergement-libertin"
                className="flex flex-col items-center p-4 bg-bg-tertiary rounded-xl hover:bg-accent-primary/10 transition-colors group"
              >
                <span className="text-2xl mb-2">🏨</span>
                <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary">Hébergements</span>
              </Link>
            </div>

            <h3 className="text-lg font-semibold text-text-primary mb-4">Par région</h3>
            <div className="flex flex-wrap gap-2">
              <Link href="/region/ile-de-france" className="px-3 py-1.5 bg-bg-tertiary text-text-secondary text-sm rounded-full hover:text-accent-primary hover:bg-accent-primary/10 transition-colors">
                Île-de-France
              </Link>
              <Link href="/region/auvergne-rhone-alpes" className="px-3 py-1.5 bg-bg-tertiary text-text-secondary text-sm rounded-full hover:text-accent-primary hover:bg-accent-primary/10 transition-colors">
                Auvergne-Rhône-Alpes
              </Link>
              <Link href="/region/provence-alpes-cote-dazur" className="px-3 py-1.5 bg-bg-tertiary text-text-secondary text-sm rounded-full hover:text-accent-primary hover:bg-accent-primary/10 transition-colors">
                PACA
              </Link>
              <Link href="/region/nouvelle-aquitaine" className="px-3 py-1.5 bg-bg-tertiary text-text-secondary text-sm rounded-full hover:text-accent-primary hover:bg-accent-primary/10 transition-colors">
                Nouvelle-Aquitaine
              </Link>
              <Link href="/region/occitanie" className="px-3 py-1.5 bg-bg-tertiary text-text-secondary text-sm rounded-full hover:text-accent-primary hover:bg-accent-primary/10 transition-colors">
                Occitanie
              </Link>
              <Link href="/region/pays-de-la-loire" className="px-3 py-1.5 bg-bg-tertiary text-text-secondary text-sm rounded-full hover:text-accent-primary hover:bg-accent-primary/10 transition-colors">
                Pays de la Loire
              </Link>
            </div>
          </section>

          {/* CTA vers clubs */}
          <section className="mt-8 bg-gradient-to-r from-accent-primary/20 to-accent-hover/20 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Trouvez un club libertin près de chez vous
            </h2>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Consultez notre annuaire complet des clubs libertins, saunas et spas en France.
            </p>
            <Link
              href="/#regions"
              className="btn-primary inline-block"
            >
              Explorer les clubs
            </Link>
          </section>

          {/* Liens retour */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/conseils"
              className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Tous les conseils
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Accueil
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
