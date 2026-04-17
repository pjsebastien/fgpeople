/**
 * DragueList - Liste de lieux de drague (server component)
 * Réordonne les lieux pour éviter d'avoir 2 fois la même image consécutive
 */

import LieuDragueCard from './LieuDragueCard';
import { avoidAdjacentDuplicateImages } from '@/lib/data/dragues';
import type { LieuDrague } from '@/lib/types/drague';

interface DragueListProps {
  lieux: LieuDrague[];
  title?: string;
  subtitle?: string;
  defaultOpenCount?: number; // nb de cartes ouvertes par défaut (pour SEO)
}

export default function DragueList({ lieux, title, subtitle, defaultOpenCount = 3 }: DragueListProps) {
  if (lieux.length === 0) {
    return (
      <div className="text-center py-12 bg-bg-secondary rounded-xl border border-border">
        <p className="text-text-secondary">Aucun lieu trouvé.</p>
      </div>
    );
  }

  // Réordonne pour éviter 2 images identiques côte à côte
  const ordered = avoidAdjacentDuplicateImages(lieux);

  return (
    <section>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-bold text-text-primary mb-2">{title}</h2>}
          {subtitle && <p className="text-text-secondary">{subtitle}</p>}
        </div>
      )}
      <div className="space-y-3">
        {ordered.map((lieu, index) => (
          <LieuDragueCard key={lieu.id} lieu={lieu} defaultOpen={index < defaultOpenCount} />
        ))}
      </div>
    </section>
  );
}
