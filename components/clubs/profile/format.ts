/** Mise en forme partagée par les blocs de la fiche club personnalisée. */

import type { Club } from '@/lib/types';

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MONTHS_SHORT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

export function formatDate(iso: string, short = false): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d === 1 ? '1er' : d} ${(short ? MONTHS_SHORT : MONTHS)[m - 1]} ${y}`;
}

/** 0645134544 → 06 45 13 45 44 ; les numéros étrangers restent tels quels. */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 && digits.startsWith('0') ? digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim() : phone;
}

/** Lien d'itinéraire Google Maps vers le lieu (sans clé d'API ni script). */
export function directionsUrl(club: Club): string {
  const q = [club.nom, club.adresse, club.code_postal, club.ville].filter(Boolean).join(' ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

/** Temps de lecture arrondi à la minute (230 mots par minute). */
export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 230));
}

export const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;

/**
 * « de » + nom du club, avec l'élision française : de Le Réservoir → du
 * Réservoir, de Les Dauphins → des Dauphins, de L'Aparté reste tel quel.
 */
export function deNom(nom: string): string {
  if (/^le\s/i.test(nom)) return `du ${nom.slice(3)}`;
  if (/^les\s/i.test(nom)) return `des ${nom.slice(4)}`;
  return /^[aeiouyhéèêàâîôû]/i.test(nom) ? `d'${nom}` : `de ${nom}`;
}
