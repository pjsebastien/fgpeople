'use client';

/**
 * HeroSearch - Client Component
 * Barre de recherche dans le hero avec résultats en temps réel
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { Club } from '@/lib/types';

interface HeroSearchProps {
  clubs: Club[];
}

export default function HeroSearch({ clubs }: HeroSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtrer les clubs selon la recherche
  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const searchTerm = query.toLowerCase().trim();
    return clubs
      .filter((club) => {
        const searchIn = [
          club.nom,
          club.ville,
          club.region,
          club.departement_nom,
          club.type,
        ]
          .join(' ')
          .toLowerCase();
        return searchIn.includes(searchTerm);
      })
      .slice(0, 8); // Limiter à 8 résultats
  }, [clubs, query]);

  // Fermer les résultats si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showResults = isFocused && query.length >= 2;

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto relative">
      {/* Barre de recherche */}
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
          placeholder="Rechercher un club, une ville..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
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

      {/* Résultats */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary/95 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-2xl z-50">
          {results.length > 0 ? (
            <>
              <ul className="divide-y divide-border">
                {results.map((club) => (
                  <li key={club.id}>
                    <Link
                      href={`/${club.slug}`}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-bg-tertiary transition-colors"
                      onClick={() => setIsFocused(false)}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-accent-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
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
                          <span
                            key={t.slug}
                            className="px-2 py-0.5 text-xs font-medium bg-accent-primary/10 text-accent-primary rounded-full"
                          >
                            {t.label}
                          </span>
                        ))}
                      </div>
                      <svg
                        className="w-5 h-5 text-text-muted flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="px-5 py-3 bg-bg-tertiary border-t border-border">
                <Link
                  href={`/clubs?q=${encodeURIComponent(query)}`}
                  className="flex items-center justify-center gap-2 text-sm text-accent-primary hover:text-accent-hover transition-colors"
                  onClick={() => setIsFocused(false)}
                >
                  Voir tous les résultats pour "{query}"
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="px-5 py-8 text-center">
              <svg
                className="w-12 h-12 mx-auto text-text-muted mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-text-muted">Aucun club trouvé pour "{query}"</p>
              <p className="text-sm text-text-muted mt-1">Essayez une autre recherche</p>
            </div>
          )}
        </div>
      )}

      {/* Suggestions rapides */}
      {!showResults && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary/95 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-2xl z-50 p-5">
          <p className="text-sm text-text-muted mb-3">Recherches populaires</p>
          <div className="flex flex-wrap gap-2">
            {['Paris', 'Lyon', 'Bordeaux', 'Sauna', 'Spa', 'Marseille'].map((suggestion) => (
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
  );
}
