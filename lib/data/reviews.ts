/**
 * Data layer — Supabase client + requêtes pour les avis.
 *
 * IMPORTANT : ce fichier ne doit JAMAIS être importé depuis un composant client.
 * Il utilise la service_role key qui doit rester serveur uniquement.
 */

import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {
  Review,
  ReviewStatus,
  EntityType,
  LieuReviewsBundle,
  ReviewsByLieuId,
  TagStats,
  TagCount,
} from '../types/reviews';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      '[reviews] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant. Voir .env.example'
    );
  }
  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

/** True si Supabase est configuré (sinon on rend le système silencieusement inactif). */
export function isReviewsEnabled(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

const EMPTY_BUNDLE: LieuReviewsBundle = {
  aggregate: { count: 0, average: 0 },
  reviews: [],
  tagStats: {},
};

const REVIEW_COLUMNS =
  'id, lieu_id, lieu_slug, ville_slug, entity_type, tags, pseudo, rating, comment, status, created_at, approved_at';

// ============================================
// REQUÊTES PUBLIQUES
// ============================================

/** Calcule les stats agrégées de tags à partir d'une liste de reviews approuvés. */
function computeTagStats(reviews: Review[]): TagStats {
  const counts: Record<string, Record<string, number>> = {};
  for (const r of reviews) {
    for (const tag of r.tags || []) {
      const idx = tag.indexOf(':');
      if (idx === -1) continue;
      const cat = tag.slice(0, idx);
      const val = tag.slice(idx + 1);
      counts[cat] ??= {};
      counts[cat][val] = (counts[cat][val] || 0) + 1;
    }
  }
  const out: TagStats = {};
  for (const [cat, valMap] of Object.entries(counts)) {
    const list: TagCount[] = Object.entries(valMap)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count);
    out[cat] = list;
  }
  return out;
}

/**
 * Charge en une seule requête tous les avis approuvés pour une liste d'entités d'un type donné,
 * puis calcule l'agrégat (moyenne + count + tags) côté JS.
 */
export async function getReviewsForEntities(
  entityType: EntityType,
  entityIds: string[]
): Promise<ReviewsByLieuId> {
  if (!isReviewsEnabled() || entityIds.length === 0) return {};
  const sb = getClient();

  const { data, error } = await sb
    .from('reviews')
    .select(REVIEW_COLUMNS)
    .eq('entity_type', entityType)
    .eq('status', 'approved')
    .in('lieu_id', entityIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[reviews] getReviewsForEntities error', error);
    return {};
  }

  const out: ReviewsByLieuId = {};
  for (const row of (data || []) as Review[]) {
    // Normalisation des tags (Supabase peut retourner null)
    const review: Review = { ...row, tags: row.tags || [] };
    const bundle = out[row.lieu_id] ?? { aggregate: { count: 0, average: 0 }, reviews: [], tagStats: {} };
    bundle.reviews.push(review);
    out[row.lieu_id] = bundle;
  }
  for (const id of Object.keys(out)) {
    const bundle = out[id];
    const sum = bundle.reviews.reduce((s, r) => s + r.rating, 0);
    const count = bundle.reviews.length;
    bundle.aggregate = {
      count,
      average: count > 0 ? Math.round((sum / count) * 10) / 10 : 0,
    };
    bundle.tagStats = computeTagStats(bundle.reviews);
  }
  return out;
}

/** Alias rétrocompatibles. */
export const getReviewsForLieux = (lieuIds: string[]) => getReviewsForEntities('lieu', lieuIds);
export const getReviewsForClubs = (clubIds: string[]) => getReviewsForEntities('club', clubIds);

/** Helper : renvoie un bundle (vide si absent). Pratique pour les composants. */
export function getBundle(byId: ReviewsByLieuId, entityId: string): LieuReviewsBundle {
  return byId[entityId] ?? EMPTY_BUNDLE;
}

// ============================================
// REQUÊTES ADMIN
// ============================================

