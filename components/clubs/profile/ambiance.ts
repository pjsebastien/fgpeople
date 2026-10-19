/**
 * Images d'ambiance des fiches clubs (public/images/ambiance/), libres de
 * droits, sans personne identifiable : registre dans
 * data/clubs/ambiance-credits.json.
 *
 * Elles illustrent un thème (sauna, jacuzzi, bar…), jamais le lieu lui-même,
 * et sont toujours présentées comme des illustrations. Le choix entre les
 * variantes d'un thème dépend du slug, pour que deux fiches voisines ne
 * montrent pas la même image.
 */

import credits from '../../../data/clubs/ambiance-credits.json';
import type { Club } from '@/lib/types';
import type { ProfileIcon } from '@/lib/types/club-profile';
import { equipmentIcon } from './Icon';

export type AmbianceTheme =
  | 'spa-jacuzzi' | 'sauna' | 'hammam' | 'piscine-nuit' | 'bar-cocktail' | 'lounge-velours' | 'piste-danse'
  | 'boudoir' | 'donjon' | 'masques' | 'champagne' | 'bougies' | 'terrasse-nuit' | 'jardin-nuit' | 'manoir'
  | 'ville-nuit' | 'cinema' | 'vestiaire' | 'diner' | 'neon';

interface Credit { file: string; theme: string }

const BY_THEME = new Map<string, string[]>();
for (const c of credits as Credit[]) {
  BY_THEME.set(c.theme, [...(BY_THEME.get(c.theme) || []), `/images/ambiance/${c.file}`]);
}

export const AMBIANCE_LABEL: Record<AmbianceTheme, string> = {
  'spa-jacuzzi': 'Espace bien-être', sauna: 'Sauna', hammam: 'Hammam', 'piscine-nuit': 'Piscine', 'bar-cocktail': 'Bar',
  'lounge-velours': 'Salons', 'piste-danse': 'Piste de danse', boudoir: 'Espaces câlins', donjon: 'Espace BDSM',
  masques: 'Soirées à thème', champagne: 'Soirées', bougies: 'Ambiance', 'terrasse-nuit': 'Terrasse', 'jardin-nuit': 'Jardin',
  manoir: 'Le domaine', 'ville-nuit': 'Le quartier', cinema: 'Espace vidéo', vestiaire: 'Vestiaires', diner: 'Restauration', neon: 'Ambiance',
};

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Image d'un thème pour une fiche donnée, ou null si le thème n'a pas d'image. */
export function ambianceImage(theme: AmbianceTheme, seed: string): string | null {
  const files = BY_THEME.get(theme);
  return files?.length ? files[hash(seed + theme) % files.length] : null;
}

const ICON_THEME: Partial<Record<ProfileIcon | string, AmbianceTheme>> = {
  water: 'spa-jacuzzi', spa: 'hammam', flame: 'sauna', drink: 'bar-cocktail', music: 'piste-danse', bed: 'boudoir',
  mask: 'donjon', food: 'diner', heart: 'lounge-velours', couple: 'lounge-velours', sparkles: 'bougies',
  calendar: 'masques', euro: 'champagne', ticket: 'champagne', star: 'champagne', camera: 'cinema', lock: 'vestiaire',
  history: 'manoir', building: 'ville-nuit', map: 'ville-nuit', car: 'ville-nuit', closed: 'ville-nuit', clock: 'neon',
};

/** Thème illustrant une section, d'après son pictogramme (aucun pour les sections purement factuelles). */
export function sectionTheme(icon?: ProfileIcon): AmbianceTheme | null {
  return (icon && ICON_THEME[icon]) || null;
}

/** Thème de l'en-tête, d'après le type principal du lieu. */
export function heroTheme(club: Club, closed: boolean): AmbianceTheme {
  if (closed) return 'ville-nuit';
  const slugs = club.types.map((t) => t.slug);
  if (slugs.includes('sauna')) return 'sauna';
  if (slugs.includes('spa')) return 'spa-jacuzzi';
  if (slugs.includes('sm')) return 'donjon';
  if (slugs.includes('discotheque')) return 'piste-danse';
  if (slugs.includes('restaurant')) return 'diner';
  if (slugs.includes('hebergement')) return 'boudoir';
  if (slugs.includes('cinema')) return 'cinema';
  if (slugs.includes('bar')) return 'bar-cocktail';
  return 'lounge-velours';
}

/** Jusqu'à `max` thèmes distincts illustrant les équipements d'un lieu. */
export function equipmentThemes(equipements: string[], max = 3): AmbianceTheme[] {
  const out: AmbianceTheme[] = [];
  for (const eq of equipements) {
    const l = eq.toLowerCase();
    const t: AmbianceTheme | null = /piscine/.test(l) ? 'piscine-nuit'
      : /hammam/.test(l) ? 'hammam'
      : /terrasse/.test(l) ? 'terrasse-nuit'
      : /jardin/.test(l) ? 'jardin-nuit'
      : sectionTheme(equipmentIcon(eq) as ProfileIcon);
    if (t && !out.includes(t) && BY_THEME.has(t)) out.push(t);
    if (out.length >= max) break;
  }
  return out;
}
