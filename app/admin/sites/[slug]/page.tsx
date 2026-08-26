/**
 * Page admin — édition d'un brief d'avis.
 * Le slug spécial « nouveau » ouvre le formulaire de création.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBriefBySlug, isBriefsEnabled } from '@/lib/data/briefs';
import { isCloudinaryEnabled } from '@/lib/utils/cloudinary-server';
import BriefForm from '@/components/admin/BriefForm';
import AssetManager from '@/components/admin/AssetManager';

export default async function AdminBriefPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isNew = slug === 'nouveau';

  if (!isBriefsEnabled()) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-yellow-300 font-semibold mb-1">Supabase non configuré</p>
        <p className="text-text-secondary text-sm">
          Définis <code>SUPABASE_URL</code> et <code>SUPABASE_SERVICE_ROLE_KEY</code>.
        </p>
      </div>
    );
  }

  const brief = isNew ? null : await getBriefBySlug(slug);
  if (!isNew && !brief) notFound();

  return (
    <>
      <nav className="mb-6">
        <Link href="/admin/sites" className="text-accent-primary hover:underline text-sm">
          ← Tous les sites
        </Link>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          {brief ? brief.site_name : 'Nouveau site'}
        </h1>
        {brief && (
          <p className="text-text-secondary text-sm">
            Page cible :{' '}
            <code className="bg-bg-tertiary px-1.5 py-0.5 rounded">/{brief.slug}</code>
          </p>
        )}
      </header>

      <section className="mb-12">
        <BriefForm brief={brief} />
      </section>

      {/* Les médias ne sont disponibles qu'une fois le brief créé (il faut son id) */}
      {brief ? (
        <section>
          <h2 className="text-xl font-bold text-text-primary mb-2">Médias</h2>
          <p className="text-text-secondary text-sm mb-5">
            Captures d&apos;écran, vidéos, liens YouTube. Tu peux annoter chaque média, mais ce
            n&apos;est pas obligatoire : j&apos;analyse les images pour identifier ce
            qu&apos;elles montrent et les placer au bon endroit dans l&apos;article.
          </p>
          <AssetManager
            briefId={brief.id}
            briefSlug={brief.slug}
            assets={brief.assets}
            cloudinaryEnabled={isCloudinaryEnabled()}
          />
        </section>
      ) : (
        <p className="text-text-muted text-sm italic">
          Enregistre le brief pour pouvoir y ajouter des médias.
        </p>
      )}
    </>
  );
}
