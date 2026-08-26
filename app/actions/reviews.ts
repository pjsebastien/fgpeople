'use server';

/**
 * Server Actions — Soumission et modération des avis.
 *
 * Toutes ces actions s'exécutent côté serveur uniquement.
 * Le client n'a JAMAIS accès au service_role key Supabase.
 */

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  insertPendingReview,
  countRecentReviewsByIp,
  countRecentReviewsByIpAndEntity,
  setReviewStatus,
  deleteReview as deleteReviewDb,
  getReviewById,
  isReviewsEnabled,
} from '@/lib/data/reviews';
import {
  validateReviewFields,
  checkAntiBot,
  hashIp,
  getClientIp,
  REVIEW_LIMITS,
} from '@/lib/utils/review-validation';
import { sanitizeTags } from '@/lib/utils/review-criteria';
import { notifyAdminNewReview } from '@/lib/utils/review-email';
import { requireAdmin } from '@/lib/utils/admin-auth';
import type { EntityType, SubmitReviewResult, Review } from '@/lib/types/reviews';

// ============================================
// SUBMIT (public)
// ============================================

function parseEntityType(v: FormDataEntryValue | null): EntityType {
  return v === 'club' ? 'club' : 'lieu';
}

export async function submitReviewAction(formData: FormData): Promise<SubmitReviewResult> {
  if (!isReviewsEnabled()) {
    return { ok: false, error: 'Le système d\'avis n\'est pas configuré.' };
  }

  // Anti-bot
  const antiBotError = checkAntiBot({
    honeypot: formData.get('website'),
    formLoadedAt: formData.get('_t'),
  });
  if (antiBotError) return { ok: false, error: antiBotError };

  // Champs requis
  const entityType = parseEntityType(formData.get('entityType'));
  const lieuId = String(formData.get('lieuId') || '').trim();
  const lieuSlug = String(formData.get('lieuSlug') || '').trim();
  const villeSlug = String(formData.get('villeSlug') || '').trim();
  if (!lieuId || !lieuSlug || !villeSlug) {
    return { ok: false, error: 'Données invalides.' };
  }

  // Validation rating + comment + pseudo
  const validated = validateReviewFields({
    rating: formData.get('rating'),
    comment: formData.get('comment'),
    pseudo: formData.get('pseudo'),
  });
  if (!validated.ok) return { ok: false, error: validated.error };

  // Tags (multi-select : on récupère toutes les valeurs du champ "tags")
  const tags = sanitizeTags(formData.getAll('tags'));

  // Rate limit IP
  const h = await headers();
  const ip = getClientIp(h);
  const ipHash = hashIp(ip);
  const userAgent = h.get('user-agent') || null;

  if (ipHash) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [perIpAll, perIpEntity] = await Promise.all([
      countRecentReviewsByIp(ipHash, since),
      countRecentReviewsByIpAndEntity(ipHash, entityType, lieuId, since),
    ]);
    if (perIpEntity >= REVIEW_LIMITS.MAX_PER_IP_LIEU_24H) {
      return {
        ok: false,
        error: 'Tu as déjà laissé un avis sur cet établissement récemment. Reviens dans 24h.',
      };
    }
    if (perIpAll >= REVIEW_LIMITS.MAX_PER_IP_24H) {
      return {
        ok: false,
        error: 'Trop d\'avis envoyés depuis ton réseau aujourd\'hui. Reviens demain.',
      };
    }
  }

  // Insert
  const review = await insertPendingReview({
    entityType,
    lieuId,
    lieuSlug,
    villeSlug,
    rating: validated.value.rating,
    comment: validated.value.comment,
    pseudo: validated.value.pseudo,
    tags,
    ipHash,
    userAgent: userAgent ? userAgent.slice(0, 500) : null,
  });

  if (!review) {
    return { ok: false, error: 'Une erreur est survenue, réessaie dans un instant.' };
  }

  // Notif admin (échec silencieux)
  const lieuName = String(formData.get('lieuName') || '').trim() || undefined;
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  notifyAdminNewReview(review, lieuName);

  return { ok: true };
}

// ============================================
// MODÉRATION (admin)
// ============================================

/** Revalide les pages affichant l'entité. */
function revalidateForReview(review: Review | null) {
  if (!review) {
    revalidatePath('/admin/avis');
    return;
  }
  if (review.entity_type === 'site') {
    // Page d'avis du site + comparatif (la note moyenne y est affichée)
    revalidatePath(`/${review.lieu_slug}`);
    revalidatePath('/comparatif-sites-libertins');
  } else if (review.entity_type === 'club') {
    // Page détail du club
    revalidatePath(`/${review.lieu_slug}`);
    // Pages de listing concernées (la ville suffit en général)
    if (review.ville_slug) {
      revalidatePath(`/ville/${review.ville_slug}`);
    }
  } else {
    // Lieu de drague
    if (review.ville_slug) {
      revalidatePath(`/lieu-de-drague/ville/${review.ville_slug}`);
    }
  }
  revalidatePath('/admin/avis');
}

export async function approveReviewAction(id: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const review = await getReviewById(id);
  if (!review) return { ok: false, error: 'Avis introuvable' };
  const ok = await setReviewStatus(id, 'approved');
  if (!ok) return { ok: false, error: 'Échec de la mise à jour' };
  revalidateForReview(review);
  return { ok: true };
}

export async function rejectReviewAction(id: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const review = await getReviewById(id);
  if (!review) return { ok: false, error: 'Avis introuvable' };
  const ok = await setReviewStatus(id, 'rejected');
  if (!ok) return { ok: false, error: 'Échec de la mise à jour' };
  revalidateForReview(review);
  return { ok: true };
}

export async function deleteReviewAction(id: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const review = await getReviewById(id);
  const ok = await deleteReviewDb(id);
  if (!ok) return { ok: false, error: 'Échec de la suppression' };
  revalidateForReview(review);
  return { ok: true };
}
