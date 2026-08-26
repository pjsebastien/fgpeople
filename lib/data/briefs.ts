/**
 * Data layer — Briefs d'avis sur les sites de rencontre.
 *
 * IMPORTANT : ne jamais importer depuis un composant client (service_role key).
 * Même pattern que lib/data/reviews.ts.
 */

import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type {
  SiteBrief,
  SiteBriefWithAssets,
  BriefAsset,
  BriefFormValues,
  AssetKind,
} from '../types/brief';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('[briefs] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant. Voir .env.example');
  }
  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

export function isBriefsEnabled(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

const BRIEF_COLUMNS =
  'id, slug, site_name, site_url, affiliate_url, status, instructions, key_facts, personal_experience, pricing_notes, pros_notes, cons_notes, target_keywords, created_at, updated_at';

const ASSET_COLUMNS =
  'id, brief_id, kind, url, public_id, width, height, format, bytes, duration, label, instruction, sort_order, created_at';

// ============================================
// LECTURE
// ============================================

export async function listBriefs(): Promise<SiteBrief[]> {
  if (!isBriefsEnabled()) return [];
  const { data, error } = await getClient()
    .from('site_briefs')
    .select(BRIEF_COLUMNS)
    .order('updated_at', { ascending: false });
  if (error) {
    console.error('[briefs] listBriefs error', error);
    return [];
  }
  return (data || []) as SiteBrief[];
}

/** Nombre d'assets par brief, pour l'affichage de la liste. */
export async function countAssetsByBrief(): Promise<Record<string, number>> {
  if (!isBriefsEnabled()) return {};
  const { data, error } = await getClient().from('site_brief_assets').select('brief_id');
  if (error) {
    console.error('[briefs] countAssetsByBrief error', error);
    return {};
  }
  const out: Record<string, number> = {};
  for (const row of (data || []) as { brief_id: string }[]) {
    out[row.brief_id] = (out[row.brief_id] || 0) + 1;
  }
  return out;
}

export async function getBriefBySlug(slug: string): Promise<SiteBriefWithAssets | null> {
  if (!isBriefsEnabled()) return null;
  const sb = getClient();

  const { data: brief, error } = await sb
    .from('site_briefs')
    .select(BRIEF_COLUMNS)
    .eq('slug', slug)
    .maybeSingle();
  if (error) {
    console.error('[briefs] getBriefBySlug error', error);
    return null;
  }
  if (!brief) return null;

  const assets = await listAssets((brief as SiteBrief).id);
  return { ...(brief as SiteBrief), assets };
}

export async function listAssets(briefId: string): Promise<BriefAsset[]> {
  if (!isBriefsEnabled()) return [];
  const { data, error } = await getClient()
    .from('site_brief_assets')
    .select(ASSET_COLUMNS)
    .eq('brief_id', briefId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) {
    console.error('[briefs] listAssets error', error);
    return [];
  }
  return (data || []) as BriefAsset[];
}

export async function getAssetById(id: string): Promise<BriefAsset | null> {
  if (!isBriefsEnabled()) return null;
  const { data, error } = await getClient()
    .from('site_brief_assets')
    .select(ASSET_COLUMNS)
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('[briefs] getAssetById error', error);
    return null;
  }
  return (data as BriefAsset) || null;
}

// ============================================
// ÉCRITURE — BRIEFS
// ============================================

export async function createBrief(values: BriefFormValues): Promise<SiteBrief | null> {
  if (!isBriefsEnabled()) return null;
  const { data, error } = await getClient()
    .from('site_briefs')
    .insert(toRow(values))
    .select(BRIEF_COLUMNS)
    .single();
  if (error) {
    console.error('[briefs] createBrief error', error);
    return null;
  }
  return data as SiteBrief;
}

