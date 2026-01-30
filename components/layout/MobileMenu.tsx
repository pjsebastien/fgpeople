'use client';

/**
 * MobileMenu - Client Component
 * Menu mobile avec sections expansibles pour régions et départements
 * Utilise un Portal pour s'afficher au-dessus de tout (y compris AgeVerification)
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Grouper les départements par région
  const deptsByRegion = departements.reduce((acc, dept) => {
    if (!acc[dept.regionSlug]) {
      acc[dept.regionSlug] = [];
    }
    acc[dept.regionSlug].push(dept);
    return acc;
  }, {} as Record<string, Departement[]>);

  // Monté côté client pour le Portal
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Contenu du menu (overlay + panel) rendu via Portal
  const menuContent = (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-[200] transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: '#141414', borderLeft: '1px solid #2a2a2a' }}
      >
        <div className="flex flex-col h-full pt-20 pb-6 overflow-y-auto">
          {/* Bouton fermer */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 text-text-primary hover:text-accent-primary"
            aria-label="Fermer le menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <nav className="flex-1 px-4">
            {/* Liens principaux */}
            <div className="space-y-1 mb-4">
              <Link href="/" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-400 hover:bg-[#1a1a1a] hover:text-white">
                Accueil
              </Link>
            </div>

            {/* Section Types */}
            <div className="border-t border-[#2a2a2a] pt-4 mb-4">
              <button
                onClick={() => toggleSection('types')}
                className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-white"
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
                      className="flex items-center justify-between px-4 py-2 text-sm text-gray-400 hover:text-[#c9a227] rounded-lg"
                    >
                      <span>{type.labelPlural}</span>
                      <span className="text-gray-500 text-xs">{type.clubCount}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Section Régions */}
            <div className="border-t border-[#2a2a2a] pt-4 mb-4">
              <button
                onClick={() => toggleSection('regions')}
                className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-white"
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
                      className="block px-4 py-2 text-sm text-gray-400 hover:text-[#c9a227] rounded-lg"
                    >
                      {region.nom} <span className="text-gray-500">({region.clubCount})</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Section Départements */}
            <div className="border-t border-[#2a2a2a] pt-4 mb-4">
              <button
                onClick={() => toggleSection('departements')}
                className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-white"
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
                      <p className="text-xs font-semibold text-[#c9a227] px-4 mb-1">{region.nom}</p>
                      <div className="flex flex-wrap gap-1 px-4">
                        {deptsByRegion[region.slug]?.map((dept) => (
                          <Link
                            key={dept.slug}
                            href={`/departement/${dept.slug}`}
                            className="px-2 py-1 text-xs text-gray-400 hover:text-[#c9a227] bg-[#1a1a1a] rounded"
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
            <div className="border-t border-[#2a2a2a] pt-4">
              <Link href="/etranger" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-400 hover:bg-[#1a1a1a] hover:text-white">
                Clubs à l'étranger
              </Link>
            </div>

            {/* Conseils */}
            <div className="border-t border-[#2a2a2a] pt-4">
              <Link href="/conseils" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-400 hover:bg-[#1a1a1a] hover:text-white">
                Conseils
              </Link>
            </div>
          </nav>

          {/* CTA Button */}
          <div className="px-4 pt-6 border-t border-[#2a2a2a] mt-4">
            <Link
              href="/#regions"
              className="block w-full text-center px-6 py-3 bg-[#c9a227] text-[#0a0a0a] font-semibold rounded-lg hover:bg-[#d4af37]"
              onClick={() => setIsOpen(false)}
            >
              Explorer les clubs
            </Link>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="lg:hidden">
      {/* Bouton Hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-[50] p-2 text-text-primary hover:text-accent-primary transition-colors"
        aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={isOpen}
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span className={`block h-0.5 w-full bg-current transform transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-full bg-current transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-full bg-current transform transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </div>
      </button>

      {/* Menu rendu via Portal pour être au-dessus de tout */}
      {mounted && createPortal(menuContent, document.body)}
    </div>
  );
}
