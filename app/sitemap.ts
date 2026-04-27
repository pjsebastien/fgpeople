/**
 * Sitemap dynamique pour le SEO
 * Génère automatiquement la liste de toutes les URLs du site
 * Divisé en sous-sitemaps pour une meilleure indexation
 */

import { MetadataRoute } from 'next';
import {
  getAllClubs,
  getAllRegions,
  getAllDepartements,
  getAllVilles,
  getAllTypeCategories,
  getTypeRegionParams,
  getTypeDepartementParams,
  getTypeVilleParams,
  getPaysEtrangers,
  getRegionsByType,
  getDepartementsByType,
  getVillesByType,
} from '@/lib/data/clubs';
import { getAllArticleSlugs } from '@/lib/data/blog';
import {
  getAllDragueRegions,
  getAllDragueDepartements,
  getAllDragueVilles,
} from '@/lib/data/dragues';

// Date dynamique : utilise la date de build pour que Google voie le site comme actif
const BUILD_DATE = new Date();

// Seuil minimum de clubs pour inclure une page dans le sitemap
// Depuis l'enrichissement SEO des pages "thin content", on inclut toutes les pages
// avec >= 1 club (contenu enrichi via FAQ, intros variantes et maillage interne)
const MIN_CLUBS_FOR_INDEX = 1;
const MIN_CLUBS_TYPE_COMBO = 1;

/**
 * Génère un index de sitemaps divisé par catégorie
 * Produit : /sitemap/0.xml, /sitemap/1.xml, /sitemap/2.xml, /sitemap/3.xml
 */
