/**
 * Fiche club personnalisée - Server Component
 *
 * Conçue pour le parcours d'un visiteur venu de Google avec une question
 * précise : la réponse (ouvert ? quand ? combien ? qui peut entrer ?) tient
 * dans les blocs de lecture rapide en haut de page, le détail vient ensuite
 * en sections repliables, et les actions (itinéraire, appel, site, avis)
 * restent à portée de main. Un club fermé met d'abord en avant les
 * alternatives ouvertes, puis raconte son histoire.
 *
 * Contenu : data/clubs/profiles/<slug>.json (voir data/clubs/PLAYBOOK.md).
 */

import Link from 'next/link';
import type { Club } from '@/lib/types';
import type { LieuReviewsBundle } from '@/lib/types/reviews';
import type { ClubProfile } from '@/lib/types/club-profile';
import { parseTextWithFormatting } from '@/lib/utils/rich-text';
import NearbyClubs, { pres } from '@/components/clubs/profile/NearbyClubs';
import Breadcrumb from '@/components/ui/Breadcrumb';
import LibertinCTA from '@/components/ui/LibertinCTA';
import PartnerSidebarCard from '@/components/ui/PartnerSidebarCard';
import { BreadcrumbJsonLd, LocalBusinessJsonLd, FAQPageJsonLd } from '@/components/seo/JsonLd';
import { CLUB_IMAGES, getImageIndexForClub } from '@/components/clubs/ClubCard';
import EntityReviewsSection from '@/components/reviews/EntityReviewsSection';
import ProfileHero from '@/components/clubs/profile/ProfileHero';
import SectionCard from '@/components/clubs/profile/SectionCard';
import Icon, { equipmentIcon } from '@/components/clubs/profile/Icon';
import {
  AudienceCards,
  ClosedNotice,
  ConfidenceTag,
  GlanceGrid,
  Highlights,
  PracticalInfo,
  SectionHeading,
} from '@/components/clubs/profile/SkimBlocks';
import { deNom, directionsUrl, formatDate, formatPhone } from '@/components/clubs/profile/format';

interface ClubProfilePageProps {
  club: Club;
  profile: ClubProfile;
  clubsProximite: Club[];
  reviewsBundle: LieuReviewsBundle;
}

const LINK_LABEL = {
  site: 'Site officiel', facebook: 'Facebook', instagram: 'Instagram', x: 'X', galerie: 'Photos officielles',
  agenda: 'Agenda', reservation: 'Réservation', autre: 'Lien',
} as const;

function Disclosure({ summary, children, defaultOpen }: { summary: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group rounded-2xl bg-bg-secondary ring-1 ring-border" open={defaultOpen}>
      <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer flex items-center justify-between gap-4 p-4 sm:p-5 text-text-primary font-semibold">
        {summary}
        <Icon name="chevron" className="w-5 h-5 flex-shrink-0 text-text-muted transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-4 pb-5 sm:px-5">{children}</div>
    </details>
  );
}

