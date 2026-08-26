/**
 * Page admin — liste des briefs d'avis sur les sites de rencontre.
 * Protégée par Basic Auth via middleware.ts.
 */

import Link from 'next/link';
import { listBriefs, countAssetsByBrief, isBriefsEnabled } from '@/lib/data/briefs';
import { BRIEF_STATUS_LABELS, type BriefStatus } from '@/lib/types/brief';

const STATUS_BADGE: Record<BriefStatus, string> = {
  draft: 'bg-bg-tertiary text-text-muted border-border',
  ready: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  generated: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  published: 'bg-green-500/20 text-green-300 border-green-500/30',
};

export default async function AdminSitesPage() {
  if (!isBriefsEnabled()) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-yellow-300 font-semibold mb-1">Supabase non configuré</p>
        <p className="text-text-secondary text-sm">
          Définis <code>SUPABASE_URL</code> et <code>SUPABASE_SERVICE_ROLE_KEY</code>, puis exécute{' '}
          <code>scripts/supabase-site-briefs-schema.sql</code> dans le SQL Editor Supabase.
        </p>
      </div>
    );
  }

  const [briefs, assetCounts] = await Promise.all([listBriefs(), countAssetsByBrief()]);

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Avis sur les sites</h1>
          <p className="text-text-secondary text-sm">
            {briefs.length} brief{briefs.length > 1 ? 's' : ''} · dépose ici captures, vidéos et
            consignes, je rédige l&apos;avis à partir de ça.
          </p>
        </div>
        <Link
          href="/admin/sites/nouveau"
          className="px-4 py-2 bg-accent-primary text-bg-primary font-semibold rounded-lg hover:bg-accent-hover text-sm"
        >
          + Nouveau site
        </Link>
      </header>

      {briefs.length === 0 ? (
        <div className="bg-bg-secondary border border-border rounded-xl p-8 text-center">
          <p className="text-text-secondary mb-4">
            Aucun brief pour l&apos;instant. Commence par le premier site que tu veux reviewer.
          </p>
          <Link
            href="/admin/sites/nouveau"
            className="inline-block px-4 py-2 bg-accent-primary text-bg-primary font-semibold rounded-lg hover:bg-accent-hover text-sm"
          >
            Créer un brief
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {briefs.map((b) => (
            <li key={b.id}>
              <Link
                href={`/admin/sites/${b.slug}`}
                className="block bg-bg-secondary border border-border rounded-lg p-4 hover:border-accent-primary transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-text-primary font-semibold">{b.site_name}</span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full border ${STATUS_BADGE[b.status]}`}
                      >
                        {BRIEF_STATUS_LABELS[b.status]}
                      </span>
                    </div>
                    <code className="text-text-muted text-xs">/{b.slug}</code>
                  </div>
                  <div className="text-right text-xs text-text-muted shrink-0">
                    <div>
                      {assetCounts[b.id] || 0} média{(assetCounts[b.id] || 0) > 1 ? 's' : ''}
                    </div>
                    <div>{new Date(b.updated_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="text-text-muted text-xs mt-8 pt-4 border-t border-border">
        Une fois un brief marqué « Prêt à rédiger », lance{' '}
        <code className="bg-bg-tertiary px-1.5 py-0.5 rounded">npm run brief:pull &lt;slug&gt;</code>{' '}
        en local pour me le transmettre.
      </p>
    </>
  );
}
