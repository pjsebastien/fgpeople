/**
 * Data Layer - Fonctions d'accès aux données des clubs
 * Parse le fichier clubs_libertins_verified.json
 */

import rawData from '../../data/clubs_libertins_verified.json';
import type { Club, ClubType, ClubTypeSlug, TypeCategory, Region, Departement, Ville, Pays, Stats, RelatedLink } from '../types';
import {
  generateFAQ,
  generateIntroText,
  generateAmbianceText,
  generateAccessText,
  generateMetaDescription,
  generateSEOTitle,
} from '../utils/seo-content';

// ============================================
// UTILITAIRES
// ============================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength - 3).trim() + '...';
}

function cleanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/Ã©/g, 'é')
    .replace(/Ã¨/g, 'è')
    .replace(/Ãª/g, 'ê')
    .replace(/Ã /g, 'à')
    .replace(/Ã¢/g, 'â')
    .replace(/Ã´/g, 'ô')
    .replace(/Ã®/g, 'î')
    .replace(/Ã¹/g, 'ù')
    .replace(/Ã§/g, 'ç')
    .replace(/Ã«/g, 'ë')
    .replace(/Ã¯/g, 'ï')
    .replace(/Ã¼/g, 'ü')
    .replace(/â¬/g, '€')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ============================================
// TRANSFORMATION DES DONNÉES
// ============================================

interface RawClub {
  id: string;
  nom: string;
  slug?: string; // Slug personnalisé (prioritaire si présent)
  type?: string;
  types_normalises?: string[];
  adresse?: string;
  code_postal?: string;
  ville?: string;
  departement_code?: string;
  departement_nom?: string;
  region?: string;
  pays?: string;
  telephone?: string;
  email?: string;
  site_web?: string;
  description?: string;
  equipements?: string[];
  horaires?: Record<string, string>;
  tarifs?: Record<string, string>;
  verification?: {
    status?: string;
    website_check?: {
      accessible?: boolean | null;
      reason?: string;
    };
    data_quality?: {
      score?: number;
    };
  };
}

// Mapping des labels vers les slugs
const TYPE_SLUG_MAP: Record<string, ClubTypeSlug> = {
  'Club': 'club',
  'Sauna': 'sauna',
  'Spa & Wellness': 'spa',
  'Restaurant': 'restaurant',
  'Bar': 'bar',
  'Hébergement': 'hebergement',
  'SM / Fétish': 'sm',
  'Gay friendly': 'gay',
  'Cinéma': 'cinema',
  'Discothèque': 'discotheque',
};

function parseClubTypes(labels: string[]): ClubType[] {
  return labels.map(label => ({
    slug: TYPE_SLUG_MAP[label] || 'club',
    label,
  }));
}

