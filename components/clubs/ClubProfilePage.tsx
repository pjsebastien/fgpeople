/**
 * Fiche club personnalisée - Server Component
 *
 * Rendu d'une fiche rédigée (data/clubs/profiles/<slug>.json) : la structure
 * suit celle de la fiche, section par section, sans contenu généré. Chaque
 * section renvoie à ses sources, numérotées en bas de page.
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Club } from '@/lib/types';
import type { LieuReviewsBundle } from '@/lib/types/reviews';
import type { ClubProfile, Confidence, ProfileBlock, ProfileSection } from '@/lib/types/club-profile';
import { RichText, parseTextWithFormatting } from '@/lib/utils/rich-text';
import ClubList from '@/components/clubs/ClubList';
import ClubSidebar from '@/components/clubs/ClubSidebar';
import Breadcrumb from '@/components/ui/Breadcrumb';
import LibertinCTA from '@/components/ui/LibertinCTA';
import { BreadcrumbJsonLd, LocalBusinessJsonLd, FAQPageJsonLd } from '@/components/seo/JsonLd';
import { CLUB_IMAGES, getImageIndexForClub } from '@/components/clubs/ClubCard';
import EntityReviewsSection from '@/components/reviews/EntityReviewsSection';
import ReviewSummary from '@/components/reviews/ReviewSummary';

interface ClubProfilePageProps {
  club: Club;
  profile: ClubProfile;
  clubsProximite: Club[];
  reviewsBundle: LieuReviewsBundle;
}

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d === 1 ? '1er' : d} ${MONTHS[m - 1]} ${y}`;
}

const STATUS_BADGE: Record<ClubProfile['status']['value'], { label: string; className: string }> = {
  ouvert: { label: 'En activité', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  ferme: { label: 'Fermé', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  fermeture_probable: { label: 'Fermeture probable', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  incertain: { label: 'Activité non confirmée', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
};

function ConfidenceTag({ value }: { value?: Confidence }) {
  if (value === 'a_verifier') {
    return <span className="ml-2 px-1.5 py-0.5 text-[11px] rounded bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 align-middle whitespace-nowrap">à vérifier</span>;
  }
  if (value === 'source_unique') {
    return <span className="ml-2 px-1.5 py-0.5 text-[11px] rounded bg-bg-tertiary text-text-muted border border-border align-middle whitespace-nowrap">source unique</span>;
  }
  return null;
}

function SourceRefs({ ids, index }: { ids: string[]; index: Map<string, number> }) {
  const nums = ids.map((id) => index.get(id)).filter((n): n is number => !!n).sort((a, b) => a - b);
  if (!nums.length) return null;
  return (
    <p className="text-text-muted text-xs mt-4">
      Sources :{' '}
      {nums.map((n, i) => (
        <span key={n}>
          {i > 0 && ', '}
          <a href={`#source-${n}`} className="hover:text-accent-primary">[{n}]</a>
        </span>
      ))}
    </p>
  );
}

const CALLOUT_STYLE = {
  info: 'bg-accent-primary/10 border-accent-primary/30',
  tip: 'bg-green-500/10 border-green-500/30',
  warning: 'bg-yellow-500/10 border-yellow-500/30',
};

function Block({ block }: { block: ProfileBlock }) {
  switch (block.kind) {
    case 'text':
      return <RichText body={block.body} />;
    case 'list':
      return (
        <div className="mb-4">
          {block.title && <h3 className="text-text-primary font-medium mb-2">{block.title}</h3>}
          <ul className="space-y-2">
            {block.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-2.5 flex-shrink-0" />
                <span>{parseTextWithFormatting(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'table':
      return (
        <div className="mb-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            {block.caption && <caption className="text-left text-text-muted text-xs mb-2">{block.caption}</caption>}
            <thead>
              <tr>
                {block.headers.map((h) => (
                  <th key={h} className="text-left text-text-primary font-medium p-2 border-b border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  {row.map((cell, j) => (
                    <td key={j} className={`p-2 align-top ${j === 0 ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {parseTextWithFormatting(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'callout':
      return (
        <div className={`mb-4 p-4 rounded-lg border ${CALLOUT_STYLE[block.tone]}`}>
          {block.title && <p className="text-text-primary font-medium mb-1">{block.title}</p>}
          <RichText body={block.body} className="[&_p:last-child]:mb-0" />
        </div>
      );
    case 'timeline':
      return (
        <ol className="mb-4 border-l border-accent-primary/40 ml-2 space-y-4">
          {block.items.map((item, i) => (
            <li key={i} className="pl-5 relative">
              <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent-primary" />
              <p className="text-accent-primary text-sm font-semibold">{item.date}</p>
              <p className="text-text-secondary">{parseTextWithFormatting(item.text)}</p>
            </li>
          ))}
        </ol>
      );
  }
}

function Section({ section, sourceIndex }: { section: ProfileSection; sourceIndex: Map<string, number> }) {
  return (
    <section id={section.id} className="bg-bg-secondary rounded-xl border border-border p-6 scroll-mt-20">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        {section.title}
        <ConfidenceTag value={section.confidence} />
      </h2>
      {section.blocks.map((b, i) => <Block key={i} block={b} />)}
      <SourceRefs ids={section.sources} index={sourceIndex} />
    </section>
  );
}

function KeyValueTable({ rows }: { rows: Record<string, string> }) {
  return (
    <div className="space-y-1">
      {Object.entries(rows).map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 py-2 border-b border-border last:border-0">
          <span className="text-text-primary font-medium first-letter:uppercase">{k}</span>
          <span className="text-text-secondary text-right">{v}</span>
        </div>
      ))}
    </div>
  );
}

export default function ClubProfilePage({ club, profile, clubsProximite, reviewsBundle: bundle }: ClubProfilePageProps) {
  const sourceIndex = new Map(profile.sources.map((s, i) => [s.id, i + 1]));
  const status = STATUS_BADGE[profile.status.value];
  const closed = profile.status.value === 'ferme' || profile.status.value === 'fermeture_probable';
  const heroImage = CLUB_IMAGES[getImageIndexForClub(club.nom)];
  const gallery = profile.officialLinks?.find((l) => l.kind === 'galerie');

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: club.region, url: `/region/${club.regionSlug}` },
    { name: `${club.departement_nom} (${club.departement_code})`, url: `/departement/${club.departementSlug}` },
    { name: club.ville, url: `/ville/${club.villeSlug}` },
    { name: club.nom, url: `/${club.slug}` },
  ];

  // Le bandeau partenaire s'insère après la deuxième section : le visiteur a
  // déjà l'essentiel sur le club. Il est retiré des fiches de clubs fermés.
  const ctaAfter = Math.min(2, profile.sections.length);
  const practical = profile.horaires || profile.tarifs;
  const toc = [
    ...profile.sections.map((s) => ({ id: s.id, title: s.title })),
    ...(practical ? [{ id: 'infos-pratiques', title: 'Horaires et tarifs' }] : []),
    ...(profile.faq.length ? [{ id: 'faq', title: 'Questions fréquentes' }] : []),
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <LocalBusinessJsonLd club={club} reviewsBundle={bundle} />
      {club.seo.faq.length > 0 && <FAQPageJsonLd faq={club.seo.faq} />}

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          <header className="mb-8">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary">{club.nom}</h1>
                <p className="text-accent-primary font-medium mt-2 text-lg">
                  {profile.seo.subtitle || `${club.type} à ${club.ville}`}
                </p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${status.className}`}>
                {status.label}
              </span>
            </div>

            <div className="flex items-center gap-2 text-text-secondary">
              <svg className="w-5 h-5 text-accent-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <address className="not-italic">
                {club.adresse && `${club.adresse}, `}
                {club.code_postal} {club.ville} - {club.departement_nom} ({club.departement_code})
              </address>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              {bundle.aggregate.count > 0 ? (
                <a href="#avis" className="inline-flex items-center hover:opacity-80 transition-opacity">
                  <ReviewSummary aggregate={bundle.aggregate} variant="inline" size={16} />
                </a>
              ) : (
                <a href="#avis" className="text-accent-primary hover:underline">
                  Donne ton avis (anonyme, sans inscription)
                </a>
              )}
              <span className="text-text-muted">
                Fiche vérifiée le {formatDate(profile.researchedAt)} · {profile.sources.length} source{profile.sources.length > 1 ? 's' : ''}
              </span>
            </div>
          </header>

          {closed && (
            <div className="mb-8 p-5 rounded-xl border bg-red-500/10 border-red-500/30">
              <p className="text-red-400 font-semibold mb-1">
                {profile.status.value === 'ferme' ? 'Cet établissement a fermé' : 'Cet établissement semble avoir fermé'}
              </p>
              <p className="text-text-secondary">{parseTextWithFormatting(profile.status.summary)}</p>
              {clubsProximite.length > 0 && (
                <a href="#alternatives" className="inline-block mt-3 text-accent-primary hover:underline">
                  Voir les clubs ouverts à proximité
                </a>
              )}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Chapô */}
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="relative w-full sm:w-56 aspect-[4/3] flex-shrink-0 rounded-xl overflow-hidden bg-bg-secondary">
                  <Image
                    src={heroImage}
                    alt={`Illustration — ${club.nom}, ${club.type} à ${club.ville}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 224px"
                    priority
                  />
                  <span className="absolute bottom-1 right-2 text-[10px] text-white/70">Image d&apos;illustration</span>
                </div>
                <div>
                  <p className="text-text-primary text-lg leading-relaxed">{parseTextWithFormatting(profile.lead)}</p>
                  {gallery && (
                    <a
                      href={gallery.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-block mt-3 text-accent-primary hover:underline text-sm"
                    >
                      {gallery.label} ↗
                    </a>
                  )}
                </div>
              </div>

              {/* En bref */}
              {profile.keyFacts.length > 0 && (
                <section className="bg-bg-secondary rounded-xl border border-border p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-4">{club.nom} en bref</h2>
                  <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                    {profile.keyFacts.map((f) => (
                      <div key={f.label} className="border-b border-border pb-2">
                        <dt className="text-text-muted text-xs uppercase tracking-wide">{f.label}</dt>
                        <dd className="text-text-primary">
                          {parseTextWithFormatting(f.value)}
                          <ConfidenceTag value={f.confidence} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {/* Sommaire */}
              {toc.length >= 4 && (
                <nav aria-label="Sommaire" className="bg-bg-secondary rounded-xl border border-border p-6">
                  <p className="text-text-primary font-semibold mb-3">Sommaire</p>
                  <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1 list-decimal list-inside text-sm">
                    {toc.map((t) => (
                      <li key={t.id} className="text-text-muted">
                        <a href={`#${t.id}`} className="text-text-secondary hover:text-accent-primary">{t.title}</a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {profile.sections.slice(0, ctaAfter).map((s) => (
                <Section key={s.id} section={s} sourceIndex={sourceIndex} />
              ))}

              {!closed && <LibertinCTA location={club.ville} />}

              {practical && (
                <section id="infos-pratiques" className="bg-bg-secondary rounded-xl border border-border p-6 scroll-mt-20">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">Horaires et tarifs de {club.nom}</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {profile.horaires && (
                      <div>
                        <h3 className="text-text-primary font-medium mb-2">
                          Horaires
                          <ConfidenceTag value={profile.horaires.confidence} />
                        </h3>
                        <KeyValueTable rows={profile.horaires.rows} />
                        {profile.horaires.note && <p className="text-text-muted text-sm mt-2">{parseTextWithFormatting(profile.horaires.note)}</p>}
                      </div>
                    )}
                    {profile.tarifs && (
                      <div>
                        <h3 className="text-text-primary font-medium mb-2">
                          Tarifs
                          <ConfidenceTag value={profile.tarifs.confidence} />
                        </h3>
                        <KeyValueTable rows={profile.tarifs.rows} />
                        {profile.tarifs.note && <p className="text-text-muted text-sm mt-2">{parseTextWithFormatting(profile.tarifs.note)}</p>}
                      </div>
                    )}
                  </div>
                  <SourceRefs ids={[...(profile.horaires?.sources || []), ...(profile.tarifs?.sources || [])]} index={sourceIndex} />
                </section>
              )}

              {profile.sections.slice(ctaAfter).map((s) => (
                <Section key={s.id} section={s} sourceIndex={sourceIndex} />
              ))}

              {profile.equipements && profile.equipements.length > 0 && (
                <section className="bg-bg-secondary rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">Équipements recensés</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.equipements.map((eq) => (
                      <span key={eq} className="px-3 py-1.5 bg-bg-tertiary border border-border rounded-full text-sm text-text-secondary">{eq}</span>
                    ))}
                  </div>
                </section>
              )}

              {profile.externalRatings && profile.externalRatings.length > 0 && (
                <section className="bg-bg-secondary rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-2">Notes publiques sur d&apos;autres plateformes</h2>
                  <p className="text-text-muted text-sm mb-4">Relevés tels qu&apos;affichés à la date indiquée ; ils évoluent en continu.</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {profile.externalRatings.map((r) => (
                      <a
                        key={r.url}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="p-4 bg-bg-tertiary rounded-lg border border-border hover:border-accent-primary/30 transition-colors"
                      >
                        <p className="text-text-primary font-medium">{r.platform}</p>
                        <p className="text-accent-primary text-lg font-semibold">
                          {r.rating.toLocaleString('fr-FR')}/{r.scale}
                          <span className="text-text-muted text-sm font-normal"> · {r.count} avis</span>
                        </p>
                        <p className="text-text-muted text-xs">relevé le {formatDate(r.date)}</p>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {profile.faq.length > 0 && (
                <section id="faq" className="bg-bg-secondary rounded-xl border border-border p-6 scroll-mt-20">
                  <h2 className="text-xl font-semibold text-text-primary mb-6">Questions fréquentes sur {club.nom}</h2>
                  <div className="space-y-4">
                    {profile.faq.map((item, index) => (
                      <details key={index} className="group bg-bg-tertiary rounded-lg border border-border" open={index === 0}>
                        <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                          <h3 className="text-text-primary font-medium pr-4">{item.question}</h3>
                          <svg className="w-5 h-5 text-text-muted transition-transform group-open:rotate-180 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="px-4 pb-4">
                          <p className="text-text-secondary leading-relaxed">{parseTextWithFormatting(item.answer)}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {profile.unverified && profile.unverified.length > 0 && (
                <section className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-3">Ce que nous n&apos;avons pas pu vérifier</h2>
                  <ul className="space-y-2">
                    {profile.unverified.map((u, i) => (
                      <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                        <span className="text-yellow-400">?</span>
                        <span>{parseTextWithFormatting(u)}</span>
                      </li>
                    ))}
                  </ul>
                  {!closed && (
                    <p className="text-text-muted text-xs mt-4">
                      Vous connaissez le lieu ? <a href="#avis" className="text-accent-primary hover:underline">Laissez un avis</a> ou{' '}
                      <Link href="/contact" className="text-accent-primary hover:underline">signalez une correction</Link>.
                    </p>
                  )}
                </section>
              )}

              <p className="text-text-muted text-xs">
                Liens partenaires : les liens vers Wyylde, Carré Libertin et Gleese présents dans cette fiche sont
                rémunérés. FG People peut percevoir une commission en cas d&apos;inscription, sans incidence sur les
                informations publiées sur ce club.
              </p>

              <section id="sources" className="text-sm">
                <details className="bg-bg-secondary rounded-xl border border-border">
                  <summary className="p-4 cursor-pointer text-text-primary font-medium">
                    Sources et méthode ({profile.sources.length})
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-text-muted mb-3">
                      Fiche rédigée par la rédaction FG People à partir des sources publiques ci-dessous, consultées
                      entre le {formatDate(profile.sources.map((s) => s.consulted).sort()[0])} et le {formatDate(profile.researchedAt)}.
                      Les informations marquées « à vérifier » ou « source unique » n&apos;ont pas pu être recoupées.
                    </p>
                    <ol className="space-y-1">
                      {profile.sources.map((s, i) => (
                        <li key={s.id} id={`source-${i + 1}`} className="text-text-secondary scroll-mt-20">
                          [{i + 1}]{' '}
                          <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="hover:text-accent-primary underline decoration-border">
                            {s.label}
                          </a>
                          <span className="text-text-muted"> — consulté le {formatDate(s.consulted)}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </details>
              </section>
            </div>

            <ClubSidebar club={club} officialLinks={profile.officialLinks} />
          </div>

          <section className="mt-16 pt-12 border-t border-border">
            <EntityReviewsSection
              entityType="club"
              entityId={club.id}
              entitySlug={club.slug}
              villeSlug={club.villeSlug}
              entityName={club.nom}
              bundle={bundle}
            />
          </section>

          {clubsProximite.length > 0 && (
            <section id="alternatives" className="mt-16 pt-12 border-t border-border scroll-mt-20">
              <ClubList
                clubs={clubsProximite}
                title={closed ? `Clubs ouverts près de ${club.ville}` : `Autres clubs libertins près de ${club.ville}`}
                columns={3}
              />
            </section>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={`/ville/${club.villeSlug}`} className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors">
              Clubs à {club.ville}
            </Link>
            <Link href={`/departement/${club.departementSlug}`} className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors">
              Clubs en {club.departement_nom}
            </Link>
            <Link href="/conseils" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors">
              Conseils pour une première visite
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
