/**
 * Helpers Cloudinary sans secret — importable côté client comme côté serveur.
 *
 * Les captures d'écran des avis sont hébergées sur Cloudinary. On ne passe pas
 * par l'optimiseur d'images Next : Cloudinary sert déjà le bon format (f_auto)
 * et la bonne qualité (q_auto), et sait redimensionner à la volée. On construit
 * donc directement un srcset pointant sur ses transformations.
 */

const CLOUDINARY_HOST = 'res.cloudinary.com';

/** Largeurs générées dans le srcset des captures. */
const SRCSET_WIDTHS = [640, 828, 1080, 1440, 1920];

export function isCloudinaryUrl(url: string): boolean {
  return url.includes(CLOUDINARY_HOST);
}

/**
 * Insère une transformation dans une URL Cloudinary.
 * .../image/upload/v123/dossier/fichier.png
 *                 ^ ici
 * Si l'URL contient déjà un segment de transformation, on empile le nôtre
 * devant plutôt que de l'écraser.
 */
export function cloudinaryUrl(url: string, transform: string): string {
  if (!isCloudinaryUrl(url)) return url;
  const marker = '/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const head = url.slice(0, idx + marker.length);
  const tail = url.slice(idx + marker.length);
  return `${head}${transform}/${tail}`;
}

/** URL optimisée à une largeur donnée. */
export function cloudinaryImage(url: string, width: number): string {
  return cloudinaryUrl(url, `f_auto,q_auto,c_limit,w_${width}`);
}

/** srcset responsive, limité aux largeurs utiles (jamais au-delà de l'original). */
export function cloudinarySrcSet(url: string, maxWidth?: number): string | undefined {
  if (!isCloudinaryUrl(url)) return undefined;
  const widths = SRCSET_WIDTHS.filter(
    (w, i) => !maxWidth || w <= maxWidth || SRCSET_WIDTHS[i - 1] === undefined || SRCSET_WIDTHS[i - 1] < maxWidth
  );
  return widths.map((w) => `${cloudinaryImage(url, w)} ${w}w`).join(', ');
}

/** Image de poster extraite d'une vidéo Cloudinary (première frame). */
export function cloudinaryVideoPoster(url: string): string {
  if (!isCloudinaryUrl(url)) return url;
  return cloudinaryUrl(url, 'f_jpg,q_auto,so_0').replace(/\.(mp4|webm|mov)$/i, '.jpg');
}

// ============================================
// YOUTUBE
// ============================================

/**
 * Extrait l'ID d'une vidéo YouTube depuis n'importe quelle forme d'URL
 * (watch?v=, youtu.be/, /embed/, /shorts/) ou depuis un ID déjà nu.
 */
export function parseYouTubeId(input: string): string | null {
  const value = (input || '').trim();
  if (!value) return null;

  // Déjà un ID brut
  if (/^[\w-]{11}$/.test(value)) return value;

  const patterns = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /\/embed\/([\w-]{11})/,
    /\/shorts\/([\w-]{11})/,
    /\/live\/([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = value.match(re);
    if (m) return m[1];
  }
  return null;
}

export function youTubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

export function youTubeEmbedUrl(videoId: string): string {
  // youtube-nocookie : pas de cookie tant que la vidéo n'est pas lancée
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
}

export function youTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