function transformClub(raw: RawClub): Club {
  const nom = cleanText(raw.nom || 'Club sans nom');
  const villeRaw = cleanText(raw.ville || '');
  const region = cleanText(raw.region || 'Région inconnue');
  const departement = cleanText(raw.departement_nom || 'Département inconnu');
  const pays = cleanText(raw.pays || 'France');
  const description = cleanText(raw.description || '');
  const type = raw.type || 'club libertin';
  const types = parseClubTypes(raw.types_normalises || ['Club']);
  const equipements = raw.equipements || [];
  const departement_code = raw.departement_code || '';
  const code_postal = raw.code_postal || '';

  // Si ville inconnue, utiliser le pays pour l'affichage et le slug
  const villeIsUnknown = !villeRaw || villeRaw.toLowerCase() === 'ville inconnue' || villeRaw.toLowerCase() === 'inconnue';
  const ville = villeIsUnknown ? pays : villeRaw;
  const villeForSlug = villeIsUnknown ? pays : villeRaw;

  // Génération du contenu SEO
  const seoTitle = generateSEOTitle(nom, type, ville, departement_code);
  const metaDescription = generateMetaDescription(nom, type, ville, departement_code, equipements);
  const introText = generateIntroText(nom, types, ville, region, equipements);
  const ambianceText = generateAmbianceText(nom, types, equipements);
  const accessText = generateAccessText(ville, region, departement, code_postal);
  const faq = generateFAQ(
    nom,
    ville,
    region,
    types,
    equipements,
    !!raw.telephone,
    !!raw.site_web
  );

  return {
    id: raw.id,
    slug: raw.slug || slugify(`${nom}-${villeForSlug}`), // Utilise le slug personnalisé si présent, sinon nom + ville/pays
    nom,
    type,
    types,
    adresse: cleanText(raw.adresse || ''),
    code_postal,
    ville,
    villeSlug: slugify(villeForSlug),
    departement_code,
    departement_nom: departement,
    departementSlug: slugify(departement),
    region,
    regionSlug: slugify(region),
    pays,
    paysSlug: slugify(pays),
    telephone: raw.telephone,
    email: raw.email,
    site_web: raw.site_web,
    websiteAccessible: raw.site_web
      ? (raw.verification?.website_check?.accessible ?? null) // null = non vérifié, true = accessible, false = inaccessible
      : null,
    description,
    shortDescription: truncate(description.replace(/\n/g, ' '), 160),
    equipements,
    horaires: raw.horaires,
    tarifs: raw.tarifs,
    status: (raw.verification?.status as Club['status']) || 'incertain',
    qualityScore: raw.verification?.data_quality?.score || 0,
    seo: {
      title: seoTitle,
      metaDescription,
      introText,
      ambianceText,
      accessText,
      faq,
    },
  };
}

// Cache des clubs transformés
let clubsCache: Club[] | null = null;

function getClubs(): Club[] {
  if (!clubsCache) {
    clubsCache = (rawData.clubs as RawClub[])
      .map(transformClub)
      .filter(club => club.ville && club.region); // Filtrer les clubs sans localisation
  }
  return clubsCache;
}

// ============================================
// FONCTIONS PRINCIPALES - CLUBS
// ============================================

export async function getAllClubs(): Promise<Club[]> {
  return getClubs();
}

export async function getClubBySlug(slug: string): Promise<Club | null> {
  return getClubs().find(club => club.slug === slug) || null;
}

export async function getClubsByStatus(status: Club['status']): Promise<Club[]> {
  return getClubs().filter(club => club.status === status);
}

export async function getFeaturedClubs(limit = 12): Promise<Club[]> {
  return getClubs()
    .filter(club => club.status === 'actif' && club.qualityScore >= 10)
    .sort((a, b) => b.qualityScore - a.qualityScore)
    .slice(0, limit);
}

// ============================================
// FONCTIONS PAR LOCALISATION - FRANCE
// ============================================

export async function getClubsByRegion(regionSlug: string): Promise<Club[]> {
  return getClubs().filter(
    club => club.regionSlug === regionSlug && club.paysSlug === 'france'
  );
}

export async function getClubsByDepartement(departementSlug: string): Promise<Club[]> {
  return getClubs().filter(
    club => club.departementSlug === departementSlug && club.paysSlug === 'france'
  );
}

export async function getClubsByVille(villeSlug: string): Promise<Club[]> {
  return getClubs().filter(
    club => club.villeSlug === villeSlug && club.paysSlug === 'france'
  );
}

// ============================================
// FONCTIONS PAR PAYS (ÉTRANGER)
// ============================================

export async function getClubsFrance(): Promise<Club[]> {
  return getClubs().filter(club => club.paysSlug === 'france');
}

export async function getClubsEtranger(): Promise<Club[]> {
  return getClubs().filter(club => club.paysSlug !== 'france');
}

export async function getClubsByPays(paysSlug: string): Promise<Club[]> {
  return getClubs().filter(club => club.paysSlug === paysSlug);
}

// ============================================
// FONCTIONS NAVIGATION - RÉGIONS
// ============================================

