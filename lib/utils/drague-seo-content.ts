/**
 * Génération de contenu SEO pour les pages "Lieux de drague"
 * Randomisation déterministe via hash du slug pour des variantes stables
 */

import type { FAQItem } from '../types';

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: string, offset = 0): T {
  return arr[(hashCode(seed) + offset) % arr.length];
}

/**
 * Renvoie l'année courante (s'actualise chaque année)
 */
export function currentYear(): number {
  return new Date().getFullYear();
}

// ============================================
// TEMPLATES INTRO REGION (6 variantes)
// ============================================
const REGION_INTROS = [
  (region: string, count: number, year: number) =>
    `Découvrez les ${count} lieux de drague recensés en ${region} en ${year}. Cette région compte de nombreux spots répartis entre parcs urbains, bois, plages et aires de repos. Notre annuaire référence chaque endroit avec son ambiance, ses meilleurs moments et ses conseils d'accès.`,
  (region: string, count: number, year: number) =>
    `${region} regroupe ${count} lieux de drague identifiés à travers ses départements en ${year}. Que vous cherchiez un spot discret en pleine nature, un parc en centre-ville ou une aire de repos sur autoroute, nous avons cartographié les lieux les plus connus de la région.`,
  (region: string, count: number, year: number) =>
    `Annuaire complet et mis à jour en ${year} des ${count} lieux de drague en ${region}. Pour chaque spot vous retrouverez le type d'orientation, l'affluence habituelle, les horaires les plus actifs ainsi que les conseils de discrétion et de sécurité.`,
  (region: string, count: number, year: number) =>
    `La région ${region} recense ${count} lieux de drague en ${year}. Du littoral aux espaces forestiers en passant par les zones urbaines, chaque département présente des spots variés correspondant à différents publics et moments de la journée.`,
  (region: string, count: number, year: number) =>
    `Retrouvez en ${year} les ${count} lieux de drague de ${region} classés par département. Notre carte interactive et nos fiches détaillées vous donnent toutes les informations utiles : accès, fréquentation, profil dominant et précautions à prendre.`,
  (region: string, count: number, year: number) =>
    `${count} spots de drague sont actuellement référencés en ${region} pour ${year}. Cette page régionale rassemble l'ensemble des lieux connus, qu'ils soient fréquentés en journée, le soir ou pendant la belle saison, avec leurs spécificités locales.`,
];

// ============================================
// TEMPLATES INTRO DEPARTEMENT (6 variantes)
// ============================================
const DEPT_INTROS = [
  (dept: string, code: string, count: number, region: string, year: number) =>
    `Le département ${dept} (${code}), situé en ${region}, compte ${count} lieux de drague identifiés en ${year}. Parcs publics, bois en périphérie, aires de repos sur axes routiers : chaque spot est documenté avec son type, son affluence et ses meilleurs créneaux.`,
  (dept: string, code: string, count: number, region: string, year: number) =>
    `Annuaire ${year} des ${count} lieux de drague en ${dept} (${code}). Notre base recense les endroits connus du département avec leur localisation précise, leur ambiance habituelle et les conseils d'accès depuis les principales villes.`,
  (dept: string, code: string, count: number, region: string, year: number) =>
    `${dept} (${code}) en région ${region} regroupe ${count} spots de drague recensés pour ${year}. Que vous soyez de passage ou résident, retrouvez ici l'ensemble des lieux fréquentés avec les détails utiles : profil, discrétion, légalité, horaires.`,
  (dept: string, code: string, count: number, region: string, year: number) =>
    `En ${year}, ${count} lieux de drague sont référencés dans le département ${code} (${dept}). Chaque fiche présente le type de spot (bois, parc, plage, parking…), son orientation dominante, son niveau d'affluence et les précautions de sécurité.`,
  (dept: string, code: string, count: number, region: string, year: number) =>
    `Le ${code} – ${dept} est un département de ${region} qui compte ${count} lieux de drague identifiés cette année. Les spots se répartissent entre zones urbaines, espaces naturels et infrastructures de transit, avec des publics et des ambiances variées.`,
  (dept: string, code: string, count: number, region: string, year: number) =>
    `Mise à jour ${year} : retrouvez les ${count} lieux de drague du département ${dept} (${code}). Triez-les par ville, par type ou par orientation pour trouver le spot qui correspond à vos attentes en toute discrétion.`,
];

