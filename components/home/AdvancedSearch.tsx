'use client';

/**
 * AdvancedSearch - Client Component
 * Formulaire de recherche avancé avec filtres multiples
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Club, Region, Departement, TypeCategory } from '@/lib/types';

interface AdvancedSearchProps {
  clubs: Club[];
  regions: Region[];
  departements: Departement[];
  typeCategories: TypeCategory[];
}

export default function AdvancedSearch({ clubs, regions, departements, typeCategories }: AdvancedSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDepartement, setSelectedDepartement] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced'>('simple');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrer les départements selon la région sélectionnée
  const filteredDepartements = useMemo(() => {
    if (!selectedRegion) return departements;
    return departements.filter(d => d.regionSlug === selectedRegion);
  }, [departements, selectedRegion]);

  // Recherche en temps réel
  const searchResults = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const searchTerm = query.toLowerCase().trim();
    let results = clubs;

    // Filtre par texte
    results = results.filter((club) => {
      const searchIn = [club.nom, club.ville, club.region, club.departement_nom, club.type]
        .join(' ')
        .toLowerCase();
      return searchIn.includes(searchTerm);
    });

    // Filtre par région
    if (selectedRegion) {
      results = results.filter(c => c.regionSlug === selectedRegion);
    }

    // Filtre par département
    if (selectedDepartement) {
      results = results.filter(c => c.departementSlug === selectedDepartement);
    }

    // Filtre par type
    if (selectedType) {
      results = results.filter(c => c.types.some(t => t.slug === selectedType));
    }

    return results.slice(0, 8);
  }, [clubs, query, selectedRegion, selectedDepartement, selectedType]);

  // Fermer les résultats si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset département quand région change
  useEffect(() => {
    setSelectedDepartement('');
  }, [selectedRegion]);

  // Lancer la recherche avancée
  const handleAdvancedSearch = () => {
    if (selectedRegion && selectedType) {
      router.push(`/${typeCategories.find(t => t.slug === selectedType)?.urlSlug}/region/${selectedRegion}`);
    } else if (selectedDepartement && selectedType) {
      router.push(`/${typeCategories.find(t => t.slug === selectedType)?.urlSlug}/departement/${selectedDepartement}`);
    } else if (selectedRegion) {
      router.push(`/region/${selectedRegion}`);
    } else if (selectedDepartement) {
      router.push(`/departement/${selectedDepartement}`);
    } else if (selectedType) {
      router.push(`/${typeCategories.find(t => t.slug === selectedType)?.urlSlug}`);
    }
  };

  const hasFilters = selectedRegion || selectedDepartement || selectedType;

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex bg-bg-tertiary/50 rounded-full p-1">
          <button
            onClick={() => setActiveTab('simple')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'simple'
                ? 'bg-accent-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Recherche rapide
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'advanced'
                ? 'bg-accent-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Filtres avancés
          </button>
        </div>
      </div>

      {/* Recherche simple */}
      {activeTab === 'simple' && (
        <div className="relative">
          <div className="relative">
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Rechercher un club, une ville, une région..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              className="w-full pl-14 pr-6 py-5 bg-bg-secondary/90 backdrop-blur-md border border-border rounded-2xl text-text-primary text-lg placeholder:text-text-muted focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Résultats de recherche */}
          {showResults && query.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary/95 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-2xl z-50">
              {searchResults.length > 0 ? (
                <>
                  <ul className="divide-y divide-border max-h-96 overflow-y-auto">
                    {searchResults.map((club) => (
                      <li key={club.id}>
                        <Link
                          href={`/${club.slug}`}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-bg-tertiary transition-colors"
                          onClick={() => setShowResults(false)}
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-text-primary truncate">{club.nom}</p>
                            <p className="text-sm text-text-muted truncate">
                              {club.ville} • {club.departement_nom}
                            </p>
                          </div>
                          <div className="flex-shrink-0 flex flex-wrap gap-1">
                            {club.types.slice(0, 2).map((t) => (
                              <span key={t.slug} className="px-2 py-0.5 text-xs font-medium bg-accent-primary/10 text-accent-primary rounded-full">
                                {t.label}
                              </span>
                            ))}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="px-5 py-8 text-center">
                  <p className="text-text-muted">Aucun club trouvé pour "{query}"</p>
                </div>
              )}
            </div>
          )}

          {/* Suggestions rapides */}
          {showResults && query.length < 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary/95 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-2xl z-50 p-5">
              <p className="text-sm text-text-muted mb-3">Recherches populaires</p>
              <div className="flex flex-wrap gap-2">
                {['Paris', 'Lyon', 'Bordeaux', 'Marseille', 'Sauna', 'Spa'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setQuery(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="px-4 py-2 bg-bg-tertiary hover:bg-accent-primary/10 text-text-secondary hover:text-accent-primary rounded-full text-sm transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recherche avancée */}
      {activeTab === 'advanced' && (
        <div className="bg-bg-secondary/90 backdrop-blur-md border border-border rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Type d'établissement */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Type d'établissement
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-text-primary focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">Tous les types</option>
                {typeCategories.map((type) => (
                  <option key={type.slug} value={type.slug}>
                    {type.labelPlural} ({type.clubCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Région */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Région
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-text-primary focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">Toutes les régions</option>
                {regions.filter(r => r.nom !== 'Région inconnue').map((region) => (
                  <option key={region.slug} value={region.slug}>
                    {region.nom} ({region.clubCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Département */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Département
              </label>
              <select
                value={selectedDepartement}
                onChange={(e) => setSelectedDepartement(e.target.value)}
                className="w-full px-4 py-3 bg-bg-tertiary border border-border rounded-xl text-text-primary focus:outline-none focus:border-accent-primary/50 focus:ring-2 focus:ring-accent-primary/20 transition-all appearance-none cursor-pointer"
              >
                <option value="">Tous les départements</option>
                {filteredDepartements.map((dept) => (
                  <option key={dept.slug} value={dept.slug}>
                    {dept.code} - {dept.nom} ({dept.clubCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Bouton rechercher */}
            <div className="flex items-end">
              <button
                onClick={handleAdvancedSearch}
                disabled={!hasFilters}
                className={`w-full px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  hasFilters
                    ? 'bg-accent-primary hover:bg-accent-hover text-white'
                    : 'bg-bg-tertiary text-text-muted cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Rechercher
              </button>
            </div>
          </div>

          {/* Filtres actifs */}
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border">
              <span className="text-sm text-text-muted">Filtres actifs :</span>
              {selectedType && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-sm">
                  {typeCategories.find(t => t.slug === selectedType)?.labelPlural}
                  <button onClick={() => setSelectedType('')} className="hover:text-accent-hover">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {selectedRegion && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-sm">
                  {regions.find(r => r.slug === selectedRegion)?.nom}
                  <button onClick={() => setSelectedRegion('')} className="hover:text-accent-hover">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {selectedDepartement && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-sm">
                  {departements.find(d => d.slug === selectedDepartement)?.nom}
                  <button onClick={() => setSelectedDepartement('')} className="hover:text-accent-hover">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedType('');
                  setSelectedRegion('');
                  setSelectedDepartement('');
                }}
                className="text-sm text-text-muted hover:text-accent-primary transition-colors ml-2"
              >
                Tout effacer
              </button>
            </div>
          )}

          {/* Raccourcis populaires */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-sm text-text-muted mb-3">Recherches populaires</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/club-libertin" className="px-4 py-2 bg-bg-tertiary hover:bg-accent-primary/10 text-text-secondary hover:text-accent-primary rounded-full text-sm transition-colors">
                Clubs libertins
              </Link>
              <Link href="/sauna-libertin" className="px-4 py-2 bg-bg-tertiary hover:bg-accent-primary/10 text-text-secondary hover:text-accent-primary rounded-full text-sm transition-colors">
                Saunas
              </Link>
              <Link href="/region/ile-de-france" className="px-4 py-2 bg-bg-tertiary hover:bg-accent-primary/10 text-text-secondary hover:text-accent-primary rounded-full text-sm transition-colors">
                Île-de-France
              </Link>
              <Link href="/region/provence-alpes-cote-dazur" className="px-4 py-2 bg-bg-tertiary hover:bg-accent-primary/10 text-text-secondary hover:text-accent-primary rounded-full text-sm transition-colors">
                PACA
              </Link>
              <Link href="/ville/paris" className="px-4 py-2 bg-bg-tertiary hover:bg-accent-primary/10 text-text-secondary hover:text-accent-primary rounded-full text-sm transition-colors">
                Paris
              </Link>
              <Link href="/ville/lyon" className="px-4 py-2 bg-bg-tertiary hover:bg-accent-primary/10 text-text-secondary hover:text-accent-primary rounded-full text-sm transition-colors">
                Lyon
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
