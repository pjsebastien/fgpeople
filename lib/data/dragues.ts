/**
 * Data Layer - Lieux de drague
 * Parse data/lieux_drague_france.json
 */

import rawData from '../../data/lieux_drague_france.json';
import type {
  LieuDrague,
  DragueRegion,
  DragueDepartement,
  DragueVille,
  DragueStats,
  DragueTypeSlug,
  DragueOrientation,
  DragueAffluenceNiveau,
  DragueDiscretion,
  DragueTypeCategory,
  RelatedLink,
} from '../types/drague';

// ============================================
// UTILITAIRES
// ============================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Normalisation des régions (fusionne les variantes orthographiques)
function normalizeRegion(name: string): string {
  if (!name) return '';
  const cleaned = name.trim();
  // Fusionner "Provence-Alpes-Cote d'Azur" → "Provence-Alpes-Côte d'Azur"
  if (slugify(cleaned).includes('provence') && slugify(cleaned).includes('cote')) {
    return "Provence-Alpes-Côte d'Azur";
  }
  return cleaned;
}

// Normalisation du type
const TYPE_NORMALIZATION: Record<string, { slug: DragueTypeSlug; label: string }> = {
  aire_repos: { slug: 'aire-de-repos', label: 'Aire de repos' },
  'aire-repos': { slug: 'aire-de-repos', label: 'Aire de repos' },
  'aire de repos': { slug: 'aire-de-repos', label: 'Aire de repos' },
  berges: { slug: 'berges', label: 'Berges' },
  bois: { slug: 'bois', label: 'Bois' },
  digue: { slug: 'digue', label: 'Digue' },
  dune: { slug: 'dune', label: 'Dune' },
  etang: { slug: 'etang', label: 'Étang' },
  gare: { slug: 'gare', label: 'Gare' },
  lac: { slug: 'lac', label: 'Lac' },
  parc: { slug: 'parc', label: 'Parc' },
  parking: { slug: 'parking', label: 'Parking' },
  plage: { slug: 'plage', label: 'Plage' },
  port: { slug: 'port', label: 'Port' },
  quai: { slug: 'quai', label: 'Quai' },
  riviere: { slug: 'riviere', label: 'Rivière' },
  sentier: { slug: 'sentier', label: 'Sentier' },
  toilettes: { slug: 'toilettes', label: 'Toilettes' },
};

function normalizeType(rawType: string): { slug: DragueTypeSlug; label: string } {
  const key = (rawType || '').toLowerCase().trim();
  return TYPE_NORMALIZATION[key] || { slug: 'parc' as DragueTypeSlug, label: 'Lieu' };
}

// Normalisation de l'affluence
function normalizeAffluence(raw: string): DragueAffluenceNiveau {
  const s = (raw || '').toLowerCase();
  if (!s) return 'variable';
  if (s.includes('très faible') || s.includes('tres faible')) return 'faible';
  if (s.includes('faible')) return 'faible';
  if (s.includes('forte') || s.includes('très forte') || s.includes('tres forte')) return 'forte';
  if (s.includes('mod') || s.includes('moyen')) return 'moderee';
  if (s.includes('variable') || s.includes('transit')) return 'variable';
  return 'variable';
}

// Normalisation de la discrétion
function normalizeDiscretion(raw: string): DragueDiscretion {
  const s = (raw || '').toLowerCase();
  if (s.includes('très discret') || s.includes('tres discret')) return 'tres-discret';
  if (s.includes('discret')) return 'discret';
  if (s.includes('expos')) return 'expose';
  if (s.includes('moyen') || s.includes('peu')) return 'moyen';
  return 'discret';
}

