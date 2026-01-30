/**
 * ClubGallery - Server Component
 * Affiche une galerie d'images basée sur le type de club
 */

import type { ClubType } from '@/lib/types';

interface ClubGalleryProps {
  clubName: string;
  types: ClubType[];
  className?: string;
}

// Images Unsplash par type de club (images libres de droits)
const TYPE_IMAGES: Record<string, string[]> = {
  sauna: [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80', // Sauna bois
    'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=800&q=80', // Sauna steam
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', // Spa relax
  ],
  spa: [
    'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80', // Jacuzzi
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80', // Wellness
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', // Pool spa
  ],
  bar: [
    'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80', // Bar ambiance
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80', // Bar drinks
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80', // Bar lounge
  ],
  discotheque: [
    'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80', // Dancefloor
    'https://images.unsplash.com/photo-1571266028243-d220c6a8b0e9?w=800&q=80', // Club lights
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80', // DJ booth
  ],
  hebergement: [
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80', // Bedroom luxury
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80', // Hotel room
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80', // Suite
  ],
  restaurant: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', // Restaurant interior
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', // Fine dining
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80', // Romantic dinner
  ],
  sm: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // Dark room
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', // Red ambiance
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80', // Industrial
  ],
  default: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', // Ambiance sombre
    'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80', // Lounge
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80', // Bar elegant
  ],
};

// Fonction pour obtenir les images basées sur les types du club
function getImagesForClub(types: ClubType[]): string[] {
  const images: string[] = [];
  const usedImages = new Set<string>();

  // Parcourir les types et ajouter des images
  for (const type of types) {
    const typeImages = TYPE_IMAGES[type.slug] || [];
    for (const img of typeImages) {
      if (!usedImages.has(img) && images.length < 4) {
        images.push(img);
        usedImages.add(img);
      }
    }
  }

  // Compléter avec les images par défaut si nécessaire
  if (images.length < 3) {
    for (const img of TYPE_IMAGES.default) {
      if (!usedImages.has(img) && images.length < 4) {
        images.push(img);
        usedImages.add(img);
      }
    }
  }

  return images.slice(0, 4);
}

export default function ClubGallery({ clubName, types, className = '' }: ClubGalleryProps) {
  const images = getImagesForClub(types);

  if (images.length === 0) return null;

  return (
    <section className={`${className}`}>
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Ambiance de l&apos;établissement
      </h2>
      <p className="text-text-muted text-sm mb-4">
        Images d&apos;illustration - Photos non contractuelles
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative aspect-[4/3] rounded-lg overflow-hidden bg-bg-tertiary"
          >
            <img
              src={src}
              alt={`Ambiance ${clubName} - Image ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>
    </section>
  );
}
