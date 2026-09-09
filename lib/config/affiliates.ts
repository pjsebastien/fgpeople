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

export type AffiliateTarget = 'gleese' | 'carre-libertin' | 'related-gay';

export interface PartnerLogo {
  src: string;
  width: number;
  height: number;
  /** 'wordmark' se pose seul, 'icon' s'accompagne du nom écrit à côté. */
  kind: 'wordmark' | 'icon';
}

export interface PartnerBenefit {
  label: string;
  hint: string;
}

export interface AffiliatePartner {
  /** Identifiant stocké dans les statistiques de clics. */
  target: AffiliateTarget;
  /** Nom affiché aux visiteurs. */
  label: string;
  url: string;

  logo?: PartnerLogo;
  /** Pastille d'accroche (« NOUVEAU », « DEPUIS 2007 »). */
  badge?: string;
  badgeHint?: string;
  /** Argument principal, très court, affiché en pastille verte. */
  hook: string;
  /** Une phrase de présentation, insérée dans le corps du bloc. */
  pitch: string;
  benefits: PartnerBenefit[];
  /** Libellé du bouton. */
  ctaLabel: string;
  /** Petite ligne sous le bouton. */
  priceNote: string;
  /** Slug de notre avis, si nous en avons publié un. */
  reviewSlug?: string;
}

// ============================================
// PARTENAIRES DU TRAFIC LIBERTIN
// ============================================

/**
 * Gleese. Arguments vérifiés le 14/08/2026 sur gleese.com et sur leurs créas.
 *
 * ⚠ NE PAS annoncer de durée d'essai : gleese.com parle d'« une période 100 %
 * gratuite » sans la chiffrer, et les sites d'avis se contredisent (1 mois
 * pour les uns, 3 mois pour les autres). « Sans carte bancaire » suffit à
 * lever l'objection principale, et c'est vérifiable.
 */
export const GLEESE_AFFILIATE: AffiliatePartner = {
  target: 'gleese',
  label: 'Gleese',
  url: 'https://gleese.com/?ae=120',
  logo: {
    src: '/images/gleese/6a3a3c492d893222eb34f281.png',
    width: 3570,
    height: 870,
    kind: 'wordmark',
  },
  badge: 'NOUVEAU',
  badgeHint: 'lancé fin 2024',
  hook: 'Sans carte bancaire',
  pitch:
    "le réseau libertin français nouvelle génération, où vous testez tout gratuitement sans sortir votre carte",
  benefits: [
    { label: 'Sans carte bancaire', hint: 'aucun paiement à l’inscription' },
    { label: 'Profils vérifiés', hint: 'numéro de téléphone obligatoire' },
    { label: 'Modération humaine', hint: 'photos contrôlées une à une' },
    { label: 'Site français', hint: 'données hébergées en France, RGPD' },
  ],
  ctaLabel: 'Créer mon profil gratuitement',
  priceNote: 'Puis à partir de 3,75 €/mois, sans engagement',
  reviewSlug: 'avis-gleese',
};

/**
 * Carré Libertin. Arguments recoupés le 26/08/2026 sur plusieurs tests
 * indépendants (kinkyee, beeutiful, madintouch, datingwiiz, proud-and-gay) :
 * ouvert en 2007, plus de 500 000 inscrits, environ 20 000 membres actifs par
 * semaine, et surtout accès complet gratuit pour les femmes et les couples.
 *
 * ⚠ NE PAS chiffrer l'abonnement homme : les sources se contredisent
 * (19,90 € le mois isolé chez les uns, « moins de 7 €/mois » en engagement
 * chez les autres). On s'en tient au gratuit femmes et couples, qui est
 * confirmé par deux sources et bien plus fort pour notre audience.
 *
 * Les bannières Kwanko fournies par la régie ne sont volontairement pas
 * utilisées : script tiers sur chaque page, consentement RGPD à gérer, et
 * clics comptés chez eux donc invisibles dans /admin/clics. On garde leur
 * lien de tracking avec nos propres créas.
 */
