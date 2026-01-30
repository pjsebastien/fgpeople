/**
 * Page d'Accueil - Server Component
 */

import Image from 'next/image';
import Link from 'next/link';
import {
  getFeaturedClubs,
  getAllRegions,
  getAllDepartements,
  getStats,
  getPopularDepartements,
  getPopularVilles,
  getPaysEtrangers,
  getAllTypeCategories,
  getAllClubs,
} from '@/lib/data/clubs';
import ClubCard, { getImageIndexForClub } from '@/components/clubs/ClubCard';
import AdvancedSearch from '@/components/home/AdvancedSearch';
import { WebsiteJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd';

const TOTAL_IMAGES = 12;

// Calcule les indices d'images pour éviter les répétitions adjacentes
function calculateFeaturedImageIndices(clubs: { nom: string }[]): number[] {
  const indices: number[] = [];

  for (let i = 0; i < clubs.length; i++) {
    let imgIndex = getImageIndexForClub(clubs[i].nom);
    const neighborIndices: number[] = [];
    if (i > 0) neighborIndices.push(indices[i - 1]);
    if (i >= 2) neighborIndices.push(indices[i - 2]);
    if (i >= 3) neighborIndices.push(indices[i - 3]);

    let attempts = 0;
    while (neighborIndices.includes(imgIndex) && attempts < TOTAL_IMAGES) {
      imgIndex = (imgIndex + 1) % TOTAL_IMAGES;
      attempts++;
    }
    indices.push(imgIndex);
  }
  return indices;
}

export default async function HomePage() {
  const [featuredClubs, allRegions, allDepartements, stats, popularDepts, popularVilles, paysEtrangers, typeCategories, allClubs] = await Promise.all([
    getFeaturedClubs(),
    getAllRegions(),
    getAllDepartements(),
    getStats(),
    getPopularDepartements(10),
    getPopularVilles(12),
    getPaysEtrangers(),
    getAllTypeCategories(),
    getAllClubs(),
  ]);

  // Filtrer les régions valides (exclure "Région inconnue")
  const regions = allRegions.filter(r => r.nom !== 'Région inconnue' && r.slug !== 'region-inconnue');
  const departements = allDepartements.filter(d => d.nom !== 'Département inconnu');

  const imageIndices = calculateFeaturedImageIndices(featuredClubs);

  return (
    <>
      <WebsiteJsonLd />
      <OrganizationJsonLd />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/images/libertin (7).jpg"
              alt="Ambiance club libertin"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>

          {/* Overlay gradients pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/90 via-bg-primary/70 to-bg-primary" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/50 via-transparent to-bg-primary/50" />

          {/* Effet de lumière */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-primary/10 rounded-full blur-3xl" />

          {/* Hero Content */}
          <div className="container-custom relative z-10 text-center py-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
              Tous les
              <span className="block gradient-text mt-2">clubs libertins de France</span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              Découvrez plus de {stats.total} clubs libertins et échangistes en France et en Europe.
              Trouvez l'établissement idéal pour des soirées inoubliables.
            </p>

            {/* Formulaire de recherche avancé */}
            <AdvancedSearch
              clubs={allClubs}
              regions={regions}
              departements={departements}
              typeCategories={typeCategories}
            />

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center bg-bg-secondary/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                <p className="text-3xl md:text-4xl font-bold text-accent-primary">{stats.total}</p>
                <p className="text-text-muted text-sm">Clubs référencés</p>
              </div>
              <div className="text-center bg-bg-secondary/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                <p className="text-3xl md:text-4xl font-bold text-accent-primary">{stats.regions}</p>
                <p className="text-text-muted text-sm">Régions</p>
              </div>
              <div className="text-center bg-bg-secondary/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                <p className="text-3xl md:text-4xl font-bold text-accent-primary">{stats.departements}</p>
                <p className="text-text-muted text-sm">Départements</p>
              </div>
              <div className="text-center bg-bg-secondary/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                <p className="text-3xl md:text-4xl font-bold text-accent-primary">{stats.villes}</p>
                <p className="text-text-muted text-sm">Villes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Clubs en vedette */}
        {featuredClubs.length > 0 && (
          <section className="py-16 md:py-24 bg-bg-primary">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="section-title">Clubs libertins en vedette</h2>
                <p className="section-subtitle max-w-2xl mx-auto">
                  Notre sélection des meilleurs clubs libertins et échangistes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredClubs.map((club, index) => (
                  <ClubCard key={club.id} club={club} imageIndex={imageIndices[index]} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Types d'établissements */}
        <section id="types" className="py-16 md:py-24 bg-bg-secondary">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="section-title">Types d'établissements</h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                Explorez les clubs libertins selon leur type : saunas, spas, restaurants, bars et plus encore.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {typeCategories.map((type) => (
                <Link
                  key={type.slug}
                  href={`/${type.urlSlug}`}
                  className="group p-5 bg-bg-tertiary rounded-xl border border-border hover:border-accent-primary/30 transition-all"
                >
                  <h3 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors mb-1">
                    {type.labelPlural}
                  </h3>
                  <p className="text-text-muted text-sm">
                    {type.clubCount} établissement{type.clubCount > 1 ? 's' : ''}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation par région */}
        <section id="regions" className="py-16 md:py-24 bg-bg-primary">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="section-title">Clubs libertins par région</h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                Trouvez les clubs libertins près de chez vous en parcourant par région.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {regions.map((region) => (
                <Link
                  key={region.slug}
                  href={`/region/${region.slug}`}
                  className="group p-5 bg-bg-tertiary rounded-xl border border-border hover:border-accent-primary/30 transition-all duration-300"
                >
                  <h3 className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors mb-1">
                    {region.nom}
                  </h3>
                  <p className="text-text-muted text-sm">
                    {region.clubCount} club{region.clubCount > 1 ? 's' : ''}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Départements populaires */}
        <section className="py-16 md:py-24 bg-bg-secondary">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="section-title">Départements les plus populaires</h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                Les départements avec le plus grand nombre de clubs libertins.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popularDepts.map((dept) => (
                <Link
                  key={dept.slug}
                  href={`/departement/${dept.slug}`}
                  className="group p-4 bg-bg-secondary rounded-xl border border-border hover:border-accent-primary/30 transition-all text-center"
                >
                  <span className="block text-accent-primary font-bold text-xl mb-1">{dept.code}</span>
                  <span className="block text-text-primary group-hover:text-accent-primary font-medium text-sm truncate">
                    {dept.nom}
                  </span>
                  <span className="text-text-muted text-xs">
                    {dept.clubCount} club{dept.clubCount > 1 ? 's' : ''}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Villes populaires */}
        <section className="py-16 md:py-24 bg-bg-secondary">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="section-title">Villes les plus populaires</h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                Les grandes villes avec le plus de clubs libertins.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popularVilles.map((ville) => (
                <Link
                  key={ville.slug}
                  href={`/ville/${ville.slug}`}
                  className="group p-4 bg-bg-tertiary rounded-xl border border-border hover:border-accent-primary/30 transition-all text-center"
                >
                  <span className="block text-text-primary group-hover:text-accent-primary font-medium truncate">
                    {ville.nom}
                  </span>
                  <span className="text-text-muted text-xs">
                    {ville.clubCount} club{ville.clubCount > 1 ? 's' : ''}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Clubs à l'étranger */}
        <section className="py-16 md:py-24 bg-bg-primary">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="section-title">Clubs libertins à l'étranger</h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                Découvrez aussi les clubs libertins en Europe.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              {paysEtrangers.map((pays) => (
                <Link
                  key={pays.slug}
                  href={`/etranger/${pays.slug}`}
                  className="group p-6 bg-bg-secondary rounded-xl border border-border hover:border-accent-primary/30 transition-all text-center"
                >
                  <span className="block text-3xl mb-2">
                    {pays.nom === 'Belgique' && '🇧🇪'}
                    {pays.nom === 'Suisse' && '🇨🇭'}
                    {pays.nom === 'Luxembourg' && '🇱🇺'}
                    {pays.nom === 'Espagne' && '🇪🇸'}
                  </span>
                  <span className="block text-text-primary group-hover:text-accent-primary font-semibold">
                    {pays.nom}
                  </span>
                  <span className="text-text-muted text-sm">
                    {pays.clubCount} club{pays.clubCount > 1 ? 's' : ''}
                  </span>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/etranger"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary/10 rounded-xl border border-accent-primary/20 hover:border-accent-primary/50 transition-all text-accent-primary font-medium"
              >
                Voir tous les clubs à l'étranger
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Pourquoi nous choisir */}
        <section className="py-16 md:py-24 bg-bg-secondary">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="section-title">Pourquoi choisir FG People</h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                Des informations vérifiées et à jour sur tous les clubs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-primary/10 mb-6">
                  <svg className="w-8 h-8 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Clubs vérifiés</h3>
                <p className="text-text-secondary">
                  Chaque établissement est vérifié et validé pour garantir des informations fiables.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-primary/10 mb-6">
                  <svg className="w-8 h-8 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">France et Europe</h3>
                <p className="text-text-secondary">
                  Une couverture nationale et européenne pour trouver un club près de chez vous.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-primary/10 mb-6">
                  <svg className="w-8 h-8 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Infos à jour</h3>
                <p className="text-text-secondary">
                  Horaires, tarifs et coordonnées régulièrement mis à jour.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-bg-primary to-bg-secondary">
          <div className="container-custom text-center">
            <h2 className="section-title mb-4">Prêt à découvrir votre prochain club libertin ?</h2>
            <p className="section-subtitle max-w-xl mx-auto mb-8">
              Explorez notre sélection de {stats.total} clubs libertins et échangistes.
            </p>
            <Link href="#regions" className="btn-primary text-lg px-10 py-4">
              Explorer les clubs
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