export async function getAllRegions(): Promise<Region[]> {
  const clubs = getClubs().filter(c => c.paysSlug === 'france');
  const regionMap = new Map<string, Region>();

  clubs.forEach(club => {
    if (!regionMap.has(club.regionSlug)) {
      regionMap.set(club.regionSlug, {
        nom: club.region,
        slug: club.regionSlug,
        departements: [],
        clubCount: 0,
      });
    }
    const region = regionMap.get(club.regionSlug)!;
    region.clubCount++;
    if (!region.departements.includes(club.departementSlug)) {
      region.departements.push(club.departementSlug);
    }
  });

  return Array.from(regionMap.values())
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
}

export async function getRegionBySlug(slug: string): Promise<Region | null> {
  const regions = await getAllRegions();
  return regions.find(r => r.slug === slug) || null;
}

// ============================================
// FONCTIONS NAVIGATION - DÉPARTEMENTS
// ============================================

export async function getAllDepartements(): Promise<Departement[]> {
  const clubs = getClubs().filter(c => c.paysSlug === 'france');
  const deptMap = new Map<string, Departement>();

  clubs.forEach(club => {
    if (!deptMap.has(club.departementSlug)) {
      deptMap.set(club.departementSlug, {
        code: club.departement_code,
        nom: club.departement_nom,
        slug: club.departementSlug,
        region: club.region,
        regionSlug: club.regionSlug,
        villes: [],
        clubCount: 0,
      });
    }
    const dept = deptMap.get(club.departementSlug)!;
    dept.clubCount++;
    if (!dept.villes.includes(club.villeSlug)) {
      dept.villes.push(club.villeSlug);
    }
  });

  return Array.from(deptMap.values())
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
}

export async function getDepartementBySlug(slug: string): Promise<Departement | null> {
  const depts = await getAllDepartements();
  return depts.find(d => d.slug === slug) || null;
}

export async function getDepartementsByRegion(regionSlug: string): Promise<Departement[]> {
  const depts = await getAllDepartements();
  return depts.filter(d => d.regionSlug === regionSlug);
}

// ============================================
// FONCTIONS NAVIGATION - VILLES
// ============================================

export async function getAllVilles(): Promise<Ville[]> {
  const clubs = getClubs().filter(c => c.paysSlug === 'france');
  const villeMap = new Map<string, Ville>();

  clubs.forEach(club => {
    const key = `${club.villeSlug}-${club.departementSlug}`;
    if (!villeMap.has(key)) {
      villeMap.set(key, {
        nom: club.ville,
        slug: club.villeSlug,
        code_postal: club.code_postal,
        departement: club.departement_nom,
        departementSlug: club.departementSlug,
        departement_code: club.departement_code,
        region: club.region,
        regionSlug: club.regionSlug,
        clubCount: 0,
      });
    }
    const ville = villeMap.get(key)!;
    ville.clubCount++;
  });

  return Array.from(villeMap.values())
    .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
}

export async function getVilleBySlug(slug: string): Promise<Ville | null> {
  const villes = await getAllVilles();
  return villes.find(v => v.slug === slug) || null;
}

export async function getVillesByDepartement(departementSlug: string): Promise<Ville[]> {
  const villes = await getAllVilles();
  return villes.filter(v => v.departementSlug === departementSlug);
}

// ============================================
// FONCTIONS NAVIGATION - PAYS
// ============================================

export async function getAllPays(): Promise<Pays[]> {
  const clubs = getClubs();
  const paysMap = new Map<string, Pays>();

  clubs.forEach(club => {
    if (!paysMap.has(club.paysSlug)) {
      paysMap.set(club.paysSlug, {
        nom: club.pays,
        slug: club.paysSlug,
        clubCount: 0,
        isEtranger: club.paysSlug !== 'france',
      });
    }
    const pays = paysMap.get(club.paysSlug)!;
    pays.clubCount++;
  });

  return Array.from(paysMap.values())
    .sort((a, b) => {
      // France en premier, puis par nombre de clubs
      if (a.slug === 'france') return -1;
      if (b.slug === 'france') return 1;
      return b.clubCount - a.clubCount;
    });
}

