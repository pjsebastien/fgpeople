/**
 * Page admin — modération des avis.
 *
 * Protégée par Basic Auth via middleware.ts (matcher: /admin/:path*).
 * Affiche : avis en attente (priorité), avis approuvés, avis rejetés.
 */

import Link from 'next/link';
import { listReviewsByStatus, isReviewsEnabled } from '@/lib/data/reviews';
import ReviewModerationItem from '@/components/admin/ReviewModerationItem';
import type { Review } from '@/lib/types/reviews';

export default async function AdminAvisPage() {
  if (!isReviewsEnabled()) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-yellow-300 font-semibold mb-1">Système d&apos;avis non configuré</p>
        <p className="text-text-secondary text-sm">
          Définis <code>SUPABASE_URL</code> et <code>SUPABASE_SERVICE_ROLE_KEY</code> dans les variables
          d&apos;environnement (voir <code>.env.example</code>).
        </p>
      </div>
    );
  }

  const [pending, approved, rejected] = await Promise.all([
    listReviewsByStatus('pending', 200),
    listReviewsByStatus('approved', 100),
    listReviewsByStatus('rejected', 50),
  ]);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Modération des avis</h1>
        <p className="text-text-secondary text-sm">
          {pending.length} avis en attente · {approved.length} approuvés · {rejected.length} rejetés
        </p>
      </header>

      <Section title={`En attente (${pending.length})`} reviews={pending} highlight />
      <Section title={`Approuvés récents (${approved.length})`} reviews={approved} />
      <Section title={`Rejetés (${rejected.length})`} reviews={rejected} />
    </>
  );
}

function Section({
  title,
  reviews,
  highlight,
}: {
  title: string;
  reviews: Review[];
  highlight?: boolean;
}) {
  return (
    <section className={`mb-10 ${highlight ? 'p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20' : ''}`}>
      <h2 className="text-xl font-bold text-text-primary mb-4">{title}</h2>
      {reviews.length === 0 ? (
        <p className="text-text-muted text-sm italic">Aucun avis dans cette catégorie.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <ReviewModerationItem key={r.id} review={r} />
          ))}
        </ul>
      )}
    </section>
  );
}