export const CARRE_LIBERTIN_AFFILIATE: AffiliatePartner = {
  target: 'carre-libertin',
  label: 'Carré Libertin',
  url: 'https://action.metaffiliation.com/trk.php?mclic=P5135A5589F052111&redir=https%3A%2F%2Fwww.carrelibertin.com%2F',
  logo: {
    src: '/images/carre-libertin/logo.jpeg',
    width: 192,
    height: 192,
    kind: 'icon',
  },
  badge: 'DEPUIS 2007',
  badgeHint: '500 000 inscrits',
  hook: 'Gratuit pour les femmes et les couples',
  pitch:
    "l'un des plus anciens sites libertins français, avec une communauté installée depuis près de vingt ans",
  benefits: [
    { label: 'Gratuit femmes et couples', hint: 'accès complet, sans abonnement' },
    { label: 'Communauté installée', hint: 'plus de 500 000 inscrits depuis 2007' },
    { label: 'Annonces et chat', hint: 'dites vos envies, on vous répond' },
    { label: 'Lives et webcams', hint: 'échangez avant de vous déplacer' },
  ],
  ctaLabel: 'Rejoindre Carré Libertin',
  priceNote: 'Inscription gratuite. Accès complet offert aux femmes et aux couples',
};

/**
 * Trafic gay / bi des pages /lieu-de-drague/*.
 * Hors rotation : ni Gleese ni Carré Libertin ne couvrent ce segment.
 */
export const GAY_AFFILIATE: AffiliatePartner = {
  target: 'related-gay',
  label: 'Related Dating',
  url: 'https://k.related-dating.com/?abc=b9653873036f3fd1&xa=n&acme=wid.94576&media=seo&tpls=4&v=sexy',
  hook: 'Profils géolocalisés',
  pitch: 'des hommes près de chez vous, en toute discrétion',
  benefits: [
    { label: 'Profils géolocalisés', hint: 'à proximité immédiate' },
    { label: '100 % discret', hint: 'aucune trace visible' },
    { label: 'Inscription gratuite', hint: 'sans engagement' },
  ],
  ctaLabel: 'Voir les profils',
  priceNote: 'Inscription gratuite',
};

// ============================================
// ROTATION QUOTIDIENNE
// ============================================

/**
 * Les deux partenaires du trafic libertin alternent un jour sur deux.
 * L'ordre du tableau fixe la séquence.
 */
const LIBERTIN_ROTATION: AffiliatePartner[] = [CARRE_LIBERTIN_AFFILIATE, GLEESE_AFFILIATE];

/**
 * Heure de bascule, en heure de Paris. À 6 h plutôt qu'à minuit pour que le
 * changement se fasse quand le trafic est au plus bas, et non au milieu du
 * pic de fréquentation du soir.
 */
const SWITCH_HOUR = 6;

/**
 * Jour d'ancrage de la rotation : le 26/08/2026 sert Carré Libertin, premier
 * élément du tableau. Tout le reste en découle.
 */
const ROTATION_ANCHOR = Math.floor(Date.UTC(2026, 7, 26) / 86_400_000);

/**
 * Numéro de jour « métier », calculé en heure de Paris et décalé de
 * SWITCH_HOUR : avant 6 h du matin, on considère qu'on est encore la veille.
 *
 * Passer par Intl évite d'embarquer une bibliothèque de fuseaux : Vercel
 * tourne en UTC, un simple getDate() ferait basculer la rotation à 2 h du
 * matin en été.
 */
function libertinDayIndex(now: Date): number {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const hour = get('hour') % 24; // certains environnements renvoient 24 à minuit

  const dayStart = Date.UTC(get('year'), get('month') - 1, get('day'));
  const shifted = hour < SWITCH_HOUR ? dayStart - 86_400_000 : dayStart;
  return Math.floor(shifted / 86_400_000);
}

/**
 * Partenaire libertin du jour.
 *
 * Appelé au rendu serveur. Les pages concernées tournent en ISR (revalidate
 * 300 s), donc elles se régénèrent dans les cinq minutes qui suivent la
 * bascule : le HTML servi ne mentionne jamais qu'un seul partenaire, sans
 * clignotement ni écart entre le serveur et le navigateur.
 */
export function getLibertinPartner(now: Date = new Date()): AffiliatePartner {
  const offset = libertinDayIndex(now) - ROTATION_ANCHOR;
  const index = ((offset % LIBERTIN_ROTATION.length) + LIBERTIN_ROTATION.length) % LIBERTIN_ROTATION.length;
  return LIBERTIN_ROTATION[index];
}

/** Choisit le partenaire selon la section du site. */
export function affiliateForPath(pathname: string | null, now?: Date): AffiliatePartner {
  return pathname?.startsWith('/lieu-de-drague') ? GAY_AFFILIATE : getLibertinPartner(now);
}

// ============================================
// CRÉAS
// ============================================

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
  'carre-libertin': 'Carré Libertin',
  'related-gay': 'Related Dating (gay)',
};