// ============================================
// TEMPLATES INTRO VILLE (6 variantes)
// ============================================
const VILLE_INTROS = [
  (ville: string, cp: string, count: number, dept: string, year: number) =>
    `${ville} (${cp}) compte ${count === 1 ? 'un lieu de drague identifié' : `${count} lieux de drague identifiés`} en ${year}. Cette page rassemble l'ensemble des spots connus de la ville avec leurs caractéristiques : type d'environnement, profil fréquenté, affluence, accès et conseils pratiques.`,
  (ville: string, cp: string, count: number, dept: string, year: number) =>
    `Annuaire ${year} des lieux de drague à ${ville} (${cp}) – ${dept}. Découvrez ${count === 1 ? 'le spot recensé' : `les ${count} spots recensés`} dans la commune avec, pour chacun, les informations essentielles : ambiance, meilleurs moments, accès et précautions.`,
  (ville: string, cp: string, count: number, dept: string, year: number) =>
    `${count === 1 ? 'Un seul lieu de drague est' : `${count} lieux de drague sont`} actuellement référencé${count === 1 ? '' : 's'} à ${ville} (${cp}) pour ${year}. Que vous soyez de passage ou habitué de la ville, retrouvez ici toutes les informations utiles pour rejoindre ces spots discrètement.`,
  (ville: string, cp: string, count: number, dept: string, year: number) =>
    `Liste complète et à jour en ${year} des lieux de drague à ${ville} (${cp}). Chaque fiche détaille le type d'environnement, le public dominant, l'affluence habituelle et les modes d'accès depuis le centre-ville.`,
  (ville: string, cp: string, count: number, dept: string, year: number) =>
    `${ville} dans le ${dept} compte ${count} lieu${count > 1 ? 'x' : ''} de drague identifié${count > 1 ? 's' : ''} cette année. Notre base intègre les principaux spots locaux avec leurs spécificités, leurs horaires les plus actifs et les conseils de discrétion adaptés.`,
  (ville: string, cp: string, count: number, dept: string, year: number) =>
    `Découvrez en ${year} ${count === 1 ? 'le lieu de drague de' : `les ${count} lieux de drague de`} ${ville} (${cp}). Carte, accès, public, fréquentation et tips de sécurité : tout ce qu'il faut savoir pour fréquenter ces spots en toute connaissance de cause.`,
];