export async function listReviewsByStatus(status: ReviewStatus, limit = 100): Promise<Review[]> {
  if (!isReviewsEnabled()) return [];
  const sb = getClient();
  const { data, error } = await sb
    .from('reviews')
    .select(REVIEW_COLUMNS)
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('[reviews] listReviewsByStatus error', error);
    return [];
  }
  return ((data || []) as Review[]).map((r) => ({ ...r, tags: r.tags || [] }));
}

export async function setReviewStatus(id: string, status: ReviewStatus): Promise<boolean> {
  if (!isReviewsEnabled()) return false;
  const sb = getClient();
  const update: Record<string, unknown> = { status };
  if (status === 'approved') update.approved_at = new Date().toISOString();
  const { error } = await sb.from('reviews').update(update).eq('id', id);
  if (error) {
    console.error('[reviews] setReviewStatus error', error);
    return false;
  }
  return true;
}

export async function deleteReview(id: string): Promise<boolean> {
  if (!isReviewsEnabled()) return false;
  const sb = getClient();
  const { error } = await sb.from('reviews').delete().eq('id', id);
  if (error) {
    console.error('[reviews] deleteReview error', error);
    return false;
  }
  return true;
}

export async function getReviewById(id: string): Promise<Review | null> {
  if (!isReviewsEnabled()) return null;
  const sb = getClient();
  const { data, error } = await sb.from('reviews').select(REVIEW_COLUMNS).eq('id', id).maybeSingle();
  if (error) {
    console.error('[reviews] getReviewById error', error);
    return null;
  }
  if (!data) return null;
  const r = data as Review;
  return { ...r, tags: r.tags || [] };
}

// ============================================
// INSERT (utilisé par la Server Action)
// ============================================

interface InsertReviewArgs {
  entityType: EntityType;
  lieuId: string;
  lieuSlug: string;
  villeSlug: string;
  rating: number;
  comment: string;
  pseudo: string | null;
  tags: string[];
  ipHash: string | null;
  userAgent: string | null;
}

export async function insertPendingReview(args: InsertReviewArgs): Promise<Review | null> {
  if (!isReviewsEnabled()) return null;
  const sb = getClient();
  const { data, error } = await sb
    .from('reviews')
    .insert({
      entity_type: args.entityType,
      lieu_id: args.lieuId,
      lieu_slug: args.lieuSlug,
      ville_slug: args.villeSlug,
      rating: args.rating,
      comment: args.comment,
      pseudo: args.pseudo,
      tags: args.tags,
      ip_hash: args.ipHash,
      user_agent: args.userAgent,
      status: 'pending',
    })
    .select(REVIEW_COLUMNS)
    .single();
  if (error) {
    console.error('[reviews] insertPendingReview error', error);
    return null;
  }
  const r = data as Review;
  return { ...r, tags: r.tags || [] };
}

/** Compte les avis (tous statuts) postés depuis `since` par une même IP. */
export async function countRecentReviewsByIp(ipHash: string, since: Date): Promise<number> {
  if (!isReviewsEnabled() || !ipHash) return 0;
  const sb = getClient();
  const { count, error } = await sb
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', since.toISOString());
  if (error) {
    console.error('[reviews] countRecentReviewsByIp error', error);
    return 0;
  }
  return count || 0;
}

/** Compte les avis (tous statuts) postés depuis `since` par une même IP sur une entité donnée. */
export async function countRecentReviewsByIpAndEntity(
  ipHash: string,
  entityType: EntityType,
  entityId: string,
  since: Date
): Promise<number> {
  if (!isReviewsEnabled() || !ipHash) return 0;
  const sb = getClient();
  const { count, error } = await sb
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .eq('entity_type', entityType)
    .eq('lieu_id', entityId)
    .gte('created_at', since.toISOString());
  if (error) {
    console.error('[reviews] countRecentReviewsByIpAndEntity error', error);
    return 0;
  }
  return count || 0;
}
