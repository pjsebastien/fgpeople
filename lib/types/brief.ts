/**
 * Types — Briefs d'avis (matière première saisie dans /admin/sites)
 *
 * Le brief n'est jamais affiché publiquement : c'est le point d'entrée
 * pour rédiger un SiteReview. Voir scripts/supabase-site-briefs-schema.sql.
 */

export type BriefStatus = 'draft' | 'ready' | 'generated' | 'published';

export const BRIEF_STATUS_LABELS: Record<BriefStatus, string> = {
  draft: 'Brouillon',
  ready: 'Prêt à rédiger',
  generated: 'Article rédigé',
  published: 'En ligne',
};

export type AssetKind = 'image' | 'video' | 'youtube' | 'logo';

export const ASSET_KIND_LABELS: Record<AssetKind, string> = {
  image: "Capture d'écran",
  video: 'Vidéo',
  youtube: 'Vidéo YouTube',
  logo: 'Logo',
};

export interface BriefAsset {
  id: string;
  brief_id: string;
  kind: AssetKind;
  /** secure_url Cloudinary, ou URL YouTube pour kind='youtube'. */
  url: string;
  /** public_id Cloudinary (null pour YouTube) — nécessaire pour supprimer. */
  public_id: string | null;
  width: number | null;
  height: number | null;
  format: string | null;
  bytes: number | null;
  duration: number | null;
  /** Optionnel : ce que montre l'asset. Laissé vide, je le déduis de l'image. */
  label: string | null;
  /** Optionnel : où le placer dans l'article. */
  instruction: string | null;
  sort_order: number;
  created_at: string;
}

export interface SiteBrief {
  id: string;
  slug: string;
  site_name: string;
  site_url: string | null;
  affiliate_url: string | null;
  status: BriefStatus;
  instructions: string | null;
  key_facts: string | null;
  personal_experience: string | null;
  pricing_notes: string | null;
  pros_notes: string | null;
  cons_notes: string | null;
  target_keywords: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteBriefWithAssets extends SiteBrief {
  assets: BriefAsset[];
}

/** Champs éditables depuis le formulaire. */
export interface BriefFormValues {
  slug: string;
  site_name: string;
  site_url: string;
  affiliate_url: string;
  status: BriefStatus;
  instructions: string;
  key_facts: string;
  personal_experience: string;
  pricing_notes: string;
  pros_notes: string;
  cons_notes: string;
  target_keywords: string;
}

export interface ActionResult<T = undefined> {
  ok: boolean;
  error?: string;
  data?: T;
}
