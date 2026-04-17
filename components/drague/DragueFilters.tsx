'use client';

/**
 * DragueFilters - Composant client pour filtrer/trier les lieux
 * Filtre côté client après hydratation
 */

import { useMemo, useState } from 'react';
import LieuDragueCard from './LieuDragueCard';
import { avoidAdjacentDuplicateImages } from '@/lib/data/dragues';
import type { LieuDrague, DragueTypeSlug, DragueOrientation, DragueAffluenceNiveau } from '@/lib/types/drague';

interface DragueFiltersProps {
  lieux: LieuDrague[];
  showVilleFilter?: boolean;
  defaultOpenCount?: number;
}

type SortKey = 'name-asc' | 'affluence-desc' | 'ville-asc';

export default function DragueFilters({ lieux, showVilleFilter = false, defaultOpenCount = 3 }: DragueFiltersProps) {
  const [typeFilter, setTypeFilter] = useState<DragueTypeSlug | 'all'>('all');
  const [orientationFilter, setOrientationFilter] = useState<DragueOrientation | 'all'>('all');
  const [affluenceFilter, setAffluenceFilter] = useState<DragueAffluenceNiveau | 'all'>('all');
  const [villeFilter, setVilleFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name-asc');

  // Options dérivées des données réelles
  const typeOptions = useMemo(() => {
    const map = new Map<DragueTypeSlug, string>();
    for (const l of lieux) map.set(l.typeSlug, l.typeLabel);
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [lieux]);

  const orientationOptions = useMemo(() => {
    const set = new Set<DragueOrientation>();
    for (const l of lieux) l.orientation.forEach((o) => set.add(o));
    return Array.from(set).sort();
  }, [lieux]);

  const affluenceOptions: DragueAffluenceNiveau[] = ['faible', 'moderee', 'forte', 'variable'];

  const villeOptions = useMemo(() => {
    if (!showVilleFilter) return [];
    const map = new Map<string, string>();
    for (const l of lieux) map.set(l.localisation.villeSlug, l.localisation.ville);
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [lieux, showVilleFilter]);

  const filtered = useMemo(() => {
    let r = lieux;
    if (typeFilter !== 'all') r = r.filter((l) => l.typeSlug === typeFilter);
    if (orientationFilter !== 'all') r = r.filter((l) => l.orientation.includes(orientationFilter));
    if (affluenceFilter !== 'all') r = r.filter((l) => l.frequentation.affluenceNiveau === affluenceFilter);
    if (villeFilter !== 'all') r = r.filter((l) => l.localisation.villeSlug === villeFilter);

    const sorted = [...r];
    if (sortKey === 'name-asc') sorted.sort((a, b) => a.nom.localeCompare(b.nom));
    else if (sortKey === 'ville-asc') sorted.sort((a, b) => a.localisation.ville.localeCompare(b.localisation.ville));
    else if (sortKey === 'affluence-desc') {
      const order: Record<DragueAffluenceNiveau, number> = { forte: 3, moderee: 2, variable: 1, faible: 0 };
      sorted.sort((a, b) => order[b.frequentation.affluenceNiveau] - order[a.frequentation.affluenceNiveau]);
    }
    return avoidAdjacentDuplicateImages(sorted);
  }, [lieux, typeFilter, orientationFilter, affluenceFilter, villeFilter, sortKey]);

  const reset = () => {
    setTypeFilter('all');
    setOrientationFilter('all');
    setAffluenceFilter('all');
    setVilleFilter('all');
    setSortKey('name-asc');
  };

  const hasFilter =
    typeFilter !== 'all' || orientationFilter !== 'all' || affluenceFilter !== 'all' || villeFilter !== 'all';

  return (
    <section className="mb-8">
      {/* Barre de filtres */}
      <div className="bg-bg-secondary rounded-xl border border-border p-4 sm:p-5 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Type */}
          <div>
            <label className="block text-text-muted text-xs mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as DragueTypeSlug | 'all')}
              className="w-full bg-bg-tertiary border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
            >
              <option value="all">Tous types</option>
              {typeOptions.map(([slug, label]) => (
                <option key={slug} value={slug}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Orientation */}
          <div>
            <label className="block text-text-muted text-xs mb-1">Orientation</label>
            <select
              value={orientationFilter}
              onChange={(e) => setOrientationFilter(e.target.value as DragueOrientation | 'all')}
              className="w-full bg-bg-tertiary border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
            >
              <option value="all">Toutes</option>
              {orientationOptions.map((o) => (
                <option key={o} value={o}>
                  {o.charAt(0).toUpperCase() + o.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Affluence */}
          <div>
            <label className="block text-text-muted text-xs mb-1">Affluence</label>
            <select
              value={affluenceFilter}
              onChange={(e) => setAffluenceFilter(e.target.value as DragueAffluenceNiveau | 'all')}
              className="w-full bg-bg-tertiary border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
            >
              <option value="all">Toutes</option>
              {affluenceOptions.map((a) => (
                <option key={a} value={a}>
                  {a === 'moderee' ? 'Modérée' : a.charAt(0).toUpperCase() + a.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Ville (optionnel) */}
          {showVilleFilter && villeOptions.length > 1 && (
            <div>
              <label className="block text-text-muted text-xs mb-1">Ville</label>
              <select
                value={villeFilter}
                onChange={(e) => setVilleFilter(e.target.value)}
                className="w-full bg-bg-tertiary border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
              >
                <option value="all">Toutes villes</option>
                {villeOptions.map(([slug, name]) => (
                  <option key={slug} value={slug}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tri */}
          <div>
            <label className="block text-text-muted text-xs mb-1">Tri</label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="w-full bg-bg-tertiary border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:border-accent-primary focus:outline-none"
            >
              <option value="name-asc">Nom A→Z</option>
              <option value="ville-asc">Ville A→Z</option>
              <option value="affluence-desc">Affluence (forte→faible)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <p className="text-text-secondary text-sm">
            <span className="text-accent-primary font-bold">{filtered.length}</span> résultat{filtered.length > 1 ? 's' : ''}
          </p>
          {hasFilter && (
            <button
              onClick={reset}
              className="text-text-muted hover:text-accent-primary text-sm transition-colors"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* Liste filtrée */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-bg-secondary rounded-xl border border-border">
          <p className="text-text-secondary">Aucun lieu ne correspond à ces filtres.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lieu, index) => (
            <LieuDragueCard key={lieu.id} lieu={lieu} defaultOpen={index < defaultOpenCount} />
          ))}
        </div>
      )}
    </section>
  );
}