export async function getPaysBySlug(slug: string): Promise<Pays | null> {
  const pays = await getAllPays();
  return pays.find(p => p.slug === slug) || null;
}

export async function getPaysEtrangers(): Promise<Pays[]> {
  const pays = await getAllPays();
  return pays.filter(p => p.isEtranger);
}

// ============================================
// FONCTIONS CLUBS À PROXIMITÉ
// ============================================

export async function getClubsProximite(
  club: Club,
  limit = 12
): Promise<Club[]> {
  const clubs = getClubs();

  // D'abord les clubs de la même ville
  let proximite = clubs.filter(
    c => c.id !== club.id && c.villeSlug === club.villeSlug
  );

  // Puis du même département
  if (proximite.length < limit) {
    const deptClubs = clubs.filter(
      c => c.id !== club.id &&
           c.departementSlug === club.departementSlug &&
           c.villeSlug !== club.villeSlug
    );
    proximite = [...proximite, ...deptClubs];
  }

  // Puis de la même région
  if (proximite.length < limit) {
    const regionClubs = clubs.filter(
      c => c.id !== club.id &&
           c.regionSlug === club.regionSlug &&
           c.departementSlug !== club.departementSlug
    );
    proximite = [...proximite, ...regionClubs];
  }

  return proximite.slice(0, limit);
}

// ============================================
// FONCTIONS ÉQUIPEMENTS
// ============================================

export async function getAllEquipements(): Promise<string[]> {
  const clubs = getClubs();
  const equipementsSet = new Set<string>();

  clubs.forEach(club => {
    club.equipements.forEach(eq => equipementsSet.add(eq));
  });

  return Array.from(equipementsSet).sort((a, b) =>
    a.localeCompare(b, 'fr')
  );
}

// ============================================
// FONCTIONS STATISTIQUES
// ============================================

export async function getStats(): Promise<Stats> {
  const clubs = getClubs();
  const regions = await getAllRegions();
  const depts = await getAllDepartements();
  const villes = await getAllVilles();

  return {
    total: clubs.length,
    france: clubs.filter(c => c.paysSlug === 'france').length,
    etranger: clubs.filter(c => c.paysSlug !== 'france').length,
    regions: regions.length,
    departements: depts.length,
    villes: villes.length,
  };
}

// ============================================
// FONCTIONS POUR generateStaticParams
// ============================================

export async function getAllClubSlugs(): Promise<string[]> {
  return getClubs().map(c => c.slug);
}

export async function getAllRegionSlugs(): Promise<string[]> {
  const regions = await getAllRegions();
  return regions.map(r => r.slug);
}

export async function getAllDepartementSlugs(): Promise<string[]> {
  const depts = await getAllDepartements();
  return depts.map(d => d.slug);
}

export async function getAllVilleSlugs(): Promise<string[]> {
  const villes = await getAllVilles();
  return villes.map(v => v.slug);
}

export async function getAllPaysSlugsEtranger(): Promise<string[]> {
  const pays = await getPaysEtrangers();
  return pays.map(p => p.slug);
}

// ============================================
// FONCTIONS POUR LE MAILLAGE INTERNE
// ============================================

export async function getRelatedRegions(currentSlug: string, limit = 6): Promise<RelatedLink[]> {
  const regions = await getAllRegions();
  return regions
    .filter(r => r.slug !== currentSlug)
    .slice(0, limit)
    .map(r => ({
      nom: r.nom,
      slug: r.slug,
      url: `/region/${r.slug}`,
      count: r.clubCount,
    }));
}

export async function getRelatedDepartements(
  regionSlug: string,
  currentSlug?: string,
  limit = 8
): Promise<RelatedLink[]> {
  const depts = await getDepartementsByRegion(regionSlug);
  return depts
    .filter(d => d.slug !== currentSlug)
    .slice(0, limit)
    .map(d => ({
      nom: `${d.nom} (${d.code})`,
      slug: d.slug,
      url: `/departement/${d.slug}`,
      count: d.clubCount,
    }));
}

