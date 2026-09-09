/**
 * Bloc CTA libertin : pages régions, départements, villes et fiches clubs.
 *
 * Composant SERVEUR. Il lit le partenaire du jour via getLibertinPartner(),
 * qui alterne Carré Libertin et Gleese un jour sur deux (bascule à 6 h, heure
 * de Paris). Les pages concernées tournent en ISR à 300 s, donc le HTML se
 * régénère dans les cinq minutes qui suivent la bascule.
 *
 * Rester en composant serveur est ce qui rend la rotation fiable : le lien
 * n'est calculé qu'une fois, côté serveur, sans risque d'écart entre le
 * rendu initial et l'hydratation.
 */

import Link from 'next/link';
import { getLibertinPartner, type AffiliatePartner } from '@/lib/config/affiliates';
import TrackedAffiliateLink from './TrackedAffiliateLink';
import PartnerBrand from './PartnerBrand';
import PartnerReviewLink from '@/components/site-reviews/PartnerReviewLink';

interface LibertinCTAProps {
  location: string;
  variant?: 'default' | 'compact';
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-green-400 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function LivePulse() {
  return (
    <span className="relative flex h-2 w-2" aria-hidden="true">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
    </span>
  );
}

/** Pastille d'accroche du partenaire (« NOUVEAU », « DEPUIS 2007 »). */
function PartnerBadge({ partner }: { partner: AffiliatePartner }) {
  if (!partner.badge) return null;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary/15 border border-accent-primary/40">
      <span className="text-accent-primary text-xs font-bold tracking-wide">{partner.badge}</span>
      {partner.badgeHint && <span className="text-text-muted text-xs">{partner.badgeHint}</span>}
    </span>
  );
}

/**
 * Lien éditorial sous le CTA. Quand nous avons publié un test du partenaire,
 * on y renvoie avec une ancre variable ; sinon on envoie vers le comparatif,
 * pour ne jamais perdre le maillage interne.
 */
function EditorialLink({ partner, seed }: { partner: AffiliatePartner; seed: string }) {
  if (partner.reviewSlug) {
    return <PartnerReviewLink slug={partner.reviewSlug} seed={seed} />;
  }
  return (
    <Link
      href="/comparatif-sites-libertins"
      className="text-accent-primary hover:text-accent-hover underline underline-offset-2"
    >
      Notre comparatif des sites libertins testés
    </Link>
  );
}

export default function LibertinCTA({ location, variant = 'default' }: LibertinCTAProps) {
  const partner = getLibertinPartner();

  if (variant === 'compact') {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-accent-primary/40 bg-gradient-to-br from-accent-primary/20 via-bg-secondary to-bg-secondary p-6 md:p-8">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <PartnerBadge partner={partner} />
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                <LivePulse />
                <span className="text-green-300 text-xs font-semibold tracking-wide">
                  {partner.hook}
                </span>
              </span>
            </div>

            <PartnerBrand partner={partner} height={22} className="mb-3 opacity-90" />

            <h3 className="text-xl md:text-2xl font-bold text-text-primary leading-snug">
              Des libertins près de {location} vous attendent
            </h3>
            <p className="text-text-secondary mt-2 leading-relaxed">
              Échangez avant d&apos;aller en club. Sur{' '}
              <strong className="text-text-primary">{partner.label}</strong>, {partner.pitch}.
            </p>

            <ul className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4">
              {partner.benefits.slice(0, 3).map((b) => (
                <li key={b.label} className="flex items-center gap-1.5 text-text-secondary text-sm">
                  <CheckIcon />
                  {b.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="shrink-0 text-center">
            <TrackedAffiliateLink
              href={partner.url}
              target={partner.target}
              block="bloc-libertin"
              className="group inline-flex items-center justify-center gap-2.5 w-full lg:w-auto px-8 py-4 rounded-xl bg-gradient-gold text-bg-primary font-bold text-lg whitespace-nowrap shadow-lg shadow-accent-primary/25 hover:shadow-xl hover:shadow-accent-primary/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              {partner.ctaLabel}
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </TrackedAffiliateLink>
            <p className="text-text-muted text-xs mt-2">{partner.priceNote}</p>
            <p className="mt-3 text-xs">
              <EditorialLink partner={partner} seed={`compact-${location}`} />
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-accent-primary/45 bg-gradient-to-br from-accent-primary/25 via-bg-secondary to-bg-secondary p-7 md:p-10">
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-accent-primary/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-accent-primary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <PartnerBadge partner={partner} />
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
            <LivePulse />
            <span className="text-green-300 text-sm font-semibold">
              Profils actifs près de {location}
            </span>
          </span>
        </div>

        <PartnerBrand partner={partner} height={26} className="mb-4 opacity-90" />

        <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4 leading-tight">
          Ne partez pas seul(e) au club
        </h3>

        <p className="text-text-secondary text-lg leading-relaxed mb-6 max-w-2xl">
          Arriver dans un club sans connaître personne, c&apos;est ce qui fait renoncer la plupart
          des débutants. Sur <strong className="text-text-primary">{partner.label}</strong>, vous
          discutez d&apos;abord, vous vérifiez les affinités, et vous vous retrouvez sur place.{' '}
          <strong className="text-text-primary">{partner.hook}.</strong>
        </p>

        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mb-7 max-w-2xl">
          {partner.benefits.map((b) => (
            <li key={b.label} className="flex items-start gap-2.5">
              <span className="mt-0.5">
                <CheckIcon />
              </span>
              <span className="text-text-secondary">
                <strong className="text-text-primary font-semibold">{b.label}</strong>
                <span className="block text-text-muted text-xs mt-0.5">{b.hint}</span>
              </span>
            </li>
          ))}
        </ul>

        <TrackedAffiliateLink
          href={partner.url}
          target={partner.target}
          block="bloc-libertin"
          className="group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-gold text-bg-primary font-bold text-lg md:text-xl shadow-xl shadow-accent-primary/30 hover:shadow-2xl hover:shadow-accent-primary/45 hover:-translate-y-0.5 transition-all duration-200"
        >
          {partner.ctaLabel}
          <svg
            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </TrackedAffiliateLink>

        <p className="text-text-muted text-xs mt-3">
          Inscription en 2 minutes · {partner.priceNote} · Lien partenaire
        </p>

        <p className="mt-4 text-sm">
          <EditorialLink partner={partner} seed={`club-${location}`} />
        </p>
      </div>
    </section>
  );
}
