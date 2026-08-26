/**
 * Réception des clics sur les liens d'affiliation.
 *
 * Appelée par navigator.sendBeacon() au moment du clic : la requête part en
 * arrière-plan et survit à la navigation, sans retarder d'une milliseconde
 * l'ouverture du lien partenaire.
 *
 * Choix assumé : on ne fait PAS transiter le visiteur par une redirection
 * /go/xxx. Un saut supplémentaire entre le clic et l'annonceur peut casser
 * l'attribution de la commission ou déclencher sa détection de fraude —
 * mieux vaut perdre quelques clics dans les statistiques que de perdre des
 * commissions réelles.
 */

import { NextResponse } from 'next/server';
import { recordClick, isClickTrackingEnabled } from '@/lib/data/affiliate-clicks';
import { hashIp, getClientIp } from '@/lib/utils/review-validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Réponse vide : le navigateur n'attend rien, autant ne rien renvoyer. */
const NO_CONTENT = new NextResponse(null, { status: 204 });

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  // sendBeacon envoie toujours un Origin ; son absence trahit un appel forgé
  if (!origin) return false;
  const host = request.headers.get('host');
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  // Statistiques non configurées : on absorbe silencieusement
  if (!isClickTrackingEnabled()) return NO_CONTENT;

  // Empêche qu'un tiers gonfle les compteurs depuis l'extérieur
  if (!isSameOrigin(request)) return NO_CONTENT;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NO_CONTENT;
  }

  const { target, block, page, referrer } = (body || {}) as Record<string, unknown>;
  if (typeof target !== 'string' || typeof block !== 'string' || typeof page !== 'string') {
    return NO_CONTENT;
  }
  if (!target || !block || !page) return NO_CONTENT;

  await recordClick({
    target,
    block,
    pagePath: page,
    referrer: typeof referrer === 'string' ? referrer : null,
    ipHash: hashIp(getClientIp(request.headers)),
    userAgent: request.headers.get('user-agent'),
  });

  return NO_CONTENT;
}