// ============================================
// FAQ GENERIQUES (rotées par hash)
// ============================================
const COMMON_QA: ((loc: string) => FAQItem)[] = [
  (loc) => ({
    question: `La drague dans un lieu public à ${loc} est-elle légale ?`,
    answer: `Oui, le simple fait de draguer dans un lieu public est légal en France. En revanche, les actes sexuels en public ou exhibitionnistes sont passibles de sanctions pénales (article 222-32 du Code pénal). Il est essentiel de respecter la pudeur d'autrui et la discrétion.`,
  }),
  (loc) => ({
    question: `Quels sont les meilleurs moments pour fréquenter les lieux de drague à ${loc} ?`,
    answer: `Cela dépend du spot. Les parcs urbains sont surtout actifs en fin de journée et le soir. Les bois et plages sont plus fréquentés du printemps à l'automne, en après-midi. Les aires de repos restent actives une grande partie de la journée. Consultez la fiche de chaque lieu pour les horaires précis.`,
  }),
  (loc) => ({
    question: `Comment être discret dans un lieu de drague à ${loc} ?`,
    answer: `Garez votre véhicule à distance, évitez les comportements ostentatoires, ne stationnez pas trop longtemps au même endroit, et gardez vos affaires de valeur en sécurité. La discrétion est la règle de base dans ces lieux.`,
  }),
  (loc) => ({
    question: `Que faire en cas de problème (vol, agression) dans un lieu de drague ?`,
    answer: `Quittez immédiatement le lieu, mettez-vous en sécurité et contactez les forces de l'ordre (17 ou 112). Vous pouvez porter plainte en commissariat ou en gendarmerie : la fréquentation d'un lieu de drague ne vous prive d'aucun droit.`,
  }),
  (loc) => ({
    question: `Les lieux de drague à ${loc} sont-ils surveillés par la police ?`,
    answer: `La présence policière varie selon les spots. Certains lieux connus font l'objet de passages ponctuels, d'autres sont peu surveillés. Consultez la fiche détaillée de chaque spot pour connaître la situation locale habituelle.`,
  }),
  (loc) => ({
    question: `Faut-il payer ou s'inscrire pour accéder à un lieu de drague à ${loc} ?`,
    answer: `Non, les lieux de drague référencés ici sont des espaces publics gratuits et accessibles librement. Aucune inscription, aucun paiement et aucune réservation ne sont nécessaires.`,
  }),
  (loc) => ({
    question: `Quelle est l'orientation des lieux de drague à ${loc} ?`,
    answer: `Cela varie selon les spots : certains sont à dominante gay, d'autres hétéro, libertine, naturiste ou mixte. Chaque fiche précise l'orientation principale du lieu pour vous orienter.`,
  }),
  (loc) => ({
    question: `Comment se rendre à un lieu de drague à ${loc} ?`,
    answer: `Chaque fiche indique les modes d'accès disponibles : transports en commun, voiture (avec emplacement de stationnement), accès à pied et distance depuis le centre-ville. Un lien Google Maps permet de localiser précisément le spot.`,
  }),
  (loc) => ({
    question: `Les informations sur les lieux de drague de ${loc} sont-elles vérifiées ?`,
    answer: `Notre base s'appuie sur des données publiques et des sources communautaires. Chaque fiche indique un niveau de confiance. Les lieux et fréquentations peuvent évoluer dans le temps : nous vous recommandons de croiser les informations.`,
  }),
];

// ============================================
// FONCTIONS PUBLIQUES
// ============================================

export function generateDragueRegionIntro(regionName: string, count: number, slug: string): string {
  const tpl = pick(REGION_INTROS, slug);
  return tpl(regionName, count, currentYear());
}

export function generateDragueDeptIntro(deptName: string, code: string, count: number, region: string, slug: string): string {
  const tpl = pick(DEPT_INTROS, slug);
  return tpl(deptName, code, count, region, currentYear());
}

export function generateDragueVilleIntro(villeName: string, cp: string, count: number, dept: string, slug: string): string {
  const tpl = pick(VILLE_INTROS, slug);
  return tpl(villeName, cp, count, dept, currentYear());
}

export function generateDragueFAQ(location: string, slug: string, count = 6): FAQItem[] {
  const baseHash = hashCode(slug);
  const ordered: FAQItem[] = [];
  const used = new Set<number>();
  for (let i = 0; ordered.length < count && i < COMMON_QA.length * 2; i++) {
    const idx = (baseHash + i) % COMMON_QA.length;
    if (!used.has(idx)) {
      used.add(idx);
      ordered.push(COMMON_QA[idx](location));
    }
  }
  return ordered;
}

// ============================================
// META TITRES & DESCRIPTIONS
// ============================================
// Titres : pas de suffixe | FG People (le layout l'ajoute via template)
export function dragueRegionTitle(regionName: string, count: number): string {
  return `Lieux de drague en ${regionName} : ${count} spots en ${currentYear()}`;
}

