/**
 * Image d'avis.
 *
 * On n'utilise pas next/image ici : les captures sont hébergées sur Cloudinary
 * qui sert déjà le format optimal (f_auto) à la qualité optimale (q_auto) et
 * redimensionne à la volée. Un simple <img> avec le bon srcset évite de payer
 * une seconde optimisation côté Vercel pour un résultat identique.
 */

import { cloudinaryImage, cloudinarySrcSet, isCloudinaryUrl } from '@/lib/utils/cloudinary';
import type { ReviewMedia } from '@/lib/types/site-review';

interface CloudImageProps {
  media: ReviewMedia;
  className?: string;
  sizes?: string;
  /** true pour l'image d'en-tête (LCP) : chargement immédiat et prioritaire. */
  priority?: boolean;
}

export default function CloudImage({
  media,
  className = '',
  sizes = '(max-width: 768px) 100vw, 768px',
  priority = false,
}: CloudImageProps) {
  const isCloud = isCloudinaryUrl(media.src);
  const src = isCloud ? cloudinaryImage(media.src, 1080) : media.src;
  const srcSet = cloudinarySrcSet(media.src, media.width);

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={media.alt}
      width={media.width}
      height={media.height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      className={className}
    />
  );
}
