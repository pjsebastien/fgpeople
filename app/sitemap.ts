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
} from '@/lib/data/clubs';
import { getAllArticleSlugs } from '@/lib/data/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.fgpeople.com';

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/conseils`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/confidentialite`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Types de clubs (club-libertin, sauna-libertin, etc.)
  const typeCategories = await getAllTypeCategories();
  const typePages: MetadataRoute.Sitemap = typeCategories.map((cat) => ({
    url: `${baseUrl}/${cat.urlSlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Régions
  const regions = await getAllRegions();
  const regionPages: MetadataRoute.Sitemap = regions.map((r) => ({
    url: `${baseUrl}/region/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Départements
  const departements = await getAllDepartements();
  const deptPages: MetadataRoute.Sitemap = departements.map((d) => ({
    url: `${baseUrl}/departement/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Villes
  const villes = await getAllVilles();
  const villePages: MetadataRoute.Sitemap = villes.map((v) => ({
    url: `${baseUrl}/ville/${v.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Clubs individuels
  const clubs = await getAllClubs();
  const clubPages: MetadataRoute.Sitemap = clubs.map((c) => ({
    url: `${baseUrl}/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Articles de blog
  const articleSlugs = getAllArticleSlugs();
  const articlePages: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Pages type + région (ex: /club-libertin/region/ile-de-france)
  const typeRegionParams = await getTypeRegionParams();
  const typeRegionPages: MetadataRoute.Sitemap = typeRegionParams.map((p) => ({
    url: `${baseUrl}/${p.type}/region/${p.region}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Pages type + département
  const typeDeptParams = await getTypeDepartementParams();
  const typeDeptPages: MetadataRoute.Sitemap = typeDeptParams.map((p) => ({
    url: `${baseUrl}/${p.type}/departement/${p.departement}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Pages type + ville
  const typeVilleParams = await getTypeVilleParams();
  const typeVillePages: MetadataRoute.Sitemap = typeVilleParams.map((p) => ({
    url: `${baseUrl}/${p.type}/ville/${p.ville}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
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
  ];
}
