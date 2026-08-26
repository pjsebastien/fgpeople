/**
 * Signature des uploads Cloudinary — SERVEUR UNIQUEMENT.
 *
 * Principe : le navigateur envoie le fichier DIRECTEMENT à Cloudinary, sans
 * transiter par Vercel (les Server Actions plafonnent autour de 4,5 Mo, une
 * vidéo passerait rarement). Le serveur se contente de signer la requête, ce
 * qui évite d'avoir à créer un upload preset non signé exploitable par
 * n'importe qui.
 *
 * Variables d'environnement attendues :
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

import 'server-only';
import { createHash } from 'crypto';

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

export function isCloudinaryEnabled(): boolean {
  return getCloudinaryConfig() !== null;
}

/**
 * Signature Cloudinary : les paramètres (hors file / api_key / resource_type)
 * triés par ordre alphabétique, concaténés en query string, suivis du secret,
 * le tout haché en SHA-1.
 */
function sign(params: Record<string, string | number>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return createHash('sha1').update(toSign + apiSecret).digest('hex');
}

export interface UploadTicket {
  endpoint: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
}

/**
 * Prépare un « ticket » d'upload à usage unique pour le navigateur.
 * @param slug   slug du brief → sert de dossier de rangement
 * @param isVideo true pour router vers l'endpoint vidéo
 */
export function createUploadTicket(slug: string, isVideo: boolean): UploadTicket | null {
  const config = getCloudinaryConfig();
  if (!config) return null;

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `fgpeople/sites/${slug}`;
  const signature = sign({ folder, timestamp }, config.apiSecret);

  return {
    endpoint: `https://api.cloudinary.com/v1_1/${config.cloudName}/${isVideo ? 'video' : 'image'}/upload`,
    apiKey: config.apiKey,
    timestamp,
    signature,
    folder,
  };
}

/** Supprime définitivement un asset de Cloudinary. */
export async function destroyAsset(publicId: string, isVideo: boolean): Promise<boolean> {
  const config = getCloudinaryConfig();
  if (!config || !publicId) return false;

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = sign({ public_id: publicId, timestamp }, config.apiSecret);

  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: config.apiKey,
    signature,
  });

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudName}/${isVideo ? 'video' : 'image'}/destroy`,
      { method: 'POST', body }
    );
    const json = (await res.json()) as { result?: string };
    // 'not found' = déjà supprimé côté Cloudinary, on considère que c'est bon
    return json.result === 'ok' || json.result === 'not found';
  } catch (err) {
    console.error('[cloudinary] destroy failed', err);
    return false;
  }
}