export function dragueDeptTitle(deptName: string, code: string, count: number): string {
  return `Lieux de drague en ${deptName} (${code}) : ${count} spots en ${currentYear()}`;
}

export function dragueVilleTitle(villeName: string, cp: string, count: number): string {
  const cpPart = cp ? ` (${cp})` : '';
  return `Lieux de drague à ${villeName}${cpPart} : ${count} spot${count > 1 ? 's' : ''} en ${currentYear()}`;
}

export function dragueHubTitle(count: number): string {
  return `Lieux de drague en France : ${count} spots recensés en ${currentYear()}`;
}

export function dragueRegionMeta(regionName: string, count: number, deptCount: number): string {
  return `Découvrez ${count} lieux de drague en ${regionName} répartis sur ${deptCount} départements. Annuaire ${currentYear()} : type, accès, fréquentation, conseils.`.slice(0, 158);
}

export function dragueDeptMeta(deptName: string, code: string, count: number, villeCount: number): string {
  return `${count} lieux de drague en ${deptName} (${code}) – ${villeCount} villes couvertes. Annuaire ${currentYear()} : ambiance, accès, public, sécurité.`.slice(0, 158);
}

export function dragueVilleMeta(villeName: string, count: number, deptName: string): string {
  return `${count} lieu${count > 1 ? 'x' : ''} de drague à ${villeName} (${deptName}). Annuaire ${currentYear()} : type, accès, public, fréquentation, conseils discrétion.`.slice(0, 158);
}

export function dragueHubMeta(count: number, regionCount: number): string {
  return `Annuaire ${currentYear()} de ${count} lieux de drague en France répartis sur ${regionCount} régions. Type, accès, fréquentation et conseils pour chaque spot.`.slice(0, 158);
}

// ============================================
// DISCLAIMER LEGAL (variantes)
// ============================================
const DISCLAIMERS = [
  `⚠️ Information à caractère documentaire. La drague dans les espaces publics est légale, mais les actes sexuels publics et l'exhibitionnisme sont passibles de poursuites pénales (art. 222-32 Code pénal). Respectez la pudeur d'autrui et la discrétion.`,
  `⚠️ Cet annuaire est informatif. Si la drague est légale dans l'espace public, les comportements sexuels visibles depuis un lieu accessible au public constituent un délit. Restez discret et respectez les autres usagers du lieu.`,
  `⚠️ Annuaire à but documentaire. Les lieux référencés sont des espaces publics. Les actes à caractère sexuel publics restent interdits par la loi française. Pensez discrétion, respect et sécurité avant tout.`,
  `⚠️ Information uniquement. Les lieux listés sont publics. La drague y est légale ; les actes sexuels en public ou l'exhibitionnisme sont des délits. Soyez discret, respectueux et prudent.`,
];

export function getDragueDisclaimer(slug: string): string {
  return pick(DISCLAIMERS, slug);
}

// Tips de sécurité génériques (en plus des tips spécifiques au lieu)
const SAFETY_TIPS_GENERIC = [
  'Préférez les heures de jour si vous ne connaissez pas le lieu.',
  'Évitez de stationner trop longtemps ou de manière trop visible.',
  "Ne laissez pas d'objets de valeur visibles dans votre véhicule.",
  'Gardez votre téléphone chargé et accessible.',
  'Faites confiance à votre instinct : quittez le lieu si vous vous sentez mal à l\'aise.',
  'Évitez de dévoiler votre identité ou votre adresse à des inconnus.',
];

export function getSafetyTips(slug: string, count = 3): string[] {
  const h = hashCode(slug);
  const out: string[] = [];
  const used = new Set<number>();
  for (let i = 0; out.length < count && i < SAFETY_TIPS_GENERIC.length; i++) {
    const idx = (h + i) % SAFETY_TIPS_GENERIC.length;
    if (!used.has(idx)) {
      used.add(idx);
      out.push(SAFETY_TIPS_GENERIC[idx]);
    }
  }
  return out;
}
