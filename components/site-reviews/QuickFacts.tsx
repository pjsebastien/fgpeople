/**
 * Bandeau de chiffres clés, juste sous l'en-tête.
 * Répond en un coup d'œil aux questions qu'on se pose avant de lire.
 */

import type { QuickFact } from '@/lib/types/site-review';

export default function QuickFacts({ facts }: { facts: QuickFact[] }) {
  if (facts.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-xl overflow-hidden border border-border">
      {facts.map((f, i) => (
        <div key={i} className="bg-bg-secondary p-4 text-center">
          {f.icon && (
            <div className="text-xl mb-1" aria-hidden="true">
              {f.icon}
            </div>
          )}
          <dt className="text-text-muted text-[11px] uppercase tracking-wide mb-1">{f.label}</dt>
          <dd className="text-text-primary font-bold text-sm leading-tight">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