export async function updateBrief(id: string, values: BriefFormValues): Promise<SiteBrief | null> {
  if (!isBriefsEnabled()) return null;
  const { data, error } = await getClient()
    .from('site_briefs')
    .update(toRow(values))
    .eq('id', id)
    .select(BRIEF_COLUMNS)
    .single();
  if (error) {
    console.error('[briefs] updateBrief error', error);
    return null;
  }
  return data as SiteBrief;
}

export async function deleteBrief(id: string): Promise<boolean> {
  if (!isBriefsEnabled()) return false;
  // Les assets partent en cascade (FK on delete cascade)
  const { error } = await getClient().from('site_briefs').delete().eq('id', id);
  if (error) {
    console.error('[briefs] deleteBrief error', error);
    return false;
  }
  return true;
}

/** Chaîne vide → null, pour ne pas polluer la base avec des '' */
function nullify(v: string | null | undefined): string | null {
  const t = (v || '').trim();
  return t.length > 0 ? t : null;
}

function toRow(values: BriefFormValues) {
  return {
    slug: values.slug.trim(),
    site_name: values.site_name.trim(),
    site_url: nullify(values.site_url),
    affiliate_url: nullify(values.affiliate_url),
    status: values.status,
    instructions: nullify(values.instructions),
    key_facts: nullify(values.key_facts),
    personal_experience: nullify(values.personal_experience),
    pricing_notes: nullify(values.pricing_notes),
    pros_notes: nullify(values.pros_notes),
    cons_notes: nullify(values.cons_notes),
    target_keywords: nullify(values.target_keywords),
  };
}

// ============================================
// ÉCRITURE — ASSETS
// ============================================

export interface NewAsset {
  briefId: string;
  kind: AssetKind;
  url: string;
  publicId?: string | null;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  bytes?: number | null;
  duration?: number | null;
  label?: string | null;
  instruction?: string | null;
}

export async function addAsset(asset: NewAsset): Promise<BriefAsset | null> {
  if (!isBriefsEnabled()) return null;
  const sb = getClient();

  // Range le nouvel asset en fin de liste
  const { count } = await sb
    .from('site_brief_assets')
    .select('id', { count: 'exact', head: true })
    .eq('brief_id', asset.briefId);

  const { data, error } = await sb
    .from('site_brief_assets')
    .insert({
      brief_id: asset.briefId,
      kind: asset.kind,
      url: asset.url,
      public_id: asset.publicId ?? null,
      width: asset.width ?? null,
      height: asset.height ?? null,
      format: asset.format ?? null,
      bytes: asset.bytes ?? null,
      duration: asset.duration ?? null,
      label: nullify(asset.label),
      instruction: nullify(asset.instruction),
      sort_order: count || 0,
    })
    .select(ASSET_COLUMNS)
    .single();

  if (error) {
    console.error('[briefs] addAsset error', error);
    return null;
  }
  return data as BriefAsset;
}

export async function updateAssetNotes(
  id: string,
  label: string,
  instruction: string
): Promise<boolean> {
  if (!isBriefsEnabled()) return false;
  const { error } = await getClient()
    .from('site_brief_assets')
    .update({ label: nullify(label), instruction: nullify(instruction) })
    .eq('id', id);
  if (error) {
    console.error('[briefs] updateAssetNotes error', error);
    return false;
  }
  return true;
}

export async function deleteAssetRow(id: string): Promise<boolean> {
  if (!isBriefsEnabled()) return false;
  const { error } = await getClient().from('site_brief_assets').delete().eq('id', id);
  if (error) {
    console.error('[briefs] deleteAssetRow error', error);
    return false;
  }
  return true;
}

/** Réécrit sort_order dans l'ordre du tableau d'ids fourni. */
export async function reorderAssets(briefId: string, orderedIds: string[]): Promise<boolean> {
  if (!isBriefsEnabled()) return false;
  const sb = getClient();
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      sb.from('site_brief_assets').update({ sort_order: index }).eq('id', id).eq('brief_id', briefId)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    console.error('[briefs] reorderAssets error', failed.error);
    return false;
  }
  return true;
}
