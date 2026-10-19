/**
 * ClubDetailPage - Server Component
 * Contenu de la page détail d'un club
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Club } from '@/lib/types';
import type { LieuReviewsBundle } from '@/lib/types/reviews';
import { generateTipsForFirstTime, generateEtiquetteRules, generateReview } from '@/lib/utils/seo-content';
import ClubList from '@/components/clubs/ClubList';
import Breadcrumb from '@/components/ui/Breadcrumb';
import LibertinCTA from '@/components/ui/LibertinCTA';
import ClubSidebar from '@/components/clubs/ClubSidebar';
import { BreadcrumbJsonLd, LocalBusinessJsonLd, FAQPageJsonLd } from '@/components/seo/JsonLd';
import { CLUB_IMAGES, getImageIndexForClub } from '@/components/clubs/ClubCard';
import EntityReviewsSection from '@/components/reviews/EntityReviewsSection';
import ReviewSummary from '@/components/reviews/ReviewSummary';

interface ClubDetailPageProps {
  club: Club;
  clubsProximite: Club[];
  reviewsBundle?: LieuReviewsBundle;
}

// Génère un tableau d'indices d'images pour la galerie (4 images différentes)
function getGalleryImagesForClub(clubName: string): string[] {
  const baseIndex = getImageIndexForClub(clubName);
  const images: string[] = [];

  for (let i = 0; i < 4; i++) {
    const index = (baseIndex + i * 3) % CLUB_IMAGES.length;
    images.push(CLUB_IMAGES[index]);
  }

  return images;
}

const EMPTY_BUNDLE: LieuReviewsBundle = {
  aggregate: { count: 0, average: 0 },
  reviews: [],
  tagStats: {},
};

export default function ClubDetailPage({ club, clubsProximite, reviewsBundle }: ClubDetailPageProps) {
  const bundle = reviewsBundle || EMPTY_BUNDLE;
  const tips = generateTipsForFirstTime();
  const etiquette = generateEtiquetteRules();
  const galleryImages = getGalleryImagesForClub(club.nom);

  // Génération de l'avis
  const review = generateReview({
    clubName: club.nom,
    city: club.ville,
    region: club.region,
    departement: club.departement_nom,
    types: club.types,
    equipements: club.equipements,
    status: club.status,
    qualityScore: club.qualityScore,
    websiteAccessible: club.websiteAccessible,
    hasPhone: !!club.telephone,
    hasEmail: !!club.email,
  });

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: club.region, url: `/region/${club.regionSlug}` },
    { name: `${club.departement_nom} (${club.departement_code})`, url: `/departement/${club.departementSlug}` },
    { name: club.ville, url: `/ville/${club.villeSlug}` },
    { name: club.nom, url: `/${club.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <LocalBusinessJsonLd club={club} reviewsBundle={bundle} />
      <FAQPageJsonLd faq={club.seo.faq} />

      <main className="py-8 md:py-12">
        <div className="container-custom">
          <Breadcrumb items={breadcrumbItems} />

          {/* En-tête du club */}
          <header className="mb-10">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
                  {club.nom}
                </h1>
                <p className="text-accent-primary font-medium capitalize mt-2 text-lg">
                  {club.type} à {club.ville}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {club.status === 'actif' && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full border border-green-500/30">
                    Établissement vérifié
                  </span>
                )}
                {club.status === 'incertain' && (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded-full border border-yellow-500/30">
                    À vérifier
                  </span>
                )}
                {club.status === 'probablement_ferme' && (
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-medium rounded-full border border-red-500/30">
                    Possiblement fermé
                  </span>
                )}
              </div>
            </div>

            {/* Localisation */}
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

            {/* Types de l'établissement */}
            {club.types.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {club.types.map((t) => (
                  <span
                    key={t.slug}
                    className="px-3 py-1 bg-accent-primary/20 text-accent-primary text-sm rounded-full"
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            )}

            {/* Note moyenne (visible en haut de page) */}
            <div className="mt-4">
              {bundle.aggregate.count > 0 ? (
                <a href="#avis" className="inline-flex items-center hover:opacity-80 transition-opacity">
                  <ReviewSummary aggregate={bundle.aggregate} variant="inline" size={16} />
                </a>
              ) : (
                <a href="#avis" className="inline-flex items-center gap-1.5 text-sm text-accent-primary hover:underline">
                  <svg className="w-4 h-4" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M10 1.5l2.6 5.27 5.81.84-4.2 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.2-4.1 5.81-.84L10 1.5z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  Donne ton avis (anonyme, sans inscription)
                </a>
              )}
            </div>
          </header>

          {/* Galerie d'images */}
          <section className="mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="col-span-2 row-span-2 relative aspect-[4/3] md:aspect-auto rounded-xl overflow-hidden bg-bg-secondary">
                <Image
                  src={galleryImages[0]}
                  alt={`${club.nom} - ${club.type} à ${club.ville} (${club.departement_code})`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/80 text-sm">Images d&apos;illustration</p>
                </div>
              </div>

              {galleryImages.slice(1).map((src, index) => {
                const altTexts = [
                  `Ambiance ${club.type} ${club.nom} en ${club.region}`,
                  `Intérieur ${club.nom} - établissement libertin ${club.ville}`,
                  `${club.nom} ${club.ville} - soirée libertine ${club.departement_nom}`,
                ];
                return (
                  <div
                    key={index}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden bg-bg-secondary"
                  >
                    <Image
                      src={src}
                      alt={altTexts[index] || `${club.nom} - ${club.type} ${club.ville}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                );
              })}
            </div>
            <p className="text-text-muted text-xs mt-2 text-center">
              Photos non contractuelles - Images d&apos;ambiance à titre illustratif
            </p>
          </section>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-8">
              {/* Introduction SEO */}
              <section className="bg-bg-secondary rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Présentation de {club.nom}
                </h2>
                <p className="text-text-secondary leading-relaxed mb-4">
                  {club.seo.introText}
                </p>
                <p className="text-text-secondary leading-relaxed">
                  {club.seo.ambianceText}
                </p>
              </section>

              {/* CTA Rencontres */}
              <LibertinCTA location={club.ville} />

              {/* Notre avis */}
              <section className="bg-bg-secondary rounded-xl border border-border p-6" id="avis">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-text-primary">
                      {review.title}
                    </h2>
                    <p className="text-text-muted text-sm mt-1">
                      Mis à jour en {review.lastUpdate}
                    </p>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center gap-2 bg-bg-tertiary px-4 py-2 rounded-lg border border-border">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${star <= review.rating ? 'text-accent-primary' : 'text-text-muted'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-text-primary font-semibold">{review.rating}/5</span>
                  </div>
                </div>

                {/* Résumé */}
                <div className={`p-4 rounded-lg mb-6 ${club.status === 'probablement_ferme' ? 'bg-red-500/10 border border-red-500/30' : club.status === 'incertain' ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-accent-primary/10 border border-accent-primary/30'}`}>
                  <p className={`leading-relaxed ${club.status === 'probablement_ferme' ? 'text-red-400' : club.status === 'incertain' ? 'text-yellow-400' : 'text-text-primary'}`}>
                    {review.summary}
                  </p>
                </div>

                {/* Détails */}
                <div className="space-y-4 mb-6">
                  {review.details.map((detail, index) => (
                    <p key={index} className="text-text-secondary leading-relaxed">
                      {detail}
                    </p>
                  ))}
                </div>

                {/* Points positifs et négatifs */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {review.positivePoints.length > 0 && (
                    <div>
                      <h3 className="text-text-primary font-medium mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Points positifs
                      </h3>
                      <ul className="space-y-2">
                        {review.positivePoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2 text-text-secondary text-sm">
                            <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.negativePoints.length > 0 && (
                    <div>
                      <h3 className="text-text-primary font-medium mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        À noter
                      </h3>
                      <ul className="space-y-2">
                        {review.negativePoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2 text-text-secondary text-sm">
                            <svg className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                            </svg>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Conclusion */}
                <div className="border-t border-border pt-4">
                  <p className="text-text-secondary leading-relaxed italic">
                    {review.conclusion}
                  </p>
                </div>

                {/* Disclaimer */}
                <p className="text-text-muted text-xs mt-4">
                  Cet avis est basé sur les informations collectées et les retours d&apos;utilisateurs. Il ne constitue pas une recommandation officielle. Nous vous invitons à vous faire votre propre opinion en visitant l&apos;établissement.
                </p>
              </section>

              {/* Description originale si disponible */}
              {club.description && club.description.length > 50 && (
                <section className="bg-bg-secondary rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">
                    À propos de l&apos;établissement
                  </h2>
                  <div className="text-text-secondary whitespace-pre-line leading-relaxed">
                    {club.description}
                  </div>
                </section>
              )}

              {/* Équipements */}
              {club.equipements.length > 0 && (
                <section className="bg-bg-secondary rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">
                    Équipements & Services de {club.nom}
                  </h2>
                  <p className="text-text-secondary mb-4">
                    {club.nom} dispose de {club.equipements.length} équipements et services pour votre confort et votre plaisir.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {club.equipements.map((eq) => (
                      <div
                        key={eq}
                        className="flex items-center gap-2 p-3 bg-bg-tertiary rounded-lg border border-border"
                      >
                        <svg className="w-4 h-4 text-accent-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-text-secondary text-sm">{eq}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Horaires */}
              {club.horaires && Object.keys(club.horaires).length > 0 && (
                <section className="bg-bg-secondary rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">
                    Horaires d&apos;ouverture
                  </h2>
                  <p className="text-text-secondary text-sm mb-4">
                    Les horaires peuvent varier selon les événements. Contactez l&apos;établissement pour confirmation.
                  </p>
                  <div className="space-y-2">
                    {Object.entries(club.horaires).map(([jour, horaire]) => (
                      <div key={jour} className="flex justify-between py-2 border-b border-border last:border-0">
                        <span className="text-text-primary capitalize font-medium">{jour}</span>
                        <span className="text-text-secondary">{horaire}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tarifs */}
              {club.tarifs && Object.keys(club.tarifs).length > 0 && (
                <section className="bg-bg-secondary rounded-xl border border-border p-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">
                    Tarifs d&apos;entrée
                  </h2>
                  <p className="text-text-secondary text-sm mb-4">
                    Les tarifs peuvent varier selon les soirées. Vérifiez auprès de l&apos;établissement.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {Object.entries(club.tarifs).map(([type, tarif]) => (
                      <div key={type} className="flex justify-between items-center p-4 bg-bg-tertiary rounded-lg border border-border">
                        <span className="text-text-primary capitalize">{type}</span>
                        <span className="text-accent-primary font-semibold text-lg">{tarif}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Accès */}
              <section className="bg-bg-secondary rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Comment se rendre à {club.nom}
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {club.seo.accessText}
                </p>
                {club.adresse && (
                  <div className="mt-4 p-4 bg-bg-tertiary rounded-lg border border-border">
                    <p className="text-text-primary font-medium">Adresse complète :</p>
                    <address className="text-text-secondary not-italic">
                      {club.adresse}<br />
                      {club.code_postal} {club.ville}
                    </address>
                  </div>
                )}
              </section>

              {/* FAQ */}
              <section className="bg-bg-secondary rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-6">
                  Questions fréquentes sur {club.nom}
                </h2>
                <div className="space-y-4">
                  {club.seo.faq.map((item, index) => (
                    <details
                      key={index}
                      className="group bg-bg-tertiary rounded-lg border border-border"
                    >
                      <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                        <h3 className="text-text-primary font-medium pr-4">{item.question}</h3>
                        <svg
                          className="w-5 h-5 text-text-muted transition-transform group-open:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-4 pb-4">
                        <p className="text-text-secondary leading-relaxed">{item.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              {/* Conseils pour les débutants */}
              <section className="bg-gradient-to-r from-accent-primary/10 to-accent-primary/5 rounded-xl border border-accent-primary/20 p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Première visite dans un établissement libertin ?
                </h2>
                <p className="text-text-secondary mb-4">
                  Voici quelques conseils pour profiter au mieux de votre expérience :
                </p>
                <ul className="space-y-3">
                  {tips.slice(0, 4).map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-accent-primary/20 text-accent-primary rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-text-secondary">{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Règles de savoir-vivre */}
              <section className="bg-bg-secondary rounded-xl border border-border p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Règles de savoir-vivre
                </h2>
                <p className="text-text-secondary mb-4">
                  Le respect mutuel est la base de toute expérience libertine réussie.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {etiquette.map((rule, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-text-secondary text-sm">{rule}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <ClubSidebar club={club} />
          </div>

          {/* Avis utilisateurs (mise en avant) */}
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

          {/* Clubs à proximité */}
          {clubsProximite.length > 0 && (
            <section className="mt-16 pt-12 border-t border-border">
              <ClubList
                clubs={clubsProximite}
                title={`Autres clubs libertins près de ${club.ville}`}
                columns={3}
              />
            </section>
          )}

          {/* Lien retour */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/ville/${club.villeSlug}`}
              className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Clubs à {club.ville}
            </Link>
            <Link
              href={`/departement/${club.departementSlug}`}
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
            >
              Clubs en {club.departement_nom}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
            >
              Tous les clubs libertins
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