export async function getRelatedVilles(
  departementSlug: string,
  currentSlug?: string,
  limit = 10
): Promise<RelatedLink[]> {
  const villes = await getVillesByDepartement(departementSlug);
  return villes
    .filter(v => v.slug !== currentSlug)
    .slice(0, limit)
    .map(v => ({
      nom: v.nom,
      slug: v.slug,
      url: `/ville/${v.slug}`,
      count: v.clubCount,
    }));
}

// ============================================
// FONCTIONS POUR LA PAGE D'ACCUEIL
// ============================================

export async function getPopularDepartements(limit = 10): Promise<Departement[]> {
  const depts = await getAllDepartements();
  return depts
    .sort((a, b) => b.clubCount - a.clubCount)
    .slice(0, limit);
}

export async function getPopularVilles(limit = 12): Promise<Ville[]> {
  const villes = await getAllVilles();
  return villes
    .sort((a, b) => b.clubCount - a.clubCount)
    .slice(0, limit);
}

// ============================================
// CONFIGURATION DES TYPES DE CLUBS
// ============================================

const TYPE_CATEGORIES_CONFIG: Record<ClubTypeSlug, Omit<TypeCategory, 'clubCount'>> = {
  club: {
    slug: 'club',
    urlSlug: 'club-libertin',
    label: 'Club libertin',
    labelPlural: 'Clubs libertins',
    seoTitle: 'Club libertin et échangiste',
    description: 'Tous les établissements libertins et échangistes',
  },
  sauna: {
    slug: 'sauna',
    urlSlug: 'sauna-libertin',
    label: 'Sauna',
    labelPlural: 'Avec sauna',
    seoTitle: 'Sauna libertin',
    description: 'Établissements proposant un espace sauna parmi leurs prestations',
  },
  spa: {
    slug: 'spa',
    urlSlug: 'spa-libertin',
    label: 'Spa & Wellness',
    labelPlural: 'Avec spa & wellness',
    seoTitle: 'Spa et hammam libertin',
    description: 'Établissements avec jacuzzi, hammam ou espaces bien-être',
  },
  restaurant: {
    slug: 'restaurant',
    urlSlug: 'restaurant-libertin',
    label: 'Restaurant',
    labelPlural: 'Avec restauration',
    seoTitle: 'Restaurant libertin',
    description: 'Établissements proposant une offre de restauration',
  },
  bar: {
    slug: 'bar',
    urlSlug: 'bar-libertin',
    label: 'Bar',
    labelPlural: 'Avec bar',
    seoTitle: 'Bar libertin',
    description: 'Établissements avec espace bar et licence pour vous accueillir',
  },
  hebergement: {
    slug: 'hebergement',
    urlSlug: 'hebergement-libertin',
    label: 'Hébergement',
    labelPlural: 'Avec hébergement',
    seoTitle: 'Hébergement libertin',
    description: 'Gîtes, chambres d\'hôtes et hôtels pour prolonger votre soirée',
  },
  sm: {
    slug: 'sm',
    urlSlug: 'club-sm-fetish',
    label: 'SM & Fétish',
    labelPlural: 'Avec espace SM & Fétish',
    seoTitle: 'Club SM et fétish',
    description: 'Établissements avec donjons ou équipements SM et fétish',
  },
  gay: {
    slug: 'gay',
    urlSlug: 'club-gay-friendly',
    label: 'Gay friendly',
    labelPlural: 'Gay friendly',
    seoTitle: 'Club libertin gay friendly',
    description: 'Établissements gay friendly et mixtes',
  },
  cinema: {
    slug: 'cinema',
    urlSlug: 'cinema-libertin',
    label: 'Cinéma / Vidéo',
    labelPlural: 'Avec espace cinéma',
    seoTitle: 'Cinéma libertin',
    description: 'Établissements avec salle vidéo ou cinéma',
  },
  discotheque: {
    slug: 'discotheque',
    urlSlug: 'discotheque-libertine',
    label: 'Discothèque',
    labelPlural: 'Avec piste de danse',
    seoTitle: 'Discothèque libertine',
    description: 'Établissements avec piste de danse et ambiance festive',
  },
};

