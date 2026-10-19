/**
 * « Comment s'y rendre » : carte OpenStreetMap du lieu (thème sombre obtenu
 * par filtre CSS) et liens d'itinéraire vers les applications courantes.
 * L'iframe est chargée paresseusement : elle ne pèse rien tant que le
 * visiteur n'a pas fait défiler la page jusqu'à elle.
 */

import type { Club } from '@/lib/types';
import type { ClubGeo } from '@/lib/data/club-geo';
import Icon from './Icon';

export default function LocationMap({ club, geo, closed }: { club: Club; geo: ClubGeo; closed: boolean }) {
  const dLon = 0.006;
  const dLat = 0.0035;
  const bbox = [geo.lon - dLon, geo.lat - dLat, geo.lon + dLon, geo.lat + dLat].map((n) => n.toFixed(6)).join(',');
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${geo.lat},${geo.lon}`;
  const ll = `${geo.lat},${geo.lon}`;

  const links = [
    { label: 'Google Maps', href: `https://www.google.com/maps/dir/?api=1&destination=${ll}`, primary: true },
    { label: 'Waze', href: `https://waze.com/ul?ll=${ll}&navigate=yes` },
    { label: 'Plans (iPhone)', href: `https://maps.apple.com/?daddr=${ll}` },
  ];

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-border bg-bg-secondary">
      <div className="relative aspect-[16/10] sm:aspect-[16/7] bg-bg-tertiary">
        <iframe
          src={embed}
          title={`Plan d'accès : ${club.nom}, ${club.ville}`}
          loading="lazy"
          className="absolute inset-0 w-full h-full border-0 [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.6)_brightness(0.95)]"
        />
      </div>
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Icon name="map" className="w-5 h-5 mt-0.5 text-accent-primary flex-shrink-0" />
          <div>
            <p className="font-semibold text-text-primary">{club.adresse}</p>
            <p className="text-sm text-text-secondary">{club.code_postal} {club.ville}</p>
            {geo.precision === 'street' && (
              <p className="mt-1 text-xs text-text-muted">Repère placé sur la rue : le numéro n&apos;a pas pu être localisé précisément.</p>
            )}
          </div>
        </div>
        {!closed && (
          <div className="flex flex-wrap gap-2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-semibold ${l.primary ? 'bg-accent-primary text-black hover:bg-accent-hover hover:text-black' : 'bg-white/5 ring-1 ring-inset ring-white/10 text-text-primary hover:bg-white/10'}`}
              >
                {l.primary && <Icon name="route" className="w-4 h-4" />}
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
