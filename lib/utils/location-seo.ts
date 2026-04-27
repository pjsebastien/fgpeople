/**
 * Enrichissement SEO pour les pages ville/département
 * But : transformer les pages "thin" (1 club) en pages riches et indexables
 * Randomisation déterministe via hash du slug pour des variantes stables
 */

import type { FAQItem } from '@/lib/types';

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: string, offset = 0): T {
  return arr[(hashCode(seed) + offset) % arr.length];
}

export function currentYear(): number {
  return new Date().getFullYear();
}

// ============================================
// INTRO PARAGRAPHES (villes) - 6 variantes x 250+ mots
// ============================================
const VILLE_INTROS = [
  (v: string, d: string, r: string, n: number, y: number) =>
    `Bienvenue sur le guide complet des clubs libertins et établissements échangistes à ${v}, en ${d}. En ${y}, nous référençons ${n === 1 ? 'un établissement' : `${n} établissements`} à ${v}, sélectionné${n > 1 ? 's' : ''} pour leur qualité d'accueil, leur ambiance et la discrétion qu'ils offrent à leur clientèle. Que vous soyez un couple cherchant à explorer le libertinage à ${v}, un célibataire curieux ou un initié de passage en ${r}, notre annuaire vous donne toutes les informations utiles : adresse, horaires, équipements, tarifs et avis. ${v} s'inscrit dans la tradition libertine de la région ${r}, où les établissements mêlent respect, convivialité et liberté d'expression. Chaque fiche club détaille l'ambiance, les services (sauna, spa, bar, dancefloor), les soirées à thème et les conditions d'accès (couples, célibataires, dress code). Profitez de cette page pour planifier votre prochaine soirée libertine à ${v} en toute sérénité.`,

  (v: string, d: string, r: string, n: number, y: number) =>
    `${v} (${d}) fait partie des villes ${r === "Île-de-France" ? "franciliennes" : `de la région ${r}`} où le libertinage s'exprime dans des établissements discrets et accueillants. Notre guide ${y} vous présente ${n === 1 ? 'le club libertin' : `les ${n} clubs libertins`} identifié${n > 1 ? 's' : ''} à ${v}, avec pour chacun une description détaillée, les coordonnées vérifiées, les horaires d'ouverture et les tarifs pratiqués. Les établissements référencés proposent différents univers : saunas mixtes, clubs échangistes pour couples, bars libertins, espaces SM/fétish ou encore hôtels discrets. Que vous cherchiez à découvrir l'échangisme, à retrouver l'esprit des clubs privés ou à organiser une soirée coquine à ${v}, vous trouverez ici toutes les infos pour choisir votre destination. Le département ${d} comporte plusieurs autres villes libertines que vous pouvez explorer depuis cette page, pour enrichir vos découvertes dans toute la région.`,

  (v: string, d: string, r: string, n: number, y: number) =>
    `À ${v}, ville du département ${d} en ${r}, la scène libertine compte ${n === 1 ? 'un établissement recensé' : `${n} établissements recensés`} dans notre annuaire ${y}. Cette page regroupe toutes les informations utiles pour préparer votre visite : adresses précises, horaires actualisés, tarifs d'entrée, équipements disponibles (jacuzzi, sauna, hammam, piste de danse, carrés VIP...) et dress code. Les clubs libertins de ${v} s'adressent aussi bien aux couples curieux qu'aux initiés du lifestyle, avec des ambiances variées — du club chic et sélect au bar libertin décontracté. Notre équipe vérifie régulièrement les données présentées pour vous assurer une information fiable. Vous pouvez également consulter les établissements des villes voisines du ${d} ou explorer les autres régions limitrophes pour élargir vos options.`,

  (v: string, d: string, r: string, n: number, y: number) =>
    `Trouvez ${n === 1 ? 'le meilleur club libertin' : `les meilleurs clubs libertins`} à ${v} grâce à notre guide ${y}. ${v}, situé dans le département ${d} en ${r}, offre une ambiance libertine ${n === 1 ? 'au sein d\'un établissement sélectionné' : `au travers de ${n} établissements distincts`}, chacun avec son caractère propre. Vous découvrirez ici des clubs pour couples, des saunas mixtes, des bars échangistes ou des lieux thématiques. Pour chaque établissement, nous indiquons le type d'ambiance (raffinée, festive, intimiste), les équipements proposés, les soirées organisées ainsi que les conditions d'entrée (réservation, adhésion, dress code). Le libertinage à ${v} et dans le ${d} plus largement reste une pratique discrète et bienveillante, où le respect et le consentement priment. Utilisez notre annuaire pour comparer, choisir et organiser votre soirée libertine en toute sérénité.`,

  (v: string, d: string, r: string, n: number, y: number) =>
    `Guide ${y} du libertinage à ${v} (${d}). Notre annuaire présente ${n === 1 ? 'le club' : `${n} clubs`} libertin${n > 1 ? 's' : ''} actif${n > 1 ? 's' : ''} dans la ville, avec pour chacun : description de l'ambiance, types de prestations (sauna, spa, restaurant, bar), public accueilli (couples, célibataires, soirées mixtes), horaires et tarifs. ${v} bénéficie de sa localisation en ${r}, à proximité des grandes métropoles du secteur, ce qui en fait une destination appréciée des libertins locaux comme de passage. Les établissements référencés respectent les standards du milieu : discrétion, propreté, sécurité, accueil bienveillant. Vous trouverez également sur cette page les coordonnées pour contacter directement les clubs, ainsi que les liens vers les villes voisines du département ${d} pour diversifier vos sorties. Bonnes découvertes à ${v}.`,

  (v: string, d: string, r: string, n: number, y: number) =>
    `Le club libertin à ${v} et plus largement dans le département ${d} (région ${r}) fait partie du patrimoine festif local. En ${y}, notre guide référence ${n === 1 ? 'un établissement' : `${n} établissements`} dans la ville, tous sélectionnés pour leur qualité et leur discrétion. Que votre motivation soit la découverte de l'échangisme, l'envie d'une soirée coquine entre couples, ou la curiosité du lifestyle, cette page vous accompagne avec des informations actualisées : adresse, horaires, équipements, tarifs, photos d'ambiance, style musical, type de clientèle. Les clubs libertins de ${v} oscillent entre raffinement chic et convivialité décontractée, pour correspondre à tous les profils. Le département ${d} compte d'autres villes libertines dont les établissements sont accessibles via le maillage interne ci-dessous. Profitez de ${v} comme point de départ pour explorer la scène libertine de ${r}.`,
];

