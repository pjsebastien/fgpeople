/**
 * Affiche les "dominantes" agrégées des avis (server component).
 * Lit les TagStats et affiche pour chaque catégorie la valeur la plus citée.
 */

import type { TagStats } from '@/lib/types/reviews';
import { ALL_CRITERIA as CRITERIA, CRITERIA_BY_KEY } from '@/lib/utils/review-criteria';

interface TagsSummaryProps {
  tagStats: TagStats;
  /** Nombre total d'avis (pour calculer % dominante) */
  totalReviews: number;
  /** Affichage compact ou large */
  variant?: 'compact' | 'large';
}

interface DominantTag {
  categoryKey: string;
  categoryLabel: string;
  optionLabel: string;
  count: number;
  percent: number;
}

function computeDominants(tagStats: TagStats, total: number): DominantTag[] {
  if (total <= 0) return [];
  const out: DominantTag[] = [];
  for (const cat of CRITERIA) {
    const list = tagStats[cat.key];
    if (!list || list.length === 0) continue;
    const top = list[0];
    const opt = cat.options.find((o) => o.value === top.value);
    if (!opt) continue;
    out.push({
      categoryKey: cat.key,
      categoryLabel: cat.label,
      optionLabel: opt.label,
      count: top.count,
      percent: Math.round((top.count / total) * 100),
    });
  }
  return out;
}

export default function TagsSummary({ tagStats, totalReviews, variant = 'compact' }: TagsSummaryProps) {
  const dominants = computeDominants(tagStats, totalReviews);
  if (dominants.length === 0) return null;

  if (variant === 'large') {
    return (
      <section className="bg-bg-tertiary border border-border rounded-lg p-4">
        <h4 className="text-text-primary text-sm font-semibold mb-3">
          Profil dominant (basé sur {totalReviews} avis)
        </h4>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {dominants.map((d) => (
            <div key={d.categoryKey}>
              <dt className="text-text-muted text-xs">{d.categoryLabel}</dt>
              <dd className="text-text-primary font-medium text-sm">
                {d.optionLabel}{' '}
                <span className="text-text-muted text-xs font-normal">
                  ({d.percent}%)
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  return (
    <ul className="flex flex-wrap gap-1.5">
      {dominants.slice(0, 4).map((d) => (
        <li
          key={d.categoryKey}
          className="px-2 py-0.5 bg-accent-primary/10 text-accent-primary text-xs rounded-full border border-accent-primary/20"
          title={`${d.categoryLabel} : ${d.optionLabel} (${d.percent}% des avis)`}
        >
          {d.optionLabel}
        </li>
      ))}
    </ul>
  );
}

/** Variante détaillée : tous les choix des catégories avec leurs %. */
export function TagsBreakdown({
  tagStats,
  totalReviews,
}: {
  tagStats: TagStats;
  totalReviews: number;
}) {
  if (totalReviews <= 0) return null;
  const cats = CRITERIA.filter((c) => tagStats[c.key] && tagStats[c.key].length > 0);
  if (cats.length === 0) return null;

  return (
    <div className="space-y-3">
      {cats.map((cat) => {
        const list = tagStats[cat.key];
        return (
          <div key={cat.key}>
            <h5 className="text-text-secondary text-xs font-semibold mb-1">{cat.label}</h5>
            <ul className="space-y-1">
              {list.map((t) => {
                const opt = CRITERIA_BY_KEY[cat.key]?.options.find((o) => o.value === t.value);
                if (!opt) return null;
                const percent = Math.round((t.count / totalReviews) * 100);
                return (
                  <li key={t.value} className="flex items-center gap-2 text-xs">
                    <div className="flex-1 bg-bg-tertiary rounded h-2 overflow-hidden">
                      <div
                        className="h-full bg-accent-primary/60 rounded"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-text-secondary min-w-[8rem]">{opt.label}</span>
                    <span className="text-text-muted tabular-nums w-12 text-right">{percent}%</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
