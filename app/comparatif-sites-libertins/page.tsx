/**
 * Hub — comparatif des sites de rencontre libertins.
 *
 * L'angle qui nous différencie : un vrai tableau comparatif (les concurrents
 * se contentent d'empiler des fiches) et la note réelle des visiteurs à côté
 * de la nôtre.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BreadcrumbJsonLd, FAQPageJsonLd } from '@/components/seo/JsonLd';
import AffiliateButton from '@/components/site-reviews/AffiliateButton';
import CloudImage from '@/components/site-reviews/CloudImage';
import { ScoreBadge, scoreLabel, scoreColor } from '@/components/site-reviews/Scores';
import Stars from '@/components/reviews/Stars';
import {
  getRankedSiteReviews,
  getSiteReviewStats,
  siteReviewTarget,
} from '@/lib/data/site-reviews';
import { getReviewsForEntities, getBundle } from '@/lib/data/reviews';
import { getStats } from '@/lib/data/clubs';

export const revalidate = 300;

const TITLE = 'Comparatif des sites libertins 2026 : lequel choisir ?';
const DESCRIPTION =
  'Notre comparatif des sites de rencontre libertins testés un par un : tarifs réels, qualité des profils, avantages et pièges. Notes de la rédaction et avis de visiteurs.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/comparatif-sites-libertins' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: '/comparatif-sites-libertins',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: TITLE }],
  },
};

const FAQ = [
  {
    question: 'Quel est le meilleur site libertin en France ?',
    answer:
      "Sur le seul critère du nombre de membres actifs, Wyylde domine largement le marché français. Mais « meilleur » dépend de votre profil : un couple en grande ville, un homme seul avec un budget serré et une personne vivant en zone rurale n'ont pas du tout le même intérêt à payer le même abonnement.",
  },
  {
    question: 'Existe-t-il des sites libertins réellement gratuits ?',
    answer:
      "Aucun site sérieux n'est entièrement gratuit. Tous permettent de créer un profil et de parcourir les membres sans payer, mais bloquent la messagerie. Les rares plateformes 100 % gratuites sont saturées de faux profils et de redirections publicitaires.",
  },
  {
    question: 'Comment tester un site libertin sans se faire piéger ?',
    answer:
      "Inscrivez-vous gratuitement et comptez les profils connectés dans les 48 dernières heures à moins de 30 km de chez vous. C'est le seul indicateur fiable. Si vous passez à l'abonnement, désactivez systématiquement la reconduction automatique dès la souscription.",
  },
  {
    question: 'Comment notez-vous les sites de ce comparatif ?',
    answer:
      "Chaque site est noté sur 10 selon six critères : taille de la communauté, qualité des profils, fonctionnalités, ergonomie, rapport qualité-prix et sécurité. Nous affichons aussi la note moyenne laissée par les visiteurs, modérée mais jamais retouchée, y compris quand elle est mauvaise.",
  },
];

export default async function ComparatifPage() {
  const reviews = getRankedSiteReviews();
  const stats = getSiteReviewStats();
  const clubStats = await getStats();

  const bundles = await getReviewsForEntities(
    'site',
    reviews.map((r) => r.slug)
  );

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: 'Comparatif des sites', url: '/comparatif-sites-libertins' },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <FAQPageJsonLd faq={FAQ} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mt-6 mb-10 max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-5">
              Comparatif des sites libertins : lequel vaut vraiment son abonnement ?
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              Nous testons les plateformes de rencontre libertine une par une, en payant
              l&apos;abonnement, et nous publions les points faibles autant que les points forts.
              Chaque note est accompagnée des <strong className="text-text-primary">avis réels
              de nos visiteurs</strong>, modérés mais jamais retouchés.
            </p>
            {stats.total > 0 && (
              <p className="text-text-muted text-sm">
                {stats.total} site{stats.total > 1 ? 's' : ''} testé
                {stats.total > 1 ? 's' : ''} · note moyenne{' '}
                {stats.average.toFixed(1).replace('.', ',')}/10
              </p>
            )}
          </header>

          {reviews.length === 0 ? (
            <p className="text-text-muted italic">Les premiers tests arrivent très bientôt.</p>
          ) : (
            <>
              {/* ============ TABLEAU COMPARATIF ============ */}
              <section className="mb-14">
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-5">
                  Le comparatif en un coup d&apos;œil
                </h2>
                <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                  <table className="w-full min-w-[720px] border-collapse">
                    <caption className="sr-only">
                      Comparatif des sites de rencontre libertins testés
                    </caption>
                    <thead>
                      <tr className="border-b border-border">
                        <th scope="col" className="text-left py-3 pr-4 text-text-muted text-xs font-medium uppercase tracking-wide">
                          Site
                        </th>
                        <th scope="col" className="text-center py-3 px-3 text-text-muted text-xs font-medium uppercase tracking-wide">
                          Notre note
                        </th>
                        <th scope="col" className="text-center py-3 px-3 text-text-muted text-xs font-medium uppercase tracking-wide">
                          Visiteurs
                        </th>
                        <th scope="col" className="text-left py-3 px-3 text-text-muted text-xs font-medium uppercase tracking-wide">
                          À partir de
                        </th>
                        <th scope="col" className="text-left py-3 px-3 text-text-muted text-xs font-medium uppercase tracking-wide">
                          Idéal pour
                        </th>
                        <th scope="col" className="py-3 pl-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((review) => {
                        const bundle = getBundle(bundles, review.slug);
                        const cheapest = review.pricing.plans.reduce(
                          (min, p) => (min === null ? p.pricePerMonth : min),
                          null as string | null
                        );
                        const best = review.pricing.plans.find((p) => p.highlight);

                        return (
                          <tr key={review.slug} className="border-b border-border last:border-0">
                            <th scope="row" className="text-left py-4 pr-4">
                              <Link
                                href={`/${review.slug}`}
                                className="text-text-primary font-bold hover:text-accent-primary transition-colors"
                              >
                                {review.siteName}
                              </Link>
                              {review.badge && (
                                <span className="block text-accent-primary text-[11px] font-medium mt-0.5">
                                  {review.badge}
                                </span>
                              )}
                            </th>
                            <td className="text-center py-4 px-3">
                              <span className={`font-bold tabular-nums ${scoreColor(review.editorScore)}`}>
                                {review.editorScore.toFixed(1).replace('.', ',')}
                              </span>
                              <span className="text-text-muted text-xs">/10</span>
                            </td>
                            <td className="text-center py-4 px-3">
                              {bundle.aggregate.count > 0 ? (
                                <>
                                  <div className="flex justify-center">
                                    <Stars value={bundle.aggregate.average} size={13} />
                                  </div>
                                  <span className="text-text-muted text-[11px]">
                                    {bundle.aggregate.count} avis
                                  </span>
                                </>
                              ) : (
                                <span className="text-text-muted text-xs">-</span>
                              )}
                            </td>
                            <td className="py-4 px-3 text-text-secondary text-sm whitespace-nowrap">
                              {best?.pricePerMonth || cheapest || '-'}
                              <span className="text-text-muted text-xs">/mois</span>
                            </td>
                            <td className="py-4 px-3 text-text-secondary text-sm">
                              {review.verdict.bestFor[0]}
                            </td>
                            <td className="py-4 pl-3 text-right whitespace-nowrap">
                              <AffiliateButton
                                href={review.affiliateUrl}
                                target={siteReviewTarget(review)}
                                block="comparatif-tableau"
                                size="md"
                              >
                                Tester
                              </AffiliateButton>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ============ FICHES DÉTAILLÉES ============ */}
              <section className="mb-14">
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">
                  Nos tests en détail
                </h2>
                <div className="space-y-5">
                  {reviews.map((review, index) => {
                    const bundle = getBundle(bundles, review.slug);
                    return (
                      <article
                        key={review.slug}
                        className="bg-bg-secondary border border-border rounded-2xl p-5 md:p-6"
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Visuel + note */}
                          <div className="md:w-56 shrink-0">
                            <Link href={`/${review.slug}`} className="block group">
                              <CloudImage
                                media={review.hero}
                                className="w-full rounded-xl border border-border mb-3 group-hover:opacity-90 transition-opacity"
                                sizes="(max-width: 768px) 100vw, 224px"
                              />
                            </Link>
                            <div className="flex items-center gap-3">
                              <ScoreBadge score={review.editorScore} size="sm" />
                              <div>
                                <p className="text-text-primary text-sm font-bold leading-tight">
                                  {scoreLabel(review.editorScore)}
                                </p>
                                {bundle.aggregate.count > 0 && (
                                  <p className="text-text-muted text-xs">
                                    {bundle.aggregate.count} avis visiteurs
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="w-6 h-6 rounded-full bg-accent-primary/20 border border-accent-primary/40 text-accent-primary text-xs font-bold flex items-center justify-center">
                                {index + 1}
                              </span>
                              <h3 className="text-xl font-bold text-text-primary">
                                <Link
                                  href={`/${review.slug}`}
                                  className="hover:text-accent-primary transition-colors"
                                >
                                  {review.siteName}
                                </Link>
                              </h3>
                              {review.badge && (
                                <span className="px-2 py-0.5 bg-accent-primary/15 text-accent-primary text-[11px] rounded-full border border-accent-primary/30">
                                  {review.badge}
                                </span>
                              )}
                            </div>

                            <p className="text-text-secondary text-sm leading-relaxed mb-4">
                              {review.verdict.oneLiner}
                            </p>

                            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-5">
                              {review.pros.slice(0, 2).map((p, i) => (
                                <p key={`p${i}`} className="flex gap-2 text-xs text-text-secondary">
                                  <span className="text-green-400 shrink-0" aria-hidden="true">
                                    ✓
                                  </span>
                                  <span>{p}</span>
                                </p>
                              ))}
                              {review.cons.slice(0, 2).map((c, i) => (
                                <p key={`c${i}`} className="flex gap-2 text-xs text-text-secondary">
                                  <span className="text-red-400 shrink-0" aria-hidden="true">
                                    ✗
                                  </span>
                                  <span>{c}</span>
                                </p>
                              ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                              <AffiliateButton
                                href={review.affiliateUrl}
                                target={siteReviewTarget(review)}
                                block="comparatif-fiche"
                              >
                                Essayer {review.siteName}
                              </AffiliateButton>
                              <Link
                                href={`/${review.slug}`}
                                className="text-accent-primary hover:text-accent-hover text-sm font-medium"
                              >
                                Lire le test complet →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {/* ============ MÉTHODOLOGIE ============ */}
          <section className="mb-14 bg-bg-secondary border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Comment nous testons</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-text-primary font-semibold mb-2 text-sm">
                  1. On paie l&apos;abonnement
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Impossible de juger un site sans débloquer la messagerie. Chaque plateforme est
                  testée avec un compte payant, pas depuis la page de vente.
                </p>
              </div>
              <div>
                <h3 className="text-text-primary font-semibold mb-2 text-sm">
                  2. On mesure la densité réelle
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Le nombre d&apos;inscrits annoncé ne veut rien dire. Nous comptons les profils
                  connectés récemment dans plusieurs départements, urbains comme ruraux.
                </p>
              </div>
              <div>
                <h3 className="text-text-primary font-semibold mb-2 text-sm">
                  3. On publie les défauts
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Reconduction automatique, faux profils, tarifs cachés : tout ce qui pose problème
                  est écrit noir sur blanc, même sur les sites qui nous rémunèrent.
                </p>
              </div>
            </div>
          </section>

          {/* ============ FAQ ============ */}
          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-5">
              Questions fréquentes
            </h2>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <details key={i} className="group bg-bg-secondary border border-border rounded-xl">
                  <summary className="cursor-pointer list-none p-4 flex items-center justify-between gap-4">
                    <h3 className="text-text-primary font-semibold">{item.question}</h3>
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

          {/* ============ MAILLAGE ANNUAIRE ============ */}
          <section className="bg-gradient-to-r from-accent-primary/15 to-accent-hover/10 border border-accent-primary/25 rounded-2xl p-6 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              Et si vous commenciez par un club près de chez vous ?
            </h2>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Aucun abonnement, aucune messagerie à débloquer : nous recensons{' '}
              {clubStats.total} établissements libertins dans {clubStats.villes} villes, avec
              adresses, équipements et avis de visiteurs.
            </p>
            <Link href="/club-libertin" className="btn-primary inline-block">
              Voir l&apos;annuaire des clubs
            </Link>
          </section>

          <p className="mt-10 text-text-muted text-xs leading-relaxed max-w-3xl">
            <strong className="text-text-secondary">Transparence :</strong> ce comparatif contient
            des liens partenaires. Une inscription via l&apos;un d&apos;eux nous rémunère, sans
            surcoût pour vous. Cela n&apos;influence ni le classement, ni les notes, ni les points
            faibles que nous signalons.
          </p>
        </div>
      </main>
    </>
  );
}