// Liste des images disponibles par type (cycle déterministe selon le slug du lieu)
const IMAGES_BY_TYPE: Record<DragueTypeSlug, string[]> = {
  bois: ['/images/lieu-de-drague/bois-1.jpg', '/images/lieu-de-drague/bois-2.jpg', '/images/lieu-de-drague/bois-3.jpg', '/images/lieu-de-drague/foret-1.jpg'],
  parc: ['/images/lieu-de-drague/parc-1.jpg', '/images/lieu-de-drague/parc-2.jpg', '/images/lieu-de-drague/parc-3.jpg'],
  parking: ['/images/lieu-de-drague/parking-1.jpg', '/images/lieu-de-drague/voiture-1.jpg'],
  'aire-de-repos': ['/images/lieu-de-drague/aire-repos-1.jpg', '/images/lieu-de-drague/aire-repos-2.jpg'],
  plage: ['/images/lieu-de-drague/exterieur-1.jpg', '/images/lieu-de-drague/parc-1.jpg', '/images/lieu-de-drague/parc-2.jpg'],
  dune: ['/images/lieu-de-drague/exterieur-1.jpg', '/images/lieu-de-drague/parc-1.jpg'],
  digue: ['/images/lieu-de-drague/exterieur-1.jpg', '/images/lieu-de-drague/parc-2.jpg'],
  berges: ['/images/lieu-de-drague/exterieur-1.jpg', '/images/lieu-de-drague/parc-1.jpg', '/images/lieu-de-drague/parc-3.jpg'],
  riviere: ['/images/lieu-de-drague/exterieur-1.jpg', '/images/lieu-de-drague/parc-1.jpg'],
  etang: ['/images/lieu-de-drague/exterieur-1.jpg', '/images/lieu-de-drague/foret-1.jpg'],
  lac: ['/images/lieu-de-drague/exterieur-1.jpg', '/images/lieu-de-drague/parc-2.jpg'],
  sentier: ['/images/lieu-de-drague/foret-1.jpg', '/images/lieu-de-drague/bois-1.jpg', '/images/lieu-de-drague/bois-3.jpg'],
  port: ['/images/lieu-de-drague/exterieur-1.jpg', '/images/lieu-de-drague/parking-1.jpg'],
  quai: ['/images/lieu-de-drague/exterieur-1.jpg', '/images/lieu-de-drague/parc-2.jpg'],
  gare: ['/images/lieu-de-drague/parking-1.jpg', '/images/lieu-de-drague/voiture-1.jpg'],
  toilettes: ['/images/lieu-de-drague/parking-1.jpg', '/images/lieu-de-drague/voiture-1.jpg'],
};

function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getImageForLieu(typeSlug: DragueTypeSlug, lieuSlug: string): string {
  const pool = IMAGES_BY_TYPE[typeSlug] || IMAGES_BY_TYPE.parc;
  const idx = hashString(lieuSlug) % pool.length;
  return pool[idx];
}

// ============================================
// TRANSFORMATION DES DONNÉES
// ============================================

interface RawLieu {
  id: string;
  nom: string;
  type: string;
  orientation?: string[];
  localisation: {
    adresse_ou_description?: string;
    ville: string;
    ville_proche?: string;
    code_postal?: string;
    departement_code: string;
    departement_nom: string;
    region: string;
    latitude?: number;
    longitude?: number;
  };
  description?: string;
  frequentation?: {
    affluence?: string;
    meilleurs_moments?: string[];
    saisonnalite?: string;
  };
  public?: {
    tranche_age_approx?: string;
    profil_dominant?: string;
    activite?: string;
  };
  acces?: {
    transport_en_commun?: string;
    voiture?: string;
    a_pied?: string;
    depuis_centre_ville?: string;
    coordonnees_approx?: string;
  };
  equipements_environnants?: string[];
  discretion?: string;
  legalite_risques?: {
    statut?: string;
    presence_police?: string;
    tips_securite?: string[];
  };
  notes_contextuelles?: string;
  sources?: string[];
  confiance_donnees?: string;
}

interface RawDept {
  code: string;
  nom: string;
  region: string;
  lieux: RawLieu[];
  nb_lieux?: number;
  villes_couvertes?: string[];
}

interface RawData {
  date_creation: string;
  total_lieux: number;
  total_departements: number;
  departements: RawDept[];
}

// ============================================
// TRANSFORMATION (memoized)
// ============================================

let _allLieux: LieuDrague[] | null = null;
let _allRegions: DragueRegion[] | null = null;
let _allDepartements: DragueDepartement[] | null = null;
let _allVilles: DragueVille[] | null = null;

// Force une valeur en array de strings (filtrage des valeurs non-string)
function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string' && x.length > 0);
  if (typeof v === 'string' && v.trim()) return [v.trim()];
  return [];
}

