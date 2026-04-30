/**
 * Layout admin — opt-out de l'indexation et du cache.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — FG People',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="py-8 md:py-12">
      <div className="container-custom max-w-5xl">{children}</div>
    </main>
  );
}