// ============================================
// INTRO PARAGRAPHES (départements) - 6 variantes
// ============================================
const DEPT_INTROS = [
  (d: string, code: string, r: string, n: number, vn: number, y: number) =>
    `Le département ${d} (${code}), en région ${r}, compte ${n} club${n > 1 ? 's' : ''} libertin${n > 1 ? 's' : ''} et échangiste${n > 1 ? 's' : ''} répartis sur ${vn} ville${vn > 1 ? 's' : ''} en ${y}. Notre annuaire départemental vous permet d'explorer l'ensemble de l'offre : saunas, spas, clubs échangistes, bars libertins, espaces SM ou hébergements. Pour chaque établissement, vous retrouvez le nom, l'adresse exacte, les horaires, les tarifs, les équipements et le type de clientèle accueillie. Le ${d} bénéficie de sa position en ${r}, à proximité des grandes métropoles, ce qui en fait un secteur actif du libertinage. Vous pouvez filtrer par ville, par type d'établissement ou par équipement pour trouver exactement ce que vous cherchez. Pensez également à consulter les départements voisins de ${r} pour élargir vos options.`,

  (d: string, code: string, r: string, n: number, vn: number, y: number) =>
    `Trouvez un club libertin dans le ${d} (${code}) parmi les ${n} établissements référencés en ${y}. Ce département de ${r} offre une scène libertine ${n <= 3 ? 'discrète mais active' : 'riche et variée'} avec des clubs répartis sur ${vn} ville${vn > 1 ? 's' : ''}. Chaque fiche établissement vous renseigne sur les prestations proposées (espace couples, sauna, jacuzzi, bar, piste de danse, salles thématiques), les soirées organisées (mixtes, couples, célibataires, à thème) et les conditions d'accès (dress code, réservation, adhésion). Notre annuaire du ${d} est mis à jour régulièrement pour refléter les ouvertures, fermetures et évolutions du secteur. Utilisez les filtres pour affiner votre recherche par ville ou par type et planifiez votre prochaine sortie libertine dans le département en toute confiance.`,

  (d: string, code: string, r: string, n: number, vn: number, y: number) =>
    `Bienvenue sur notre guide ${y} des clubs libertins et établissements échangistes du ${d} (${code}), département de ${r}. ${n} ${n === 1 ? 'établissement est référencé' : 'établissements sont référencés'} sur ${vn} ville${vn > 1 ? 's' : ''}, chacun avec ses spécificités : ambiance chic ou festive, clientèle couples ou mixte, équipements haut de gamme ou configuration cosy. Pour vous aider à choisir, nous détaillons pour chaque club ses points forts, ses horaires, ses tarifs et ses conditions d'entrée. Les établissements libertins du ${d} adhèrent aux standards du milieu : respect, discrétion, consentement. Explorez ville par ville ou utilisez les filtres thématiques pour découvrir la scène libertine de ${r}. Cette page sert de hub principal pour tous les clubs du département.`,

  (d: string, code: string, r: string, n: number, vn: number, y: number) =>
    `Le ${d} (${code}) en ${r} propose ${n} club${n > 1 ? 's' : ''} libertin${n > 1 ? 's' : ''} identifié${n > 1 ? 's' : ''} dans notre annuaire ${y}, répartis sur ${vn} commune${vn > 1 ? 's' : ''}. Pour les couples libertins, les célibataires ou les curieux souhaitant découvrir l'échangisme, ce département offre une palette de lieux adaptés à chaque envie : du sauna mixte convivial au club privé très select, en passant par les bars libertins décontractés et les lieux plus pointus (SM, fétish, naturiste). Chaque fiche club précise l'ambiance, les types de soirées, les équipements (sauna, spa, jacuzzi, bar, dancefloor, espaces privés), les tarifs couples et célibataires, ainsi que les consignes de dress code. L'annuaire est régulièrement mis à jour pour garantir l'exactitude des informations publiées.`,

  (d: string, code: string, r: string, n: number, vn: number, y: number) =>
    `Découvrez le milieu libertin du ${d} (${code}) grâce à notre annuaire ${y} : ${n} ${n === 1 ? 'club libertin et échangiste' : 'clubs libertins et échangistes'} ${n === 1 ? 'recensé' : 'recensés'} sur ${vn} ville${vn > 1 ? 's' : ''} du département. Le ${d} fait partie de la région ${r}, secteur réputé pour sa scène libertine de qualité. Notre guide vous accompagne dans le choix du bon établissement en fonction de vos envies : rencontre en club, moment détente au sauna libertin, dîner au restaurant avec ambiance échangiste ou soirée thématique. Pour chaque club, la fiche renseigne l'adresse, les horaires, les tarifs, les équipements et le type de public accueilli. Pensez également à explorer les départements voisins de ${r} pour étendre vos découvertes.`,

  (d: string, code: string, r: string, n: number, vn: number, y: number) =>
    `Le département ${d} (${code}), situé en ${r}, concentre en ${y} un total de ${n} établissement${n > 1 ? 's' : ''} libertin${n > 1 ? 's' : ''} répertorié${n > 1 ? 's' : ''} sur ${vn} commune${vn > 1 ? 's' : ''}. Qu'il s'agisse de saunas mixtes, de clubs échangistes pour couples, de bars libertins ou d'espaces dédiés au SM et au fétichisme, notre annuaire couvre toute la diversité du département. Chaque fiche vous donne accès aux informations clés (coordonnées, horaires, tarifs, équipements) et vous permet d'entrer en contact direct avec l'établissement. Nos rédacteurs vérifient régulièrement la validité des données pour vous éviter toute mauvaise surprise. Le ${d} reste un département intéressant pour la scène libertine de ${r}, à mettre en regard des départements voisins que vous pouvez également consulter depuis cette page.`,
];

