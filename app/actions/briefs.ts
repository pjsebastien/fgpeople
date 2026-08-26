'use server';

/**
 * Server Actions — Briefs d'avis sur les sites de rencontre.
 *
 * Flux d'upload d'un média (le fichier ne transite JAMAIS par Vercel, dont les
 * Server Actions plafonnent autour de 4,5 Mo) :
 *   1. le navigateur demande un ticket signé      → getUploadTicketAction
 *   2. il POST le fichier directement à Cloudinary
 *   3. il renvoie la réponse Cloudinary à enregistrer → registerAssetAction
 */

import { revalidatePath } from 'next/cache';
import {
  createBrief,
  updateBrief,
  deleteBrief,
  getBriefBySlug,
  addAsset,
  updateAssetNotes,
  deleteAssetRow,
  getAssetById,
  reorderAssets,
  isBriefsEnabled,
} from '@/lib/data/briefs';
import { createUploadTicket, destroyAsset, isCloudinaryEnabled } from '@/lib/utils/cloudinary-server';
import { parseYouTubeId, youTubeWatchUrl } from '@/lib/utils/cloudinary';
import { requireAdmin } from '@/lib/utils/admin-auth';
import { slugify, isValidSlug } from '@/lib/utils/slugify';
import type { ActionResult, BriefFormValues, BriefStatus, AssetKind } from '@/lib/types/brief';
import type { UploadTicket } from '@/lib/utils/cloudinary-server';

function str(fd: FormData, key: string): string {
  return String(fd.get(key) || '').trim();
}

function parseStatus(v: string): BriefStatus {
  return v === 'ready' || v === 'generated' || v === 'published' ? v : 'draft';
}

// ============================================
// BRIEF
// ============================================

export async function saveBriefAction(formData: FormData): Promise<ActionResult<{ slug: string }>> {
  await requireAdmin();
  if (!isBriefsEnabled()) {
    return { ok: false, error: 'Supabase non configuré (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).' };
  }

  const id = str(formData, 'id');
  let slug = str(formData, 'slug').toLowerCase();
  const siteName = str(formData, 'site_name');

  if (!siteName) return { ok: false, error: 'Le nom du site est obligatoire.' };

  // Slug déduit du nom si laissé vide : "Place Libertine" → "avis-place-libertine"
  if (!slug) slug = `avis-${slugify(siteName)}`;

  if (!isValidSlug(slug)) {
    return { ok: false, error: 'Slug invalide : minuscules, chiffres et tirets uniquement.' };
  }

  const values: BriefFormValues = {
    slug,
    site_name: siteName,
    site_url: str(formData, 'site_url'),
    affiliate_url: str(formData, 'affiliate_url'),
    status: parseStatus(str(formData, 'status')),
    instructions: str(formData, 'instructions'),
    key_facts: str(formData, 'key_facts'),
    personal_experience: str(formData, 'personal_experience'),
    pricing_notes: str(formData, 'pricing_notes'),
    pros_notes: str(formData, 'pros_notes'),
    cons_notes: str(formData, 'cons_notes'),
    target_keywords: str(formData, 'target_keywords'),
  };

  // Refuse d'écraser un autre brief portant déjà ce slug
  const existing = await getBriefBySlug(slug);
  if (existing && existing.id !== id) {
    return { ok: false, error: `Le slug « ${slug} » est déjà utilisé par un autre brief.` };
  }

  const saved = id ? await updateBrief(id, values) : await createBrief(values);
  if (!saved) return { ok: false, error: "Échec de l'enregistrement." };

  revalidatePath('/admin/sites');
  revalidatePath(`/admin/sites/${slug}`);
  return { ok: true, data: { slug: saved.slug } };
}

export async function deleteBriefAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const ok = await deleteBrief(id);
  if (!ok) return { ok: false, error: 'Échec de la suppression.' };
  revalidatePath('/admin/sites');
  return { ok: true };
}

// ============================================
// UPLOAD CLOUDINARY
// ============================================

export async function getUploadTicketAction(
  slug: string,
  isVideo: boolean
): Promise<ActionResult<UploadTicket>> {
  await requireAdmin();
  if (!isCloudinaryEnabled()) {
    return {
      ok: false,
      error: 'Cloudinary non configuré (CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET).',
    };
  }
  if (!isValidSlug(slug)) return { ok: false, error: 'Slug invalide.' };

  const ticket = createUploadTicket(slug, isVideo);
  if (!ticket) return { ok: false, error: 'Impossible de signer la requête.' };
  return { ok: true, data: ticket };
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  duration?: number;
  resource_type?: string;
}

export async function registerAssetAction(
  briefId: string,
  briefSlug: string,
  kind: AssetKind,
  result: CloudinaryUploadResult
): Promise<ActionResult> {
  await requireAdmin();
  if (!result?.secure_url || !result?.public_id) {
    return { ok: false, error: 'Réponse Cloudinary incomplète.' };
  }

  const asset = await addAsset({
    briefId,
    kind,
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width ?? null,
    height: result.height ?? null,
    format: result.format ?? null,
    bytes: result.bytes ?? null,
    duration: result.duration ?? null,
  });
  if (!asset) return { ok: false, error: "Échec de l'enregistrement du média." };

  revalidatePath(`/admin/sites/${briefSlug}`);
  return { ok: true };
}

// ============================================
// YOUTUBE
// ============================================

export async function addYouTubeAction(
  briefId: string,
  briefSlug: string,
  rawUrl: string,
  label: string
): Promise<ActionResult> {
  await requireAdmin();
  const videoId = parseYouTubeId(rawUrl);
  if (!videoId) return { ok: false, error: 'Lien YouTube non reconnu.' };

  const asset = await addAsset({
    briefId,
    kind: 'youtube',
    url: youTubeWatchUrl(videoId),
    publicId: null,
    label: label || null,
  });
  if (!asset) return { ok: false, error: "Échec de l'ajout." };

  revalidatePath(`/admin/sites/${briefSlug}`);
  return { ok: true };
}

// ============================================
// ASSETS — édition / suppression / ordre
// ============================================

export async function updateAssetNotesAction(
  id: string,
  briefSlug: string,
  label: string,
  instruction: string
): Promise<ActionResult> {
  await requireAdmin();
  const ok = await updateAssetNotes(id, label, instruction);
  if (!ok) return { ok: false, error: 'Échec de la mise à jour.' };
  revalidatePath(`/admin/sites/${briefSlug}`);
  return { ok: true };
}

export async function deleteAssetAction(id: string, briefSlug: string): Promise<ActionResult> {
  await requireAdmin();

  const asset = await getAssetById(id);
  if (!asset) return { ok: false, error: 'Média introuvable.' };

  // On supprime d'abord la ligne : si Cloudinary échoue, mieux vaut un fichier
  // orphelin sur le CDN qu'un média fantôme dans le brief.
  const ok = await deleteAssetRow(id);
  if (!ok) return { ok: false, error: 'Échec de la suppression.' };

  if (asset.public_id) {
    await destroyAsset(asset.public_id, asset.kind === 'video');
  }

  revalidatePath(`/admin/sites/${briefSlug}`);
  return { ok: true };
}

export async function reorderAssetsAction(
  briefId: string,
  briefSlug: string,
  orderedIds: string[]
): Promise<ActionResult> {
  await requireAdmin();
  const ok = await reorderAssets(briefId, orderedIds);
  if (!ok) return { ok: false, error: 'Échec du réordonnancement.' };
  revalidatePath(`/admin/sites/${briefSlug}`);
  return { ok: true };
}
