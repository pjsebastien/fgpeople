/**
 * Types pour la section "Lieux de drague"
 * Basé sur le JSON lieux_drague_france.json
 */

import type { FAQItem, RelatedLink, BreadcrumbItem } from './index';

// ============================================
// VALEURS NORMALISÉES
// ============================================
export type DragueTypeSlug =
  | 'aire-de-repos'
  | 'berges'
  | 'bois'
  | 'digue'
  | 'dune'
  | 'etang'
  | 'gare'
  | 'lac'
  | 'parc'
  | 'parking'
  | 'plage'
  | 'port'
  | 'quai'
  | 'riviere'
  | 'sentier'
  | 'toilettes';

export type DragueOrientation = 'gay' | 'bi' | 'hetero' | 'libertin' | 'mixte' | 'naturiste' | 'trans';

export type DragueAffluenceNiveau = 'faible' | 'moderee' | 'forte' | 'variable';

export type DragueDiscretion = 'tres-discret' | 'discret' | 'moyen' | 'expose';

// ============================================
// TYPE PRINCIPAL : LIEU DE DRAGUE
// ============================================
export interface LieuDragueLocalisation {
  adresse_ou_description: string;
  ville: string;
  villeSlug: string;
  villeProche?: string;
  code_postal: string;
  departement_code: string;
  departement_nom: string;
  departementSlug: string;
  region: string;
  regionSlug: string;
  latitude?: number;
  longitude?: number;
}

export interface LieuDragueFrequentation {
  affluence: string;
  affluenceNiveau: DragueAffluenceNiveau;
  meilleurs_moments: string[];
  saisonnalite: string;
}

export interface LieuDraguePublic {
  tranche_age_approx?: string;
  profil_dominant?: string;
  activite?: string;
}

export interface LieuDragueAcces {
  transport_en_commun?: string;
  voiture?: string;
  a_pied?: string;
  depuis_centre_ville?: string;
  coordonnees_approx?: string; // URL Google Maps
}

export interface LieuDragueLegalite {
  statut?: string;
  presence_police?: string;
  tips_securite: string[];
}

export interface LieuDrague {
  id: string;
  slug: string;
  nom: string;
  type: string; // valeur brute du JSON (ex: "bois", "aire_repos")
  typeSlug: DragueTypeSlug; // slug normalisé
  typeLabel: string; // label affiché (ex: "Bois", "Aire de repos")
  orientation: DragueOrientation[];
  localisation: LieuDragueLocalisation;
  description: string;
  frequentation: LieuDragueFrequentation;
  public: LieuDraguePublic;
  acces: LieuDragueAcces;
  equipements_environnants: string[];
  discretion: string; // valeur brute
  discretionNiveau: DragueDiscretion;
  legalite_risques: LieuDragueLegalite;
  notes_contextuelles?: string;
  sources: string[];
  confiance_donnees?: string;
  // image attribuée selon le type (chemin public)
  imageSrc: string;
}

// ============================================
// AGRÉGATIONS NAVIGATION
// ============================================
export interface DragueRegion {
  nom: string;
  slug: string;
  departementSlugs: string[];
  villeCount: number;
  lieuCount: number;
}

export interface DragueDepartement {
  code: string;
  nom: string;
  slug: string;
  region: string;
  regionSlug: string;
  villeSlugs: string[];
  lieuCount: number;
}

export interface DragueVille {
  nom: string;
  slug: string;
  code_postal: string;
  departement: string;
  departementSlug: string;
  departement_code: string;
  region: string;
  regionSlug: string;
  lieuCount: number;
}

// ============================================
// TYPES UTILITAIRES
// ============================================
export interface DragueStats {
  totalLieux: number;
  totalRegions: number;
  totalDepartements: number;
  totalVilles: number;
  totalTypes: number;
}

export interface DragueTypeCategory {
  slug: DragueTypeSlug;
  label: string;
  labelPlural: string;
  count: number;
}

// Re-export des types partagés
export type { FAQItem, RelatedLink, BreadcrumbItem };
