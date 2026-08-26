/**
 * Avis Wyylde — refonte complète.
 *
 * ⚠ MÉDIAS PROVISOIRES
 * Les captures pointent encore sur des visuels d'ambiance génériques (PLACEHOLDER).
 * Dès que les vraies captures sont uploadées dans /admin/sites → brief `avis-wyylde`,
 * lancer `npm run brief:pull avis-wyylde` : les URLs Cloudinary remplaceront les
 * placeholders et les légendes seront ajustées à ce que montre réellement chaque image.
 * Tout bloc encore marqué PLACEHOLDER est à remplacer avant de considérer la page finie.
 */

import type { SiteReview } from '@/lib/types/site-review';

/** Visuel d'attente — à remplacer par une capture réelle. */
const PLACEHOLDER = (n: number, alt: string) => ({
  src: `/images/club-libertin-ambiance-${n}.jpg`,
  alt,
  width: 1200,
  height: 800,
});

/**
 * Lien d'affiliation Wyylde.
 *
 * Règle des pages d'avis : le CTA pointe vers le site TESTÉ, jamais vers un
 * autre partenaire. Un lecteur venu chercher « avis Wyylde » et redirigé vers
 * Gleese rebondit, et la page perd la position qu'elle occupe.
 *
 * Les clics sont attribués au partenaire « wyylde » dans /admin/clics, ce qui
 * permet de comparer le rendement de cette page à celui des blocs Gleese.
 */
const AFFILIATE_URL = 'https://c3po.link/QVYZUh6myz';

