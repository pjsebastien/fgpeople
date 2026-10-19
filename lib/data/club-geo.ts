/**
 * Coordonnées des clubs, géocodées par scripts/geocode-clubs.mjs à partir de
 * la Base Adresse Nationale. Absentes quand l'adresse était trop imprécise.
 */

import rawGeo from '../../data/clubs/geo.json';

export interface ClubGeo {
  lat: number;
  lon: number;
  /** housenumber : repère au numéro ; street : repère sur la rue. */
  precision: 'housenumber' | 'street';
  label: string;
}

const geo = rawGeo as unknown as Record<string, ClubGeo>;

export function getClubGeo(slug: string): ClubGeo | null {
  return geo[slug] ?? null;
}
