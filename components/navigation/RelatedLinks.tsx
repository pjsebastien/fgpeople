/**
 * RelatedLinks - Server Component
 *
 * Affiche les liens connexes pour le maillage interne SEO
 */

import Link from 'next/link';
import type { RelatedLink } from '@/lib/types';

interface RelatedLinksProps {
  title: string;
  links: RelatedLink[];
  variant?: 'grid' | 'list' | 'inline';
}

export default function RelatedLinks({
  title,
  links,
  variant = 'grid',
}: RelatedLinksProps) {
  if (links.length === 0) return null;

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.slug}
            href={link.url}
            className="px-3 py-1.5 bg-bg-tertiary text-text-secondary text-sm rounded-lg border border-border hover:border-accent-primary hover:text-accent-primary transition-colors"
          >
            {link.nom}
            {link.count !== undefined && (
              <span className="ml-1 text-text-muted">({link.count})</span>
            )}
          </Link>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="bg-bg-secondary rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.slug}>
              <Link
                href={link.url}
                className="flex items-center justify-between py-2 text-text-secondary hover:text-accent-primary transition-colors"
              >
                <span>{link.nom}</span>
                {link.count !== undefined && (
                  <span className="text-text-muted text-sm">{link.count} clubs</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // variant === 'grid'
  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-xl font-semibold text-text-primary mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {links.map((link) => (
          <Link
            key={link.slug}
            href={link.url}
            className="group p-4 bg-bg-secondary rounded-lg border border-border hover:border-accent-primary/30 transition-all text-center"
          >
            <span className="block text-text-primary group-hover:text-accent-primary transition-colors font-medium text-sm truncate">
              {link.nom}
            </span>
            {link.count !== undefined && (
              <span className="block text-text-muted text-xs mt-1">
                {link.count} club{link.count > 1 ? 's' : ''}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
