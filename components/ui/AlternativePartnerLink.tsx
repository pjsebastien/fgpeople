/**
 * Ligne discrète sous le bouton principal, qui propose le partenaire libertin
 * secondaire (Gleese tant que Carré Libertin est en tête).
 *
 * Composant SERVEUR. Le clic est crédité au partenaire secondaire avec le
 * suffixe « -alternative » sur l'emplacement, pour distinguer dans
 * /admin/clics ce lien du CTA principal.
 */

import { getLibertinAlternative } from '@/lib/config/affiliates';
import TrackedAffiliateLink from './TrackedAffiliateLink';

export default function AlternativePartnerLink({
  block,
  className = '',
}: {
  /** Emplacement du CTA principal, ex : 'bloc-libertin'. */
  block: string;
  className?: string;
}) {
  const alt = getLibertinAlternative();
  if (!alt?.altPitch) return null;

  return (
    <p className={`text-text-muted text-xs ${className}`}>
      {alt.altPitch.lead}{' '}
      <TrackedAffiliateLink
        href={alt.url}
        target={alt.target}
        block={`${block}-alternative`}
        className="text-text-secondary hover:text-accent-primary underline underline-offset-2"
      >
        {alt.altPitch.cta}
      </TrackedAffiliateLink>
    </p>
  );
}
