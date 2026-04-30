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
  ReviewAggregate,
  LieuReviewsBundle,
  ReviewsByLieuId,
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
};

// ============================================
// REQUÊTES PUBLIQUES (utilisées par les pages)
// ============================================

/**
 * Charge en une seule requête tous les avis approuvés pour une liste de lieux,
 * puis calcule l'agrégat (moyenne + count) côté JS.
 *
 * Renvoie une Map<lieuId, bundle>. Les lieux sans avis sont absents (utilisez le
 * helper `getBundle` ci-dessous pour avoir un bundle vide par défaut).
 */
export async function getReviewsForLieux(lieuIds: string[]): Promise<ReviewsByLieuId> {
  if (!isReviewsEnabled() || lieuIds.length === 0) return {};
  const sb = getClient();

  const { data, error } = await sb
    .from('reviews')
    .select('id, lieu_id, lieu_slug, ville_slug, pseudo, rating, comment, status, created_at, approved_at')
    .eq('status', 'approved')
    .in('lieu_id', lieuIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[reviews] getReviewsForLieux error', error);
    return {};
  }

  const out: ReviewsByLieuId = {};
  for (const row of (data || []) as Review[]) {
    const bundle = out[row.lieu_id] ?? { aggregate: { count: 0, average: 0 }, reviews: [] };
    bundle.reviews.push(row);
    out[row.lieu_id] = bundle;
  }
  // Calcul des agrégats
  for (const id of Object.keys(out)) {
    const bundle = out[id];
    const sum = bundle.reviews.reduce((s, r) => s + r.rating, 0);
    const count = bundle.reviews.length;
    bundle.aggregate = {
      count,
      average: count > 0 ? Math.round((sum / count) * 10) / 10 : 0,
    };
  }
  return out;
}

/** Helper : renvoie un bundle (vide si absent). Pratique pour les composants. */
export function getBundle(byId: ReviewsByLieuId, lieuId: string): LieuReviewsBundle {
  return byId[lieuId] ?? EMPTY_BUNDLE;
}

// ============================================
// REQUÊTES ADMIN
// ============================================

export async function listReviewsByStatus(status: ReviewStatus, limit = 100): Promise<Review[]> {
  if (!isReviewsEnabled()) return [];
  const sb = getClient();
  const { data, error } = await sb
    .from('reviews')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('[reviews] listReviewsByStatus error', error);
    return [];
  }
  return (data || []) as Review[];
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
  const { data, error } = await sb.from('reviews').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('[reviews] getReviewById error', error);
    return null;
  }
  return (data as Review) || null;
}

// ============================================
// INSERT (utilisé par la Server Action)
// ============================================

interface InsertReviewArgs {
  lieuId: string;
  lieuSlug: string;
  villeSlug: string;
  rating: number;
  comment: string;
  pseudo: string | null;
  ipHash: string | null;
  userAgent: string | null;
}

export async function insertPendingReview(args: InsertReviewArgs): Promise<Review | null> {
  if (!isReviewsEnabled()) return null;
  const sb = getClient();
  const { data, error } = await sb
    .from('reviews')
    .insert({
      lieu_id: args.lieuId,
      lieu_slug: args.lieuSlug,
      ville_slug: args.villeSlug,
      rating: args.rating,
      comment: args.comment,
      pseudo: args.pseudo,
      ip_hash: args.ipHash,
      user_agent: args.userAgent,
      status: 'pending',
    })
    .select('*')
    .single();
  if (error) {
    console.error('[reviews] insertPendingReview error', error);
    return null;
  }
  return data as Review;
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

/** Compte les avis (tous statuts) postés depuis `since` par une même IP sur un lieu donné. */
export async function countRecentReviewsByIpAndLieu(
  ipHash: string,
  lieuId: string,
  since: Date
): Promise<number> {
  if (!isReviewsEnabled() || !ipHash) return 0;
  const sb = getClient();
  const { count, error } = await sb
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .eq('lieu_id', lieuId)
    .gte('created_at', since.toISOString());
  if (error) {
    console.error('[reviews] countRecentReviewsByIpAndLieu error', error);
    return 0;
  }
  return count || 0;
}
