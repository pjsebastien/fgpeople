/**
 * Carte d'un lieu de drague (server component)
 * Utilise <details> natif pour être crawlable et SEO-friendly
 */

import Image from 'next/image';
import type { LieuDrague } from '@/lib/types/drague';

interface LieuDragueCardProps {
  lieu: LieuDrague;
  defaultOpen?: boolean;
}

const ORIENTATION_LABELS: Record<string, { label: string; color: string }> = {
  gay: { label: 'Gay', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  bi: { label: 'Bi', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  hetero: { label: 'Hétéro', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  libertin: { label: 'Libertin', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  mixte: { label: 'Mixte', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  naturiste: { label: 'Naturiste', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  trans: { label: 'Trans', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
};

const AFFLUENCE_COLORS: Record<string, string> = {
  faible: 'text-yellow-400',
  moderee: 'text-orange-400',
  forte: 'text-red-400',
  variable: 'text-text-muted',
};

const DISCRETION_LABELS: Record<string, string> = {
  'tres-discret': 'Très discret',
  discret: 'Discret',
  moyen: 'Discrétion moyenne',
  expose: 'Lieu exposé',
};

export default function LieuDragueCard({ lieu, defaultOpen = false }: LieuDragueCardProps) {
  return (
    <details
      open={defaultOpen}
      className="group bg-bg-secondary rounded-xl border border-border overflow-hidden hover:border-accent-primary/40 transition-colors"
    >
      <summary className="cursor-pointer list-none p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {/* Image */}
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-bg-tertiary">
            <Image
              src={lieu.imageSrc}
              alt={`${lieu.nom} – ${lieu.typeLabel} à ${lieu.localisation.ville}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, 112px"
            />
          </div>

          {/* Tête */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-text-primary truncate">
                  {lieu.nom}
                </h3>
                <p className="text-text-secondary text-sm">
                  {lieu.typeLabel} · {lieu.localisation.ville} ({lieu.localisation.departement_code})
                </p>
              </div>
              <svg
                className="w-5 h-5 text-text-muted transition-transform group-open:rotate-180 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Badges rapides */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {lieu.orientation.slice(0, 3).map((o) => {
                const cfg = ORIENTATION_LABELS[o] || { label: o, color: 'bg-bg-tertiary text-text-secondary border-border' };
                return (
                  <span key={o} className={`px-2 py-0.5 text-xs rounded-full border ${cfg.color}`}>
                    {cfg.label}
                  </span>
                );
              })}
              {lieu.frequentation.affluenceNiveau && (
                <span className={`text-xs ${AFFLUENCE_COLORS[lieu.frequentation.affluenceNiveau]}`}>
                  · Affluence {lieu.frequentation.affluence || lieu.frequentation.affluenceNiveau}
                </span>
              )}
              {lieu.discretionNiveau && (
                <span className="text-xs text-text-muted">
                  · {DISCRETION_LABELS[lieu.discretionNiveau] || lieu.discretion}
                </span>
              )}
            </div>
          </div>
        </div>
      </summary>

      {/* Contenu déplié */}
      <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-border space-y-4">
        {/* Description */}
        {lieu.description && (
          <p className="text-text-secondary text-sm leading-relaxed">{lieu.description}</p>
        )}

        {/* Localisation détaillée */}
        {lieu.localisation.adresse_ou_description && (
          <div>
            <h4 className="text-text-primary text-sm font-semibold mb-1 flex items-center gap-2">
              <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Localisation
            </h4>
            <p className="text-text-secondary text-sm">{lieu.localisation.adresse_ou_description}</p>
            {lieu.localisation.villeProche && (
              <p className="text-text-muted text-xs mt-1">Ville proche : {lieu.localisation.villeProche}</p>
            )}
          </div>
        )}

        {/* Fréquentation & moments */}
        <div className="grid sm:grid-cols-2 gap-4">
          {(lieu.frequentation.meilleurs_moments.length > 0 || lieu.frequentation.saisonnalite) && (
            <div>
              <h4 className="text-text-primary text-sm font-semibold mb-1">Quand y aller</h4>
              {lieu.frequentation.meilleurs_moments.length > 0 && (
                <p className="text-text-secondary text-sm">
                  Meilleurs moments : {lieu.frequentation.meilleurs_moments.join(', ')}
                </p>
              )}
              {lieu.frequentation.saisonnalite && (
                <p className="text-text-secondary text-sm">Saison : {lieu.frequentation.saisonnalite}</p>
              )}
            </div>
          )}
          {(lieu.public.tranche_age_approx || lieu.public.profil_dominant || lieu.public.activite) && (
            <div>
              <h4 className="text-text-primary text-sm font-semibold mb-1">Public</h4>
              {lieu.public.profil_dominant && (
                <p className="text-text-secondary text-sm">{lieu.public.profil_dominant}</p>
              )}
              {lieu.public.tranche_age_approx && (
                <p className="text-text-muted text-xs">Tranche d'âge : {lieu.public.tranche_age_approx}</p>
              )}
              {lieu.public.activite && (
                <p className="text-text-muted text-xs">Activité : {lieu.public.activite}</p>
              )}
            </div>
          )}
        </div>

        {/* Accès */}
        {(lieu.acces.transport_en_commun || lieu.acces.voiture || lieu.acces.a_pied || lieu.acces.depuis_centre_ville) && (
          <div>
            <h4 className="text-text-primary text-sm font-semibold mb-1">Accès</h4>
            <ul className="text-text-secondary text-sm space-y-1">
              {lieu.acces.transport_en_commun && (
                <li>🚌 <span className="text-text-muted">Transport :</span> {lieu.acces.transport_en_commun}</li>
              )}
              {lieu.acces.voiture && (
                <li>🚗 <span className="text-text-muted">Voiture :</span> {lieu.acces.voiture}</li>
              )}
              {lieu.acces.a_pied && (
                <li>🚶 <span className="text-text-muted">À pied :</span> {lieu.acces.a_pied}</li>
              )}
              {lieu.acces.depuis_centre_ville && (
                <li>📍 <span className="text-text-muted">Depuis le centre :</span> {lieu.acces.depuis_centre_ville}</li>
              )}
            </ul>
            {lieu.acces.coordonnees_approx && (
              <a
                href={lieu.acces.coordonnees_approx}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary text-sm rounded-lg border border-accent-primary/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Voir sur Google Maps
              </a>
            )}
          </div>
        )}

        {/* Équipements environnants */}
        {lieu.equipements_environnants.length > 0 && (
          <div>
            <h4 className="text-text-primary text-sm font-semibold mb-1">Environnement</h4>
            <div className="flex flex-wrap gap-1.5">
              {lieu.equipements_environnants.map((eq, i) => (
                <span key={i} className="px-2 py-0.5 bg-bg-tertiary text-text-secondary text-xs rounded">
                  {eq}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Légalité & sécurité */}
        {(lieu.legalite_risques.statut || lieu.legalite_risques.tips_securite.length > 0) && (
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
            <h4 className="text-yellow-400 text-sm font-semibold mb-1 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Légalité & sécurité
            </h4>
            {lieu.legalite_risques.statut && (
              <p className="text-text-secondary text-sm mb-2">{lieu.legalite_risques.statut}</p>
            )}
            {lieu.legalite_risques.presence_police && (
              <p className="text-text-muted text-xs mb-2">Présence police : {lieu.legalite_risques.presence_police}</p>
            )}
            {lieu.legalite_risques.tips_securite.length > 0 && (
              <ul className="text-text-secondary text-sm space-y-1 list-disc list-inside">
                {lieu.legalite_risques.tips_securite.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Notes contextuelles */}
        {lieu.notes_contextuelles && (
          <div>
            <h4 className="text-text-primary text-sm font-semibold mb-1">À savoir</h4>
            <p className="text-text-secondary text-sm italic">{lieu.notes_contextuelles}</p>
          </div>
        )}

        {/* Confiance des données */}
        {lieu.confiance_donnees && (
          <p className="text-text-muted text-xs">
            Niveau de fiabilité des informations : <span className="text-text-secondary">{lieu.confiance_donnees}</span>
          </p>
        )}
      </div>
    </details>
  );
}