// ============================================
// "POURQUOI VISITER" - 6 variantes par ville
// ============================================
const WHY_VISIT_VILLE = [
  (v: string, n: number) =>
    `Visiter un club libertin à ${v}, c'est faire le choix d'une expérience authentique et discrète. ${n === 1 ? "L'établissement référencé ici a été sélectionné" : `Les ${n} établissements référencés ici ont été sélectionnés`} pour leur sérieux, leur respect de la clientèle et la qualité de leur accueil. Vous y trouverez un cadre sécurisé pour explorer le libertinage, rencontrer d'autres couples ou célibataires avec des envies communes, et profiter d'un moment suspendu loin du quotidien.`,
  (v: string, n: number) =>
    `${v} offre aux amateurs de libertinage une ${n === 1 ? 'adresse de confiance' : 'sélection d\'adresses de confiance'} pour leurs soirées coquines. L'ambiance y est généralement chaleureuse, sans jugement, avec un public d'habitués et de nouveaux venus. Les clubs locaux privilégient le respect mutuel, la discrétion et la bienveillance, trois valeurs fondatrices du milieu. Un passage à ${v} permet de découvrir le libertinage dans un cadre convivial.`,
  (v: string, n: number) =>
    `Choisir un club libertin à ${v} présente plusieurs avantages : proximité géographique si vous habitez la région, cadre sécurisé et discret, possibilité de rencontres authentiques et spontanées. ${n > 1 ? `Les ${n} établissements se distinguent par leurs ambiances propres` : "L'établissement se distingue par son ambiance singulière"}, permettant à chacun de trouver le lieu qui lui correspond. Le libertinage à ${v} s'inscrit dans une tradition de convivialité caractéristique du milieu.`,
  (v: string, n: number) =>
    `Le libertinage à ${v} présente l'atout d'une scène ${n === 1 ? 'concentrée autour d\'un établissement phare' : `répartie entre plusieurs établissements aux ambiances distinctes`}. Que vous recherchiez la convivialité d'un bar libertin, la détente d'un sauna mixte ou l'effervescence d'un club échangiste, vous trouverez dans la ville un lieu adapté. Le public local est accueillant envers les nouveaux venus, et les équipes savent mettre à l'aise les débutants.`,
  (v: string, n: number) =>
    `Pourquoi venir à ${v} pour un club libertin ? D'abord pour la qualité des établissements locaux, reconnus dans le milieu pour leur sérieux. Ensuite pour l'ambiance caractéristique de la ville, mêlant authenticité et modernité. Enfin pour la possibilité de faire de belles rencontres dans un cadre respectueux, où le consentement et la discrétion sont la règle. ${n === 1 ? "Une adresse à découvrir." : `${n} adresses à découvrir.`}`,
  (v: string, n: number) =>
    `Les amateurs de soirées libertines à ${v} apprécient ${n === 1 ? "l'établissement local" : `les ${n} établissements locaux`} pour leur cadre soigné, leur clientèle éclectique et la liberté d'expression qui y règne. Les thématiques proposées (soirées couples, mixtes, à thème) permettent à chacun de trouver son univers. La qualité des prestations — décoration, musique, espaces privés, services — place ${v} parmi les destinations libertines à connaître en ${currentYear()}.`,
];