export async function generateSitemaps() {
  return [
    { id: 0 }, // Pages principales : accueil, types, régions, articles, étranger
    { id: 1 }, // Pages géographiques : départements, villes (filtrées)
    { id: 2 }, // Pages combinées : type+région, type+département, type+ville (filtrées)
    { id: 3 }, // Pages individuelles : fiches clubs
    { id: 4 }, // Section "Lieux de drague" : hub + régions + départements + villes
  ];
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.fgpeople.com';

  switch (id) {
    // ================================================
    // SITEMAP 0 : Pages principales (haute priorité)
    // ================================================
    case 0: {
      // Pages statiques
      const staticPages: MetadataRoute.Sitemap = [
        {
          url: baseUrl,
          lastModified: BUILD_DATE,
          changeFrequency: 'daily',
          priority: 1,
        },
        {
          url: `${baseUrl}/conseils`,
          lastModified: BUILD_DATE,
          changeFrequency: 'weekly',
          priority: 0.8,
        },
        {
          url: `${baseUrl}/contact`,
          lastModified: BUILD_DATE,
          changeFrequency: 'monthly',
          priority: 0.3,
        },
        {
          url: `${baseUrl}/mentions-legales`,
          lastModified: BUILD_DATE,
          changeFrequency: 'yearly',
          priority: 0.2,
        },
        {
          url: `${baseUrl}/confidentialite`,
          lastModified: BUILD_DATE,
          changeFrequency: 'yearly',
          priority: 0.2,
        },
        {
          url: `${baseUrl}/etranger`,
          lastModified: BUILD_DATE,
          changeFrequency: 'weekly',
          priority: 0.7,
        },
      ];

      // Types de clubs
      const typeCategories = await getAllTypeCategories();
      const typePages: MetadataRoute.Sitemap = typeCategories.map((cat) => ({
        url: `${baseUrl}/${cat.urlSlug}`,
        lastModified: BUILD_DATE,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));

      // Régions (toujours indexées, toujours > 1 club)
      const regions = await getAllRegions();
      const regionPages: MetadataRoute.Sitemap = regions
        .filter((r) => r.slug !== 'region-inconnue')
        .map((r) => ({
          url: `${baseUrl}/region/${r.slug}`,
          lastModified: BUILD_DATE,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));

      // Articles de blog
      const articleSlugs = getAllArticleSlugs();
      const articlePages: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
        url: `${baseUrl}/${slug}`,
        lastModified: BUILD_DATE,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

      // Pays étrangers
      const paysEtrangers = await getPaysEtrangers();
      const paysPages: MetadataRoute.Sitemap = paysEtrangers.map((p) => ({
        url: `${baseUrl}/etranger/${p.slug}`,
        lastModified: BUILD_DATE,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));

      return [...staticPages, ...typePages, ...regionPages, ...articlePages, ...paysPages];
    }

    // ================================================
    // SITEMAP 1 : Départements et villes (filtrés)
    // ================================================
    case 1: {
      // Départements : exclure ceux avec <= 1 club (noindex)
      const departements = await getAllDepartements();
      const deptPages: MetadataRoute.Sitemap = departements
        .filter((d) => d.nom !== 'Département inconnu' && d.clubCount >= MIN_CLUBS_FOR_INDEX)
        .map((d) => ({
          url: `${baseUrl}/departement/${d.slug}`,
          lastModified: BUILD_DATE,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));

      // Villes : exclure celles avec <= 1 club (noindex) + dédoublonner
      const villes = await getAllVilles();
      const villesSeen = new Set<string>();
      const villePages: MetadataRoute.Sitemap = villes
        .filter((v) => {
          if (v.clubCount < MIN_CLUBS_FOR_INDEX) return false;
          if (villesSeen.has(v.slug)) return false;
          villesSeen.add(v.slug);
          return true;
        })
        .map((v) => ({
          url: `${baseUrl}/ville/${v.slug}`,
          lastModified: BUILD_DATE,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));

      return [...deptPages, ...villePages];
    }

    // ================================================
    // SITEMAP 2 : Pages combinées type+lieu (filtrées)
    // ================================================
    case 2: {
      const typeCategories = await getAllTypeCategories();

      // Type + Région : inclure seulement si >= MIN_CLUBS_TYPE_COMBO clubs
      const typeRegionPages: MetadataRoute.Sitemap = [];
      for (const cat of typeCategories) {
        const regions = await getRegionsByType(cat.slug);
        for (const r of regions) {
          if (r.clubCount >= MIN_CLUBS_TYPE_COMBO) {
            typeRegionPages.push({
              url: `${baseUrl}/${cat.urlSlug}/region/${r.slug}`,
              lastModified: BUILD_DATE,
              changeFrequency: 'weekly' as const,
              priority: 0.7,
            });
          }
        }
      }

      // Type + Département : inclure seulement si >= MIN_CLUBS_TYPE_COMBO clubs
      const typeDeptPages: MetadataRoute.Sitemap = [];
      for (const cat of typeCategories) {
        const depts = await getDepartementsByType(cat.slug);
        for (const d of depts) {
          if (d.clubCount >= MIN_CLUBS_TYPE_COMBO) {
            typeDeptPages.push({
              url: `${baseUrl}/${cat.urlSlug}/departement/${d.slug}`,
              lastModified: BUILD_DATE,
              changeFrequency: 'weekly' as const,
              priority: 0.6,
            });
          }
        }
      }

      // Type + Ville : inclure seulement si >= MIN_CLUBS_TYPE_COMBO clubs
      const typeVillePages: MetadataRoute.Sitemap = [];
      for (const cat of typeCategories) {
        const villes = await getVillesByType(cat.slug);
        for (const v of villes) {
          if (v.clubCount >= MIN_CLUBS_TYPE_COMBO) {
            typeVillePages.push({
              url: `${baseUrl}/${cat.urlSlug}/ville/${v.slug}`,
              lastModified: BUILD_DATE,
              changeFrequency: 'weekly' as const,
              priority: 0.6,
            });
          }
        }
      }

      return [...typeRegionPages, ...typeDeptPages, ...typeVillePages];
    }

    // ================================================
    // SITEMAP 3 : Fiches clubs individuelles
    // ================================================
    case 3: {
      const clubs = await getAllClubs();
      return clubs.map((c) => ({
        url: `${baseUrl}/${c.slug}`,
        lastModified: BUILD_DATE,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }

    // ================================================
    // SITEMAP 4 : Section "Lieux de drague"
    // ================================================
    case 4: {
      const [dragueRegions, dragueDepts, dragueVilles] = await Promise.all([
        getAllDragueRegions(),
        getAllDragueDepartements(),
        getAllDragueVilles(),
      ]);

      const hubPage: MetadataRoute.Sitemap = [
        {
          url: `${baseUrl}/lieu-de-drague`,
          lastModified: BUILD_DATE,
          changeFrequency: 'weekly',
          priority: 0.8,
        },
      ];

      const regionPages: MetadataRoute.Sitemap = dragueRegions.map((r) => ({
        url: `${baseUrl}/lieu-de-drague/region/${r.slug}`,
        lastModified: BUILD_DATE,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

      const deptPages: MetadataRoute.Sitemap = dragueDepts.map((d) => ({
        url: `${baseUrl}/lieu-de-drague/departement/${d.slug}`,
        lastModified: BUILD_DATE,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));

      // Filtre les villes : on indexe celles avec >= 1 lieu (toutes celles présentes)
      const villePages: MetadataRoute.Sitemap = dragueVilles.map((v) => ({
        url: `${baseUrl}/lieu-de-drague/ville/${v.slug}`,
        lastModified: BUILD_DATE,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      }));

      return [...hubPage, ...regionPages, ...deptPages, ...villePages];
    }

    default:
      return [];
  }
}
