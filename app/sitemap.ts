/**
 * Sitemap dynamique pour le SEO
 * Génère automatiquement la liste de toutes les URLs du site
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
} from '@/lib/data/clubs';
import { getAllArticleSlugs } from '@/lib/data/blog';

// Date fixe de dernière mise à jour des données
// À mettre à jour manuellement quand les données clubs changent
const DATA_LAST_UPDATED = new Date('2025-01-30');
const ARTICLES_LAST_UPDATED = new Date('2025-01-28');
const STATIC_PAGES_UPDATED = new Date('2025-01-30');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.fgpeople.com';

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: DATA_LAST_UPDATED,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/conseils`,
      lastModified: ARTICLES_LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: STATIC_PAGES_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: STATIC_PAGES_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/confidentialite`,
      lastModified: STATIC_PAGES_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/etranger`,
      lastModified: DATA_LAST_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Types de clubs (club-libertin, sauna-libertin, etc.)
  const typeCategories = await getAllTypeCategories();
  const typePages: MetadataRoute.Sitemap = typeCategories.map((cat) => ({
    url: `${baseUrl}/${cat.urlSlug}`,
    lastModified: DATA_LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Régions
  const regions = await getAllRegions();
  const regionPages: MetadataRoute.Sitemap = regions
    .filter((r) => r.slug !== 'region-inconnue')
    .map((r) => ({
      url: `${baseUrl}/region/${r.slug}`,
      lastModified: DATA_LAST_UPDATED,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // Départements
  const departements = await getAllDepartements();
  const deptPages: MetadataRoute.Sitemap = departements
    .filter((d) => d.nom !== 'Département inconnu')
    .map((d) => ({
      url: `${baseUrl}/departement/${d.slug}`,
      lastModified: DATA_LAST_UPDATED,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  // Villes (exclure les doublons et villes sans intérêt)
  const villes = await getAllVilles();
  const villesSeen = new Set<string>();
  const villePages: MetadataRoute.Sitemap = villes
    .filter((v) => {
      if (villesSeen.has(v.slug)) return false;
      villesSeen.add(v.slug);
      return true;
    })
    .map((v) => ({
      url: `${baseUrl}/ville/${v.slug}`,
      lastModified: DATA_LAST_UPDATED,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  // Clubs individuels
  const clubs = await getAllClubs();
  const clubPages: MetadataRoute.Sitemap = clubs.map((c) => ({
    url: `${baseUrl}/${c.slug}`,
    lastModified: DATA_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Articles de blog
  const articleSlugs = getAllArticleSlugs();
  const articlePages: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: ARTICLES_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Pages type + région (ex: /club-libertin/region/ile-de-france)
  const typeRegionParams = await getTypeRegionParams();
  const typeRegionPages: MetadataRoute.Sitemap = typeRegionParams.map((p) => ({
    url: `${baseUrl}/${p.type}/region/${p.region}`,
    lastModified: DATA_LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Pages type + département
  const typeDeptParams = await getTypeDepartementParams();
  const typeDeptPages: MetadataRoute.Sitemap = typeDeptParams.map((p) => ({
    url: `${baseUrl}/${p.type}/departement/${p.departement}`,
    lastModified: DATA_LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Pages type + ville
  const typeVilleParams = await getTypeVilleParams();
  const typeVillePages: MetadataRoute.Sitemap = typeVilleParams.map((p) => ({
    url: `${baseUrl}/${p.type}/ville/${p.ville}`,
    lastModified: DATA_LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Pages pays étrangers
  const paysEtrangers = await getPaysEtrangers();
  const paysPages: MetadataRoute.Sitemap = paysEtrangers.map((p) => ({
    url: `${baseUrl}/etranger/${p.slug}`,
    lastModified: DATA_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...typePages,
    ...regionPages,
    ...deptPages,
    ...villePages,
    ...typeRegionPages,
    ...typeDeptPages,
    ...typeVillePages,
    ...clubPages,
    ...articlePages,
    ...paysPages,
  ];
}
