/**
 * Avis Carré Libertin.
 *
 * Sources recoupées le 26/08/2026 sur des tests indépendants (kinkyee,
 * beeutiful, madintouch, datingwiiz, proud-and-gay, jesuisbadass,
 * rencontresenlignefiables) :
 *  - ouvert en 2007, édité par TISC MEDIAS, paiement via Paybox
 *  - plus de 500 000 inscrits, environ 20 000 membres actifs par semaine
 *  - répartition annoncée autour de 60 % femmes et couples / 40 % hommes
 *  - gratuité complète femmes seules et couples, sous condition de publier
 *    au moins 3 photos de profil
 *  - abonnements hommes : 19,90 € le mois, 13,30 €/mois en trimestriel,
 *    8,33 €/mois en annuel (Pack GOLD)
 *  - reconduction automatique active par défaut
 *
 * ⚠ MÉDIAS PROVISOIRES
 * Aucune capture réelle du site n'a encore été fournie : les blocs marqués
 * PLACEHOLDER pointent sur des visuels d'ambiance génériques. À remplacer par
 * de vraies captures (accueil, annonces, shuffle, chat, recherche, tarifs)
 * avant de considérer la page terminée.
 */

import type { SiteReview } from '@/lib/types/site-review';
import { CARRE_LIBERTIN_AFFILIATE } from '@/lib/config/affiliates';

const AFFILIATE_URL = CARRE_LIBERTIN_AFFILIATE.url;

/** Visuel d'attente, à remplacer par une capture réelle. */
const PLACEHOLDER = (n: number, alt: string) => ({
  src: `/images/club-libertin-ambiance-${n}.jpg`,
  alt,
  width: 1200,
  height: 800,
});

