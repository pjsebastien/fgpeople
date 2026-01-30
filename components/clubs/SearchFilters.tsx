'use client';

/**
 * SearchFilters - Client Component
 * Formulaire de recherche et filtrage avancé avec résultats en temps réel
 */

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import type { Club, Region, Departement, TypeCategory } from '@/lib/types';
import ClubCard, { getImageIndexForClub } from './ClubCard';

const TOTAL_IMAGES = 12;

interface SearchFiltersProps {
  clubs: Club[];
  regions?: Region[];
  departements?: Departement[];
  typeCategories?: TypeCategory[];
  equipements?: string[];
  // Filtres pré-appliqués (masquer ces options)
  hideTypeFilter?: boolean;
  hideRegionFilter?: boolean;
  hideDepartementFilter?: boolean;
  hideVilleFilter?: boolean;
  // Contexte pour les liens
  baseUrl?: string;
  title?: string;
  subtitle?: string;
}

// Calcule les indices d'images pour éviter les répétitions adjacentes
function calculateImageIndices(clubs: Club[], maxColumns: number = 4): number[] {
  const indices: number[] = [];
  for (let i = 0; i < clubs.length; i++) {
    let imgIndex = getImageIndexForClub(clubs[i].nom);
    const neighborIndices: number[] = [];
    if (i > 0) neighborIndices.push(indices[i - 1]);
    for (let cols = 2; cols <= maxColumns; cols++) {
      if (i >= cols) neighborIndices.push(indices[i - cols]);
    }
    let attempts = 0;
    while (neighborIndices.includes(imgIndex) && attempts < TOTAL_IMAGES) {
      imgIndex = (imgIndex + 1) % TOTAL_IMAGES;
      attempts++;
    }
    indices.push(imgIndex);
  }
  return indices;
}

