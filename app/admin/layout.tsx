/**
 * Layout admin — opt-out de l'indexation et du cache, navigation commune.
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin — FG People',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SECTIONS = [
  { href: '/admin/avis', label: 'Modération des avis' },
  { href: '/admin/sites', label: 'Avis sur les sites' },
  { href: '/admin/clics', label: 'Clics partenaires' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="py-8 md:py-12">
      <div className="container-custom max-w-5xl">
        <nav className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-border">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="px-3.5 py-2 text-sm rounded-lg bg-bg-secondary text-text-secondary border border-border hover:border-accent-primary hover:text-accent-primary transition-colors"
            >
              {s.label}
            </Link>
          ))}
          <Link
            href="/"
            className="ml-auto px-3.5 py-2 text-sm text-text-muted hover:text-accent-primary transition-colors"
          >
            ← Retour au site
          </Link>
        </nav>

        {children}
      </div>
    </main>
  );
}