function transformLieu(raw: RawLieu): LieuDrague {
  const region = normalizeRegion(raw.localisation.region);
  const regionSlug = slugify(region);
  const ville = (raw.localisation.ville || '').trim();
  const villeSlug = slugify(ville);
  const departementSlug = slugify(raw.localisation.departement_nom || '');
  const { slug: typeSlug, label: typeLabel } = normalizeType(raw.type);
  const lieuSlug = `${slugify(raw.nom)}-${villeSlug}` || raw.id;

  return {
    id: raw.id,
    slug: lieuSlug,
    nom: raw.nom,
    type: raw.type,
    typeSlug,
    typeLabel,
    orientation: toStringArray(raw.orientation) as DragueOrientation[],
    localisation: {
      adresse_ou_description: raw.localisation.adresse_ou_description || '',
      ville,
      villeSlug,
      villeProche: raw.localisation.ville_proche,
      code_postal: raw.localisation.code_postal || '',
      departement_code: raw.localisation.departement_code,
      departement_nom: raw.localisation.departement_nom,
      departementSlug,
      region,
      regionSlug,
      latitude: raw.localisation.latitude,
      longitude: raw.localisation.longitude,
    },
    description: raw.description || '',
    frequentation: {
      affluence: raw.frequentation?.affluence || '',
      affluenceNiveau: normalizeAffluence(raw.frequentation?.affluence || ''),
      meilleurs_moments: toStringArray(raw.frequentation?.meilleurs_moments),
      saisonnalite: raw.frequentation?.saisonnalite || '',
    },
    public: {
      tranche_age_approx: raw.public?.tranche_age_approx,
      profil_dominant: raw.public?.profil_dominant,
      activite: raw.public?.activite,
    },
    acces: {
      transport_en_commun: raw.acces?.transport_en_commun,
      voiture: raw.acces?.voiture,
      a_pied: raw.acces?.a_pied,
      depuis_centre_ville: raw.acces?.depuis_centre_ville,
      coordonnees_approx: raw.acces?.coordonnees_approx,
    },
    equipements_environnants: toStringArray(raw.equipements_environnants),
    discretion: raw.discretion || '',
    discretionNiveau: normalizeDiscretion(raw.discretion || ''),
    legalite_risques: {
      statut: raw.legalite_risques?.statut,
      presence_police: raw.legalite_risques?.presence_police,
      tips_securite: toStringArray(raw.legalite_risques?.tips_securite),
    },
    notes_contextuelles: raw.notes_contextuelles,
    sources: toStringArray(raw.sources),
    confiance_donnees: raw.confiance_donnees,
    imageSrc: getImageForLieu(typeSlug, lieuSlug),
  };
}

