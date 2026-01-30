/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisation des images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  // Redirections des anciennes URLs vers les nouvelles
  async redirects() {
    return [
      // Anciennes catégories de blog
      {
        source: '/category/blog',
        destination: '/conseils',
        permanent: true,
      },
      {
        source: '/category/blog/:path*',
        destination: '/conseils',
        permanent: true,
      },
      {
        source: '/category/rencontre-adulte',
        destination: '/conseils',
        permanent: true,
      },
      {
        source: '/category/rencontre-adulte/:path*',
        destination: '/conseils',
        permanent: true,
      },
      // Anciens tags
      {
        source: '/tag/echangisme',
        destination: '/decouvrir-les-differents-styles-dechangisme',
        permanent: true,
      },
      {
        source: '/tag/:tag',
        destination: '/conseils',
        permanent: true,
      },
      // Anciennes pages club-libertin-ville
      {
        source: '/club-libertin-lyon',
        destination: '/club-libertin/ville/lyon',
        permanent: true,
      },
      {
        source: '/club-libertin-bordeaux',
        destination: '/club-libertin/ville/bordeaux',
        permanent: true,
      },
      {
        source: '/club-libertin-lille',
        destination: '/club-libertin/ville/lille',
        permanent: true,
      },
      // Anciennes pages camping (clubs non trouvés dans la base)
      {
        source: '/camping-libertin-diamant-noir',
        destination: '/hebergement-libertin',
        permanent: true,
      },
      {
        source: '/camping-libertin-ran-du-chabrier-avis',
        destination: '/hebergement-libertin',
        permanent: true,
      },
    ];
  },

  // Headers de sécurité et cache
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
