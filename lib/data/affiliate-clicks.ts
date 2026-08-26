/**
 * Data layer — clics sur les liens d'affiliation.
 * SERVEUR UNIQUEMENT (service_role key).
 */

import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('[clicks] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants');
  _client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return _client;
}

export function isClickTrackingEnabled(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export interface ClickInput {
  target: string;
  block: string;
  pagePath: string;
  referrer?: string | null;
  ipHash?: string | null;
  userAgent?: string | null;
}

/**
 * Enregistre un clic. Ne lève jamais : un échec de statistique ne doit pas
 * casser la navigation de l'utilisateur.
 */
export async function recordClick(input: ClickInput): Promise<boolean> {
  if (!isClickTrackingEnabled()) return false;
  try {
    const { error } = await getClient().from('affiliate_clicks').insert({
      target: input.target.slice(0, 60),
      block: input.block.slice(0, 60),
      page_path: input.pagePath.slice(0, 300),
      referrer: input.referrer?.slice(0, 300) || null,
      ip_hash: input.ipHash || null,
      user_agent: input.userAgent?.slice(0, 300) || null,
    });
    if (error) {
      console.error('[clicks] insert error', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[clicks] insert failed', err);
    return false;
  }
}

// ============================================
// RAPPORT
// ============================================

export interface ClickCount {
  key: string;
  clicks: number;
}

export interface PageBlockCount {
  page: string;
  block: string;
  clicks: number;
}

export interface ClickReport {
  total: number;
  by_target: ClickCount[];
  by_block: ClickCount[];
  by_page: ClickCount[];
  by_page_block: PageBlockCount[];
  by_day: ClickCount[];
}

const EMPTY_REPORT: ClickReport = {
  total: 0,
  by_target: [],
  by_block: [],
  by_page: [],
  by_page_block: [],
  by_day: [],
};

/** Agrégats calculés côté Postgres (voir la fonction affiliate_click_report). */
export async function getClickReport(days = 30): Promise<ClickReport> {
  if (!isClickTrackingEnabled()) return EMPTY_REPORT;
  try {
    const { data, error } = await getClient().rpc('affiliate_click_report', { p_days: days });
    if (error) {
      console.error('[clicks] report error', error.message);
      return EMPTY_REPORT;
    }
    return { ...EMPTY_REPORT, ...(data as ClickReport) };
  } catch (err) {
    console.error('[clicks] report failed', err);
    return EMPTY_REPORT;
  }
}