function buildAll() {
  if (_allLieux && _allRegions && _allDepartements && _allVilles) return;

  const data = rawData as unknown as RawData;
  _allLieux = [];
  const regionsMap = new Map<string, { nom: string; deptSlugs: Set<string>; villeSlugs: Set<string>; lieuCount: number }>();
  const deptsMap = new Map<string, { code: string; nom: string; region: string; villeSlugs: Set<string>; lieuCount: number }>();
  const villesMap = new Map<string, { nom: string; cp: string; deptNom: string; deptCode: string; region: string; lieuCount: number }>();

  for (const dept of data.departements) {
    const deptName = (dept.nom || '').trim();
    const deptSlug = slugify(deptName);
    const region = normalizeRegion(dept.region);
    const regionSlug = slugify(region);

    for (const rawLieu of dept.lieux) {
      const lieu = transformLieu(rawLieu);
      _allLieux.push(lieu);

      // Région
      if (!regionsMap.has(regionSlug)) {
        regionsMap.set(regionSlug, { nom: region, deptSlugs: new Set(), villeSlugs: new Set(), lieuCount: 0 });
      }
      const regionEntry = regionsMap.get(regionSlug)!;
      regionEntry.deptSlugs.add(deptSlug);
      regionEntry.villeSlugs.add(lieu.localisation.villeSlug);
      regionEntry.lieuCount++;

      // Département
      if (!deptsMap.has(deptSlug)) {
        deptsMap.set(deptSlug, {
          code: dept.code,
          nom: deptName,
          region,
          villeSlugs: new Set(),
          lieuCount: 0,
        });
      }
      const deptEntry = deptsMap.get(deptSlug)!;
      deptEntry.villeSlugs.add(lieu.localisation.villeSlug);
      deptEntry.lieuCount++;

      // Ville (clé = slug pour dédoublonner)
      const vKey = lieu.localisation.villeSlug;
      if (!villesMap.has(vKey)) {
        villesMap.set(vKey, {
          nom: lieu.localisation.ville,
          cp: lieu.localisation.code_postal,
          deptNom: lieu.localisation.departement_nom,
          deptCode: lieu.localisation.departement_code,
          region,
          lieuCount: 0,
        });
      }
      villesMap.get(vKey)!.lieuCount++;
    }
  }

  _allRegions = Array.from(regionsMap.entries()).map(([slug, v]) => ({
    nom: v.nom,
    slug,
    departementSlugs: Array.from(v.deptSlugs),
    villeCount: v.villeSlugs.size,
    lieuCount: v.lieuCount,
  }));

  _allDepartements = Array.from(deptsMap.entries()).map(([slug, v]) => ({
    code: v.code,
    nom: v.nom,
    slug,
    region: v.region,
    regionSlug: slugify(v.region),
    villeSlugs: Array.from(v.villeSlugs),
    lieuCount: v.lieuCount,
  }));

  _allVilles = Array.from(villesMap.entries()).map(([slug, v]) => ({
    nom: v.nom,
    slug,
    code_postal: v.cp,
    departement: v.deptNom,
    departementSlug: slugify(v.deptNom),
    departement_code: v.deptCode,
    region: v.region,
    regionSlug: slugify(v.region),
    lieuCount: v.lieuCount,
  }));
}

// ============================================
// API PUBLIQUE
// ============================================

export async function getAllLieuxDrague(): Promise<LieuDrague[]> {
  buildAll();
  return _allLieux!;
}

export async function getAllDragueRegions(): Promise<DragueRegion[]> {
  buildAll();
  return [..._allRegions!].sort((a, b) => b.lieuCount - a.lieuCount);
}

export async function getDragueRegionBySlug(slug: string): Promise<DragueRegion | null> {
  buildAll();
  return _allRegions!.find((r) => r.slug === slug) || null;
}

export async function getAllDragueDepartements(): Promise<DragueDepartement[]> {
  buildAll();
  return [..._allDepartements!].sort((a, b) => a.nom.localeCompare(b.nom));
}

export async function getDragueDepartementBySlug(slug: string): Promise<DragueDepartement | null> {
  buildAll();
  return _allDepartements!.find((d) => d.slug === slug) || null;
}

export async function getDragueDepartementsByRegion(regionSlug: string): Promise<DragueDepartement[]> {
  buildAll();
  return _allDepartements!
    .filter((d) => d.regionSlug === regionSlug)
    .sort((a, b) => b.lieuCount - a.lieuCount);
}

export async function getAllDragueVilles(): Promise<DragueVille[]> {
  buildAll();
  return [..._allVilles!].sort((a, b) => b.lieuCount - a.lieuCount);
}

export async function getDragueVilleBySlug(slug: string): Promise<DragueVille | null> {
  buildAll();
  return _allVilles!.find((v) => v.slug === slug) || null;
}

export async function getDragueVillesByDepartement(departementSlug: string): Promise<DragueVille[]> {
  buildAll();
  return _allVilles!
    .filter((v) => v.departementSlug === departementSlug)
    .sort((a, b) => b.lieuCount - a.lieuCount);
}

export async function getLieuxByRegion(regionSlug: string): Promise<LieuDrague[]> {
  buildAll();
  return _allLieux!.filter((l) => l.localisation.regionSlug === regionSlug);
}

export async function getLieuxByDepartement(departementSlug: string): Promise<LieuDrague[]> {
  buildAll();
  return _allLieux!.filter((l) => l.localisation.departementSlug === departementSlug);
}

export async function getLieuxByVille(villeSlug: string): Promise<LieuDrague[]> {
  buildAll();
  return _allLieux!.filter((l) => l.localisation.villeSlug === villeSlug);
}

