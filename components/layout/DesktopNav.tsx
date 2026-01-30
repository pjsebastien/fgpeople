'use client';

/**
 * DesktopNav - Client Component
 * Navigation desktop avec menus déroulants
 */

import { useState } from 'react';
import Link from 'next/link';
import type { Region, Departement, TypeCategory } from '@/lib/types';

interface DesktopNavProps {
  regions: Region[];
  departements: Departement[];
  typeCategories: TypeCategory[];
}

export default function DesktopNav({ regions, departements, typeCategories }: DesktopNavProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Grouper les départements par région
  const deptsByRegion = departements.reduce((acc, dept) => {
    if (!acc[dept.regionSlug]) {
      acc[dept.regionSlug] = [];
    }
    acc[dept.regionSlug].push(dept);
    return acc;
  }, {} as Record<string, Departement[]>);

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {/* Accueil */}
      <Link
        href="/"
        className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors rounded-lg hover:bg-bg-secondary"
      >
        Accueil
      </Link>

      {/* Types - Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => setActiveMenu('types')}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <button
          className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors rounded-lg hover:bg-bg-secondary flex items-center gap-1"
        >
          Par type
          <svg className={`w-4 h-4 transition-transform ${activeMenu === 'types' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {activeMenu === 'types' && (
          <div className="absolute top-full left-0 mt-1 w-[280px] bg-bg-secondary border border-border rounded-xl shadow-xl p-2 z-50">
            {typeCategories.map((type) => (
              <Link
                key={type.slug}
                href={`/${type.urlSlug}`}
                className="flex items-center justify-between px-4 py-2.5 text-sm text-text-secondary hover:text-accent-primary hover:bg-bg-tertiary rounded-lg transition-colors"
              >
                <span className="font-medium">{type.labelPlural}</span>
                <span className="text-text-muted text-xs bg-bg-primary px-2 py-0.5 rounded-full">{type.clubCount}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Régions - Mega Menu */}
      <div
        className="relative"
        onMouseEnter={() => setActiveMenu('regions')}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <button
          className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors rounded-lg hover:bg-bg-secondary flex items-center gap-1"
        >
          Régions
          <svg className={`w-4 h-4 transition-transform ${activeMenu === 'regions' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {activeMenu === 'regions' && (
          <div className="absolute top-full left-0 mt-1 w-[600px] bg-bg-secondary border border-border rounded-xl shadow-xl p-4 grid grid-cols-3 gap-2 z-50">
            {regions.map((region) => (
              <Link
                key={region.slug}
                href={`/region/${region.slug}`}
                className="px-3 py-2 text-sm text-text-secondary hover:text-accent-primary hover:bg-bg-tertiary rounded-lg transition-colors"
              >
                <span className="font-medium">{region.nom}</span>
                <span className="text-text-muted ml-1 text-xs">({region.clubCount})</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Départements - Mega Menu */}
      <div
        className="relative"
        onMouseEnter={() => setActiveMenu('departements')}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <button
          className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors rounded-lg hover:bg-bg-secondary flex items-center gap-1"
        >
          Départements
          <svg className={`w-4 h-4 transition-transform ${activeMenu === 'departements' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {activeMenu === 'departements' && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[800px] max-h-[70vh] overflow-y-auto bg-bg-secondary border border-border rounded-xl shadow-xl p-4 z-50">
            <div className="grid grid-cols-2 gap-6">
              {regions.map((region) => (
                <div key={region.slug}>
                  <Link
                    href={`/region/${region.slug}`}
                    className="text-accent-primary font-semibold text-sm mb-2 block hover:underline"
                  >
                    {region.nom}
                  </Link>
                  <div className="flex flex-wrap gap-1">
                    {deptsByRegion[region.slug]?.map((dept) => (
                      <Link
                        key={dept.slug}
                        href={`/departement/${dept.slug}`}
                        className="px-2 py-1 text-xs text-text-secondary hover:text-accent-primary hover:bg-bg-tertiary rounded transition-colors"
                      >
                        {dept.code}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Étranger */}
      <Link
        href="/etranger"
        className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors rounded-lg hover:bg-bg-secondary"
      >
        Étranger
      </Link>

      {/* Conseils */}
      <Link
        href="/conseils"
        className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors rounded-lg hover:bg-bg-secondary"
      >
        Conseils
      </Link>
    </nav>
  );
}
