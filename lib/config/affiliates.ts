/**
 * Configuration centrale des liens d'affiliation.
 *
 * Les URLs étaient auparavant copiées dans FloatingCTA, DelayedPopup,
 * LibertinCTA, GayCTA et les fiches d'avis : changer de partenaire imposait
 * six éditions et un oubli passait inaperçu. Tout passe désormais par ici.
 *
 * Aucun secret : ces liens sont publics par nature, le fichier est importable
 * côté client comme côté serveur.
 */

export type AffiliateTarget = 'gleese' | 'related-gay';

export interface AffiliatePartner {
  /** Identifiant stocké dans les statistiques de clics. */
  target: AffiliateTarget;
  label: string;
  url: string;
}

/**
 * Trafic libertin : clubs, saunas, spas, pages généralistes, blog.
 * Gleese depuis août 2026.
 *
 * ⚠ Les pages d'avis sur un site (data/site_reviews/) font exception : elles
 * pointent vers le lien d'affiliation DU SITE TESTÉ. Envoyer un lecteur venu
 * pour Wyylde vers une autre plateforme le ferait rebondir immédiatement.
 */
export const LIBERTIN_AFFILIATE: AffiliatePartner = {
  target: 'gleese',
  label: 'Gleese',
  url: 'https://gleese.com/?ae=120',
};

/**
 * Trafic gay / bi des pages /lieu-de-drague/*.
 * Conservé sur related-dating : Gleese ne couvre pas ce segment.
 */
export const GAY_AFFILIATE: AffiliatePartner = {
  target: 'related-gay',
  label: 'Related Dating (gay)',
  url: 'https://k.related-dating.com/?abc=b9653873036f3fd1&xa=n&acme=wid.94576&media=seo&tpls=4&v=sexy',
};

/** Choisit le partenaire selon la section du site. */
export function affiliateForPath(pathname: string | null): AffiliatePartner {
  return pathname?.startsWith('/lieu-de-drague') ? GAY_AFFILIATE : LIBERTIN_AFFILIATE;
}

/**
 * Arguments de vente Gleese — vérifiés le 14/08/2026 sur gleese.com.
 *
 * « Pas besoin de CB » et « toutes les fonctions premium sans aucune
 * restriction » sont repris mot pour mot de leur page d'accueil.
 *
 * ⚠ NE PAS annoncer de durée d'essai : gleese.com parle d'« une période 100%
 * gratuite » sans la chiffrer, et les sites d'avis se contredisent (1 mois
 * pour les uns, 3 mois pour les autres). Promettre « 1 mois » sur l'ensemble
 * du site nous exposerait si l'offre change ou varie selon les campagnes.
 * « Sans carte bancaire » suffit à lever l'objection principale.
 */
export const GLEESE_PITCH = {
  noCard: 'Sans carte bancaire',
  freeTrial: 'Essai gratuit, sans carte bancaire',
  premium: 'Toutes les fonctions premium débloquées',
  price: 'Puis à partir de 3,75 €/mois',
} as const;

/**
 * Créas fournies par Gleese (public/images/gleese/).
 * Les noms de fichiers sont ceux de l'annonceur : on les mappe ici plutôt que
 * de les renommer, pour pouvoir les remplacer à l'identique lors d'une mise à
 * jour de leur kit.
 *
 * ⚠ Les carrés font 3375 px pour ~1 Mo : ils DOIVENT passer par next/image,
 * jamais par une balise <img> brute.
 */
export const GLEESE_ASSETS = {
  /** Logo blanc — le seul lisible sur notre fond sombre. */
  logo: { src: '/images/gleese/6a3a3c492d893222eb34f281.png', width: 3570, height: 870 },
  /** Logo sombre — réservé à un éventuel fond clair. */
  logoDark: { src: '/images/gleese/6a3a3c3d922a983ca84972f2.png', width: 3570, height: 870 },
  /** Carré « Vous êtes ouvert ? Notre site aussi ! » — parle aux couples. */
  squareOpen: { src: '/images/gleese/6a3a3c27922a983ca84972ec.png', width: 3375, height: 3375 },
  /** Carré « Fais des rencontres très pimentées ! » */
  squareSpicy: { src: '/images/gleese/6a3a3c60a21684377f14052e.png', width: 3375, height: 3375 },
  /** Vertical 9:16 — format natif de la popup mobile. */
  story: { src: '/images/gleese/6a3a3d5aa6b602940310f4ce.jpeg', width: 720, height: 1280 },
} as const;

/** Libellés lisibles pour le tableau de bord admin. */
export const AFFILIATE_LABELS: Record<string, string> = {
  gleese: 'Gleese',
  'related-gay': 'Related Dating (gay)',
};