// ============================================
// FONCTIONS PAR TYPE DE CLUB
// ============================================

export async function getAllTypeCategories(): Promise<TypeCategory[]> {
  const clubs = getClubs();
  const typeCounts = new Map<ClubTypeSlug, number>();

  clubs.forEach(club => {
    club.types.forEach(t => {
      typeCounts.set(t.slug, (typeCounts.get(t.slug) || 0) + 1);
    });
  });

  return Object.entries(TYPE_CATEGORIES_CONFIG)
    .map(([slug, config]) => ({
      ...config,
      clubCount: typeCounts.get(slug as ClubTypeSlug) || 0,
    }))
    .filter(t => t.clubCount > 0)
    .sort((a, b) => b.clubCount - a.clubCount);
}

export async function getTypeCategoryByUrlSlug(urlSlug: string): Promise<TypeCategory | null> {
  const categories = await getAllTypeCategories();
  return categories.find(c => c.urlSlug === urlSlug) || null;
}

export async function getTypeCategoryBySlug(slug: ClubTypeSlug): Promise<TypeCategory | null> {
  const categories = await getAllTypeCategories();
  return categories.find(c => c.slug === slug) || null;
}

export async function getAllTypeUrlSlugs(): Promise<string[]> {
  const categories = await getAllTypeCategories();
  return categories.map(c => c.urlSlug);
}

export async function getClubsByTypeSlug(typeSlug: ClubTypeSlug): Promise<Club[]> {
  return getClubs().filter(club =>
    club.types.some(t => t.slug === typeSlug)
  );
}

export async function getClubsByTypeUrlSlug(urlSlug: string): Promise<Club[]> {
  const category = await getTypeCategoryByUrlSlug(urlSlug);
  if (!category) return [];
  return getClubsByTypeSlug(category.slug);
}

// ============================================
// FONCTIONS PAR TYPE + LOCALISATION
// ============================================

export async function getClubsByTypeAndRegion(typeSlug: ClubTypeSlug, regionSlug: string): Promise<Club[]> {
  return getClubs().filter(club =>
    club.types.some(t => t.slug === typeSlug) &&
    club.regionSlug === regionSlug &&
    club.paysSlug === 'france'
  );
}

export async function getClubsByTypeAndDepartement(typeSlug: ClubTypeSlug, departementSlug: string): Promise<Club[]> {
  return getClubs().filter(club =>
    club.types.some(t => t.slug === typeSlug) &&
    club.departementSlug === departementSlug &&
    club.paysSlug === 'france'
  );
}

export async function getClubsByTypeAndVille(typeSlug: ClubTypeSlug, villeSlug: string): Promise<Club[]> {
  return getClubs().filter(club =>
    club.types.some(t => t.slug === typeSlug) &&
    club.villeSlug === villeSlug &&
    club.paysSlug === 'france'
  );
}

// ============================================
// FONCTIONS NAVIGATION PAR TYPE
// ============================================

export async function getRegionsByType(typeSlug: ClubTypeSlug): Promise<Region[]> {
  const clubs = getClubs().filter(c =>
    c.types.some(t => t.slug === typeSlug) && c.paysSlug === 'france'
  );
  const regionMap = new Map<string, Region>();

  clubs.forEach(club => {
    if (!regionMap.has(club.regionSlug)) {
      regionMap.set(club.regionSlug, {
        nom: club.region,
        slug: club.regionSlug,
        departements: [],
        clubCount: 0,
      });
    }
    const region = regionMap.get(club.regionSlug)!;
    region.clubCount++;
    if (!region.departements.includes(club.departementSlug)) {
      region.departements.push(club.departementSlug);
    }
  });

  return Array.from(regionMap.values())
    .filter(r => r.nom !== 'Région inconnue')
    .sort((a, b) => b.clubCount - a.clubCount);
}