// ============================================
// FAQ GÉNÉRIQUES (rotation par hash)
// ============================================
type FAQGen = (location: string, n: number) => FAQItem;
const VILLE_FAQ_POOL: FAQGen[] = [
  (loc, n) => ({
    question: `Combien y a-t-il de clubs libertins à ${loc} ?`,
    answer: `Notre annuaire référence actuellement ${n} club${n > 1 ? 's' : ''} libertin${n > 1 ? 's' : ''} et échangiste${n > 1 ? 's' : ''} à ${loc}. Ce nombre évolue selon les ouvertures, fermetures et vérifications régulières de notre équipe. Consultez la liste sur cette page pour voir les établissements disponibles avec leurs coordonnées et équipements.`,
  }),
  (loc) => ({
    question: `Quel est le dress code dans les clubs libertins de ${loc} ?`,
    answer: `Le dress code varie d'un établissement à l'autre. Certains clubs de ${loc} imposent une tenue chic ou sexy (robe, talons pour madame ; chemise, pantalon habillé pour monsieur), d'autres sont plus permissifs avec tenues en cuir, lingerie ou costumes à thème selon les soirées. Nous vous recommandons de consulter la fiche de chaque club ou de contacter l'établissement pour connaître les exigences précises.`,
  }),
  (loc) => ({
    question: `Les clubs libertins à ${loc} acceptent-ils les célibataires ?`,
    answer: `La plupart des clubs libertins à ${loc} accueillent les couples, et certains acceptent également les célibataires hommes ou femmes, souvent avec un ratio régulé (plus de femmes seules que d'hommes seuls) et des tarifs différenciés. Vérifiez les conditions d'accès pour chaque établissement avant de vous déplacer.`,
  }),
  (loc) => ({
    question: `Quels sont les tarifs des clubs libertins à ${loc} ?`,
    answer: `Les tarifs varient selon l'établissement, la soirée et le type de prestation. En moyenne, comptez entre 30 € et 100 € pour une entrée couple, avec des variations selon les consommations incluses (open bar, buffet). Les soirées spéciales (Saint-Valentin, Nouvel An, soirées à thème) peuvent appliquer des tarifs majorés. Consultez la fiche de chaque club à ${loc} pour les tarifs détaillés.`,
  }),
  (loc) => ({
    question: `Faut-il réserver pour aller dans un club libertin à ${loc} ?`,
    answer: `La réservation n'est pas toujours obligatoire, mais elle est vivement recommandée, surtout pour les soirées à thème, les week-ends ou les événements spéciaux. Certains clubs de ${loc} limitent les entrées pour préserver l'ambiance et le ratio couples/célibataires. Appeler ou écrire en amont permet de garantir votre place et de connaître le programme de la soirée.`,
  }),
  (loc) => ({
    question: `Quels équipements trouve-t-on dans les clubs libertins de ${loc} ?`,
    answer: `Les équipements classiques incluent : sauna, hammam, jacuzzi, espaces privés, chambres de jeu, piste de danse, bar, restauration. Certains établissements de ${loc} proposent des équipements plus spécifiques : piscine, cinéma, espace SM, salles thématiques, glory holes. Chaque fiche club détaille précisément les prestations disponibles.`,
  }),
  (loc) => ({
    question: `Comment se déroule une première soirée libertine à ${loc} ?`,
    answer: `Pour une première visite, arrivez en début de soirée (vers 22-23h), respectez le dress code et prenez le temps d'observer l'ambiance. Un verre au bar permet souvent de commencer à discuter avec d'autres couples ou célibataires. Le maître mot est : aller à votre rythme. Personne ne vous forcera à participer à quoi que ce soit — le consentement est la règle absolue dans tous les clubs libertins de ${loc} et d'ailleurs.`,
  }),
  (loc) => ({
    question: `Les clubs libertins de ${loc} sont-ils sûrs et respectueux ?`,
    answer: `Oui, les établissements libertins sérieux — dont ceux référencés sur notre site à ${loc} — mettent la sécurité et le respect au cœur de leur fonctionnement. Les comportements déplacés sont sanctionnés, les équipes veillent au bon déroulement des soirées, et le consentement est la règle absolue. Vous pouvez refuser toute avance à tout moment et quitter le club librement.`,
  }),
];