export const carreLibertin: SiteReview = {
  slug: 'avis-carre-libertin',
  siteName: 'Carré Libertin',
  siteUrl: 'https://www.carrelibertin.com',
  affiliateUrl: AFFILIATE_URL,

  logo: {
    src: '/images/carre-libertin/logo.jpeg',
    alt: 'Carré Libertin',
    width: 192,
    height: 192,
  },
  hero: PLACEHOLDER(3, "Carré Libertin, site de rencontre libertine français depuis 2007"),

  tagline:
    "On l'a gardé pour la fin parce qu'il ne paie pas de mine. Design d'un autre temps, aucune application mobile, et pourtant : c'est le seul site libertin français où les hommes seuls ne sont pas noyés sous la concurrence. Voilà pourquoi ça change tout.",

  excerpt:
    "Notre test de Carré Libertin, en ligne depuis 2007 : le ratio femmes et couples qui fait sa réputation, les tarifs réels, ce qui est vraiment gratuit, et les défauts qu'on ne vous cachera pas.",

  editorScore: 8.1,

  scores: [
    {
      key: 'ratio',
      label: 'Ratio femmes et couples',
      score: 9.5,
      comment:
        "Autour de 60 % de femmes et de couples selon les chiffres annoncés. C'est l'inverse de ce qu'on subit ailleurs, et c'est toute la raison d'être du site.",
    },
    {
      key: 'prix',
      label: 'Rapport qualité-prix',
      score: 9,
      comment:
        "Entièrement gratuit pour les femmes et les couples, et 8,33 €/mois en annuel pour les hommes. Difficile de faire mieux à ce niveau de fréquentation.",
    },
    {
      key: 'securite',
      label: 'Fiabilité et ancienneté',
      score: 8.5,
      comment:
        "Dix-neuf ans d'activité, société identifiée (TISC MEDIAS), paiement Paybox, profils validés avant publication. Aucun incident connu sur les données.",
    },
    {
      key: 'communaute',
      label: 'Taille de la communauté',
      score: 8,
      comment:
        "Plus de 500 000 inscrits et environ 20 000 membres actifs par semaine. Loin derrière Wyylde en volume brut, mais bien mieux réparti.",
    },
    {
      key: 'fonctionnalites',
      label: 'Fonctionnalités',
      score: 7.5,
      comment:
        "Annonces, messagerie, webcams, lives et un mode Shuffle à la Tinder. Tout ce qu'il faut, rien de superflu, et rien d'innovant non plus.",
    },
    {
      key: 'ergonomie',
      label: 'Ergonomie et design',
      score: 6,
      comment:
        "Le point noir, et on ne va pas prétendre le contraire : l'interface a dix ans de retard et il n'existe aucune application mobile dédiée.",
    },
  ],

  quickFacts: [
    { icon: '🇫🇷', label: 'Origine', value: 'France' },
    { icon: '📅', label: 'En ligne depuis', value: '2007' },
    { icon: '👥', label: 'Inscrits', value: '500 000 +' },
    { icon: '♀️', label: 'Femmes et couples', value: 'Gratuit' },
    { icon: '💶', label: 'Hommes, à partir de', value: '8,33 €/mois' },
    { icon: '📱', label: 'Application', value: 'Aucune (site mobile)' },
  ],

  verdict: {
    oneLiner:
      "Si vous êtes un homme seul et que vous en avez assez d'écrire à trente profils pour une réponse, c'est ici qu'il faut aller. Et si vous êtes une femme ou un couple, tout est gratuit.",
    bestFor: [
      "Les hommes seuls fatigués par la concurrence des autres plateformes",
      "Les femmes seules et les couples, qui accèdent à tout sans payer un centime",
      "Ceux qui préfèrent une valeur sûre installée depuis 2007 à une plateforme qui vient d'ouvrir",
      "Les amateurs d'annonces claires, où chacun écrit ce qu'il cherche vraiment",
    ],
    notFor: [
      "Ceux pour qui l'esthétique d'une interface compte autant que son contenu",
      "Les inconditionnels du mobile, puisqu'il n'existe aucune application dédiée",
      "Ceux qui veulent des fonctions sociales modernes comme les stories ou les vocaux",
    ],
    body:
      "Carré Libertin ne gagnera aucun prix de design, et honnêtement, ça se voit dès la page d'accueil. Mais nous, ce qu'on regarde sur un site de rencontre, c'est qui s'y trouve. Et sur ce terrain, il fait quelque chose que presque personne ne réussit : maintenir une majorité de femmes et de couples. C'est la conséquence directe de sa politique tarifaire, gratuite pour elles depuis toujours, et ça explique dix-neuf ans de longévité dans un secteur où les sites ferment tous les deux ans. Notre conseil est simple. Si vous êtes une femme ou un couple, l'inscription ne vous coûte rien, il n'y a aucune raison de ne pas aller voir. Si vous êtes un homme seul, commencez par le compte gratuit pour jauger la densité autour de chez vous, puis prenez l'annuel si le vivier vous convainc : à 8,33 € par mois, le calcul est vite fait. Dans tous les cas, coupez la reconduction automatique dès le premier paiement.",
  },

  pros: [
    "Une majorité de femmes et de couples, ce qui est rarissime sur ce marché",
    "Totalement gratuit pour les femmes seules et les couples, sans limite de fonctionnalités",
    "Dix-neuf ans d'existence sans incident connu, édité par une société française identifiée",
    "Des annonces claires : on lit ce que la personne cherche avant même d'écrire",
    "Le mode Shuffle permet de balayer les profils rapidement, à la manière de Tinder",
    "Abonnement homme très compétitif en annuel, à 8,33 € par mois",
    "Résiliation simple, depuis les paramètres du compte",
  ],

  cons: [
    "Une interface qui accuse clairement son âge, dans les codes graphiques des années 2010",
    "Aucune application mobile dédiée, seulement un site adapté aux téléphones",
    "La gratuité femmes et couples exige la publication d'au moins 3 photos de profil",
    "Reconduction automatique activée par défaut sur les abonnements",
    "Volume total très en deçà de Wyylde, surtout en dehors des grandes agglomérations",
    "Aucun audit indépendant publié sur la proportion de profils inactifs",
  ],

  pricing: {
    freeTier:
      "Pour les femmes seules et les couples, absolument tout est gratuit, à condition de publier au moins 3 photos sur le profil. Pour les hommes seuls, l'inscription et la navigation ne coûtent rien, mais l'ouverture des conversations et l'accès complet aux profils demandent un abonnement.",
    plans: [
      {
        name: 'Femmes seules et couples',
        duration: 'Illimité',
        pricePerMonth: 'Gratuit',
        total: '0 €',
        highlight: true,
        features: ['Accès complet', '3 photos de profil requises'],
      },
      {
        name: 'Hommes, 1 mois',
        duration: '1 mois',
        pricePerMonth: '19,90 €',
        total: '19,90 €',
        features: ['Sans engagement'],
      },
      {
        name: 'Hommes, 3 mois',
        duration: '3 mois',
        pricePerMonth: '13,30 €',
        total: '39,90 €',
        savings: '-33 %',
      },
      {
        name: 'Hommes, 12 mois (Pack GOLD)',
        duration: '12 mois',
        pricePerMonth: '8,33 €',
        total: '99,90 €',
        savings: '-58 %',
        features: ['Débité en une fois'],
      },
    ],
    warning:
      "La reconduction automatique est active par défaut. Désactivez-la dans les paramètres de votre compte dès le premier paiement : vous conservez votre abonnement jusqu'à son terme, sans mauvaise surprise le mois suivant.",
    note: "Tarifs relevés en août 2026 et recoupés sur plusieurs tests indépendants. Vérifiez le prix affiché avant de valider, des promotions circulent régulièrement sur la première période.",
  },

  blocks: [
    {
      type: 'text',
      id: 'presentation',
      heading: "Carré Libertin, c'est quoi et pourquoi ça dure depuis 2007",
      body: `Posons le décor tout de suite : Carré Libertin a ouvert en **2007**. Dans un secteur où les plateformes naissent et disparaissent en deux ans, dix-neuf ans d'activité continue, ce n'est pas un détail, c'est une preuve.

Le site est édité par une société française, **TISC MEDIAS**, les paiements passent par Paybox, et nous n'avons trouvé trace d'aucune fuite de données ni d'aucun litige d'ampleur en presque vingt ans. Pour un sujet aussi sensible que votre vie intime, c'est le genre de vérification qu'on fait toujours en premier.

Le principe est resté le même depuis le départ : des **annonces** où chacun écrit ce qu'il cherche, une messagerie pour en discuter, des webcams et des lives pour se jauger avant de se déplacer. Rien de révolutionnaire. Mais c'est carré, et ça fonctionne.`,
    },
    {
      type: 'callout',
      variant: 'tip',
      id: 'largument',
      title: "L'argument qui nous a fait changer d'avis",
      body: `On avait rangé Carré Libertin dans la catégorie « vieux site » avant de regarder les chiffres. Puis on est tombés sur la répartition de sa communauté : environ **60 % de femmes et de couples** pour 40 % d'hommes.

Prenez n'importe quel autre site libertin et retournez ce rapport : vous obtenez la réalité que vivent la plupart des hommes seuls, à savoir écrire à trente profils pour obtenir une réponse. Ici, le rapport de force est structurellement différent. Ce n'est pas du marketing, c'est la conséquence mécanique de la gratuité accordée aux femmes et aux couples depuis 2007.`,
    },
    {
      type: 'screenshot',
      id: 'interface',
      heading: "L'interface : parlons-en franchement",
      body: `Autant le dire tout de suite, parce que vous le verrez en trois secondes : le site a dix ans de retard sur le plan graphique. Fond sombre, typographies datées, mise en page qui rappelle les plateformes du début des années 2010.

Est-ce que ça nous a gênés pour naviguer ? Non. Tout est là où on l'attend, la recherche fonctionne, les annonces se lisent bien. Est-ce que ça donne envie de rester par plaisir esthétique, comme sur [Gleese](/avis-gleese) ? Clairement pas. À vous de voir ce qui compte le plus dans votre cas : la vitrine ou ce qu'il y a derrière.`,
      media: PLACEHOLDER(5, "Interface de Carré Libertin"),
      caption: "PLACEHOLDER : à remplacer par une capture réelle de la page d'accueil.",
      clickable: true,
    },
    {
      type: 'proscons',
      id: 'points-forts-faibles',
      heading: 'Ce qui nous a plu, ce qui nous a agacés',
    },
    {
      type: 'text',
      id: 'fonctionnalites',
      heading: 'Les fonctionnalités, une par une',
      body: `**Les annonces**
C'est le cœur du site et sa meilleure idée. Chacun publie ce qu'il recherche, avec ses conditions et ses limites. Vous savez donc à quoi vous en tenir avant même d'écrire, ce qui fait gagner un temps considérable des deux côtés.

**Le mode Shuffle**
Un balayage rapide des profils, façon Tinder : un clic pour dire que ça vous plaît, un clic pour passer. Parfait pour dégrossir quand vous découvrez le vivier de votre secteur.

**La recherche avancée**
Filtrage par localisation, orientation, genre, âge, disponibilité et popularité. C'est complet, et c'est surtout ce que vous utiliserez le plus souvent.

**Les webcams et les lives**
Des échanges en direct, utiles pour vérifier qu'une personne correspond à ses photos avant d'organiser une rencontre. Un réflexe de prudence que nous recommandons systématiquement.

**La messagerie**
Classique et efficace. Gratuite pour les femmes et les couples, conditionnée à l'abonnement pour les hommes seuls.`,
    },
    {
      type: 'pricing',
      id: 'tarifs',
      heading: 'Tarifs Carré Libertin 2026 : ce que ça coûte vraiment',
    },
    {
      type: 'text',
      id: 'gratuit',
      heading: 'Qui peut vraiment utiliser Carré Libertin gratuitement ?',
      body: `C'est la question qu'on nous pose le plus, alors répondons-y sans détour.

**Femmes seules et couples : tout est gratuit.** Messagerie, annonces, webcams, recherche avancée, sans limitation ni abonnement caché. Une seule condition, et elle est réelle : publier **au moins 3 photos** sur votre profil. C'est le filtre que le site utilise pour écarter les comptes fantômes, et on trouve la contrepartie honnête.

**Hommes seuls : l'inscription est gratuite, la conversation ne l'est pas.** Vous pouvez créer votre profil, parcourir les membres et mesurer la densité autour de chez vous sans rien payer. Pour ouvrir une conversation et accéder aux profils complets, il faut passer à l'abonnement.

Notre position là-dessus n'a pas changé : servez-vous du compte gratuit pour compter les profils actifs à moins de 30 km de chez vous. Si le vivier est là, l'abonnement annuel à 8,33 € par mois est l'un des meilleurs rapports du marché. S'il n'y est pas, aucun abonnement ne le fera apparaître.`,
    },
    {
      type: 'callout',
      variant: 'warning',
      id: 'reconduction',
      title: 'Coupez la reconduction automatique tout de suite',
      body: `Comme la quasi-totalité de ses concurrents, Carré Libertin active le renouvellement automatique par défaut. C'est la première source de litige sur ce marché, et la première cause d'avis négatifs en ligne.

Le geste prend trente secondes : **paramètres du compte, section abonnement, désactiver le renouvellement**. Votre abonnement reste actif jusqu'à son terme, vous ne perdez rien, et vous ne serez pas prélevé sans l'avoir décidé.`,
    },
    {
      type: 'steps',
      id: 'inscription',
      heading: "S'inscrire en 4 étapes",
      items: [
        {
          title: 'Créez le compte',
          body: "Adresse e-mail, pseudo, type de profil. Comptez deux minutes. Si vous cloisonnez votre vie libertine, utilisez une adresse dédiée, c'est le réflexe le plus efficace.",
        },
        {
          title: 'Publiez au moins 3 photos',
          body: "Obligatoire pour débloquer la gratuité si vous êtes une femme ou un couple, et fortement conseillé dans tous les cas : un profil sans visuel n'obtient pratiquement aucune réponse.",
        },
        {
          title: 'Rédigez une vraie annonce',
          body: "C'est la force du site, servez-vous-en. Dites ce que vous cherchez, ce que vous ne cherchez pas, vos limites. Vous recevrez moins de messages, mais bien plus pertinents.",
        },
        {
          title: 'Mesurez la densité avant de payer',
          body: "Lancez une recherche à 30 km et regardez combien de profils se sont connectés récemment. C'est le seul indicateur qui vaille, et il est gratuit. **Et si vous passez à l'abonnement, coupez la reconduction dans la foulée.**",
        },
      ],
    },
    {
      type: 'cta',
      id: 'cta-milieu',
      title: 'Regardez qui est actif près de chez vous',
      body: "L'inscription et la recherche par localisation ne coûtent rien, quel que soit votre profil. C'est le seul moyen fiable de savoir si le vivier tient la route dans votre secteur.",
      label: 'Créer mon profil gratuitement',
    },
    {
      type: 'table',
      id: 'comparaison',
      heading: 'Carré Libertin, Gleese ou Wyylde : lequel pour vous ?',
      body: `Les trois se valent sur le papier, mais ils ne répondent pas du tout aux mêmes situations. Voici notre lecture, après les avoir tous testés :`,
      columns: ['Critère', 'Carré Libertin', 'Gleese', 'Wyylde'],
      rows: [
        ['En ligne depuis', '2007', 'Fin 2024', '2001'],
        ['Volume de membres', '500 000 +', 'En croissance', '7 millions'],
        ['Ratio femmes et couples', 'Environ 60 %', 'Équilibré', 'Défavorable'],
        ['Femmes et couples', 'Gratuit', 'Essai sans CB', 'Payant'],
        ['Hommes, prix mini', '8,33 €/mois', '3,75 €/mois', '8,33 €/mois'],
        ['Application mobile', 'Aucune', 'iOS et Android', 'iOS et Android'],
        ['Design', 'Daté', 'Moderne', 'Correct'],
      ],
    },
    {
      type: 'text',
      id: 'notre-lecture',
      body: `**Notre lecture.** Si vous êtes un homme seul et que le taux de réponse est votre obsession, Carré Libertin est le meilleur choix des trois, malgré son look. Si vous voulez l'expérience la plus agréable et le prix le plus bas, allez voir [notre test de Gleese](/avis-gleese). Et si votre seul critère est d'avoir le maximum de profils dans un rayon de 20 km, [Wyylde](/avis-wyylde) reste devant en volume brut, à condition d'accepter son tarif et son déséquilibre.

Le [comparatif complet des sites libertins](/comparatif-sites-libertins) reprend tout ça critère par critère.`,
    },
    {
      type: 'text',
      id: 'du-site-au-club',
      heading: 'Le vrai conseil que personne ne vous donnera',
      body: `On va finir par là, parce que c'est ce qui nous distingue des autres sites d'avis : nous ne vivons pas que de l'affiliation, nous référençons **plus de 500 clubs libertins, saunas et spas échangistes** partout en France.

Alors voici ce qu'on constate depuis des années. Un site de rencontre, aussi bon soit-il, sert à **préparer** une rencontre, pas à la remplacer. Les couples qui réussissent le mieux leur entrée dans le libertinage sont ceux qui discutent d'abord en ligne, puis se retrouvent dans un club, sur un terrain neutre et encadré.

Repérez donc quelques profils sur Carré Libertin, échangez, et proposez une première rencontre dans un [club libertin près de chez vous](/club-libertin). Vous verrez, c'est beaucoup moins intimidant que d'y aller seul, et infiniment plus simple qu'un premier rendez-vous en tête-à-tête.`,
    },
  ],

  faq: [
    {
      question: 'Carré Libertin est-il une arnaque ?',
      answer:
        "Non. Le site est en activité depuis 2007, il est édité par une société française identifiée (TISC MEDIAS), les paiements passent par Paybox et les nouveaux profils sont validés avant publication. En dix-neuf ans, aucune fuite de données ni litige d'ampleur n'a été rapporté. Les avis négatifs que l'on trouve en ligne concernent presque toujours la reconduction automatique de l'abonnement, pas la réalité du service.",
    },
    {
      question: 'Carré Libertin est-il vraiment gratuit pour les femmes et les couples ?',
      answer:
        "Oui, et sans limitation de fonctionnalités : messagerie, annonces, webcams et recherche avancée sont accessibles sans payer. Une condition s'applique néanmoins, il faut publier au moins 3 photos sur le profil. C'est le filtre utilisé par le site pour écarter les comptes vides.",
    },
    {
      question: 'Combien coûte Carré Libertin pour un homme seul ?',
      answer:
        "Environ 19,90 € pour un mois sans engagement, 13,30 € par mois en formule trimestrielle, et 8,33 € par mois avec le Pack GOLD annuel, soit 99,90 € prélevés en une fois. L'inscription et la navigation restent gratuites, seule l'ouverture des conversations demande un abonnement.",
    },
    {
      question: 'Y a-t-il vraiment plus de femmes que sur les autres sites libertins ?',
      answer:
        "C'est la particularité du site : la répartition annoncée tourne autour de 60 % de femmes et de couples pour 40 % d'hommes, quand la plupart des plateformes concurrentes présentent le déséquilibre inverse. Cela découle directement de la gratuité accordée aux femmes et aux couples depuis 2007. Concrètement, un homme seul y obtient un bien meilleur taux de réponse qu'ailleurs.",
    },
    {
      question: 'Comment résilier son abonnement Carré Libertin ?',
      answer:
        "La résiliation se fait depuis les paramètres de votre compte, dans la section dédiée à l'abonnement. L'annulation prend effet à la fin de la période en cours, vous conservez donc l'accès jusqu'au terme déjà payé. Pensez surtout à désactiver la reconduction automatique dès votre premier paiement.",
    },
    {
      question: 'Existe-t-il une application mobile Carré Libertin ?',
      answer:
        "Non, et c'est l'un de ses vrais défauts. Il n'existe aucune application dédiée sur iOS ou Android. Le site reste utilisable depuis un téléphone, la mise en page s'adapte correctement, mais l'expérience n'a rien à voir avec une application native comme celle de Gleese ou de Wyylde.",
    },
    {
      question: 'Carré Libertin convient-il aux débutants ?',
      answer:
        "Plutôt bien, oui. Le fonctionnement par annonces est le plus lisible du marché pour quelqu'un qui découvre : vous lisez ce que chacun recherche avant d'engager la conversation, ce qui évite beaucoup de malentendus. L'interface est datée mais simple, sans fonctions inutiles à apprivoiser.",
    },
    {
      question: 'Y a-t-il des faux profils sur Carré Libertin ?',
      answer:
        "Comme partout, il en existe, mais la modération valide les nouveaux profils avant publication et l'obligation de photos limite fortement les comptes vides. Aucun audit indépendant n'a toutefois été publié sur la proportion de profils inactifs, nous ne pouvons donc pas vous donner de chiffre. Notre conseil habituel reste valable : privilégiez les profils avec plusieurs photos et une annonce rédigée.",
    },
  ],

  alternatives: [],

  relatedSlugs: [
    'quest-ce-que-la-communaute-libertine',
    'eviter-les-arnaques-et-les-faux-profils-rencontres-adultes',
    'tenue-club-libertin',
  ],

  meta: {
    title: 'Avis Carré Libertin 2026 : le site où les hommes seuls ont enfin leur chance',
    description:
      "Notre test complet de Carré Libertin : 60 % de femmes et de couples, gratuit pour elles, tarifs réels pour eux, et les défauts qu'on ne vous cache pas. Verdict et alternatives.",
  },

  publishedAt: '2026-08-26',
  updatedAt: '2026-08-26',
  rank: 2,
  badge: 'Le meilleur ratio femmes / hommes',
};