export async function getDepartementsByType(typeSlug: ClubTypeSlug): Promise<Departement[]> {
  const clubs = getClubs().filter(c =>
    c.types.some(t => t.slug === typeSlug) && c.paysSlug === 'france'
  );
  const deptMap = new Map<string, Departement>();

  clubs.forEach(club => {
    if (!deptMap.has(club.departementSlug)) {
      deptMap.set(club.departementSlug, {
        code: club.departement_code,
        nom: club.departement_nom,
        slug: club.departementSlug,
        region: club.region,
        regionSlug: club.regionSlug,
        villes: [],
        clubCount: 0,
      });
    }
    const dept = deptMap.get(club.departementSlug)!;
    dept.clubCount++;
    if (!dept.villes.includes(club.villeSlug)) {
      dept.villes.push(club.villeSlug);
    }
  });

  return Array.from(deptMap.values())
    .sort((a, b) => b.clubCount - a.clubCount);
}

export async function getVillesByType(typeSlug: ClubTypeSlug): Promise<Ville[]> {
  const clubs = getClubs().filter(c =>
    c.types.some(t => t.slug === typeSlug) && c.paysSlug === 'france'
  );
  const villeMap = new Map<string, Ville>();

  clubs.forEach(club => {
    const key = `${club.villeSlug}-${club.departementSlug}`;
    if (!villeMap.has(key)) {
      villeMap.set(key, {
        nom: club.ville,
        slug: club.villeSlug,
        code_postal: club.code_postal,
        departement: club.departement_nom,
        departementSlug: club.departementSlug,
        departement_code: club.departement_code,
        region: club.region,
        regionSlug: club.regionSlug,
        clubCount: 0,
      });
    }
    const ville = villeMap.get(key)!;
    ville.clubCount++;
  });

  return Array.from(villeMap.values())
    .sort((a, b) => b.clubCount - a.clubCount);
}

export async function getDepartementsByTypeAndRegion(typeSlug: ClubTypeSlug, regionSlug: string): Promise<Departement[]> {
  const depts = await getDepartementsByType(typeSlug);
  return depts.filter(d => d.regionSlug === regionSlug);
}

export async function getVillesByTypeAndDepartement(typeSlug: ClubTypeSlug, departementSlug: string): Promise<Ville[]> {
  const villes = await getVillesByType(typeSlug);
  return villes.filter(v => v.departementSlug === departementSlug);
}

// ============================================
// FONCTIONS POUR generateStaticParams PAR TYPE
// ============================================

export async function getTypeRegionParams(): Promise<{ type: string; region: string }[]> {
  const categories = await getAllTypeCategories();
  const params: { type: string; region: string }[] = [];

  for (const cat of categories) {
    const regions = await getRegionsByType(cat.slug);
    for (const region of regions) {
      params.push({ type: cat.urlSlug, region: region.slug });
    }
  }

  return params;
}

export async function getTypeDepartementParams(): Promise<{ type: string; departement: string }[]> {
  const categories = await getAllTypeCategories();
  const params: { type: string; departement: string }[] = [];

  for (const cat of categories) {
    const depts = await getDepartementsByType(cat.slug);
    for (const dept of depts) {
      params.push({ type: cat.urlSlug, departement: dept.slug });
    }
  }

  return params;
}

export async function getTypeVilleParams(): Promise<{ type: string; ville: string }[]> {
  const categories = await getAllTypeCategories();
  const params: { type: string; ville: string }[] = [];

  for (const cat of categories) {
    const villes = await getVillesByType(cat.slug);
    for (const ville of villes) {
      params.push({ type: cat.urlSlug, ville: ville.slug });
    }
  }

  return params;
}
