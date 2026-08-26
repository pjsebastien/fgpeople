'use client';

/**
 * Lecteur YouTube en « façade ».
 *
 * Tant que le visiteur n'a pas cliqué, on n'affiche qu'une miniature : aucun
 * script YouTube n'est chargé, aucun cookie n'est déposé. L'iframe (domaine
 * nocookie) n'apparaît qu'au clic. Gain : ~1 Mo de JS tiers en moins au
 * chargement, et pas de consentement à demander pour une vidéo non lue.
 */

import { useState } from 'react';
import { youTubeEmbedUrl, youTubeThumbnail } from '@/lib/utils/cloudinary';

export default function YouTubeEmbed({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-bg-tertiary">
      {playing ? (
        <iframe
          src={youTubeEmbedUrl(videoId)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 w-full h-full"
          aria-label={`Lire la vidéo : ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={youTubeThumbnail(videoId)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <span className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-red-600 group-hover:scale-110 transition-transform shadow-xl">
              <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
          <span className="absolute bottom-0 left-0 right-0 p-4 text-left bg-gradient-to-t from-black/80 to-transparent">
            <span className="text-white font-semibold text-sm line-clamp-2">{title}</span>
          </span>
        </button>
      )}
    </div>
  );
}
