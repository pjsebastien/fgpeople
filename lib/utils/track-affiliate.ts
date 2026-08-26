/**
 * Envoi du clic d'affiliation aux statistiques, côté navigateur.
 *
 * navigator.sendBeacon met la requête en file d'attente au niveau du
 * navigateur : elle part même si la page est immédiatement quittée, et elle
 * ne bloque jamais l'ouverture du lien partenaire.
 */

/** Emplacements de CTA suivis. Une valeur par position réelle dans le site. */
export type AffiliateBlock =
  | 'floating-cta'
  | 'floating-cta-reduit'
  | 'popup'
  | 'bloc-libertin'
  | 'bloc-gay'
  | 'avis-entete'
  | 'avis-milieu'
  | 'avis-tarifs'
  | 'avis-verdict'
  | 'avis-colonne'
  | 'avis-alternative'
  | 'comparatif-tableau'
  | 'comparatif-fiche';

export function trackAffiliateClick(target: string, block: AffiliateBlock | string): void {
  if (typeof window === 'undefined') return;

  try {
    const payload = JSON.stringify({
      target,
      block,
      page: window.location.pathname,
      referrer: document.referrer || null,
    });

    const blob = new Blob([payload], { type: 'application/json' });

    if (navigator.sendBeacon?.('/api/aff', blob)) return;

    // Repli pour les navigateurs sans sendBeacon : keepalive joue le même rôle
    void fetch('/api/aff', {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Une statistique perdue ne doit jamais empêcher un clic d'aboutir
  }
}
