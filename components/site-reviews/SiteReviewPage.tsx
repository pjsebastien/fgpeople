/**
 * Page d'avis sur un site de rencontre — Server Component.
 *
 * Structure pensée pour la conversion autant que pour le SEO :
 *   1. verdict immédiat (note + une phrase + CTA) sans scroll
 *   2. chiffres clés
 *   3. sommaire ancré + corps de l'article en blocs
 *   4. avis réels des visiteurs (ce que la concurrence n'a pas)
 *   5. alternatives + maillage vers l'annuaire de clubs
 */

import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BreadcrumbJsonLd, FAQPageJsonLd } from '@/components/seo/JsonLd';
import SiteReviewJsonLd from '@/components/seo/SiteReviewJsonLd';
import EntityReviewsSection from '@/components/reviews/EntityReviewsSection';
import Stars from '@/components/reviews/Stars';
import AffiliateButton from './AffiliateButton';
import CloudImage from './CloudImage';
import QuickFacts from './QuickFacts';
import ProsCons from './ProsCons';
import StickyOffer from './StickyOffer';
import ReviewStickyBar from './ReviewStickyBar';
import ReviewBlocks, { buildToc } from './ReviewBlocks';
import { ScoreBadge, ScoreBreakdown, scoreLabel } from './Scores';
import { getOtherSiteReviews, siteReviewTarget } from '@/lib/data/site-reviews';
import type { SiteReview } from '@/lib/types/site-review';
import type { LieuReviewsBundle } from '@/lib/types/reviews';

const EMPTY_BUNDLE: LieuReviewsBundle = {
  aggregate: { count: 0, average: 0 },
  reviews: [],
  tagStats: {},
};

