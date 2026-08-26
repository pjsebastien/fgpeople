/**
 * Tableau des tarifs.
 *
 * C'est la requête n°1 de la longue traîne (« wyylde tarif », « prix
 * abonnement… ») : le tableau est rendu côté serveur, en vrai <table>, donc
 * lisible par Google sans JS. Le bloc « warning » sert à afficher la
 * reconduction automatique — l'information que la concurrence cache.
 */

import AffiliateButton from './AffiliateButton';
import type { PricingInfo } from '@/lib/types/site-review';

export default function PricingTable({
  pricing,
  siteName,
  affiliateUrl,
  target,
}: {
  pricing: PricingInfo;
  siteName: string;
  affiliateUrl: string;
  /** Partenaire crédité dans les statistiques de clics. */
  target: string;
}) {
  return (
    <div className="space-y-4">
      {pricing.freeTier && (
        <div className="bg-bg-secondary border border-border rounded-xl p-4">
          <p className="text-text-primary text-sm font-semibold mb-1">Ce que permet la version gratuite</p>
          <p className="text-text-secondary text-sm leading-relaxed">{pricing.freeTier}</p>
        </div>
      )}

      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full min-w-[520px] border-collapse">
          <caption className="sr-only">Tarifs des abonnements {siteName}</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="text-left py-3 pr-4 text-text-muted text-xs font-medium uppercase tracking-wide">
                Formule
              </th>
              <th scope="col" className="text-right py-3 px-4 text-text-muted text-xs font-medium uppercase tracking-wide">
                Par mois
              </th>
              <th scope="col" className="text-right py-3 px-4 text-text-muted text-xs font-medium uppercase tracking-wide">
                Total débité
              </th>
              <th scope="col" className="text-right py-3 pl-4 text-text-muted text-xs font-medium uppercase tracking-wide">
                Économie
              </th>
            </tr>
          </thead>
          <tbody>
            {pricing.plans.map((plan, i) => (
              <tr
                key={i}
                className={`border-b border-border last:border-0 ${
                  plan.highlight ? 'bg-accent-primary/5' : ''
                }`}
              >
                <th scope="row" className="text-left py-4 pr-4 font-medium">
                  <span className="text-text-primary">{plan.name}</span>
                  {plan.highlight && (
                    <span className="ml-2 px-2 py-0.5 bg-accent-primary/20 text-accent-primary text-[10px] rounded-full border border-accent-primary/30 align-middle">
                      Meilleure offre
                    </span>
                  )}
                  {plan.features && plan.features.length > 0 && (
                    <span className="block text-text-muted text-xs font-normal mt-1">
                      {plan.features.join(' · ')}
                    </span>
                  )}
                </th>
                <td className="text-right py-4 px-4 text-text-primary font-bold tabular-nums whitespace-nowrap">
                  {plan.pricePerMonth}
                </td>
                <td className="text-right py-4 px-4 text-text-secondary tabular-nums whitespace-nowrap">
                  {plan.total || '-'}
                </td>
                <td className="text-right py-4 pl-4 tabular-nums whitespace-nowrap">
                  {plan.savings ? (
                    <span className="text-green-400 font-medium">{plan.savings}</span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pricing.warning && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex gap-3">
          <span className="text-orange-400 shrink-0" aria-hidden="true">
            ⚠
          </span>
          <p className="text-text-secondary text-sm leading-relaxed">{pricing.warning}</p>
        </div>
      )}

      {pricing.note && <p className="text-text-muted text-xs">{pricing.note}</p>}

      <div className="text-center pt-2">
        <AffiliateButton
          href={affiliateUrl}
          target={target}
          block="avis-tarifs"
          size="lg"
          note="Inscription gratuite, sans engagement"
        >
          Voir les tarifs à jour sur {siteName}
        </AffiliateButton>
      </div>
    </div>
  );
}
