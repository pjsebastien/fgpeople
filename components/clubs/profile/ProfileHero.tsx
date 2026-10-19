/**
 * En-tête de la fiche club : tout ce qu'un visiteur venu de Google veut
 * savoir en premier (le lieu existe-t-il encore, où est-il, que vaut-il) et
 * les actions qui en découlent (y aller, appeler, consulter le site).
 */

import Image from 'next/image';
import type { Club } from '@/lib/types';
import type { LieuReviewsBundle } from '@/lib/types/reviews';
import type { ClubProfile } from '@/lib/types/club-profile';
import { parseTextWithFormatting } from '@/lib/utils/rich-text';
import ReviewSummary from '@/components/reviews/ReviewSummary';
import Icon from './Icon';
import { directionsUrl, formatDate, formatPhone } from './format';

const STATUS = {
  ouvert: { label: 'Ouvert', dot: 'bg-emerald-400', className: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30' },
  ferme: { label: 'Fermé', dot: 'bg-rose-400', className: 'bg-rose-500/15 text-rose-300 ring-rose-500/30' },
  fermeture_probable: { label: 'Probablement fermé', dot: 'bg-rose-400', className: 'bg-rose-500/15 text-rose-300 ring-rose-500/30' },
  incertain: { label: 'Activité non confirmée', dot: 'bg-amber-400', className: 'bg-amber-500/15 text-amber-300 ring-amber-500/30' },
} as const;

interface ProfileHeroProps {
  club: Club;
  profile: ClubProfile;
  bundle: LieuReviewsBundle;
  image: string;
  hasAlternatives: boolean;
}

const btn = 'inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-sm font-semibold transition-colors';
const btnGhost = `${btn} bg-white/5 text-text-primary ring-1 ring-inset ring-white/10 hover:bg-white/10 hover:text-text-primary`;

export default function ProfileHero({ club, profile, bundle, image, hasAlternatives }: ProfileHeroProps) {
  const status = STATUS[profile.status.value];
  const closed = profile.status.value === 'ferme' || profile.status.value === 'fermeture_probable';
  const showSite = !closed && club.site_web && club.websiteAccessible !== false;

  return (
    <section className="relative overflow-hidden rounded-3xl ring-1 ring-border bg-bg-secondary">
      {/* Illustration : bandeau en haut sur mobile, moitié droite fondue sur ordinateur. */}
      <div className="relative h-48 sm:h-60 md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[46%]">
        <Image src={image} alt="" fill priority sizes="(max-width: 768px) 100vw, 46vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-bg-secondary/30 to-transparent md:bg-gradient-to-r md:from-bg-secondary md:via-bg-secondary/40 md:to-transparent" />
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/45 text-[10px] text-white/75">Illustration</span>
      </div>
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-accent-primary/10 blur-3xl" />

      <div className="relative -mt-16 md:mt-0 px-5 pb-6 sm:px-8 sm:pb-8 md:px-10 md:pt-10 md:max-w-[64%]">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${status.className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${profile.status.value === 'ouvert' ? 'animate-pulse' : ''}`} />
            {status.label}
          </span>
          {club.types.slice(0, 3).map((t) => (
            <span key={t.slug} className="px-3 py-1 rounded-full text-xs font-medium text-text-secondary bg-white/5 ring-1 ring-inset ring-white/10">
              {t.label}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary">{club.nom}</h1>
        {profile.seo.subtitle && (
          <p className="mt-2 text-base sm:text-lg text-accent-primary/90 font-medium max-w-3xl">{profile.seo.subtitle}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="map" className="w-4 h-4 text-accent-primary" />
            {club.adresse ? `${club.adresse}, ` : ''}{club.code_postal} {club.ville}
          </span>
          {bundle.aggregate.count > 0 ? (
            <a href="#avis" className="inline-flex items-center hover:opacity-80">
              <ReviewSummary aggregate={bundle.aggregate} variant="inline" size={14} />
            </a>
          ) : (
            <a href="#avis" className="inline-flex items-center gap-1.5 text-accent-primary hover:underline">
              <Icon name="star" className="w-4 h-4" /> Soyez le premier à donner votre avis
            </a>
          )}
        </div>

        <p className="mt-5 max-w-3xl text-[15px] sm:text-base leading-7 text-text-primary/85">
          {parseTextWithFormatting(profile.lead)}
        </p>

        <div className="mt-6 grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          {closed ? (
            hasAlternatives && (
              <a href="#alternatives" className={`${btn} col-span-2 bg-accent-primary text-black hover:bg-accent-hover hover:text-black`}>
                <Icon name="map" className="w-4 h-4" /> Où sortir à proximité
              </a>
            )
          ) : (
            club.adresse && (
              <a href={directionsUrl(club)} target="_blank" rel="noopener noreferrer nofollow" className={`${btn} bg-accent-primary text-black hover:bg-accent-hover hover:text-black`}>
                <Icon name="route" className="w-4 h-4" /> Itinéraire
              </a>
            )
          )}
          {!closed && club.telephone && (
            <a href={`tel:${club.telephone.replace(/\s/g, '')}`} className={btnGhost}>
              <Icon name="phone" className="w-4 h-4" /> {formatPhone(club.telephone)}
            </a>
          )}
          {showSite && (
            <a href={club.site_web} target="_blank" rel="noopener noreferrer nofollow" className={btnGhost}>
              <Icon name="globe" className="w-4 h-4" /> Site officiel
            </a>
          )}
          <a href="#avis" className={btnGhost}>
            <Icon name="star" className="w-4 h-4" /> Avis
          </a>
        </div>

        <p className="mt-5 text-xs text-text-muted">
          Fiche vérifiée le {formatDate(profile.researchedAt)} à partir de {profile.sources.length} sources · images d&apos;illustration, non contractuelles
        </p>
      </div>
    </section>
  );
}
