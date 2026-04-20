/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisation des images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  // Redirections 301 pour nettoyer les URLs 404 indexées (ancien site WordPress)
  async redirects() {
    return [
      // ============================================
      // GROUPE 1 — CATCH-ALL PATTERNS (WordPress)
      // ============================================
      // Flux RSS (feeds)
      { source: '/feed', destination: '/', permanent: true },
      { source: '/feed/:path*', destination: '/', permanent: true },
      { source: '/:slug/feed', destination: '/', permanent: true },
      { source: '/:slug/feed/:path*', destination: '/', permanent: true },

      // Anciennes catégories WordPress
      { source: '/category', destination: '/', permanent: true },
      { source: '/category/blog', destination: '/conseils', permanent: true },
      { source: '/category/blog/:path*', destination: '/conseils', permanent: true },
      { source: '/category/rencontre-adulte', destination: '/conseils', permanent: true },
      { source: '/category/rencontre-adulte/:path*', destination: '/conseils', permanent: true },
      { source: '/category/club-libertin', destination: '/club-libertin', permanent: true },
      { source: '/category/club-libertin/:path*', destination: '/club-libertin', permanent: true },
      { source: '/category/sauna-libertin', destination: '/sauna-libertin', permanent: true },
      { source: '/category/sauna-libertin/:path*', destination: '/sauna-libertin', permanent: true },
      { source: '/category/bars-restos', destination: '/bar-libertin', permanent: true },
      { source: '/category/bars-restos/:path*', destination: '/bar-libertin', permanent: true },
      { source: '/category/libertin-echangisme', destination: '/decouvrir-les-differents-styles-dechangisme', permanent: true },
      { source: '/category/libertin-echangisme/:path*', destination: '/decouvrir-les-differents-styles-dechangisme', permanent: true },
      { source: '/category/plaisirs-solitaire', destination: '/conseils', permanent: true },
      { source: '/category/plaisirs-solitaire/:path*', destination: '/conseils', permanent: true },
      { source: '/category/uncategorized', destination: '/', permanent: true },
      { source: '/category/uncategorized/:path*', destination: '/', permanent: true },
      { source: '/category/:slug*', destination: '/', permanent: true },

      // Anciens tags WordPress
      { source: '/tag/echangisme', destination: '/decouvrir-les-differents-styles-dechangisme', permanent: true },
      { source: '/tag/:tag', destination: '/conseils', permanent: true },
      { source: '/tag/:tag/:path*', destination: '/conseils', permanent: true },

      // Blog et pagination WordPress
      { source: '/blog', destination: '/conseils', permanent: true },
      { source: '/blog/page/:n', destination: '/conseils', permanent: true },
      { source: '/blog/:path*', destination: '/conseils', permanent: true },

      // ============================================
      // GROUPE 2 — ERREURS SLUG SIMPLES
      // ============================================
      { source: '/politique-de-confidentialite', destination: '/confidentialite', permanent: true },
      { source: '/region/provence-alpes-cote-dazur', destination: '/region/provence-alpes-cote-d-azur', permanent: true },

      // ============================================
      // GROUPE 3 — VILLES ÉTRANGER MAL ROUTÉES
      // ============================================
      { source: '/ville/geneve', destination: '/etranger/suisse', permanent: true },
      { source: '/ville/suisse', destination: '/etranger/suisse', permanent: true },
      { source: '/ville/belgique', destination: '/etranger/belgique', permanent: true },
      { source: '/ville/luxembourg', destination: '/etranger/luxembourg', permanent: true },
      { source: '/ville/sta-llogaia-figueres', destination: '/etranger/espagne', permanent: true },
      { source: '/ville/coma-ruga-tarragona', destination: '/etranger/espagne', permanent: true },

      // ============================================
      // GROUPE 4 — PAGES TYPE+LIEU FILTRÉES
      // ============================================
      { source: '/restaurant-libertin/departement/haut-rhin', destination: '/restaurant-libertin', permanent: true },
      { source: '/hebergement-libertin/departement/haut-rhin', destination: '/hebergement-libertin', permanent: true },
      { source: '/hebergement-libertin/region/grand-est', destination: '/hebergement-libertin', permanent: true },

      // ============================================
      // GROUPE 5 — ANCIENS PATTERNS VILLE/TYPE
      // ============================================
      { source: '/club-libertin-lyon', destination: '/club-libertin/ville/lyon', permanent: true },
      { source: '/club-libertin-bordeaux', destination: '/club-libertin/ville/bordeaux', permanent: true },
      { source: '/club-libertin-lille', destination: '/club-libertin/ville/lille', permanent: true },
      { source: '/club-libertin-paris', destination: '/club-libertin/ville/paris', permanent: true },
      { source: '/sauna-libertin-bordeaux', destination: '/sauna-libertin/ville/bordeaux', permanent: true },

      // ============================================
      // GROUPE 6 — ANCIENS SLUGS CLUBS (aucun équivalent, redirect vers ville)
      // ============================================
      { source: '/thermes-marseille-sauna-gay', destination: '/sauna-libertin/ville/marseille', permanent: true },
      { source: '/sauna-terreaux-lyon-naturiste', destination: '/sauna-libertin/ville/lyon', permanent: true },
      { source: '/baronne-cannes-club-libertin', destination: '/ville/cannes', permanent: true },
      { source: '/diamant-lyon-club-libertin', destination: '/club-libertin/ville/lyon', permanent: true },
      { source: '/chant-cigales-septemes', destination: '/ville/septemes-les-vallons', permanent: true },
      { source: '/venusia-club-libertin', destination: '/club-libertin', permanent: true },
      { source: '/moloko-saint-etienne-club', destination: '/ville/saint-etienne', permanent: true },
      { source: '/domaine-auchay-club-libertin', destination: '/club-libertin', permanent: true },
      { source: '/frisson-pin-belgique', destination: '/etranger/belgique', permanent: true },
      { source: '/tentation-premesques-club-libertin', destination: '/ville/premesques', permanent: true },
      { source: '/new-bora-castillon-gard', destination: '/ville/castillon-du-gard', permanent: true },
      { source: '/escapade-glamour-moisdon', destination: '/ville/moisdon-la-riviere', permanent: true },
      { source: '/alina-sauna-poitiers', destination: '/sauna-libertin/ville/poitiers', permanent: true },
      { source: '/club-libertin-altromondo', destination: '/ville/rixheim', permanent: true },
      { source: '/sweet-paradise-montorgueil', destination: '/ville/paris', permanent: true },
      { source: '/liberty-station-club-libertin', destination: '/club-libertin', permanent: true },
      { source: '/odbx-club-sauna-libertin-mixte-avis', destination: '/sauna-libertin', permanent: true },
      { source: '/hyppocampe-paris-club-libertin-avis', destination: '/ville/paris', permanent: true },
      { source: '/escarpin-club-sm-paris', destination: '/club-sm-fetish/ville/paris', permanent: true },
      { source: '/secret-paris-club-libertin', destination: '/ville/paris', permanent: true },
      { source: '/aquadisiac-sauna-libertin-mixte-avis', destination: '/ville/cannes', permanent: true },
      { source: '/mas-virginie-libertin-drome', destination: '/departement/drome', permanent: true },
      { source: '/boudoir-cosy-bar-nice', destination: '/bar-libertin/ville/nice', permanent: true },
      { source: '/oasis-club-sauna-lyon', destination: '/sauna-libertin/ville/lyon', permanent: true },
      { source: '/cupidon-paris-club-libertin', destination: '/club-libertin/ville/paris', permanent: true },
      { source: '/we-club-paris-libertin', destination: '/club-libertin/ville/paris', permanent: true },
      { source: '/club-libertin-le-louxor-avis', destination: '/club-libertin/ville/paris', permanent: true },
      { source: '/chaloupe-bordeaux-club-libertin', destination: '/club-libertin/ville/bordeaux', permanent: true },
      { source: '/station-sauna-pau-club-libertin', destination: '/sauna-libertin/ville/pau', permanent: true },
      { source: '/guilis-club-carquefou', destination: '/ville/carquefou', permanent: true },
      { source: '/overside-paris-nuits-libertines', destination: '/club-libertin/ville/paris', permanent: true },
      { source: '/sauna-club-provence-opera', destination: '/sauna-libertin/ville/paris', permanent: true },
      { source: '/moon-city-sensualite-paris', destination: '/ville/paris', permanent: true },
      { source: '/chrysalide-club-libertin-var', destination: '/departement/var', permanent: true },
      { source: '/cent-douze-lille-club-libertin', destination: '/club-libertin/ville/lille', permanent: true },
      { source: '/strip-saint-ouen-club-libertin', destination: '/ville/saint-ouen', permanent: true },
      { source: '/yacht-club-76-auzebosc', destination: '/ville/auzebosc', permanent: true },
      { source: '/extasia-pinet-complexe-libertin', destination: '/ville/pinet', permanent: true },
      { source: '/bar-a-pute-dame-joelle', destination: '/bar-libertin', permanent: true },
      { source: '/le-karma-club-libertin-avis', destination: '/club-libertin', permanent: true },
      { source: '/camping-libertin-la-roseraie-avis', destination: '/hebergement-libertin', permanent: true },

      // ============================================
      // GROUPE 7 — ANCIENS ARTICLES DE BLOG DISPARUS
      // ============================================
      { source: '/avis-impartial-nouslib-experience-explosive', destination: '/conseils', permanent: true },
      { source: '/avis-utilisateurs-libertic-surprenants', destination: '/conseils', permanent: true },
      { source: '/avis-jacquie-michel-contact', destination: '/conseils', permanent: true },
      { source: '/telephone-rose', destination: '/conseils', permanent: true },
      { source: '/seduction-en-ligne', destination: '/conseils', permanent: true },
      { source: '/comment-booster-libido', destination: '/conseils', permanent: true },
      { source: '/comment-rencontrer-femme-soumise', destination: '/conseils', permanent: true },
      { source: '/comment-bien-utiliser-un-site-de-plan-cul', destination: '/conseils', permanent: true },
      { source: '/organiser-une-soiree-echangiste', destination: '/conseils', permanent: true },
      { source: '/erreurs-a-eviter-profil-sexylib', destination: '/conseils', permanent: true },
      { source: '/lifestyle-epanoui-equilibre', destination: '/conseils', permanent: true },
      { source: '/apprendre-a-mieux-se-connaitre-sexualite', destination: '/conseils', permanent: true },
      { source: '/conseil-rencontre-libertine', destination: '/conseils', permanent: true },
      { source: '/sites-de-rencontre-adultes', destination: '/conseils', permanent: true },
      { source: '/solutions-problemes-erection', destination: '/conseils', permanent: true },
      { source: '/sextoy-plaisir-anal', destination: '/conseils', permanent: true },
      { source: '/sex-dolls-poupee-sexuelle', destination: '/conseils', permanent: true },
      { source: '/poupee-sextoy', destination: '/conseils', permanent: true },
      { source: '/covoiturage-libertin', destination: '/conseils', permanent: true },
      { source: '/escort-lausanne-suisse', destination: '/etranger/suisse', permanent: true },
      { source: '/decouvrez-les-meilleurs-clubs-libertins-de-nice-et-des-alpes-maritimes', destination: '/departement/alpes-maritimes', permanent: true },
      { source: '/les-clubs-libertins-incontournables-de-strasbourg-et-du-bas-rhin', destination: '/departement/bas-rhin', permanent: true },
      { source: '/explorez-les-meilleurs-clubs-libertins-de-dijon-et-de-la-cote-dor', destination: '/departement/cote-d-or', permanent: true },
      { source: '/les-meilleurs-clubs-libertins-et-echangistes-de-tours-et-dindre-et-loire', destination: '/departement/indre-et-loire', permanent: true },

      // ============================================
      // GROUPE 8 — ANCIENNES REDIRECTIONS CAMPING
      // ============================================
      { source: '/camping-libertin-diamant-noir', destination: '/hebergement-libertin', permanent: true },
      { source: '/camping-libertin-ran-du-chabrier-avis', destination: '/hebergement-libertin', permanent: true },
    ];
  },

  // Headers de sécurité et cache
  async headers() {
    return [
      // Headers de sécurité globaux
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
      // Cache long pour les images statiques
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Cache pour les polices et assets Next.js
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
