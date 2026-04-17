/**
 * Robots.txt dynamique
 * Indique aux moteurs de recherche comment indexer le site
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: [
      'https://www.fgpeople.com/sitemap/0.xml',
      'https://www.fgpeople.com/sitemap/1.xml',
      'https://www.fgpeople.com/sitemap/2.xml',
      'https://www.fgpeople.com/sitemap/3.xml',
      'https://www.fgpeople.com/sitemap/4.xml',
    ],
  };
}