const DEPT_FAQ_POOL: FAQGen[] = [
  (loc, n) => ({
    question: `Combien de clubs libertins dans le ${loc} ?`,
    answer: `Notre annuaire recense ${n} club${n > 1 ? 's' : ''} libertin${n > 1 ? 's' : ''} et échangiste${n > 1 ? 's' : ''} dans le département ${loc}, répartis sur plusieurs villes. Vous pouvez filtrer les résultats par ville ou par type d'établissement pour trouver le lieu qui vous convient.`,
  }),
  (loc) => ({
    question: `Quel type de clubs libertins trouve-t-on dans le ${loc} ?`,
    answer: `Le ${loc} propose une diversité d'établissements : clubs échangistes pour couples, saunas mixtes, bars libertins, spas, restaurants avec ambiance coquine, et parfois des lieux plus spécialisés (SM, fétish, naturiste). Chaque type a son ambiance et son public. Consultez nos catégories pour affiner votre recherche.`,
  }),
  (loc) => ({
    question: `Les clubs libertins du ${loc} sont-ils ouverts toute l'année ?`,
    answer: `La grande majorité des établissements libertins du ${loc} sont ouverts toute l'année, avec des horaires concentrés sur les soirs et week-ends. Certains clubs ferment quelques jours par semaine ou pendant les vacances estivales. Consultez les horaires précis sur chaque fiche ou contactez directement l'établissement.`,
  }),
  (loc) => ({
    question: `Peut-on venir en célibataire dans un club libertin du ${loc} ?`,
    answer: `Oui, de nombreux clubs du ${loc} accueillent les célibataires, avec souvent un ratio contrôlé entre hommes et femmes seuls, et des tarifs différenciés. Les soirées "célibataires" ou "mixtes" sont spécifiquement organisées pour permettre aux solos de trouver leur place dans l'univers libertin.`,
  }),
  (loc) => ({
    question: `Quels sont les prix moyens des clubs libertins dans le ${loc} ?`,
    answer: `Les tarifs dans le ${loc} varient selon le standing de l'établissement et le type de soirée. En règle générale, comptez 40-80 € pour une entrée couple standard, 15-30 € pour une femme seule, et 60-120 € pour un homme seul (tarifs souvent dissuasifs pour limiter leur nombre). Les soirées open bar ou avec buffet peuvent afficher des tarifs supérieurs. Consultez chaque fiche pour les prix à jour.`,
  }),
  (loc) => ({
    question: `Comment choisir un club libertin dans le ${loc} ?`,
    answer: `Choisir un club libertin dans le ${loc} dépend de vos envies : ambiance chic ou décontractée, club pour couples uniquement ou mixte, avec ou sans sauna, avec restauration, orientation (hétéro, mixte, gay friendly, naturiste, SM). Consultez les fiches détaillées, regardez les avis, identifiez les soirées qui vous intéressent, puis contactez le club pour plus d'infos avant votre visite.`,
  }),
  (loc) => ({
    question: `Les clubs du ${loc} proposent-ils des soirées à thème ?`,
    answer: `Oui, de nombreux clubs libertins du ${loc} organisent régulièrement des soirées à thème : Saint-Valentin, Halloween, Nouvel An, soirées fétish, glamour, lingerie, naturiste, vinyles, BDSM, couples seulement, bi-féminine, etc. Ces soirées sont souvent annoncées sur les réseaux sociaux des clubs ou par newsletter. Renseignez-vous à l'avance pour profiter de programmations qui vous correspondent.`,
  }),
  (loc) => ({
    question: `Est-il nécessaire d'être adhérent pour aller dans un club libertin du ${loc} ?`,
    answer: `Certains clubs privés du ${loc} fonctionnent sur un système d'adhésion annuelle, d'autres sont ouverts au public avec simple entrée. L'adhésion offre généralement des tarifs réduits et l'accès à des événements exclusifs. Consultez les conditions d'accès sur chaque fiche club pour savoir si une adhésion est requise.`,
  }),
];

