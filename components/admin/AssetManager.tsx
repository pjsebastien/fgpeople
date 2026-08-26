'use client';

/**
 * Gestion des médias d'un brief.
 *
 * Les fichiers partent DIRECTEMENT du navigateur vers Cloudinary avec une
 * signature obtenue du serveur : rien ne transite par Vercel, donc aucune
 * limite de taille de Server Action à contourner.
 */

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  getUploadTicketAction,
  registerAssetAction,
  addYouTubeAction,
  updateAssetNotesAction,
  deleteAssetAction,
  reorderAssetsAction,
  type CloudinaryUploadResult,
} from '@/app/actions/briefs';
import { cloudinaryImage, parseYouTubeId, youTubeThumbnail } from '@/lib/utils/cloudinary';
import { ASSET_KIND_LABELS, type BriefAsset, type AssetKind } from '@/lib/types/brief';

interface AssetManagerProps {
  briefId: string;
  briefSlug: string;
  assets: BriefAsset[];
  cloudinaryEnabled: boolean;
}

interface UploadState {
  name: string;
  status: 'uploading' | 'error';
  error?: string;
}

export default function AssetManager({
  briefId,
  briefSlug,
  assets,
  cloudinaryEnabled,
}: AssetManagerProps) {
  const router = useRouter();
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeLabel, setYoutubeLabel] = useState('');
  const [ytError, setYtError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const captureInput = useRef<HTMLInputElement>(null);
  const logoInput = useRef<HTMLInputElement>(null);

  async function uploadOne(file: File, kind: AssetKind) {
    const isVideo = file.type.startsWith('video/');
    const resolvedKind: AssetKind = kind === 'logo' ? 'logo' : isVideo ? 'video' : 'image';

    setUploads((u) => [...u, { name: file.name, status: 'uploading' }]);

    const fail = (msg: string) =>
      setUploads((u) =>
        u.map((x) => (x.name === file.name ? { ...x, status: 'error' as const, error: msg } : x))
      );

    try {
      const ticketRes = await getUploadTicketAction(briefSlug, isVideo);
      if (!ticketRes.ok || !ticketRes.data) return fail(ticketRes.error || 'Signature refusée');
      const t = ticketRes.data;

      const fd = new FormData();
      fd.append('file', file);
      fd.append('api_key', t.apiKey);
      fd.append('timestamp', String(t.timestamp));
      fd.append('signature', t.signature);
      fd.append('folder', t.folder);

      const res = await fetch(t.endpoint, { method: 'POST', body: fd });
      const json = (await res.json()) as CloudinaryUploadResult & { error?: { message: string } };
      if (!res.ok || json.error) return fail(json.error?.message || `Cloudinary a répondu ${res.status}`);

      const reg = await registerAssetAction(briefId, briefSlug, resolvedKind, json);
      if (!reg.ok) return fail(reg.error || 'Enregistrement échoué');

      setUploads((u) => u.filter((x) => x.name !== file.name));
      router.refresh();
    } catch (err) {
      fail(err instanceof Error ? err.message : 'Erreur réseau');
    }
  }

  function handleFiles(files: FileList | null, kind: AssetKind) {
    if (!files) return;
    Array.from(files).forEach((f) => uploadOne(f, kind));
  }

  function addYouTube() {
    setYtError(null);
    if (!parseYouTubeId(youtubeUrl)) {
      setYtError('Lien YouTube non reconnu.');
      return;
    }
    startTransition(async () => {
      const res = await addYouTubeAction(briefId, briefSlug, youtubeUrl, youtubeLabel);
      if (res.ok) {
        setYoutubeUrl('');
        setYoutubeLabel('');
        router.refresh();
      } else {
        setYtError(res.error || 'Erreur');
      }
    });
  }

  function move(index: number, delta: number) {
    const next = [...assets];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    startTransition(async () => {
      await reorderAssetsAction(
        briefId,
        briefSlug,
        next.map((a) => a.id)
      );
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {!cloudinaryEnabled && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-300 font-semibold mb-1">Cloudinary non configuré</p>
          <p className="text-text-secondary text-sm">
            Renseigne <code>CLOUDINARY_CLOUD_NAME</code>, <code>CLOUDINARY_API_KEY</code> et{' '}
            <code>CLOUDINARY_API_SECRET</code>. Les liens YouTube restent utilisables.
          </p>
        </div>
      )}

      {/* Boutons d'ajout */}
      <div className="flex flex-wrap gap-3">
        <input
          ref={captureInput}
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files, 'image');
            e.target.value = '';
          }}
        />
        <input
          ref={logoInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            handleFiles(e.target.files, 'logo');
            e.target.value = '';
          }}
        />
        <button
          type="button"
          disabled={!cloudinaryEnabled}
          onClick={() => captureInput.current?.click()}
          className="px-4 py-2 bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary rounded-lg border border-accent-primary/40 text-sm font-medium disabled:opacity-40"
        >
          + Captures d&apos;écran / vidéos
        </button>
        <button
          type="button"
          disabled={!cloudinaryEnabled}
          onClick={() => logoInput.current?.click()}
          className="px-4 py-2 bg-bg-tertiary hover:bg-bg-secondary text-text-secondary rounded-lg border border-border text-sm disabled:opacity-40"
        >
          + Logo du site
        </button>
      </div>

      {/* Uploads en cours */}
      {uploads.length > 0 && (
        <ul className="space-y-1 text-sm">
          {uploads.map((u) => (
            <li
              key={u.name}
              className={u.status === 'error' ? 'text-red-400' : 'text-text-secondary'}
            >
              {u.status === 'uploading' ? '⏳' : '⚠'} {u.name}
              {u.error && ` — ${u.error}`}
            </li>
          ))}
        </ul>
      )}

      {/* Ajout YouTube */}
      <div className="bg-bg-secondary border border-border rounded-lg p-4">
        <p className="text-text-primary text-sm font-medium mb-3">Ajouter une vidéo YouTube</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 bg-bg-tertiary border border-border rounded px-3 py-2 text-sm text-text-primary placeholder:text-text-muted"
          />
          <input
            type="text"
            value={youtubeLabel}
            onChange={(e) => setYoutubeLabel(e.target.value)}
            placeholder="Ce que montre la vidéo (optionnel)"
            className="flex-1 bg-bg-tertiary border border-border rounded px-3 py-2 text-sm text-text-primary placeholder:text-text-muted"
          />
          <button
            type="button"
            onClick={addYouTube}
            disabled={isPending || !youtubeUrl}
            className="px-4 py-2 bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary rounded border border-accent-primary/40 text-sm disabled:opacity-40"
          >
            Ajouter
          </button>
        </div>
        {ytError && <p className="text-red-400 text-sm mt-2">{ytError}</p>}
      </div>

      {/* Liste des médias */}
      {assets.length === 0 ? (
        <p className="text-text-muted text-sm italic">
          Aucun média pour l&apos;instant. Ajoute les captures d&apos;écran du site : page
          d&apos;accueil, inscription, recherche, messagerie, tarifs…
        </p>
      ) : (
        <ul className="space-y-3">
          {assets.map((asset, i) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              briefSlug={briefSlug}
              index={i}
              total={assets.length}
              onMove={move}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================
// CARTE D'UN MÉDIA
// ============================================

function AssetCard({
  asset,
  briefSlug,
  index,
  total,
  onMove,
}: {
  asset: BriefAsset;
  briefSlug: string;
  index: number;
  total: number;
  onMove: (index: number, delta: number) => void;
}) {
  const router = useRouter();
  const [label, setLabel] = useState(asset.label || '');
  const [instruction, setInstruction] = useState(asset.instruction || '');
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function saveNotes() {
    if (label === (asset.label || '') && instruction === (asset.instruction || '')) return;
    startTransition(async () => {
      const res = await updateAssetNotesAction(asset.id, briefSlug, label, instruction);
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }
    });
  }

  function remove() {
    if (!window.confirm('Supprimer ce média ? Il sera aussi effacé de Cloudinary.')) return;
    startTransition(async () => {
      await deleteAssetAction(asset.id, briefSlug);
      router.refresh();
    });
  }

  return (
    <li className="bg-bg-secondary border border-border rounded-lg p-3 flex flex-col sm:flex-row gap-4">
      {/* Aperçu */}
      <div className="shrink-0 w-full sm:w-40">
        <AssetPreview asset={asset} />
        <p className="text-text-muted text-[11px] mt-1 truncate">
          {ASSET_KIND_LABELS[asset.kind]}
          {asset.width && asset.height ? ` · ${asset.width}×${asset.height}` : ''}
        </p>
      </div>

      {/* Annotations */}
      <div className="flex-1 min-w-0 space-y-2">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={saveNotes}
          placeholder="Ce que ça montre — laisse vide, je le déduis de l'image"
          className="w-full bg-bg-tertiary border border-border rounded px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted"
        />
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          onBlur={saveNotes}
          placeholder="Où le placer (ex : « section tarifs ») — optionnel"
          className="w-full bg-bg-tertiary border border-border rounded px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted"
        />
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            disabled={index === 0 || isPending}
            onClick={() => onMove(index, -1)}
            className="px-2 py-1 bg-bg-tertiary border border-border rounded text-text-secondary disabled:opacity-30"
            aria-label="Monter"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={index === total - 1 || isPending}
            onClick={() => onMove(index, 1)}
            className="px-2 py-1 bg-bg-tertiary border border-border rounded text-text-secondary disabled:opacity-30"
            aria-label="Descendre"
          >
            ↓
          </button>
          <a
            href={asset.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary hover:underline ml-1"
          >
            ouvrir
          </a>
          <button
            type="button"
            onClick={remove}
            disabled={isPending}
            className="ml-auto text-text-muted hover:text-red-400 disabled:opacity-40"
          >
            Supprimer
          </button>
          {saved && <span className="text-green-400">✓</span>}
        </div>
      </div>
    </li>
  );
}

function AssetPreview({ asset }: { asset: BriefAsset }) {
  const boxClass = 'w-full aspect-video object-cover rounded border border-border bg-bg-tertiary';

  if (asset.kind === 'youtube') {
    const id = parseYouTubeId(asset.url);
    return id ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={youTubeThumbnail(id)} alt="Miniature YouTube" className={boxClass} loading="lazy" />
    ) : (
      <div className={`${boxClass} flex items-center justify-center text-text-muted text-xs`}>
        YouTube
      </div>
    );
  }

  if (asset.kind === 'video') {
    return <video src={asset.url} className={boxClass} muted playsInline preload="metadata" />;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={cloudinaryImage(asset.url, 320)}
      alt={asset.label || 'Capture'}
      className={boxClass}
      loading="lazy"
    />
  );
}
