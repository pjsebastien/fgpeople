'use client';

/**
 * ClubFilters - Client Component
 *
 * RENDU CLIENT: Gestion des filtres interactifs.
 * - Filtrage par ville, région, caractéristiques
 * - Mise à jour de l'URL avec les paramètres de recherche
 * - État local pour la réactivité immédiate
 *
 * NOTE SEO: Les filtres n'affectent pas le HTML initial.
 * Le contenu complet est déjà rendu côté serveur dans ClubList.
 * Les filtres ne font que masquer/afficher les éléments côté client.
 */

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface ClubFiltersProps {
  cities: FilterOption[];
  regions: FilterOption[];
  features: string[];
}

export default function ClubFilters({ cities, regions, features }: ClubFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // État des filtres (initialisé depuis l'URL)
  const [selectedCity, setSelectedCity] = useState(searchParams.get('ville') || '');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || '');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    searchParams.get('features')?.split(',').filter(Boolean) || []
  );
  const [isExpanded, setIsExpanded] = useState(false);

  // Mise à jour de l'URL avec les filtres
  const updateFilters = useCallback(
    (city: string, region: string, featuresList: string[]) => {
      const params = new URLSearchParams();
      if (city) params.set('ville', city);
      if (region) params.set('region', region);
      if (featuresList.length > 0) params.set('features', featuresList.join(','));

      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : '', { scroll: false });
    },
    [router]
  );

  // Handlers
  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    updateFilters(value, selectedRegion, selectedFeatures);
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setSelectedCity(''); // Reset ville quand on change de région
    updateFilters('', value, selectedFeatures);
  };

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter((f) => f !== feature)
      : [...selectedFeatures, feature];
    setSelectedFeatures(newFeatures);
    updateFilters(selectedCity, selectedRegion, newFeatures);
  };

  const clearAllFilters = () => {
    setSelectedCity('');
    setSelectedRegion('');
    setSelectedFeatures([]);
    router.push('', { scroll: false });
  };

  const hasActiveFilters = selectedCity || selectedRegion || selectedFeatures.length > 0;

  return (
    <div className="bg-bg-secondary rounded-xl border border-border p-4 md:p-6 mb-8">
      {/* ====== EN-TÊTE DES FILTRES ====== */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <svg
            className="w-5 h-5 text-accent-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filtres
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-accent-primary hover:text-accent-hover transition-colors"
          >
            Effacer tout
          </button>
        )}
      </div>

      {/* ====== FILTRES PRINCIPAUX ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Filtre par région */}
        <div>
          <label
            htmlFor="region-filter"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Région
          </label>
          <select
            id="region-filter"
            value={selectedRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
          >
            <option value="">Toutes les régions</option>
            {regions.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label} {region.count !== undefined && `(${region.count})`}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre par ville */}
        <div>
          <label
            htmlFor="city-filter"
            className="block text-sm font-medium text-text-secondary mb-2"
          >
            Ville
          </label>
          <select
            id="city-filter"
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-text-primary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
          >
            <option value="">Toutes les villes</option>
            {cities
              .filter((city) => !selectedRegion || city.value.includes(selectedRegion))
              .map((city) => (
                <option key={city.value} value={city.value}>
                  {city.label} {city.count !== undefined && `(${city.count})`}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* ====== FILTRES PAR CARACTÉRISTIQUES ====== */}
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors mb-3"
        >
          <span>Caractéristiques</span>
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {selectedFeatures.length > 0 && (
            <span className="px-2 py-0.5 bg-accent-primary/10 text-accent-primary text-xs rounded-full">
              {selectedFeatures.length}
            </span>
          )}
        </button>

        {isExpanded && (
          <div className="flex flex-wrap gap-2">
            {features.map((feature) => {
              const isSelected = selectedFeatures.includes(feature);
              return (
                <button
                  key={feature}
                  onClick={() => handleFeatureToggle(feature)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    isSelected
                      ? 'bg-accent-primary text-bg-primary border-accent-primary'
                      : 'bg-transparent text-text-secondary border-border hover:border-accent-primary hover:text-accent-primary'
                  }`}
                >
                  {feature}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
