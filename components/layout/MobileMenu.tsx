'use client';

/**
 * MobileMenu - Client Component
 * Menu mobile avec sections expansibles pour régions et départements
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Region, Departement, TypeCategory } from '@/lib/types';

interface MobileMenuProps {
  regions: Region[];
  departements: Departement[];
  typeCategories: TypeCategory[];
}

export default function MobileMenu({ regions, departements, typeCategories }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const pathname = usePathname();

  // Grouper les départements par région
  const deptsByRegion = departements.reduce((acc, dept) => {
    if (!acc[dept.regionSlug]) {
      acc[dept.regionSlug] = [];
    }
    acc[dept.regionSlug].push(dept);
    return acc;
  }, {} as Record<string, Departement[]>);

  // Fermer le menu lors du changement de page
  useEffect(() => {
    setIsOpen(false);
    setExpandedSection(null);
  }, [pathname]);

  // Empêcher le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="lg:hidden">
      {/* Bouton Hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 p-2 text-text-primary hover:text-accent-primary transition-colors"
        aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={isOpen}
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span className={`block h-0.5 w-full bg-current transform transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-full bg-current transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-full bg-current transform transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </div>
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-bg-secondary border-l border-border z-40 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-20 pb-6 overflow-y-auto">
          <nav className="flex-1 px-4">
            {/* Liens principaux */}
            <div className="space-y-1 mb-4">
              <Link href="/" className="block px-4 py-3 rounded-lg text-base font-medium text-text-secondary hover:bg-bg-tertiary hover:text-text-primary">
                Accueil
              </Link>
            </div>

            {/* Section Types */}
            <div className="border-t border-border pt-4 mb-4">
              <button
                onClick={() => toggleSection('types')}
                className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-text-primary"
              >
                <span>Par type</span>
                <svg className={`w-5 h-5 transition-transform ${expandedSection === 'types' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === 'types' && (
                <div className="mt-2 space-y-1 pl-4">
                  {typeCategories.map((type) => (
                    <Link
                      key={type.slug}
                      href={`/${type.urlSlug}`}
                      className="flex items-center justify-between px-4 py-2 text-sm text-text-secondary hover:text-accent-primary rounded-lg"
                    >
                      <span>{type.labelPlural}</span>
                      <span className="text-text-muted text-xs">{type.clubCount}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Section Régions */}
            <div className="border-t border-border pt-4 mb-4">
              <button
                onClick={() => toggleSection('regions')}
                className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-text-primary"
              >
                <span>Régions</span>
                <svg className={`w-5 h-5 transition-transform ${expandedSection === 'regions' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === 'regions' && (
                <div className="mt-2 space-y-1 pl-4">
                  {regions.map((region) => (
                    <Link
                      key={region.slug}
                      href={`/region/${region.slug}`}
                      className="block px-4 py-2 text-sm text-text-secondary hover:text-accent-primary rounded-lg"
                    >
                      {region.nom} <span className="text-text-muted">({region.clubCount})</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Section Départements */}
            <div className="border-t border-border pt-4 mb-4">
              <button
                onClick={() => toggleSection('departements')}
                className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-text-primary"
              >
                <span>Départements</span>
                <svg className={`w-5 h-5 transition-transform ${expandedSection === 'departements' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === 'departements' && (
                <div className="mt-2 space-y-4 pl-4 max-h-60 overflow-y-auto">
                  {regions.map((region) => (
                    <div key={region.slug}>
                      <p className="text-xs font-semibold text-accent-primary px-4 mb-1">{region.nom}</p>
                      <div className="flex flex-wrap gap-1 px-4">
                        {deptsByRegion[region.slug]?.map((dept) => (
                          <Link
                            key={dept.slug}
                            href={`/departement/${dept.slug}`}
                            className="px-2 py-1 text-xs text-text-secondary hover:text-accent-primary bg-bg-tertiary rounded"
                          >
                            {dept.code}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Étranger */}
            <div className="border-t border-border pt-4">
              <Link href="/etranger" className="block px-4 py-3 rounded-lg text-base font-medium text-text-secondary hover:bg-bg-tertiary hover:text-text-primary">
                Clubs à l'étranger
              </Link>
            </div>

            {/* Conseils */}
            <div className="border-t border-border pt-4">
              <Link href="/conseils" className="block px-4 py-3 rounded-lg text-base font-medium text-text-secondary hover:bg-bg-tertiary hover:text-text-primary">
                Conseils
              </Link>
            </div>
          </nav>

          {/* CTA Button */}
          <div className="px-4 pt-6 border-t border-border mt-4">
            <Link href="/#regions" className="btn-primary w-full text-center" onClick={() => setIsOpen(false)}>
              Explorer les clubs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