export default function ClubProfilePage({ club, profile, clubsProximite, reviewsBundle: bundle }: ClubProfilePageProps) {
  const sourceIndex = new Map(profile.sources.map((s, i) => [s.id, i + 1]));
  const closed = profile.status.value === 'ferme' || profile.status.value === 'fermeture_probable';
  // Alternatives : le département d'abord ; la région seulement s'il en manque.
  const candidates = clubsProximite.filter((c) => c.status !== 'probablement_ferme');
  const sameDept = candidates.filter((c) => c.departementSlug === club.departementSlug);
  const alternatives = (sameDept.length >= 3 ? sameDept : [...sameDept, ...candidates.filter((c) => c.departementSlug !== club.departementSlug)]).slice(0, 6);
  const practical = profile.horaires || profile.tarifs;
  const gallery = profile.officialLinks?.find((l) => l.kind === 'galerie');
  const otherLinks = (profile.officialLinks || []).filter((l) => l.url !== club.site_web);

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: club.region, url: `/region/${club.regionSlug}` },
    { name: `${club.departement_nom} (${club.departement_code})`, url: `/departement/${club.departementSlug}` },
    { name: club.ville, url: `/ville/${club.villeSlug}` },
    { name: club.nom, url: `/${club.slug}` },
  ];

  const nav = [
    ...(closed && alternatives.length ? [{ id: 'alternatives', label: 'Où sortir' }] : []),
    { id: 'essentiel', label: 'L\'essentiel' },
    ...(practical ? [{ id: 'infos-pratiques', label: closed ? 'Horaires (archives)' : 'Horaires & tarifs' }] : []),
    { id: 'details', label: closed ? 'Son histoire' : 'En détail' },
    { id: 'avis', label: 'Avis' },
    ...(profile.faq.length ? [{ id: 'faq', label: 'Questions' }] : []),
    ...(!closed && alternatives.length ? [{ id: 'alternatives', label: 'À proximité' }] : []),
  ];

  const alternativesBlock = alternatives.length > 0 && (
    <NearbyClubs
      clubs={alternatives}
      title={closed ? `Où sortir ${pres(club.ville)} aujourd'hui` : `Autres lieux libertins ${pres(club.ville)}`}
      ville={club.ville}
      villeSlug={club.villeSlug}
      departement={club.departement_nom}
      departementSlug={club.departementSlug}
    />
  );

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <LocalBusinessJsonLd club={club} reviewsBundle={bundle} />
      {club.seo.faq.length > 0 && <FAQPageJsonLd faq={club.seo.faq} />}

      <main className="pb-16">
        <div className="container-custom pt-4 md:pt-6">
          <Breadcrumb items={breadcrumbItems} />
          <ProfileHero
            club={club}
            profile={profile}
            bundle={bundle}
            image={CLUB_IMAGES[getImageIndexForClub(club.nom)]}
            hasAlternatives={alternatives.length > 0}
          />
        </div>

        {/* Navigation interne, collée sous l'en-tête du site */}
        <nav aria-label="Dans cette fiche" className="sticky top-16 z-40 mt-6 bg-bg-primary/90 backdrop-blur border-y border-border">
          <div className="container-custom">
            <ul className="flex gap-2 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {nav.map((n) => (
                <li key={n.id} className="flex-shrink-0">
                  <a href={`#${n.id}`} className="block px-3.5 py-1.5 rounded-full text-sm font-medium text-text-secondary bg-white/5 ring-1 ring-inset ring-white/10 hover:text-text-primary hover:bg-white/10">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="container-custom mt-8 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 xl:gap-12">
          <div className="min-w-0 space-y-12">
            {closed && (
              <>
                <ClosedNotice profile={profile} />
                {alternativesBlock}
              </>
            )}

            {/* L'essentiel */}
            <section className="space-y-4">
              <SectionHeading id="essentiel" kicker="En un coup d'œil" title={closed ? `${club.nom} en bref` : `L'essentiel sur ${club.nom}`} />
              {profile.glance && <GlanceGrid items={profile.glance} />}
              {profile.audience && profile.audience.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-lg font-semibold text-text-primary mb-3">{closed ? 'Qui pouvait entrer ?' : 'Qui peut entrer ?'}</h3>
                  <AudienceCards items={profile.audience} past={closed} />
                </div>
              )}
              {profile.highlights && profile.highlights.length > 0 && (
                <div className="pt-4">
                  <Highlights items={profile.highlights} closed={closed} />
                </div>
              )}
            </section>

            {practical && (
              <section className="space-y-4">
                <SectionHeading
                  id="infos-pratiques"
                  kicker={closed ? 'Archives' : 'Infos pratiques'}
                  title={closed ? `Horaires et tarifs ${deNom(club.nom)} à l'époque` : `Horaires et tarifs ${deNom(club.nom)}`}
                />
                <PracticalInfo profile={profile} />
                <SourceList ids={[...(profile.horaires?.sources || []), ...(profile.tarifs?.sources || [])]} index={sourceIndex} />
              </section>
            )}

            <LibertinCTA location={club.ville} />

            {/* Le détail, section par section */}
            <section className="space-y-4">
              <SectionHeading id="details" kicker={closed ? 'Son histoire' : 'En détail'} title={`Tout savoir sur ${club.nom}`} />
              {profile.sections.length >= 4 && (
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mb-2">
                  {profile.sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="flex items-start gap-2 py-1 text-sm text-text-secondary hover:text-accent-primary">
                        <Icon name={s.icon || 'info'} className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent-primary/80" />
                        <span>{s.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {profile.sections.map((s) => <SectionCard key={s.id} section={s} sourceIndex={sourceIndex} />)}
            </section>

            {(profile.equipements?.length || gallery) && (
              <section className="space-y-4">
                <SectionHeading kicker="Sur place" title={closed ? `Les équipements ${deNom(club.nom)}` : `Équipements et photos ${deNom(club.nom)}`} />
                {profile.equipements && profile.equipements.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profile.equipements.map((eq) => (
                      <span key={eq} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-secondary ring-1 ring-border text-sm text-text-primary/90">
                        <Icon name={equipmentIcon(eq)} className="w-4 h-4 text-accent-primary" />
                        {eq}
                      </span>
                    ))}
                  </div>
                )}
                {gallery && (
                  <a href={gallery.url} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center justify-between gap-4 rounded-2xl bg-bg-secondary ring-1 ring-border p-4 hover:ring-accent-primary/40">
                    <span className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-accent-primary/10 text-accent-primary grid place-items-center"><Icon name="camera" /></span>
                      <span>
                        <span className="block font-semibold text-text-primary">{gallery.label}</span>
                        <span className="block text-xs text-text-muted">Galerie publiée par le club, sur son site</span>
                      </span>
                    </span>
                    <Icon name="external" className="w-5 h-5 text-text-muted" />
                  </a>
                )}
              </section>
            )}

            {profile.externalRatings && profile.externalRatings.length > 0 && (
              <section className="space-y-4">
                <SectionHeading kicker="Réputation" title="Les notes publiques ailleurs" />
                <div className="grid sm:grid-cols-2 gap-3">
                  {profile.externalRatings.map((r) => (
                    <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer nofollow" className="rounded-2xl bg-bg-secondary ring-1 ring-border p-4 hover:ring-accent-primary/40">
                      <p className="text-sm text-text-secondary">{r.platform}</p>
                      <p className="mt-1 text-2xl font-bold text-accent-primary">
                        {r.rating.toLocaleString('fr-FR')}<span className="text-base text-text-muted font-medium">/{r.scale}</span>
                      </p>
                      <p className="text-xs text-text-muted">{r.count} avis · relevé le {formatDate(r.date, true)}</p>
                    </a>
                  ))}
                </div>
              </section>
            )}

            <EntityReviewsSection
              entityType="club"
              entityId={club.id}
              entitySlug={club.slug}
              villeSlug={club.villeSlug}
              entityName={club.nom}
              bundle={bundle}
            />

            {profile.faq.length > 0 && (
              <section className="space-y-4">
                <SectionHeading id="faq" kicker="Vos questions" title={`Questions fréquentes sur ${club.nom}`} />
                <div className="space-y-2">
                  {profile.faq.map((item, i) => (
                    <details key={i} className="group rounded-2xl bg-bg-secondary ring-1 ring-border" open={i === 0}>
                      <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer flex items-center justify-between gap-4 p-4 sm:p-5">
                        <h3 className="text-[15px] sm:text-base font-semibold text-text-primary">{item.question}</h3>
                        <Icon name="chevron" className="w-5 h-5 flex-shrink-0 text-text-muted transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="px-4 pb-5 sm:px-5 text-[15px] leading-7 text-text-secondary">{parseTextWithFormatting(item.answer)}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Compléments : fiche d'identité, points ouverts, sources */}
            <section className="space-y-3">
              {profile.keyFacts.length > 0 && (
                <Disclosure summary={<span className="flex items-center gap-2"><Icon name="building" className="w-5 h-5 text-accent-primary" />Fiche d&apos;identité complète</span>}>
                  <dl className="grid sm:grid-cols-2 gap-x-6">
                    {profile.keyFacts.map((f) => (
                      <div key={f.label} className="py-2.5 border-b border-border">
                        <dt className="text-[11px] uppercase tracking-wider text-text-muted">{f.label}</dt>
                        <dd className="mt-0.5 text-sm text-text-primary">{parseTextWithFormatting(f.value)}<ConfidenceTag value={f.confidence} /></dd>
                      </div>
                    ))}
                  </dl>
                </Disclosure>
              )}
              {profile.unverified && profile.unverified.length > 0 && (
                <Disclosure summary={<span className="flex items-center gap-2"><Icon name="question" className="w-5 h-5 text-amber-300" />Ce que nous n&apos;avons pas pu vérifier ({profile.unverified.length})</span>}>
                  <ul className="space-y-2">
                    {profile.unverified.map((u, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-text-secondary">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-300/70 flex-shrink-0" />
                        <span>{parseTextWithFormatting(u)}</span>
                      </li>
                    ))}
                  </ul>
                  {!closed && (
                    <p className="mt-4 text-xs text-text-muted">
                      Vous connaissez le lieu ? <a href="#avis" className="text-accent-primary hover:underline">Laissez un avis</a> ou{' '}
                      <Link href="/contact" className="text-accent-primary hover:underline">signalez une correction</Link>.
                    </p>
                  )}
                </Disclosure>
              )}
              <div id="sources" className="scroll-mt-32">
                <Disclosure summary={<span className="flex items-center gap-2"><Icon name="shield" className="w-5 h-5 text-accent-primary" />Sources et méthode ({profile.sources.length})</span>}>
                  <p className="text-sm text-text-muted mb-3">
                    Fiche rédigée par la rédaction FG People à partir des sources publiques ci-dessous, consultées
                    entre le {formatDate(profile.sources.map((s) => s.consulted).sort()[0])} et le {formatDate(profile.researchedAt)}.
                    Les informations marquées « à vérifier » ou « source unique » n&apos;ont pas pu être recoupées.
                  </p>
                  <ol className="space-y-1.5 text-sm">
                    {profile.sources.map((s, i) => (
                      <li key={s.id} id={`source-${i + 1}`} className="scroll-mt-32 text-text-secondary">
                        <span className="text-text-muted">[{i + 1}]</span>{' '}
                        <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="hover:text-accent-primary underline decoration-border underline-offset-2">{s.label}</a>
                        <span className="text-text-muted"> · {formatDate(s.consulted, true)}</span>
                      </li>
                    ))}
                  </ol>
                </Disclosure>
              </div>
              <p className="text-xs text-text-muted px-1">
                Liens partenaires : les liens vers Wyylde, Carré Libertin et Gleese présents dans cette fiche sont rémunérés.
                FG People peut percevoir une commission en cas d&apos;inscription, sans incidence sur les informations publiées sur ce club.
              </p>
            </section>

            {!closed && alternativesBlock}
          </div>

          {/* Colonne latérale (ordinateur) : l'essentiel pratique toujours visible */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-6">
              <div className="rounded-2xl bg-bg-secondary ring-1 ring-border p-5">
                <p className="font-semibold text-text-primary">{closed ? 'Coordonnées (archives)' : 'Infos pratiques'}</p>
                <div className="mt-4 space-y-3 text-sm">
                  <p className="flex items-start gap-2.5 text-text-secondary">
                    <Icon name="map" className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent-primary" />
                    <span>{club.adresse && <>{club.adresse}<br /></>}{club.code_postal} {club.ville}</span>
                  </p>
                  {club.telephone && (
                    <a href={`tel:${club.telephone.replace(/\s/g, '')}`} className="flex items-center gap-2.5 text-text-secondary hover:text-accent-primary">
                      <Icon name="phone" className="w-4 h-4 text-accent-primary" /> {formatPhone(club.telephone)}
                    </a>
                  )}
                  {club.email && (
                    <a href={`mailto:${club.email}`} className="flex items-center gap-2.5 text-text-secondary hover:text-accent-primary truncate">
                      <Icon name="info" className="w-4 h-4 text-accent-primary" /> {club.email}
                    </a>
                  )}
                </div>
                {!closed && (
                  <div className="mt-5 grid gap-2">
                    {club.adresse && (
                      <a href={directionsUrl(club)} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-accent-primary text-black text-sm font-semibold hover:bg-accent-hover hover:text-black">
                        <Icon name="route" className="w-4 h-4" /> Itinéraire
                      </a>
                    )}
                    {club.site_web && club.websiteAccessible !== false && (
                      <a href={club.site_web} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-white/5 ring-1 ring-inset ring-white/10 text-text-primary text-sm font-semibold hover:bg-white/10">
                        <Icon name="globe" className="w-4 h-4" /> Site officiel
                      </a>
                    )}
                  </div>
                )}
                {otherLinks.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {otherLinks.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer nofollow" className="px-2.5 py-1 rounded-full text-xs bg-white/5 ring-1 ring-white/10 text-text-secondary hover:text-accent-primary">
                        {l.kind === 'autre' ? (l.label.length > 22 ? `${l.label.slice(0, 21)}…` : l.label) : LINK_LABEL[l.kind]}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <nav aria-label="Sections de la fiche" className="rounded-2xl bg-bg-secondary ring-1 ring-border p-5">
                <p className="font-semibold text-text-primary mb-3">Dans cette fiche</p>
                <ul className="space-y-1.5">
                  {profile.sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="flex items-start gap-2 text-sm text-text-secondary hover:text-accent-primary">
                        <Icon name={s.icon || 'info'} className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent-primary/70" />
                        <span className="line-clamp-2">{s.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <PartnerSidebarCard block="colonne-club" />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

function SourceList({ ids, index }: { ids: string[]; index: Map<string, number> }) {
  const nums = Array.from(new Set(ids.map((id) => index.get(id)).filter((n): n is number => !!n))).sort((a, b) => a - b);
  if (!nums.length) return null;
  return (
    <p className="text-xs text-text-muted">
      Sources{' '}
      {nums.map((n, i) => (
        <span key={n}>{i > 0 && ' '}<a href={`#source-${n}`} className="hover:text-accent-primary">[{n}]</a></span>
      ))}
    </p>
  );
}