export const wyylde: SiteReview = {
  slug: 'avis-wyylde',
  siteName: 'Wyylde',
  siteUrl: 'https://www.wyylde.com',
  affiliateUrl: AFFILIATE_URL,

  hero: PLACEHOLDER(1, "Page d'accueil de Wyylde"),

  tagline:
    "Le plus gros site libertin français, et de loin. Mais aussi l'un des plus chers, avec une reconduction automatique qui piège beaucoup de monde. Voici ce qu'on en pense après l'avoir testé.",

  excerpt:
    "Wyylde revendique 7 millions de membres et domine le libertinage en ligne en France. Notre test complet : tarifs réels, qualité des profils, pièges de l'abonnement et alternatives.",

  editorScore: 7.8,

  scores: [
    {
      key: 'communaute',
      label: 'Taille de la communauté',
      score: 9.5,
      comment: "Aucun concurrent français n'approche ce volume de profils actifs.",
    },
    {
      key: 'profils',
      label: 'Qualité des profils',
      score: 7.5,
      comment: 'La certification limite les faux comptes, mais le déséquilibre hommes/femmes reste marqué.',
    },
    {
      key: 'fonctionnalites',
      label: 'Fonctionnalités',
      score: 8.5,
      comment: 'Lives, albums privés, agenda des soirées : le plus complet du marché.',
    },
    {
      key: 'ergonomie',
      label: 'Ergonomie et application',
      score: 7,
      comment: "Le site est clair, l'application mobile reste en retrait.",
    },
    {
      key: 'prix',
      label: 'Rapport qualité-prix',
      score: 6,
      comment: "Presque tout est payant, et l'engagement 12 mois est quasi obligatoire pour un tarif correct.",
    },
    {
      key: 'securite',
      label: 'Sécurité et modération',
      score: 8,
      comment: 'Société française, données hébergées en France, modération réellement active.',
    },
  ],

  quickFacts: [
    { icon: '👥', label: 'Membres', value: '~7 millions' },
    { icon: '🇫🇷', label: 'Origine', value: 'France' },
    { icon: '📅', label: 'En ligne depuis', value: '2001' },
    { icon: '💶', label: 'À partir de', value: '8,33 €/mois' },
    { icon: '🆓', label: 'Version gratuite', value: 'Limitée' },
    { icon: '📱', label: 'Application', value: 'iOS & Android' },
  ],

  verdict: {
    oneLiner:
      "Si vous ne deviez tester qu'un seul site libertin en France, c'est celui-là, à condition d'accepter de payer et de désactiver la reconduction automatique dès l'inscription.",
    bestFor: [
      'Les couples qui cherchent un maximum de profils près de chez eux',
      'Ceux qui veulent trouver des soirées et événements libertins réels',
      'Les débutants qui préfèrent une plateforme française encadrée',
    ],
    notFor: [
      'Les hommes seuls avec un petit budget : la concurrence est rude et tout est payant',
      "Ceux qui veulent tester sérieusement sans sortir la carte bancaire",
      'Les habitants de zones rurales, où la densité de profils chute vite',
    ],
    body:
      "Wyylde reste la référence française et il n'y a pas de débat sur ce point : le volume de membres est sans équivalent, et c'est précisément ce qui fait qu'on y fait des rencontres. Le reste est plus discutable. Le modèle économique est agressif (sans abonnement, vous ne pouvez pratiquement rien faire) et la reconduction automatique activée par défaut explique une bonne partie des avis négatifs qu'on trouve en ligne. Notre recommandation : inscrivez-vous gratuitement pour juger de la densité de profils dans votre département, et ne payez que si le vivier local vous convainc. Si vous passez à l'abonnement, désactivez la reconduction immédiatement.",
  },

  pros: [
    'La plus grosse base de membres libertins en France, sans concurrence sérieuse',
    "Un agenda des soirées et événements libertins réellement alimenté",
    'Certification des profils qui réduit nettement les faux comptes',
    'Société française : données hébergées en France, support en français',
    'Discrétion des prélèvements bancaires (libellé neutre)',
    'Plus de 20 ans d\'existence, aucune fermeture ni scandale de fuite de données',
  ],

  cons: [
    'Quasiment inutilisable sans abonnement : la messagerie est bloquée',
    'Reconduction automatique activée par défaut, à désactiver manuellement',
    "Le tarif attractif (8,33 €/mois) impose un engagement de 12 mois payé d'avance",
    'Fort déséquilibre hommes seuls / femmes seules, comme partout',
    'Note Trustpilot faible, très majoritairement à cause de la facturation',
    "Densité de profils qui s'effondre hors des grandes agglomérations",
  ],

  pricing: {
    freeTier:
      "Créer un profil, parcourir les membres, consulter l'agenda des soirées et recevoir des messages. En revanche, impossible de répondre, d'accéder aux albums privés, aux lives ou à la recherche avancée sans abonnement.",
    plans: [
      {
        name: 'Abonnement 1 mois',
        duration: '1 mois',
        pricePerMonth: '22,90 €',
        total: '22,90 €',
        features: ['Sans engagement'],
      },
      {
        name: 'Abonnement 3 mois',
        duration: '3 mois',
        pricePerMonth: '14,97 €',
        total: '44,90 €',
        savings: '-35 %',
      },
      {
        name: 'Abonnement 12 mois',
        duration: '12 mois',
        pricePerMonth: '8,33 €',
        total: '99,90 €',
        savings: '-64 %',
        highlight: true,
        features: ['Débité en une fois'],
      },
    ],
    warning:
      "La reconduction automatique est activée par défaut sur toutes les formules. Pour la couper : Mon compte → Abonnement → Paramètres de facturation → Désactiver le renouvellement automatique. Faites-le dès la souscription, c'est la première cause de litige avec la plateforme.",
    note: 'Tarifs relevés en août 2026. Wyylde pratique régulièrement des promotions sur les premiers mois : vérifiez le prix affiché avant de valider.',
  },

  blocks: [
    {
      type: 'text',
      id: 'presentation',
      heading: "Wyylde, c'est quoi exactement ?",
      body: `Wyylde n'est pas un nouveau venu. Le site s'appelait **Netéchangisme** et existe depuis 2001 : c'est l'un des plus anciens services de rencontre libertine encore en activité en France. Le changement de nom, en 2018, visait à sortir de l'image « échangisme » un peu datée pour toucher un public plus large : couples curieux, célibataires, amateurs de BDSM ou simplement gens ouverts.

Concrètement, la plateforme fonctionne comme un réseau social pour libertins : profil, photos publiques et privées, messagerie, fil d'actualité, groupes thématiques, et surtout un **agenda des soirées** organisées dans les clubs partout en France.

C'est une société française, qui héberge ses données en France. Sur un sujet aussi sensible que la vie sexuelle, ce n'est pas un détail : vous n'avez pas affaire à une structure offshore injoignable.`,
    },
    {
      type: 'screenshot',
      id: 'interface',
      heading: "À quoi ressemble l'interface",
      body: `La prise en main est simple, y compris pour quelqu'un qui n'a jamais utilisé de site libertin. L'écran d'accueil affiche les profils connectés autour de vous, triés par distance.`,
      media: PLACEHOLDER(2, "Fil d'actualité et profils connectés sur Wyylde"),
      caption:
        "PLACEHOLDER : à remplacer par la capture du fil d'actualité (upload dans /admin/sites)",
    },
    {
      type: 'callout',
      variant: 'tip',
      id: 'astuce-test',
      title: 'Testez la densité avant de payer',
      body: `Créez votre compte gratuitement et lancez une recherche limitée à 30 km autour de chez vous. Comptez les profils **connectés dans les dernières 48 h**, pas le nombre total d'inscrits, qui inclut des comptes abandonnés depuis des années.

En dessous d'une trentaine de profils actifs, l'abonnement ne se rentabilisera pas : vous ferez le tour du vivier local en deux semaines.`,
    },
    {
      type: 'proscons',
      id: 'points-forts-faibles',
      heading: 'Points forts et points faibles',
    },
    {
      type: 'pricing',
      id: 'tarifs',
      heading: 'Tarifs Wyylde 2026 : combien ça coûte vraiment',
    },
    {
      type: 'text',
      id: 'gratuit',
      heading: 'Peut-on utiliser Wyylde gratuitement ?',
      body: `Oui, mais pas pour rencontrer quelqu'un. C'est important d'être clair là-dessus, parce que beaucoup de sites concurrents entretiennent le flou.

Avec un compte gratuit, vous pouvez :

- créer un profil complet et mettre des photos
- parcourir les membres et les filtrer par localisation
- consulter l'agenda des soirées libertines
- **recevoir** des messages

Ce que vous ne pouvez pas faire :

- répondre à un message reçu
- accéder aux albums privés des autres membres
- utiliser la recherche avancée (pratiques, critères physiques…)
- participer aux lives

Autrement dit : le compte gratuit sert à évaluer si le vivier local vaut le coup. C'est déjà utile, mais il ne faut pas espérer plus.`,
    },
    {
      type: 'screenshot',
      id: 'soirees',
      heading: "L'agenda des soirées : le vrai atout",
      body: `C'est la fonctionnalité qui distingue le plus Wyylde de ses concurrents. La plateforme recense les soirées organisées dans les clubs libertins de toute la France, avec la date, le club, le thème et souvent les conditions d'entrée.

Pour un couple qui débute, c'est le pont le plus simple entre le virtuel et le réel : vous repérez une soirée, vous discutez avec des membres qui y vont, et vous n'arrivez pas totalement seuls le soir venu.`,
      media: PLACEHOLDER(4, 'Agenda des soirées libertines sur Wyylde'),
      caption: "PLACEHOLDER : à remplacer par la capture de l'agenda des soirées",
    },
    {
      type: 'callout',
      variant: 'info',
      id: 'lien-annuaire',
      title: 'Repérez le club avant la soirée',
      body: `Avant de réserver une soirée trouvée sur Wyylde, vérifiez le club sur notre annuaire : [plus de 500 établissements](/club-libertin) avec adresse, équipements, tarifs d'entrée et avis de visiteurs. Ça évite les mauvaises surprises à l'arrivée.`,
    },
    {
      type: 'text',
      id: 'profils',
      heading: 'Qualité des profils et faux comptes',
      body: `Wyylde propose une **certification de profil** : le membre envoie une photo de lui tenant un code manuscrit, la modération valide. Un profil certifié porte un badge visible.

Ce système fonctionne plutôt bien. On croise nettement moins de faux profils que sur les sites gratuits, où les robots et les arnaques au « je te retrouve sur ce site cam » sont la norme.

Cela dit, deux réserves honnêtes :

- La certification est facultative. Beaucoup de membres ne la font pas, et un profil non certifié reste incertain.
- Le déséquilibre hommes seuls / femmes seules est massif, comme sur absolument tous les sites libertins. Un homme seul doit s'attendre à un taux de réponse très bas et à devoir soigner son profil pour exister.`,
    },
    {
      type: 'quote',
      id: 'trustpilot',
      heading: 'Ce que disent les avis en ligne',
      text: "Site correct pour les rencontres mais attention au renouvellement automatique, j'ai été prélevé sans m'en rendre compte.",
      author: 'Avis récurrent',
      source: 'Trustpilot',
    },
    {
      type: 'text',
      id: 'reputation',
      body: `Il faut le dire franchement : la note de Wyylde sur Trustpilot est mauvaise, autour de **2,3/5**. Mais quand on lit les avis en détail, l'écrasante majorité des critiques porte sur **la facturation**, pas sur le service : reconduction non désirée, difficulté à résilier, prélèvement surprise.

C'est un vrai problème, et c'est pour ça qu'on insiste lourdement sur la désactivation du renouvellement automatique. Ce n'est en revanche pas un signe d'arnaque : Wyylde est une société française identifiée, en activité depuis plus de vingt ans, qui n'a jamais fait l'objet de scandale sur la protection des données.`,
    },
    {
      type: 'steps',
      id: 'inscription',
      heading: "S'inscrire sur Wyylde en 4 étapes",
      items: [
        {
          title: 'Créer le compte',
          body: "Adresse e-mail, pseudo, type de profil (homme seul, femme seule, couple). Comptez deux minutes. Utilisez une adresse e-mail dédiée si vous tenez à cloisonner.",
        },
        {
          title: 'Remplir le profil et ajouter des photos',
          body: "C'est l'étape que tout le monde bâcle et qui détermine pourtant tout. Un profil sans photo et sans texte ne reçoit aucune réponse. Vous pouvez garder vos photos en album privé et n'y donner accès qu'au cas par cas.",
        },
        {
          title: 'Faire certifier le profil',
          body: 'Gratuit, rapide, et ça change nettement le taux de réponse. À faire immédiatement.',
        },
        {
          title: 'Tester la densité locale avant de payer',
          body: 'Recherche à 30 km, filtre sur les connexions récentes. Si le vivier est correct, prenez un mois pour valider ; ne partez sur 12 mois qu\'une fois convaincu, et **désactivez la reconduction dans la foulée**.',
        },
      ],
    },
    {
      type: 'cta',
      id: 'cta-milieu',
      title: 'Voir combien de profils sont actifs près de chez vous',
      body: "L'inscription et la recherche par localisation sont gratuites. C'est le seul moyen fiable de savoir si Wyylde vaut le coup dans votre secteur.",
      label: 'Tester Wyylde gratuitement',
    },
    {
      type: 'text',
      id: 'concurrence',
      heading: 'Wyylde face à la concurrence',
      body: `Aucun site français ne rivalise sur le volume. La vraie question n'est donc pas « Wyylde ou un autre » mais « Wyylde vaut-il son prix dans ma situation ».

Pour un couple en zone urbaine, la réponse est presque toujours oui : c'est là que la masse critique paie. Pour un homme seul avec un budget serré, ou pour quelqu'un vivant loin d'une grande ville, l'équation est beaucoup moins évidente, et il vaut mieux commencer par les clubs près de chez vous, où la rencontre est immédiate et sans abonnement.`,
    },
  ],

  faq: [
    {
      question: 'Wyylde est-il une arnaque ?',
      answer:
        "Non. Wyylde est une société française en activité depuis 2001, avec des données hébergées en France et un support joignable. Les avis négatifs qu'on trouve en ligne concernent presque tous la reconduction automatique de l'abonnement, pas la réalité du service ni la sécurité des données.",
    },
    {
      question: 'Combien coûte Wyylde en 2026 ?',
      answer:
        "De 22,90 €/mois sans engagement à 8,33 €/mois avec un engagement de 12 mois (99,90 € prélevés en une seule fois). La formule 3 mois revient à 14,97 €/mois. Des promotions sont fréquentes sur la première période.",
    },
    {
      question: 'Comment désactiver le renouvellement automatique ?',
      answer:
        "Mon compte → Abonnement → Paramètres de facturation → Désactiver le renouvellement automatique. Faites-le dès la souscription : c'est la principale source de litiges avec la plateforme, et vous conservez votre abonnement jusqu'à son terme.",
    },
    {
      question: 'Peut-on vraiment faire des rencontres gratuitement sur Wyylde ?',
      answer:
        "Non. Le compte gratuit permet de créer un profil, de parcourir les membres et de recevoir des messages, mais pas d'y répondre. Il sert à évaluer le nombre de profils actifs autour de chez vous avant de décider de payer.",
    },
    {
      question: 'Wyylde est-il discret vis-à-vis de mes proches ?',
      answer:
        "Oui. Les photos peuvent être placées en album privé accessible au cas par cas, le profil peut être masqué à certains membres, et le libellé du prélèvement bancaire est neutre. Utiliser une adresse e-mail dédiée reste la précaution la plus efficace.",
    },
    {
      question: 'Wyylde convient-il aux débutants ?',
      answer:
        "Oui, c'est même l'un de ses points forts : l'interface est simple, la communauté est habituée aux nouveaux arrivants, et l'agenda des soirées permet de passer au réel de façon progressive plutôt que de se lancer seul dans un club inconnu.",
    },
    {
      question: 'Que vaut Wyylde pour un homme seul ?',
      answer:
        "C'est le profil le plus désavantagé, sur Wyylde comme partout ailleurs : la concurrence est forte et les taux de réponse sont bas. Un profil certifié, avec de vraies photos et un texte soigné, est indispensable. Avec un budget limité, les clubs libertins locaux offrent souvent un meilleur rendement.",
    },
  ],

  alternatives: [],

  relatedSlugs: [
    'quest-ce-que-la-communaute-libertine',
    'eviter-les-arnaques-et-les-faux-profils-rencontres-adultes',
    'tenue-club-libertin',
  ],

  meta: {
    title: 'Avis Wyylde 2026 : test complet, tarifs réels et pièges à éviter',
    description:
      "Notre test complet de Wyylde : tarifs 2026, qualité des profils, agenda des soirées et le piège de la reconduction automatique. Verdict honnête et alternatives.",
  },

  publishedAt: '2026-08-14',
  updatedAt: '2026-08-14',
  rank: 2,
  badge: 'La plus grosse communauté',
};
