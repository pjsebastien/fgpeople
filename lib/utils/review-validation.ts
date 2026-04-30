/**
 * Validation et anti-spam pour les avis utilisateurs.
 */

import 'server-only';
import { createHash } from 'crypto';

export const REVIEW_LIMITS = {
  COMMENT_MIN: 10,
  COMMENT_MAX: 2000,
  PSEUDO_MAX: 30,
  /** Délai minimum (ms) entre l'affichage du formulaire et sa soumission. */
  MIN_FILL_TIME_MS: 3000,
  /** Délai max d'expiration du formulaire (24h pour éviter rejouage trop tardif). */
  MAX_FILL_TIME_MS: 24 * 60 * 60 * 1000,
  /** Max avis par IP toutes les 24h sur l'ensemble du site. */
  MAX_PER_IP_24H: 5,
  /** Max avis par IP sur un même lieu en 24h. */
  MAX_PER_IP_LIEU_24H: 1,
};

export interface ValidatedReviewInput {
  rating: number;
  comment: string;
  pseudo: string | null;
}

/** Validation des champs visibles. Renvoie un message d'erreur ou null. */
export function validateReviewFields(input: {
  rating: unknown;
  comment: unknown;
  pseudo?: unknown;
}): { ok: true; value: ValidatedReviewInput } | { ok: false; error: string } {
  // Rating
  const ratingNum = Number(input.rating);
  if (!Number.isFinite(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return { ok: false, error: 'Note invalide. Choisis entre 1 et 5 étoiles.' };
  }
  const rating = Math.round(ratingNum);

  // Comment
  const commentRaw = typeof input.comment === 'string' ? input.comment.trim() : '';
  if (commentRaw.length < REVIEW_LIMITS.COMMENT_MIN) {
    return {
      ok: false,
      error: `Ton commentaire est trop court (${REVIEW_LIMITS.COMMENT_MIN} caractères minimum).`,
    };
  }
  if (commentRaw.length > REVIEW_LIMITS.COMMENT_MAX) {
    return {
      ok: false,
      error: `Ton commentaire est trop long (${REVIEW_LIMITS.COMMENT_MAX} caractères maximum).`,
    };
  }
  // Limite ultra simple sur les liens (anti-spam)
  const linkCount = (commentRaw.match(/https?:\/\//gi) || []).length;
  if (linkCount > 1) {
    return { ok: false, error: 'Trop de liens dans ton commentaire.' };
  }

  // Pseudo
  let pseudo: string | null = null;
  if (typeof input.pseudo === 'string') {
    const trimmed = input.pseudo.trim();
    if (trimmed.length > REVIEW_LIMITS.PSEUDO_MAX) {
      return {
        ok: false,
        error: `Pseudo trop long (${REVIEW_LIMITS.PSEUDO_MAX} caractères maximum).`,
      };
    }
    if (trimmed) pseudo = trimmed;
  }

  return { ok: true, value: { rating, comment: commentRaw, pseudo } };
}

/**
 * Vérifie le honeypot et le délai de remplissage.
 * Renvoie un message d'erreur ou null.
 */
export function checkAntiBot(input: {
  honeypot?: unknown;
  formLoadedAt?: unknown;
}): string | null {
  // Honeypot : champ caché qui doit rester vide
  if (typeof input.honeypot === 'string' && input.honeypot.trim().length > 0) {
    return 'Erreur de soumission.';
  }
  // Délai mini de remplissage
  const ts = Number(input.formLoadedAt);
  if (Number.isFinite(ts) && ts > 0) {
    const elapsed = Date.now() - ts;
    if (elapsed < REVIEW_LIMITS.MIN_FILL_TIME_MS) {
      return 'Soumission trop rapide. Merci de patienter quelques secondes.';
    }
    if (elapsed > REVIEW_LIMITS.MAX_FILL_TIME_MS) {
      return 'Le formulaire a expiré. Merci de recharger la page.';
    }
  }
  return null;
}

/** Hash anonymisé d'une IP avec sel applicatif. */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const salt = process.env.REVIEW_IP_SALT || 'fgpeople-default-salt';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}

/** Récupère l'IP du client à partir des headers Next.js. */
export function getClientIp(headers: Headers): string | null {
  const xff = headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = headers.get('x-real-ip');
  if (real) return real.trim();
  return null;
}
