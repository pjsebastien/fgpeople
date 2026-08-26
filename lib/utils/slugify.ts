/**
 * Slugification partagée.
 *
 * Même logique que le slugify privé de lib/data/clubs.ts, extraite ici pour
 * être réutilisable (briefs, avis de sites…).
 */

// Plage des diacritiques combinants, laissés par normalize('NFD').
const COMBINING_MARKS = /[̀-ͯ]/g;

export function slugify(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Slug valide : minuscules, chiffres, tirets simples, ni au début ni à la fin. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}
