/**
 * DragueDisclaimer - Disclaimer légal et sécurité (server component)
 * Variante affichée selon le slug pour éviter le contenu dupliqué
 */

import { getDragueDisclaimer, getSafetyTips } from '@/lib/utils/drague-seo-content';

interface DragueDisclaimerProps {
  slug: string;
  showSafetyTips?: boolean;
}

export default function DragueDisclaimer({ slug, showSafetyTips = false }: DragueDisclaimerProps) {
  const disclaimer = getDragueDisclaimer(slug);
  const tips = showSafetyTips ? getSafetyTips(slug, 4) : [];

  return (
    <aside className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5">
      <p className="text-text-secondary text-sm leading-relaxed">{disclaimer}</p>

      {tips.length > 0 && (
        <div className="mt-4 pt-4 border-t border-yellow-500/20">
          <h3 className="text-text-primary text-sm font-semibold mb-2">Conseils de sécurité</h3>
          <ul className="text-text-secondary text-sm space-y-1 list-disc list-inside">
            {tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
