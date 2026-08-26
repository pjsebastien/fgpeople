'use client';

/**
 * Bloc CTA libertin — pages régions, départements, villes et fiches clubs.
 *
 * Partenaire : Gleese (voir lib/config/affiliates.ts).
 * L'accroche s'appuie sur le seul argument que la concurrence n'a pas et qui
 * lève l'objection principale : on peut tout essayer sans donner sa carte.
 * Aucune durée d'essai n'est annoncée, Gleese n'en publiant pas.
 */

import { LIBERTIN_AFFILIATE } from '@/lib/config/affiliates';
import { GleeseLogo } from './GleeseBanner';
import GleeseReviewLink from '@/components/site-reviews/GleeseReviewLink';
import { trackAffiliateClick } from '@/lib/utils/track-affiliate';

interface LibertinCTAProps {
  location: string;
  variant?: 'default' | 'compact';
}

const { url: AFFILIATE_URL, target: TARGET } = LIBERTIN_AFFILIATE;

/** Arguments vérifiés sur gleese.com le 14/08/2026. */
const BENEFITS = [
  { label: 'Sans carte bancaire', hint: 'aucun paiement à l’inscription' },
  { label: 'Profils vérifiés', hint: 'numéro de téléphone obligatoire' },
  { label: 'Modération humaine', hint: 'photos contrôlées une à une' },
  { label: 'Site français', hint: 'données hébergées en France, RGPD' },
];

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

/**
 * Gleese a été lancé fin 2024. On l'affiche plutôt que de le taire : c'est
 * honnête, et sur une plateforme récente la communauté est moins saturée —
 * un argument réel pour ceux qui arrivent tôt.
 */
function NewBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary/15 border border-accent-primary/40">
      <span className="text-accent-primary text-xs font-bold tracking-wide">NOUVEAU</span>
      <span className="text-text-muted text-xs">lancé fin 2024</span>
    </span>
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

export default function LibertinCTA({ location, variant = 'default' }: LibertinCTAProps) {
  const onClick = () => trackAffiliateClick(TARGET, 'bloc-libertin');

  if (variant === 'compact') {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-accent-primary/40 bg-gradient-to-br from-accent-primary/20 via-bg-secondary to-bg-secondary p-6 md:p-8">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <NewBadge />
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                <LivePulse />
                <span className="text-green-300 text-xs font-semibold tracking-wide">
                  Sans carte bancaire
                </span>
              </span>
            </div>

            <GleeseLogo height={22} className="mb-3 opacity-90" block="bloc-libertin" />

            <h3 className="text-xl md:text-2xl font-bold text-text-primary leading-snug">
              Des libertins près de {location} vous attendent
            </h3>
            <p className="text-text-secondary mt-2 leading-relaxed">
              Échangez avant d&apos;aller en club. Sur{' '}
              <strong className="text-text-primary">Gleese</strong>, le réseau libertin français,
              vous testez tout gratuitement, sans sortir votre carte.
            </p>

            <ul className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4">
              {BENEFITS.slice(0, 3).map((b) => (
                <li key={b.label} className="flex items-center gap-1.5 text-text-secondary text-sm">
                  <CheckIcon />
                  {b.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="shrink-0 text-center">
            <a
              href={AFFILIATE_URL}
              target="_blank"
              rel="nofollow sponsored noopener"
              onClick={onClick}
              className="group inline-flex items-center justify-center gap-2.5 w-full lg:w-auto px-8 py-4 rounded-xl bg-gradient-gold text-bg-primary font-bold text-lg whitespace-nowrap shadow-lg shadow-accent-primary/25 hover:shadow-xl hover:shadow-accent-primary/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Créer mon profil gratuitement
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
            </a>
            <p className="text-text-muted text-xs mt-2">
              Puis à partir de 3,75 €/mois, sans engagement
            </p>
            <p className="mt-3 text-xs">
              <GleeseReviewLink seed={`compact-${location}`} />
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
          <NewBadge />
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
            <LivePulse />
            <span className="text-green-300 text-sm font-semibold">
              Profils actifs près de {location}
            </span>
          </span>
        </div>

        <GleeseLogo height={26} className="mb-4 opacity-90" block="bloc-libertin" />

        <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4 leading-tight">
          Ne partez pas seul(e) au club
        </h3>

        <p className="text-text-secondary text-lg leading-relaxed mb-6 max-w-2xl">
          Arriver dans un club sans connaître personne, c&apos;est ce qui fait renoncer la plupart
          des débutants. Sur <strong className="text-text-primary">Gleese</strong>, vous discutez
          d&apos;abord, vous vérifiez les affinités, et vous vous retrouvez sur place.{' '}
          <strong className="text-text-primary">
            Tout est débloqué gratuitement, sans carte bancaire.
          </strong>
        </p>

        <p className="text-text-secondary leading-relaxed mb-6 max-w-2xl">
          C&apos;est une plateforme récente, lancée fin 2024, et c&apos;est justement
          l&apos;intérêt d&apos;y aller maintenant : la communauté se construit, il y a moins de
          monde sur chaque profil que sur les mastodontes installés depuis vingt ans.
        </p>

        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mb-7 max-w-2xl">
          {BENEFITS.map((b) => (
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

        <a
          href={AFFILIATE_URL}
          target="_blank"
          rel="nofollow sponsored noopener"
          onClick={onClick}
          className="group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-gold text-bg-primary font-bold text-lg md:text-xl shadow-xl shadow-accent-primary/30 hover:shadow-2xl hover:shadow-accent-primary/45 hover:-translate-y-0.5 transition-all duration-200"
        >
          Rejoindre Gleese gratuitement
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
        </a>

        <p className="text-text-muted text-xs mt-3">
          Inscription en 2 minutes · Puis à partir de 3,75 €/mois, sans engagement · Lien partenaire
        </p>
        <p className="mt-4 text-sm">
          Encore des doutes ? {' '}
          <GleeseReviewLink seed={`club-${location}`} />
        </p>
      </div>
    </section>
  );
}