// ============================================
// API PUBLIQUE
// ============================================

export function generateVilleIntroRich(villeName: string, deptName: string, regionName: string, clubCount: number, slug: string): string {
  const tpl = pick(VILLE_INTROS, slug);
  return tpl(villeName, deptName, regionName, clubCount, currentYear());
}

export function generateDeptIntroRich(deptName: string, deptCode: string, regionName: string, clubCount: number, villeCount: number, slug: string): string {
  const tpl = pick(DEPT_INTROS, slug);
  return tpl(deptName, deptCode, regionName, clubCount, villeCount, currentYear());
}

export function generateWhyVisitVille(villeName: string, clubCount: number, slug: string): string {
  const tpl = pick(WHY_VISIT_VILLE, slug);
  return tpl(villeName, clubCount);
}

export function generateVilleFAQ(villeName: string, clubCount: number, slug: string, count = 6): FAQItem[] {
  const baseHash = hashCode(slug);
  const out: FAQItem[] = [];
  const used = new Set<number>();
  for (let i = 0; out.length < count && i < VILLE_FAQ_POOL.length * 2; i++) {
    const idx = (baseHash + i) % VILLE_FAQ_POOL.length;
    if (!used.has(idx)) {
      used.add(idx);
      out.push(VILLE_FAQ_POOL[idx](villeName, clubCount));
    }
  }
  return out;
}

export function generateDeptFAQ(deptName: string, clubCount: number, slug: string, count = 7): FAQItem[] {
  const baseHash = hashCode(slug);
  const out: FAQItem[] = [];
  const used = new Set<number>();
  for (let i = 0; out.length < count && i < DEPT_FAQ_POOL.length * 2; i++) {
    const idx = (baseHash + i) % DEPT_FAQ_POOL.length;
    if (!used.has(idx)) {
      used.add(idx);
      out.push(DEPT_FAQ_POOL[idx](deptName, clubCount));
    }
  }
  return out;
}