export default function SiteReviewPage({
  review,
  reviewsBundle = EMPTY_BUNDLE,
}: {
  review: SiteReview;
  reviewsBundle?: LieuReviewsBundle;
}) {
  const toc = buildToc(review.blocks);
  const others = getOtherSiteReviews(review.slug, 3);
  const hasVisitorReviews = reviewsBundle.aggregate.count > 0;

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: 'Comparatif des sites', url: '/comparatif-sites-libertins' },
    { name: review.siteName, url: `/${review.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <SiteReviewJsonLd review={review} reviewsBundle={reviewsBundle} />
      {review.faq.length > 0 && <FAQPageJsonLd faq={review.faq} />}

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          {/* ============ EN-TÊTE ============ */}
          <header className="mt-6 mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-accent-primary/15 text-accent-primary text-xs font-semibold rounded-full border border-accent-primary/30">
                Testé par la rédaction
              </span>
              <time className="text-text-muted text-xs" dateTime={review.updatedAt}>
                Mis à jour le{' '}
                {new Date(review.updatedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </div>

            <div className="grid lg:grid-cols-[1fr,auto] gap-8 items-start">
              <div>
                {review.logo && (
                  <CloudImage
                    media={review.logo}
                    className="h-11 w-auto object-contain mb-5"
                    sizes="220px"
                  />
                )}

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
                  {review.meta.title.includes('|')
                    ? review.meta.title.split('|')[0].trim()
                    : `Avis ${review.siteName}`}
                </h1>

                <p className="text-text-secondary text-lg md:text-xl max-w-2xl mb-6">
                  {review.tagline}
                </p>

                {/* Notes : rédaction + visiteurs */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-4">
                    <ScoreBadge score={review.editorScore} size="lg" />
                    <div>
                      <p className="text-text-primary font-bold text-lg leading-tight">
                        {scoreLabel(review.editorScore)}
                      </p>
                      <p className="text-text-muted text-sm">Note de la rédaction</p>
                    </div>
                  </div>

                  {hasVisitorReviews && (
                    <div className="pl-6 border-l border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <Stars value={reviewsBundle.aggregate.average} size={18} />
                        <span className="text-text-primary font-bold">
                          {reviewsBundle.aggregate.average.toFixed(1).replace('.', ',')}
                          <span className="text-text-muted font-normal text-sm">/5</span>
                        </span>
                      </div>
                      <a href="#avis" className="text-text-muted text-sm hover:text-accent-primary">
                        {reviewsBundle.aggregate.count} avis de visiteurs →
                      </a>
                    </div>
                  )}
                </div>

                {/* Le verdict, avant tout scroll */}
                <div className="bg-bg-secondary border-l-4 border-accent-primary rounded-r-xl p-5 mb-6">
                  <p className="text-text-primary text-lg leading-relaxed font-medium">
                    {review.verdict.oneLiner}
                  </p>
                </div>

                <AffiliateButton
                  href={review.affiliateUrl}
                  target={siteReviewTarget(review)}
                  block="avis-entete"
                  size="lg"
                  note="Inscription gratuite. Lien partenaire, prix inchangé pour vous"
                >
                  Essayer {review.siteName} gratuitement
                </AffiliateButton>
              </div>

              {/* Capture d'en-tête */}
              <div className="w-full lg:w-[420px] shrink-0">
                <CloudImage
                  media={review.hero}
                  priority
                  className="w-full rounded-2xl border border-border"
                  sizes="(max-width: 1024px) 100vw, 420px"
                />
              </div>
            </div>
          </header>

          {/* ============ CHIFFRES CLÉS ============ */}
          <div className="mb-10">
            <QuickFacts facts={review.quickFacts} />
          </div>

          {/* ============ POUR QUI / PAS POUR QUI ============ */}
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            <div className="bg-bg-secondary border border-border rounded-xl p-5">
              <h2 className="text-text-primary font-bold mb-3">
                {review.siteName} est fait pour vous si…
              </h2>
              <ul className="space-y-2">
                {review.verdict.bestFor.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-text-secondary text-sm leading-relaxed">
                    <span className="text-green-400 shrink-0" aria-hidden="true">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-bg-secondary border border-border rounded-xl p-5">
              <h2 className="text-text-primary font-bold mb-3">Passez votre chemin si…</h2>
              <ul className="space-y-2">
                {review.verdict.notFor.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-text-secondary text-sm leading-relaxed">
                    <span className="text-red-400 shrink-0" aria-hidden="true">
                      ✗
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ============ CORPS + COLONNE STICKY ============ */}
          <div className="flex gap-10 items-start">
            <article className="flex-1 min-w-0 max-w-3xl">
              {/* Sommaire */}
              {toc.length > 2 && (
                <nav
                  aria-label="Sommaire"
                  className="bg-bg-secondary border border-border rounded-xl p-5 mb-10"
                >
                  <h2 className="text-text-primary font-bold mb-3 text-sm uppercase tracking-wide">
                    Au sommaire
                  </h2>
                  <ol className="space-y-1.5">
                    {toc.map((entry, i) => (
                      <li key={entry.id} className="flex gap-2.5 text-sm">
                        <span className="text-text-muted tabular-nums">{i + 1}.</span>
                        <a
                          href={`#${entry.id}`}
                          className="text-text-secondary hover:text-accent-primary transition-colors"
                        >
                          {entry.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              <ReviewBlocks review={review} />

              {/* ============ VERDICT FINAL ============ */}
              <section id="verdict" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-5">
                  Notre verdict sur {review.siteName}
                </h2>

                <div className="bg-bg-secondary border border-border rounded-2xl p-6">
                  <div className="flex flex-wrap items-center gap-5 mb-6 pb-6 border-b border-border">
                    <ScoreBadge score={review.editorScore} size="md" />
                    <div className="flex-1 min-w-[200px]">
                      <p className="text-text-primary font-bold text-lg">
                        {scoreLabel(review.editorScore)}
                      </p>
                      <p className="text-text-secondary text-sm">{review.verdict.oneLiner}</p>
                    </div>
                  </div>

                  <ScoreBreakdown scores={review.scores} />

                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-text-secondary leading-relaxed mb-5">
                      {review.verdict.body}
                    </p>
                    <div className="text-center">
                      <AffiliateButton
                        href={review.affiliateUrl}
                        target={siteReviewTarget(review)}
                        block="avis-verdict"
                        size="lg"
                      >
                        Créer un compte sur {review.siteName}
                      </AffiliateButton>
                    </div>
                  </div>
                </div>
              </section>

              {/* ============ FAQ ============ */}
              {review.faq.length > 0 && (
                <section id="faq" className="scroll-mt-24 mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-5">
                    Questions fréquentes sur {review.siteName}
                  </h2>
                  <div className="space-y-3">
                    {review.faq.map((item, i) => (
                      <details
                        key={i}
                        className="group bg-bg-secondary border border-border rounded-xl"
                      >
                        <summary className="cursor-pointer list-none p-4 flex items-center justify-between gap-4">
                          <h3 className="text-text-primary font-semibold text-base">
                            {item.question}
                          </h3>
                          <svg
                            className="w-5 h-5 text-text-muted shrink-0 transition-transform group-open:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="px-4 pb-4 -mt-1">
                          <p className="text-text-secondary leading-relaxed">{item.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </article>

            <StickyOffer review={review} />
          </div>

          {/* ============ AVIS DES VISITEURS ============ */}
          <section className="mt-14 pt-10 border-t border-border">
            <EntityReviewsSection
              entityType="site"
              entityId={review.slug}
              entitySlug={review.slug}
              villeSlug=""
              entityName={review.siteName}
              bundle={reviewsBundle}
            />
          </section>

          {/* ============ ALTERNATIVES ============ */}
          {(others.length > 0 || review.alternatives.length > 0) && (
            <section className="mt-14 pt-10 border-t border-border">
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                Les alternatives à {review.siteName}
              </h2>
              <p className="text-text-secondary mb-6">
                {review.siteName} ne vous convient pas ? Voici ce que nous recommandons à la place.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {others.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/${other.slug}`}
                    className="group bg-bg-secondary border border-border rounded-xl p-5 hover:border-accent-primary transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <ScoreBadge score={other.editorScore} size="sm" />
                      <span className="text-text-primary font-bold group-hover:text-accent-primary transition-colors">
                        {other.siteName}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm line-clamp-3">{other.tagline}</p>
                  </Link>
                ))}

                {review.alternatives.map((alt, i) =>
                  alt.slug ? null : (
                    <div key={i} className="bg-bg-secondary border border-border rounded-xl p-5">
                      <p className="text-text-primary font-bold mb-1">{alt.name}</p>
                      <p className="text-text-secondary text-sm mb-3">{alt.why}</p>
                      {alt.affiliateUrl && (
                        <AffiliateButton
                          href={alt.affiliateUrl}
                          target={alt.name.toLowerCase()}
                          block="avis-alternative"
                          variant="secondary"
                          size="md"
                        >
                          Voir {alt.name}
                        </AffiliateButton>
                      )}
                    </div>
                  )
                )}
              </div>

              <div className="mt-6">
                <Link
                  href="/comparatif-sites-libertins"
                  className="text-accent-primary hover:text-accent-hover font-medium"
                >
                  Voir le comparatif complet des sites libertins →
                </Link>
              </div>
            </section>
          )}

          {/* ============ MAILLAGE VERS L'ANNUAIRE ============ */}
          <section className="mt-14 bg-gradient-to-r from-accent-primary/15 to-accent-hover/10 border border-accent-primary/25 rounded-2xl p-6 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              Vous préférez les rencontres en vrai ?
            </h2>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Un site de rencontre ne remplace pas une soirée en club. Nous recensons plus de 500
              clubs libertins, saunas et spas échangistes partout en France.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/club-libertin" className="btn-primary">
                Explorer les clubs libertins
              </Link>
              <Link
                href="/sauna-libertin"
                className="px-5 py-2.5 bg-bg-tertiary text-text-primary rounded-xl border border-border hover:border-accent-primary transition-colors font-medium"
              >
                Les saunas libertins
              </Link>
            </div>
          </section>

          {/* ============ TRANSPARENCE AFFILIATION ============ */}
          <p className="mt-10 text-text-muted text-xs leading-relaxed max-w-3xl">
            <strong className="text-text-secondary">Transparence :</strong> cette page contient des
            liens partenaires. Si vous vous inscrivez via l&apos;un d&apos;eux, nous percevons une
            commission, sans aucun surcoût pour vous. Cela ne conditionne ni notre note ni le
            contenu de ce test : nos points faibles sont réels et nous citons systématiquement les
            alternatives.
          </p>
        </div>

        {/* Encart d'offre fixe, discret et fermable */}
        <ReviewStickyBar
          siteName={review.siteName}
          editorScore={review.editorScore}
          affiliateUrl={review.affiliateUrl}
          target={siteReviewTarget(review)}
          hook={review.quickFacts.find((f) => f.label === 'Essai')?.value || review.badge}
        />
      </main>
    </>
  );
}