export default function SearchFilters({
  clubs,
  regions = [],
  departements = [],
  typeCategories = [],
  equipements = [],
  hideTypeFilter = false,
  hideRegionFilter = false,
  hideDepartementFilter = false,
  hideVilleFilter = false,
  baseUrl = '',
  title = 'Rechercher un établissement',
  subtitle = 'Utilisez les filtres pour affiner votre recherche',
}: SearchFiltersProps) {
  // États des filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedDepartement, setSelectedDepartement] = useState<string>('');
  const [selectedVille, setSelectedVille] = useState<string>('');
  const [selectedEquipements, setSelectedEquipements] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [resultsPerPage, setResultsPerPage] = useState(12);

  // Extraire les villes uniques des clubs
  const villes = useMemo(() => {
    const villeMap = new Map<string, { nom: string; slug: string; count: number }>();
    clubs.forEach(club => {
      if (!villeMap.has(club.villeSlug)) {
        villeMap.set(club.villeSlug, { nom: club.ville, slug: club.villeSlug, count: 0 });
      }
      villeMap.get(club.villeSlug)!.count++;
    });
    return Array.from(villeMap.values()).sort((a, b) => b.count - a.count);
  }, [clubs]);

  // Filtrer les départements par région sélectionnée
  const filteredDepartements = useMemo(() => {
    if (!selectedRegion) return departements;
    return departements.filter(d => d.regionSlug === selectedRegion);
  }, [departements, selectedRegion]);

  // Filtrer les villes par département sélectionné
  const filteredVilles = useMemo(() => {
    if (!selectedDepartement) return villes;
    return villes.filter(v => {
      const club = clubs.find(c => c.villeSlug === v.slug);
      return club && club.departementSlug === selectedDepartement;
    });
  }, [villes, selectedDepartement, clubs]);

  // Appliquer les filtres
  const filteredClubs = useMemo(() => {
    return clubs.filter(club => {
      // Recherche textuelle
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchIn = [
          club.nom,
          club.ville,
          club.region,
          club.departement_nom,
          club.description,
          ...club.equipements,
        ].join(' ').toLowerCase();
        if (!searchIn.includes(query)) return false;
      }

      // Filtre par type
      if (selectedType && !club.types.some(t => t.slug === selectedType)) {
        return false;
      }

      // Filtre par région
      if (selectedRegion && club.regionSlug !== selectedRegion) {
        return false;
      }

      // Filtre par département
      if (selectedDepartement && club.departementSlug !== selectedDepartement) {
        return false;
      }

      // Filtre par ville
      if (selectedVille && club.villeSlug !== selectedVille) {
        return false;
      }

      // Filtre par équipements
      if (selectedEquipements.length > 0) {
        const hasAllEquipements = selectedEquipements.every(eq =>
          club.equipements.some(e => e.toLowerCase().includes(eq.toLowerCase()))
        );
        if (!hasAllEquipements) return false;
      }

      // Filtre par status
      if (selectedStatus && club.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [clubs, searchQuery, selectedType, selectedRegion, selectedDepartement, selectedVille, selectedEquipements, selectedStatus]);

  // Clubs affichés (avec pagination)
  const displayedClubs = useMemo(() => {
    return filteredClubs.slice(0, resultsPerPage);
  }, [filteredClubs, resultsPerPage]);

  // Indices d'images pour les clubs affichés
  const imageIndices = useMemo(() => {
    return calculateImageIndices(displayedClubs, 4);
  }, [displayedClubs]);

  // Reset des filtres
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedRegion('');
    setSelectedDepartement('');
    setSelectedVille('');
    setSelectedEquipements([]);
    setSelectedStatus('');
  }, []);

  // Toggle équipement
  const toggleEquipement = useCallback((eq: string) => {
    setSelectedEquipements(prev =>
      prev.includes(eq) ? prev.filter(e => e !== eq) : [...prev, eq]
    );
  }, []);

  // Nombre de filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedType) count++;
    if (selectedRegion) count++;
    if (selectedDepartement) count++;
    if (selectedVille) count++;
    if (selectedEquipements.length > 0) count++;
    if (selectedStatus) count++;
    return count;
  }, [searchQuery, selectedType, selectedRegion, selectedDepartement, selectedVille, selectedEquipements, selectedStatus]);

  // Équipements populaires (top 12)
  const popularEquipements = useMemo(() => {
    const eqCount = new Map<string, number>();
    clubs.forEach(club => {
      club.equipements.forEach(eq => {
        eqCount.set(eq, (eqCount.get(eq) || 0) + 1);
      });
    });
    return Array.from(eqCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([eq]) => eq);
  }, [clubs]);

  return (
    <div className="w-full">
      {/* Formulaire de recherche */}
      <div className="bg-bg-secondary/80 backdrop-blur-sm rounded-2xl border border-border p-6 mb-8">
        <h2 className="text-xl font-semibold text-text-primary mb-2">{title}</h2>
        <p className="text-text-muted text-sm mb-6">{subtitle}</p>

        {/* Barre de recherche principale */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher par nom, ville, équipement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-bg-primary border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary/50 transition-colors"
            />
          </div>

          {/* Bouton filtres avancés */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors ${
              showFilters || activeFiltersCount > 0
                ? 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary'
                : 'bg-bg-primary border-border text-text-secondary hover:border-accent-primary/30'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filtres</span>
            {activeFiltersCount > 0 && (
              <span className="bg-accent-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="border-t border-border pt-6 mt-4 space-y-6">
            {/* Ligne 1: Type, Région, Département, Ville */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type */}
              {!hideTypeFilter && typeCategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="">Tous les types</option>
                    {typeCategories.map(t => (
                      <option key={t.slug} value={t.slug}>{t.labelPlural} ({t.clubCount})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Région */}
              {!hideRegionFilter && regions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Région</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      setSelectedDepartement('');
                      setSelectedVille('');
                    }}
                    className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="">Toutes les régions</option>
                    {regions.map(r => (
                      <option key={r.slug} value={r.slug}>{r.nom} ({r.clubCount})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Département */}
              {!hideDepartementFilter && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Département</label>
                  <select
                    value={selectedDepartement}
                    onChange={(e) => {
                      setSelectedDepartement(e.target.value);
                      setSelectedVille('');
                    }}
                    className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="">Tous les départements</option>
                    {filteredDepartements.map(d => (
                      <option key={d.slug} value={d.slug}>{d.nom} ({d.code})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Ville */}
              {!hideVilleFilter && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Ville</label>
                  <select
                    value={selectedVille}
                    onChange={(e) => setSelectedVille(e.target.value)}
                    className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="">Toutes les villes</option>
                    {filteredVilles.slice(0, 50).map(v => (
                      <option key={v.slug} value={v.slug}>{v.nom} ({v.count})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Ligne 2: Status */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Statut</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: '', label: 'Tous' },
                  { value: 'actif', label: 'Vérifié' },
                  { value: 'incertain', label: 'Non vérifié' },
                ].map(status => (
                  <button
                    key={status.value}
                    onClick={() => setSelectedStatus(status.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedStatus === status.value
                        ? 'bg-accent-primary text-white'
                        : 'bg-bg-primary border border-border text-text-secondary hover:border-accent-primary/30'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ligne 3: Équipements */}
            {popularEquipements.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Équipements</label>
                <div className="flex flex-wrap gap-2">
                  {popularEquipements.map(eq => (
                    <button
                      key={eq}
                      onClick={() => toggleEquipement(eq)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedEquipements.includes(eq)
                          ? 'bg-accent-primary text-white'
                          : 'bg-bg-primary border border-border text-text-secondary hover:border-accent-primary/30'
                      }`}
                    >
                      {eq}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton reset */}
            {activeFiltersCount > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={resetFilters}
                  className="text-sm text-accent-primary hover:text-accent-hover transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Résultats */}
      <div>
        {/* Header résultats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-text-secondary">
            <span className="text-accent-primary font-bold">{filteredClubs.length}</span>
            {' '}établissement{filteredClubs.length > 1 ? 's' : ''} trouvé{filteredClubs.length > 1 ? 's' : ''}
            {activeFiltersCount > 0 && (
              <span className="text-text-muted ml-2">(sur {clubs.length})</span>
            )}
          </p>
        </div>

        {/* Grille de résultats */}
        {displayedClubs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedClubs.map((club, index) => (
                <ClubCard key={club.id} club={club} imageIndex={imageIndices[index]} />
              ))}
            </div>

            {/* Charger plus */}
            {filteredClubs.length > resultsPerPage && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setResultsPerPage(prev => prev + 12)}
                  className="btn-secondary"
                >
                  Voir plus ({filteredClubs.length - resultsPerPage} restants)
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-bg-secondary rounded-xl border border-border">
            <svg className="w-16 h-16 mx-auto text-text-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Aucun résultat</h3>
            <p className="text-text-muted mb-6">Aucun établissement ne correspond à vos critères.</p>
            <button
              onClick={resetFilters}
              className="btn-secondary"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