export async function getDragueStats(): Promise<DragueStats> {
  buildAll();
  const types = new Set(_allLieux!.map((l) => l.typeSlug));
  return {
    totalLieux: _allLieux!.length,
    totalRegions: _allRegions!.length,
    totalDepartements: _allDepartements!.length,
    totalVilles: _allVilles!.length,
    totalTypes: types.size,
  };
}

export async function getTopDragueVilles(limit = 12): Promise<DragueVille[]> {
  buildAll();
  return [..._allVilles!].sort((a, b) => b.lieuCount - a.lieuCount).slice(0, limit);
}

export async function getTopDragueDepartements(limit = 10): Promise<DragueDepartement[]> {
  buildAll();
  return [..._allDepartements!].sort((a, b) => b.lieuCount - a.lieuCount).slice(0, limit);
}

export async function getAllDragueRegionSlugs(): Promise<string[]> {
  buildAll();
  return _allRegions!.map((r) => r.slug);
}

export async function getAllDragueDepartementSlugs(): Promise<string[]> {
  buildAll();
  return _allDepartements!.map((d) => d.slug);
}

export async function getAllDragueVilleSlugs(): Promise<string[]> {
  buildAll();
  return _allVilles!.map((v) => v.slug);
}

export async function getDragueTypeCategories(): Promise<DragueTypeCategory[]> {
  buildAll();
  const counts = new Map<DragueTypeSlug, { label: string; count: number }>();
  for (const lieu of _allLieux!) {
    const cur = counts.get(lieu.typeSlug);
    if (cur) cur.count++;
    else counts.set(lieu.typeSlug, { label: lieu.typeLabel, count: 1 });
  }
  return Array.from(counts.entries())
    .map(([slug, v]) => ({
      slug,
      label: v.label,
      labelPlural: v.label + 's',
      count: v.count,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function getRelatedDragueRegions(currentSlug: string, limit = 6): Promise<RelatedLink[]> {
  buildAll();
  return _allRegions!
    .filter((r) => r.slug !== currentSlug)
    .sort((a, b) => b.lieuCount - a.lieuCount)
    .slice(0, limit)
    .map((r) => ({
      nom: r.nom,
      slug: r.slug,
      url: `/lieu-de-drague/region/${r.slug}`,
      count: r.lieuCount,
    }));
}

export async function getRelatedDragueDepartements(regionSlug: string, currentSlug?: string, limit = 8): Promise<RelatedLink[]> {
  buildAll();
  return _allDepartements!
    .filter((d) => d.regionSlug === regionSlug && d.slug !== currentSlug)
    .sort((a, b) => b.lieuCount - a.lieuCount)
    .slice(0, limit)
    .map((d) => ({
      nom: `${d.nom} (${d.code})`,
      slug: d.slug,
      url: `/lieu-de-drague/departement/${d.slug}`,
      count: d.lieuCount,
    }));
}

export async function getRelatedDragueVilles(departementSlug: string, currentSlug?: string, limit = 10): Promise<RelatedLink[]> {
  buildAll();
  return _allVilles!
    .filter((v) => v.departementSlug === departementSlug && v.slug !== currentSlug)
    .sort((a, b) => b.lieuCount - a.lieuCount)
    .slice(0, limit)
    .map((v) => ({
      nom: v.nom,
      slug: v.slug,
      url: `/lieu-de-drague/ville/${v.slug}`,
      count: v.lieuCount,
    }));
}

// Réagence l'ordre des lieux pour qu'aucune image identique ne soit adjacente
export function avoidAdjacentDuplicateImages<T extends { imageSrc: string }>(items: T[]): T[] {
  if (items.length < 2) return items;
  const result = [...items];
  for (let i = 1; i < result.length; i++) {
    if (result[i].imageSrc === result[i - 1].imageSrc) {
      // Cherche le prochain item avec une image différente et l'échange
      for (let j = i + 1; j < result.length; j++) {
        if (result[j].imageSrc !== result[i - 1].imageSrc) {
          [result[i], result[j]] = [result[j], result[i]];
          break;
        }
      }
    }
  }
  return result;
}
