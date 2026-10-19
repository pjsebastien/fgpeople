/**
 * Accès aux fiches clubs personnalisées.
 *
 * Les fiches sont rédigées dans data/clubs/profiles/<slug>.json puis validées
 * et regroupées par `node scripts/build-club-profiles.mjs`.
 */

import rawProfiles from '../../data/clubs/profiles.generated.json';
import type { ClubProfile } from '../types/club-profile';

const profiles = rawProfiles as unknown as Record<string, ClubProfile>;

export function getClubProfile(slug: string): ClubProfile | null {
  return profiles[slug] ?? null;
}

export function getAllProfiledSlugs(): string[] {
  return Object.keys(profiles);
}
