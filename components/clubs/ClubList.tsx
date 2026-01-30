/**
 * ClubList - Server Component
 * Liste de clubs avec grille responsive et images variées
 */

import type { Club } from '@/lib/types';
import ClubCard, { getImageIndexForClub } from './ClubCard';

const TOTAL_IMAGES = 12;

interface ClubListProps {
  clubs: Club[];
  title?: string;
  subtitle?: string;
  showCount?: boolean;
  columns?: 2 | 3 | 4;
  emptyMessage?: string;
}

// Calcule les indices d'images pour éviter les répétitions adjacentes
// Vérifie les voisins horizontaux (gauche) et verticaux (dessus) pour grilles 1-4 colonnes
function calculateImageIndices(clubs: Club[], maxColumns: number): number[] {
  if (clubs.length === 0) return [];

  const indices: number[] = [];

  for (let i = 0; i < clubs.length; i++) {
    let imgIndex = getImageIndexForClub(clubs[i].nom);

    // Collecter les indices des voisins potentiels
    // Pour une grille responsive, on vérifie les positions qui seraient adjacentes
    // dans toutes les configurations possibles (1, 2, 3, 4 colonnes)
    const neighborIndices: number[] = [];

    // Voisin gauche (index - 1) - valable pour toutes les grilles sauf première colonne
    if (i > 0) {
      neighborIndices.push(indices[i - 1]);
    }

    // Voisins au-dessus selon le nombre de colonnes possible
    // On vérifie pour 2, 3 et 4 colonnes
    for (let cols = 2; cols <= maxColumns; cols++) {
      if (i >= cols) {
        neighborIndices.push(indices[i - cols]);
      }
    }

    // Si l'image naturelle est identique à un voisin, trouver une autre
    let attempts = 0;
    while (neighborIndices.includes(imgIndex) && attempts < TOTAL_IMAGES) {
      imgIndex = (imgIndex + 1) % TOTAL_IMAGES;
      attempts++;
    }

    indices.push(imgIndex);
  }

  return indices;
}

export default function ClubList({
  clubs,
  title,
  subtitle,
  showCount = true,
  columns = 3,
  emptyMessage = 'Aucun club trouvé dans cette catégorie.',
}: ClubListProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (clubs.length === 0) {
    return (
      <div className="text-center py-12 bg-bg-secondary rounded-xl border border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg-tertiary mb-4">
          <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <p className="text-text-secondary">{emptyMessage}</p>
      </div>
    );
  }

  // Calculer les indices d'images pour éviter les répétitions adjacentes
  const imageIndices = calculateImageIndices(clubs, columns);

  return (
    <section>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-bold text-text-primary mb-2">{title}</h2>}
          {subtitle && <p className="text-text-secondary">{subtitle}</p>}
        </div>
      )}

      {showCount && (
        <p className="text-text-muted text-sm mb-6">
          {clubs.length} club{clubs.length > 1 ? 's' : ''} trouvé{clubs.length > 1 ? 's' : ''}
        </p>
      )}

      <div className={`grid ${gridCols[columns]} gap-6`}>
        {clubs.map((club, index) => (
          <ClubCard key={club.id} club={club} imageIndex={imageIndices[index]} />
        ))}
      </div>
    </section>
  );
}
