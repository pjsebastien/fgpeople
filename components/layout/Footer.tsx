/**
 * Footer - Server Component
 *
 * RENDU SERVEUR: Le pied de page est rendu côté serveur.
 * Tous les liens sont présents dans le HTML source pour le SEO.
 *
 * Structure:
 * - Liens de navigation par catégorie
 * - Liens vers les régions principales
 * - Informations légales
 */

import Link from 'next/link';

// Liens des régions principales
const regionLinks = [
  { href: '/region/ile-de-france', label: 'Île-de-France' },
  { href: '/region/auvergne-rhone-alpes', label: 'Auvergne-Rhône-Alpes' },
  { href: '/region/provence-alpes-cote-dazur', label: 'PACA' },
  { href: '/region/nouvelle-aquitaine', label: 'Nouvelle-Aquitaine' },
  { href: '/region/pays-de-la-loire', label: 'Pays de la Loire' },
];

// Liens des villes principales
const cityLinks = [
  { href: '/ville/paris', label: 'Paris' },
  { href: '/ville/lyon', label: 'Lyon' },
  { href: '/ville/marseille', label: 'Marseille' },
  { href: '/ville/bordeaux', label: 'Bordeaux' },
  { href: '/ville/nantes', label: 'Nantes' },
];

// Liens légaux
const legalLinks = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/confidentialite', label: 'Politique de confidentialité' },
  { href: '/contact', label: 'Contact' },
];

// Liens conseils/blog
const blogLinks = [
  { href: '/conseils', label: 'Tous les conseils' },
  { href: '/avis-wyylde', label: 'Avis Wyylde' },
  { href: '/tenue-club-libertin', label: 'Tenue club libertin' },
  { href: '/quest-ce-que-la-communaute-libertine', label: 'Communauté libertine' },
  { href: '/decouvrir-les-differents-styles-dechangisme', label: 'Styles d\'échangisme' },
];

// Liens lieux de drague
const dragueLinks = [
  { href: '/lieu-de-drague', label: 'Tous les lieux de drague' },
  { href: '/lieu-de-drague/region/ile-de-france', label: 'Île-de-France' },
  { href: '/lieu-de-drague/region/auvergne-rhone-alpes', label: 'Auvergne-Rhône-Alpes' },
  { href: '/lieu-de-drague/region/provence-alpes-cote-d-azur', label: 'PACA' },
  { href: '/lieu-de-drague/ville/paris', label: 'Paris' },
  { href: '/lieu-de-drague/ville/marseille', label: 'Marseille' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-secondary" role="contentinfo">
      <div className="container-custom py-12 md:py-16">
        {/* ====== GRILLE PRINCIPALE ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* ====== COLONNE 1: À PROPOS ====== */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-baseline mb-4">
              <span className="text-accent-primary text-2xl font-bold">F</span>
              <span className="text-text-secondary text-[10px] font-medium -ml-0.5">or</span>
              <span className="text-accent-primary text-2xl font-bold ml-0.5">G</span>
              <span className="text-text-secondary text-[10px] font-medium -ml-0.5">ood</span>
              <span className="text-text-primary text-xl font-bold ml-1.5">People</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Tous les clubs libertins et échangistes de France réunis.
              Une sélection rigoureuse pour des soirées inoubliables.
            </p>
          </div>

          {/* ====== COLONNE 2: PAR RÉGION ====== */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Par région</h3>
            <ul className="space-y-2">
              {regionLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary text-sm hover:text-accent-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ====== COLONNE 3: PAR VILLE ====== */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Par ville</h3>
            <ul className="space-y-2">
              {cityLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary text-sm hover:text-accent-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ====== COLONNE: LIEUX DE DRAGUE ====== */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Lieux de drague</h3>
            <ul className="space-y-2">
              {dragueLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary text-sm hover:text-accent-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ====== COLONNE 4: CONSEILS ====== */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Conseils</h3>
            <ul className="space-y-2">
              {blogLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary text-sm hover:text-accent-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ====== COLONNE 5: INFORMATIONS ====== */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Informations</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary text-sm hover:text-accent-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ====== DIVIDER ====== */}
        <div className="divider my-8" />

        {/* ====== BAS DE PAGE ====== */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm">
            &copy; {currentYear} For Good People. Tous droits réservés.
          </p>
          <p className="text-text-muted text-sm">
            Site réservé aux personnes majeures (18+)
          </p>
        </div>
      </div>
    </footer>
  );
}
