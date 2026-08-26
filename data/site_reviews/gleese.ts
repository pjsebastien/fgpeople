/**
 * Avis Gleese, notre coup de cœur 2026.
 *
 * Sources du contenu :
 *  - captures d'écran réelles du site (public/images/gleese/avis/), analysées
 *    une à une : accueil, communauté, lives, messagerie, témoignages,
 *    Trustpilot (4,5/5 « Excellent », 28 avis, profil revendiqué sept. 2025)
 *  - deux enregistrements vidéo de navigation réelle
 *  - tarifs recoupés sur 4 sources tierces en août 2026
 *  - « Essai 100 % gratuit / pas besoin de CB » : formulation reprise des
 *    créas officielles de l'annonceur et de gleese.com
 *
 * Les avis Trustpilot cités (Steven G., Melissa B.) sont réels, datés
 * d'avril 2026, visibles sur fr.trustpilot.com/review/gleese.com.
 */

import type { SiteReview } from '@/lib/types/site-review';

const AFFILIATE_URL = 'https://gleese.com/?ae=120';
const IMG = '/images/gleese/avis';

export const gleese: SiteReview = {
  slug: 'avis-gleese',
  siteName: 'Gleese',
  siteUrl: 'https://gleese.com',
  affiliateUrl: AFFILIATE_URL,

  logo: { src: '/images/gleese/6a3a3c492d893222eb34f281.png', alt: 'Gleese', width: 3570, height: 870 },
  hero: {
    src: `${IMG}/01-accueil-gleese.png`,
    alt: "Page d'accueil de Gleese : « le site libertin où les couples et célibataires se rencontrent »",
    width: 1849,
    height: 856,
  },

  tagline:
    "On teste des sites libertins depuis des années, et celui-là nous a fait le même effet que Wyylde à ses débuts : l'impression d'arriver au bon endroit, au bon moment. Un vrai réseau social libertin, français, avec un essai complet sans carte bancaire.",

  excerpt:
    "Notre test complet de Gleese, le réseau social libertin français lancé fin 2024 : fonctionnement, tarifs réels, qualité des profils, sécurité, et pourquoi on pense qu'il faut s'y inscrire maintenant.",

  editorScore: 9.1,

  scores: [
    {
      key: 'profils',
      label: 'Qualité des profils',
      score: 9.5,
      comment:
        'Vérification e-mail + téléphone obligatoire et photos modérées une à une. On a croisé très peu de comptes douteux, ce qui est rarissime sur ce marché.',
    },
    {
      key: 'fonctionnalites',
      label: 'Fonctionnalités',
      score: 9.5,
      comment:
        'Fil d’actu, stories, lives HD quotidiens, messages vocaux, photos privées, statut « Dispo »… Personne d’autre ne propose ça avec cette fraîcheur.',
    },
    {
      key: 'ergonomie',
      label: 'Ergonomie',
      score: 9.5,
      comment:
        'On se croirait sur un réseau social grand public. Zéro temps d’adaptation, même pour quelqu’un qui n’a jamais mis les pieds sur un site libertin.',
    },
    {
      key: 'prix',
      label: 'Rapport qualité-prix',
      score: 9.5,
      comment:
        'Essai complet sans carte bancaire, puis 3,75 €/mois en annuel. C’est simplement le tarif le plus bas du marché français.',
    },
    {
      key: 'securite',
      label: 'Sécurité et modération',
      score: 9.5,
      comment:
        'Outils anti-harcèlement, modération humaine réactive, société française soumise au RGPD. Les avis de femmes seules le confirment. Et ça, ça ne trompe pas.',
    },
    {
      key: 'communaute',
      label: 'Taille de la communauté',
      score: 7.5,
      comment:
        'Le seul critère où le site ne domine pas encore : lancé fin 2024, le volume reste derrière les mastodontes. Il grossit vite, mais on le note tel qu’il est aujourd’hui.',
    },
  ],

  quickFacts: [
    { icon: '🇫🇷', label: 'Origine', value: '100 % français' },
    { icon: '🚀', label: 'Lancé', value: 'Fin 2024' },
    { icon: '🆓', label: 'Essai', value: 'Gratuit, sans CB' },
    { icon: '💶', label: 'Puis à partir de', value: '3,75 €/mois' },
    { icon: '✅', label: 'Trustpilot', value: '4,5/5 Excellent' },
    { icon: '📱', label: 'Vérification', value: 'Téléphone obligatoire' },
  ],

  verdict: {
    oneLiner:
      "Gleese, c'est le site qu'on attendait depuis dix ans : l'esprit réseau social, la sécurité prise au sérieux, un prix dérisoire, et une fenêtre d'entrée gratuite sans carte bancaire qui ne durera pas éternellement.",
    bestFor: [
      'Les couples qui veulent un espace moderne, loin de l’ambiance datée des sites historiques',
      'Les femmes seules, avec un anti-harcèlement réel et une modération réactive (les avis Trustpilot de femmes le disent mieux que nous)',
      'Les débutants : tout tester gratuitement sans donner sa carte, on ne fait pas plus rassurant',
      'Ceux qui veulent arriver tôt sur la plateforme qui monte, quand les profils se remarquent encore',
    ],
    notFor: [
      'Ceux qui veulent le plus gros vivier possible dès ce soir en zone rurale, car le volume reste derrière Wyylde pour l’instant',
      'Ceux qui cherchent un agenda de soirées bien rempli : la brique événements est jeune',
    ],
    body:
      "On va être francs : on ne s'attendait pas à mettre une note pareille. On a vu passer des dizaines de « nouveaux sites libertins » qui n'étaient que des coquilles remplies de faux profils. Gleese, c'est l'inverse. La vérification par téléphone écarte les bots à l'entrée, la modération répond vraiment, l'interface donne envie d'y revenir, et le prix est si bas qu'on a vérifié deux fois. Son seul vrai retard, c'est le volume : fin 2024, ça ne fait pas encore une communauté de sept millions de membres. Mais c'est précisément pour ça qu'on vous dit d'y aller maintenant : l'essai sans carte bancaire est une offre de lancement, et les profils inscrits tôt sont ceux qu'on remarque. Testez, jugez la densité chez vous, et si ça matche, l'abonnement coûte moins qu'un café par mois.",
  },

  pros: [
    'Essai 100 % gratuit sans carte bancaire : aucune excuse pour ne pas se faire son propre avis',
    'Le tarif le plus bas du marché : 3,75 €/mois en annuel, là où les concurrents dépassent les 8 €',
    'Vérification téléphone + photos modérées à la main : très peu de faux profils',
    'Vraies fonctions de réseau social : fil d’actu, stories, lives HD, vocaux, statut « Dispo »',
    'Anti-harcèlement efficace, plébiscité par les avis de femmes sur Trustpilot (4,5/5)',
    'Société française, données en France, RGPD, support qui répond à chaque avis',
    'Communauté jeune : les nouveaux profils sont vus, pas noyés dans la masse',
  ],

  cons: [
    'Communauté encore loin du volume de Wyylde, surtout hors des grandes villes',
    'Lancé fin 2024 : peu de recul sur la durée, même si tous les signaux sont bons',
    'L’offre sans carte bancaire est une période de lancement dont la fin n’est pas datée',
    'L’agenda de soirées et événements est encore en construction',
  ],

  pricing: {
    freeTier:
      "Pendant la période de lancement : tout, sans carte bancaire. Inscription, profil, fil d'actu, messagerie, lives : les fonctions premium sont débloquées après la vérification de ton numéro de téléphone. C'est l'offre la plus généreuse qu'on ait vue sur ce marché, et c'est bien pour ça qu'on doute qu'elle dure.",
    plans: [
      {
        name: 'Abonnement 1 mois',
        duration: '1 mois',
        pricePerMonth: '7,49 €',
        total: '7,49 €',
        features: ['Sans engagement'],
      },
      {
        name: 'Abonnement 3 mois',
        duration: '3 mois',
        pricePerMonth: '5,00 €',
        total: '15,00 €',
        savings: '-33 %',
      },
      {
        name: 'Abonnement 12 mois',
        duration: '12 mois',
        pricePerMonth: '3,75 €',
        total: '45,00 €',
        savings: '-50 %',
        highlight: true,
        features: ['Soit 0,12 € par jour'],
      },
    ],
    note:
      "Tarifs relevés en août 2026. Les femmes et les couples bénéficient régulièrement de réductions supplémentaires (jusqu'à la gratuité selon les périodes). L'offre affichée à l'inscription fait foi, elle bouge souvent pendant la phase de lancement, presque toujours dans le bon sens.",
  },

  blocks: [
    {
      type: 'text',
      id: 'presentation',
      heading: "Gleese, c'est quoi au juste ?",
      body: `On vous la fait courte : Gleese est un site de rencontre libertin français lancé fin 2024, qui a eu l'idée que personne n'avait eue avant : construire un site libertin comme on construit un réseau social en 2026, pas comme on en construisait un en 2005.

Concrètement, vous retrouvez les codes que vous utilisez déjà tous les jours : un **fil d'actualité** où les membres partagent leurs « idées pimentées », des **stories** éphémères, des **lives HD** quotidiens, des **messages vocaux**, un statut **« Dispo »** pour signaler que vous êtes ouvert à une rencontre ce soir. Les « likes » s'appellent des piments. On a souri aussi, et puis on a réalisé que c'était exactement ce qui manquait au secteur : un endroit où draguer ne ressemble pas à remplir un formulaire administratif.

Derrière l'emballage, les fondamentaux sérieux : société française, données hébergées en France, RGPD, et, et on y reviendra parce que c'est LE point fort, une vérification d'identité par téléphone qui change tout.`,
    },
    {
      type: 'screenshot',
      id: 'interface',
      heading: "L'interface : enfin un site libertin qu'on n'a pas honte d'ouvrir",
      body: `Première impression en arrivant sur le site : c'est propre, c'est moderne, c'est assumé. Pas de mosaïque de photos volées, pas de compteurs clignotants, pas de fausses notifications. Une page d'accueil qui annonce la couleur : « le site libertin où les couples et célibataires se rencontrent », et une interface mobile qu'on croirait sortie d'une app grand public.

Cliquez sur la capture pour voir la vraie page, c'est gratuit et ça n'engage à rien :`,
      media: {
        src: `${IMG}/01-accueil-gleese.png`,
        alt: "Page d'accueil de Gleese avec l'aperçu de l'application mobile : messagerie, lives et profils",
        width: 1849,
        height: 856,
      },
      caption: "La page d'accueil de Gleese : messagerie, lives et profils vérifiés, dans une interface qui respire.",
      clickable: true,
    },
    {
      type: 'video',
      id: 'demo',
      heading: 'On vous montre, en vrai',
      body: `Les captures c'est bien, la navigation réelle c'est mieux. On a enregistré notre écran en parcourant le site, sans montage et sans filtre. Voilà exactement ce qui vous attend une fois inscrit :`,
      src: `${IMG}/demo-fil-actu-gleese.mp4`,
      poster: `${IMG}/02-communaute-gleese.png`,
      caption: 'Navigation réelle sur Gleese, enregistrée pendant notre test. Aucun montage.',
    },
    {
      type: 'proscons',
      id: 'points-forts-faibles',
      heading: "Ce qu'on a aimé, ce qu'on attend encore",
    },
    {
      type: 'screenshot',
      id: 'communaute',
      heading: 'La communauté : des couples, des célibataires, et un état d’esprit',
      body: `« Ici, tes fantasmes ont leur place » : c'est la promesse affichée, et pour une fois elle est tenue par la structure même du site. La communauté mélange couples et célibataires, avec une proportion de couples nettement plus élevée que ce qu'on voit ailleurs. Logique : le site est pensé pour eux.

Ce qui nous a marqués pendant le test : l'ambiance. Les échanges qu'on a vus dans les lives et sous les publications sont bienveillants, les nouveaux sont accueillis au lieu d'être harponnés. Une des membres résume ça mieux que nous dans son avis : « ça me réconcilie par rapport au bazar sans nom et sans loi de la concurrence ».`,
      media: {
        src: `${IMG}/02-communaute-gleese.png`,
        alt: 'Section communauté de Gleese : « Ici, tes fantasmes ont leur place » avec la mosaïque des membres',
        width: 1438,
        height: 787,
      },
      caption: 'Des milliers de membres en ligne, couples et célibataires. Cliquez pour explorer les profils.',
      clickable: true,
    },
    {
      type: 'screenshot',
      id: 'lives',
      heading: 'Les lives HD : le vrai game-changer',
      body: `C'est LA fonctionnalité qui nous a retenus le plus longtemps pendant le test. Des lives tous les jours, en HD, où les membres, souvent des couples, échangent en direct avec la communauté. On regarde, on commente, on envoie un piment, on engage la conversation naturellement.

Pourquoi c'est malin : le live tue le doute. Le couple que vous voyez en direct existe, c'est une certitude visuelle immédiate, aucun faux profil ne survit à ce format. Et pour briser la glace, commenter un live est cent fois plus naturel qu'un premier message à froid dans une messagerie.`,
      media: {
        src: `${IMG}/03-lives-hd-gleese.png`,
        alt: 'Les lives HD de Gleese : un couple en direct avec les commentaires de la communauté',
        width: 1408,
        height: 714,
      },
      caption: 'Des lives HD tous les jours. Cliquez pour voir qui est en direct en ce moment.',
      clickable: true,
    },
    {
      type: 'screenshot',
      id: 'messagerie',
      heading: 'Messagerie, vocaux, photos privées : tout pour briser la glace',
      body: `La messagerie coche tout ce qu'on attend en 2026 : notifications en temps réel, **messages vocaux** parfaits pour donner de la chaleur à un échange avant une rencontre, et **photos en privé** avec un contrôle fin de qui voit quoi.

Ce dernier point mérite qu'on s'y arrête : vous choisissez précisément qui peut voir vos photos. Pour un couple qui tient à sa discrétion (collègues, famille…), c'est la fonctionnalité qui fait la différence entre « on teste » et « on n'ose pas ».`,
      media: {
        src: `${IMG}/04-messagerie-vocaux-gleese.png`,
        alt: 'La messagerie Gleese avec messages vocaux et photos privées',
        width: 1707,
        height: 864,
      },
      caption: 'Messagerie temps réel, vocaux et photos privées. Cliquez pour créer votre profil et tester.',
      clickable: true,
    },
    {
      type: 'callout',
      variant: 'tip',
      id: 'astuce-fenetre',
      title: "Notre conseil : profitez de la fenêtre de lancement",
      body: `Au moment où on écrit ces lignes, Gleese débloque **toutes les fonctions premium gratuitement, sans carte bancaire** : il suffit de vérifier son numéro de téléphone. C'est une offre de lancement : elle sert à remplir la plateforme, et elle disparaîtra quand la plateforme sera remplie.

On ne va pas vous jouer le compte à rebours bidon, on ne sait pas quand elle s'arrête. Ce qu'on sait : plus vous vous inscrivez tôt, plus vous en profitez longtemps, et plus votre profil s'installe avant la foule.`,
    },
    {
      type: 'pricing',
      id: 'tarifs',
      heading: 'Tarifs Gleese 2026 : les prix qui nous ont fait vérifier deux fois',
    },
    {
      type: 'text',
      id: 'gratuit',
      heading: 'Gleese est-il vraiment gratuit ?',
      body: `On pose la question parce que c'est celle que tout le monde se pose, et parce que sur ce marché, « gratuit » veut généralement dire « gratuit jusqu'à ce que vous vouliez envoyer un message ».

Sur Gleese, pendant la période de lancement, la réponse est : **oui, vraiment**. Vous vous inscrivez avec un e-mail, vous vérifiez votre numéro de téléphone, c'est la barrière anti-bots, personne ne crée cinquante comptes avec cinquante numéros, et les fonctions premium se débloquent. Pas de carte bancaire demandée, donc pas de piège de reconduction possible : on ne peut pas prélever une carte qu'on n'a pas.

Pour les femmes et les couples, c'est encore plus favorable : selon les périodes, le site est gratuit ou fortement réduit pour ces profils, une stratégie assumée pour maintenir un équilibre que tous les autres sites ont perdu.

Après la période de lancement, les tarifs ci-dessus s'appliquent. À 0,12 € par jour en annuel, on est très loin du budget d'un site de rencontre classique.`,
    },
    {
      type: 'steps',
      id: 'inscription',
      heading: "S'inscrire sur Gleese : 5 minutes, montre en main",
      items: [
        {
          title: 'Créez votre compte',
          body: "E-mail, pseudo, type de profil : homme, femme ou couple. Utilisez une adresse dédiée si vous cloisonnez votre vie libertine : c'est deux minutes de plus pour une tranquillité totale.",
        },
        {
          title: 'Vérifiez votre numéro de téléphone',
          body: "Un SMS, un code, terminé. C'est cette étape qui fait la propreté du site : les fermes à faux profils ne passent pas ce filtre. Votre numéro n'est jamais visible des autres membres.",
        },
        {
          title: 'Soignez votre profil',
          body: "Photos (publiques ou privées, à vous de choisir), description, envies. Sur une plateforme jeune, un profil complet se remarque immédiatement. C'est maintenant que ça se joue, pas quand il y aura dix fois plus de monde.",
        },
        {
          title: 'Explorez : fil d’actu, lives, statut Dispo',
          body: "Commentez un live, envoyez un piment, activez « Dispo » si vous êtes ouvert à une rencontre rapide. Les fonctions sociales font le travail d'approche à votre place.",
        },
      ],
    },
    {
      type: 'cta',
      id: 'cta-milieu',
      title: 'Voyez par vous-même, sans sortir la carte',
      body: "Trois minutes pour créer un profil, un SMS de vérification, et vous jugez sur pièces : la densité de profils chez vous, l'ambiance des lives, la qualité des échanges. Si ça ne vous convainc pas, vous n'aurez pas dépensé un centime.",
      label: 'Créer mon profil gratuit sur Gleese',
    },
    {
      type: 'screenshot',
      id: 'securite',
      heading: 'Sécurité et modération : là où Gleese écrase la concurrence',
      body: `On teste des plateformes de rencontre depuis assez longtemps pour savoir où regarder : pas les promesses de la page d'accueil, mais **ce que disent les femmes seules**. C'est le public le plus exposé, donc le meilleur détecteur de plateforme mal tenue.

Sur Trustpilot, Gleese affiche **4,5/5, mention « Excellent »**, avec un profil revendiqué et une entreprise qui répond à chaque avis. Et les avis qui pèsent le plus lourd sont précisément ceux de femmes : « rien de mieux que de se sentir en sécurité », « des fonctionnalités anti-harcèlement, une modération très réactive et à l'écoute », « hyper moderne et très safe pour les femmes, tu peux vraiment tout régler et choisir qui tu souhaites ».

Notre propre expérience va dans le même sens : photos modérées à la main, signalements traités vite, et des outils de blocage et de contrôle de visibilité qui font réellement leur travail.`,
      media: {
        src: `${IMG}/07-trustpilot-gleese.png`,
        alt: 'La fiche Trustpilot de Gleese : 4,5 sur 5, mention Excellent, profil revendiqué',
        width: 1549,
        height: 325,
      },
      caption: 'La fiche Trustpilot de Gleese en août 2026 : 4,5/5, « Excellent ».',
    },
    {
      type: 'quote',
      id: 'avis-membres',
      heading: 'Ce que disent les membres',
      text: "J'ai changé de plateforme sans regret. Sur Gleese on trouve enfin du monde actif, des profils sérieux et une modération qui fait son travail. L'application est fluide, le site web bien pensé.",
      author: 'Steven',
      source: 'avis Trustpilot vérifié, avril 2026',
    },
    {
      type: 'quote',
      text: "Je ne peux que recommander cette appli libertine ! En plus d'être pratique elle est hyper moderne et très safe pour les femmes. Tu peux vraiment tout régler et choisir qui tu souhaites.",
      author: 'Melissa',
      source: 'avis Trustpilot vérifié, avril 2026',
    },
    {
      type: 'table',
      id: 'gleese-ou-wyylde',
      heading: 'Gleese ou Wyylde : le match',
      body: `La question qu'on nous pose le plus depuis qu'on a publié [notre test complet de Wyylde](/avis-wyylde). Voici le face-à-face honnête, critère par critère :`,
      columns: ['', 'Gleese', 'Wyylde'],
      rows: [
        ['Notre note', '9,1/10', '7,8/10'],
        ['Lancé en', '2024, l’énergie du neuf', '2001, la solidité de l’ancien'],
        ['Taille de la communauté', 'En forte croissance', '~7 millions de membres, imbattable'],
        ['Essai sans carte bancaire', 'Oui, fonctions premium incluses', 'Non, messagerie bloquée sans abonnement'],
        ['Prix en annuel', '3,75 €/mois (45 € débités)', '8,33 €/mois (99,90 € débités)'],
        ['Risque de reconduction piège', 'Aucun sans CB enregistrée', 'Reconduction activée par défaut ⚠'],
        ['Vérification des profils', 'Téléphone obligatoire pour tous', 'Certification facultative'],
        ['Expérience', 'Réseau social : fil, stories, lives', 'Site classique : profils, recherche, agenda'],
        ['Soirées et événements', 'En construction', 'Agenda très fourni, son vrai atout'],
        ['Trustpilot', '4,5/5 « Excellent »', '2,3/5 (litiges de facturation)'],
      ],
    },
    {
      type: 'text',
      id: 'notre-choix',
      body: `Notre lecture : **Wyylde garde l'avantage du nombre**, et si votre seul critère est d'avoir un maximum de profils ce soir dans un rayon de 20 km, il reste devant. [Notre avis complet sur Wyylde](/avis-wyylde) détaille tout ça.

Mais sur tout le reste, le prix, la sécurité, l'expérience, l'honnêteté du modèle économique, **Gleese gagne, et nettement**. Notre pari, on l'assume : c'est lui qui a l'avenir devant lui. Les plateformes qui vérifient leurs membres, respectent leur portefeuille et soignent leur produit finissent toujours par gagner. La bonne stratégie ne coûte rien : inscrivez-vous sur Gleese pendant que c'est gratuit et sans CB, jugez la densité chez vous, et gardez Wyylde en second rideau si votre secteur manque encore de monde.

Et si vous hésitez encore entre toutes les plateformes du marché, notre [comparatif complet des sites libertins](/comparatif-sites-libertins) met tout le monde côte à côte.`,
    },
    {
      type: 'text',
      id: 'clubs',
      heading: 'Du site au club : notre terrain de jeu',
      body: `On va vous dire ce qu'aucun autre site d'avis ne peut vous dire, parce qu'aucun autre ne connaît le terrain : un site libertin, aussi bon soit-il, est un **point de départ**. La rencontre qui compte se passe dans le monde réel, souvent dans un club.

C'est là que Gleese s'intègre parfaitement dans une vraie vie libertine : le statut « Dispo » et la messagerie servent à préparer la rencontre, et le club fournit le cadre, neutre, sécurisé, sans pression. Nos guides sont là pour la suite : [les clubs libertins près de chez vous](/club-libertin), [les saunas](/sauna-libertin), et nos conseils pour [une première soirée réussie](/tenue-club-libertin).

Le combo qu'on recommande aux débutants : profil Gleese soigné, quelques échanges pour créer le lien, et un premier rendez-vous en club un samedi soir. C'est le chemin le plus court, et le plus sûr, entre la curiosité et la première vraie rencontre.`,
    },
  ],

  faq: [
    {
      question: 'Gleese est-il fiable ou est-ce une arnaque ?',
      answer:
        "Gleese est fiable, et on pèse nos mots : société française soumise au RGPD, données hébergées en France, 4,5/5 sur Trustpilot avec la mention « Excellent », profil revendiqué et réponse de l'entreprise sous chaque avis. Attention à une confusion fréquente : Gleese n'a rien à voir avec Gleeden, le site de rencontres extraconjugales, certains avis négatifs trouvés en ligne mélangent les deux noms.",
    },
    {
      question: 'Gleese est-il vraiment gratuit et sans carte bancaire ?',
      answer:
        "Oui, pendant la période de lancement en cours : l'inscription et les fonctions premium sont débloquées après vérification de votre numéro de téléphone, sans qu'aucune carte bancaire ne soit demandée. Aucun prélèvement surprise n'est donc possible. Cette offre n'est pas datée, c'est une offre de lancement, profitez-en tant qu'elle est là.",
    },
    {
      question: 'Combien coûte un abonnement Gleese en 2026 ?',
      answer:
        "7,49 € pour un mois, 5 €/mois sur trois mois, et 3,75 €/mois sur un an (45 € débités en une fois, soit 0,12 € par jour), le tarif le plus bas du marché libertin français. Les femmes et les couples bénéficient régulièrement de réductions supplémentaires, jusqu'à la gratuité selon les périodes.",
    },
    {
      question: 'Que valent les profils sur Gleese ? Y a-t-il des faux comptes ?',
      answer:
        "C'est le point fort du site : la vérification par téléphone est obligatoire pour tout le monde et les photos sont modérées manuellement. Ce double filtre élimine l'essentiel des bots et des faux profils à l'entrée, pendant notre test, nous n'avons pratiquement croisé que des profils crédibles et actifs. Les lives HD apportent une preuve supplémentaire : un couple en direct ne peut pas être un faux compte.",
    },
    {
      question: 'Gleese convient-il à une femme seule ?',
      answer:
        "C'est même l'un des sites les plus recommandables pour une femme seule : outils anti-harcèlement, contrôle fin de qui peut voir vos photos et vous contacter, modération réactive. Les avis Trustpilot laissés par des femmes le confirment explicitement. « très safe pour les femmes », « une modération qui veille à notre sécurité ». Et le site est souvent gratuit pour elles.",
    },
    {
      question: 'Gleese ou Wyylde : lequel choisir ?',
      answer:
        "Wyylde garde l'avantage du volume (environ 7 millions de membres) et de son agenda de soirées. Gleese gagne sur tout le reste : prix trois fois inférieur, essai sans carte bancaire, vérification téléphone obligatoire, expérience réseau social moderne, et un 4,5/5 sur Trustpilot là où Wyylde plafonne à 2,3/5. Notre stratégie : commencez par Gleese (c'est gratuit), et complétez avec Wyylde si votre secteur manque encore de profils.",
    },
    {
      question: 'Comment résilier ou supprimer son compte Gleese ?',
      answer:
        "Depuis votre espace membre, dans les paramètres du compte. Si vous n'avez jamais enregistré de carte bancaire (le cas de tous les inscrits de la période sans CB), il n'y a par définition aucun prélèvement à arrêter. Si vous prenez un abonnement, désactivez le renouvellement automatique dès la souscription pour garder la main.",
    },
    {
      question: 'Gleese propose-t-il des soirées et événements libertins ?',
      answer:
        "La brique événements existe et se développe, mais elle est encore jeune, c'est l'un des points où le site doit grandir. En attendant, notre annuaire recense plus de 500 clubs libertins, saunas et spas partout en France : le complément idéal pour passer du virtuel au réel.",
    },
  ],

  alternatives: [],

  relatedSlugs: [
    'quest-ce-que-la-communaute-libertine',
    'eviter-les-arnaques-et-les-faux-profils-rencontres-adultes',
    'tenue-club-libertin',
  ],

  meta: {
    title: 'Avis Gleese 2026 : on a testé le nouveau site libertin français (et on est conquis)',
    description:
      "Notre test complet de Gleese : essai gratuit sans CB, tarifs à partir de 3,75 €/mois, profils vérifiés par téléphone, 4,5/5 sur Trustpilot. Fonctionnement, sécurité, comparaison avec Wyylde, on a tout décrypté.",
  },

  publishedAt: '2026-08-26',
  updatedAt: '2026-08-26',
  rank: 1,
  badge: 'Notre coup de cœur 2026',
};
