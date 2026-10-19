# Playbook — Fiches clubs personnalisées

Standard à respecter pour **chaque** fiche de `data/clubs/profiles/`.
Schéma JSON : `lib/types/club-profile.ts`. Rendu : `components/clubs/ClubProfilePage.tsx`.

## L'objectif

Chaque fiche club doit être **la page la plus complète et la plus fiable du web
sur ce lieu**, et ne ressembler à aucune autre fiche du site. On sort du « texte
à trous » : pas de gabarit, pas de phrases interchangeables. Un club sur lequel
on trouve beaucoup obtient une fiche longue ; un club sur lequel on ne trouve
presque rien obtient une fiche courte et honnête qui dit ce qu'on sait, ce qu'on
ne sait pas, et comment le savoir.

Ce qui nous distingue des annuaires concurrents, qui recopient tous la même
fiche : on **vérifie** (registre des entreprises, archives du site, presse,
activité récente), on **date** chaque information, on **dit quand un club a
fermé**, et on **relie** le lieu à son contexte local.

## Les règles absolues

1. **Rien d'inventé.** Chaque fait publié s'appuie sur une source listée dans
   `sources`. Ce qui n'est pas sourcé n'est pas écrit. En cas de doute, on écrit
   le doute (« selon un annuaire de 2023, non confirmé depuis »).
2. **Pas de copie.** On reformule. Jamais plus de quelques mots repris tels
   quels d'un autre site, et entre guillemets avec attribution. Aucune photo
   d'un autre site. Les avis de tiers : note, nombre d'avis, date du relevé, et
   au plus une synthèse des thèmes récurrents si on a lu les avis soi-même
   (« plusieurs avis Google de 2025 évoquent l'attente au vestiaire »).
3. **Pas de données personnelles.** Jamais de nom de client ou de membre. Pas
   de nom de famille de gérant tiré d'un registre. Un prénom de gérant
   seulement si le club le met lui-même en avant sur ses canaux officiels.
4. **Pas d'accès privé.** Pas de connexion à un espace membre, pas de
   contournement de captcha ou de mur de connexion. Pages publiques uniquement.
5. **FG People n'est jamais une source.** Ni fgpeople.com, ni la base interne,
   ni les sites qui recopient nos fiches (texte identique à la « description
   d'origine » du contexte = copie, pas source).
6. **Les annuaires agrégateurs sont des sources faibles** (sauna-club-libertin,
   sojoob, cerclelibertin, netechangisme, annuaires généralistes…). Souvent
   périmés et recopiés les uns des autres : jamais seuls pour un fait
   `confirme`.

## Phase 1 — Recherche

Commencer par `node scripts/club-context.mjs <slug>` : fiche brute de la base
(non vérifiée), requêtes Search Console, clubs proches, doublons possibles.

### Outils qui marchent

- **WebSearch en mode `extended`** pour les recherches principales (le mode
  `standard` est faible sur ces sujets en français). Lancer plusieurs requêtes
  différentes, par exemple :
  `<nom> <ville>`, `<nom> club libertin <ville>`, `<nom> avis`, `<nom> tarifs`,
  `<nom> soirée`, `<nom> fermeture` / `fermé`, `<nom> facebook`,
  `<adresse exacte>`, `<téléphone au format 06 12 34 56 78>`,
  `club libertin <ville>` (concurrence et contexte),
  `<nom> <ville>` + nom du quotidien régional (Midi Libre, La Dépêche,
  Ouest-France, Le Progrès, Sud Ouest, actu.fr, Le Parisien…).
- **WebFetch** pour lire : le site officiel (accueil, tarifs, agenda, règlement,
  accès, galerie, **mentions légales** → société et SIREN), les pages publiques
  de réseaux sociaux, les articles de presse, les annuaires.
- **Registre des entreprises** (Bash) :
  `curl -s "https://recherche-entreprises.api.gouv.fr/search?q=<nom ou enseigne>&code_postal=<cp>"`
  → SIREN, `date_creation`, `etat_administratif` (A = active, C = cessée), établissements
  (`etat_administratif` F = fermé), code NAF, enseignes. Essayer plusieurs
  libellés (enseigne, nom commercial, société des mentions légales).
  Source à citer : `https://annuaire-entreprises.data.gouv.fr/entreprise/<siren>` (type `registre`).
  Attention aux homonymes : vérifier l'adresse et l'activité (NAF 93.29Z, 56.30Z, 96.04Z…).
- **Archives du site** (Bash) :
  `curl -s "https://web.archive.org/cdx/search/cdx?url=<domaine>&fl=timestamp,statuscode&collapse=timestamp:6"`
  → historique des captures (date de la dernière capture valide = indice de fermeture),
  puis WebFetch sur `https://web.archive.org/web/<timestamp>/<url>` pour lire
  d'anciennes pages (tarifs, concept, histoire). Citer « site officiel, archive du JJ/MM/AAAA ».
- **État du site** (Bash) :
  `curl -s -L -m 20 -A "Mozilla/5.0" -o /dev/null -w "%{http_code} %{url_effective}" <url>`.

Ne pas utiliser : DuckDuckGo (captcha), Google en direct, Bing en direct (résultats hors sujet).

### Ce qu'on cherche

- **Identité** : nom exact, enseigne, société exploitante, date de création,
  changements de nom ou de propriétaire annoncés publiquement.
- **Statut** : ouvert ou fermé, depuis quand, avec quelles preuves.
- **Concept** : club, sauna, spa, bar, discothèque ; mixte, gay, naturiste,
  BDSM ; ce que le lieu dit de lui-même.
- **Public et conditions d'accès** : couples, femmes seules, hommes seuls (jours,
  quotas, tarifs), âge minimum, adhésion, réservation.
- **Horaires** par jour, **tarifs** par catégorie et par jour, ce qui est inclus
  (boissons, buffet, vestiaire).
- **Soirées à thème** et événements récurrents, agenda récent.
- **Règles** : dress code, protections, téléphones, tabac.
- **Lieux** : surface, niveaux, espaces (jacuzzi, piscine, hammam, salons,
  coins câlins, donjon…), restauration, hébergement, parking, accès.
- **Histoire** : ouverture, rénovations, reprises, presse, faits marquants.
- **Réputation** : notes publiques avec nombre d'avis et date.
- **Ce qui le distingue** : ce qu'aucun autre club de la région n'a.
- **Contexte local** : autres lieux libertins proches, y compris ceux absents
  de notre base (à signaler dans le dossier).

### Statut : règles de décision

- `ouvert` : preuve d'activité de moins de 6 mois (agenda daté 2026, publication
  datée, avis récent daté, site à jour).
- `ferme` : au moins **deux** indices indépendants et concordants (registre
  cessé + site mort depuis longtemps, article de presse, annonce officielle,
  mention « définitivement fermé » vue dans un résultat de recherche…).
- `fermeture_probable` : un indice fort isolé, ou plusieurs indices faibles
  (site mort + aucune activité visible depuis plus d'un an).
- `incertain` : indices contradictoires ou absence de toute preuve récente.

`status.summary` explique le verdict au visiteur, avec les dates et les preuves
(« Le site ne répond plus depuis mars 2024 et la société exploitante a été
radiée en juin 2024 »). Il commence par la preuve la plus parlante pour CE club
(une soirée datée, une annonce, un article), pas par une formule fixe du type
« Ouvert. Le site officiel… ».

**Cohérence des réserves.** Quand un fait est déduit plutôt que constaté (par
exemple le rôle d'une société déduit de son enseigne et de son code NAF), la
même réserve s'applique partout où il apparaît : statut, `keyFacts` (confiance
`a_verifier` ou `source_unique`), tableaux et texte.

### Doublons dans la base

La base contient des doublons (ancien nom, double saisie). Si la recherche
établit que deux fiches désignent le même lieu (même adresse et même société,
même SIRET, changement de nom attesté), le noter dans une section
« Doublons » du dossier avec les preuves et le slug concerné. La fiche
rédigée mentionne l'ancien nom dans l'histoire du lieu ; la fusion (redirection
301 de l'ancienne fiche) est faite à la publication via `data/clubs/merged.json`.

### Lieux absents de la base

Les lieux libertins trouvés pendant la recherche et absents de notre base sont
listés dans le dossier (nom, ville, URL) **et** dans
`data/clubs/research/<slug>.missing.json` (`[{"nom", "ville", "url"}]`, tableau
vide si aucun) : ils alimentent la file d'ajout de nouvelles fiches
(`data/clubs/candidates/`). Vérifier d'abord avec `node scripts/find-club.mjs
"<nom> <ville>"` qu'ils ne sont pas déjà dans la base. Pour un club fermé, s'il n'existe pas d'alternative ouverte
vérifiée dans la base, un lien externe vers le site officiel d'un club ouvert
vérifié est permis.

### Le dossier de recherche

Écrit dans `data/clubs/research/<slug>.md` (non publié, conservé pour les mises
à jour) :

```
# <Nom> — dossier de recherche (<AAAA-MM-JJ>)
## Statut
Verdict + preuves datées.
## Sources
S1. <titre> — <url> — <type> — consulté le <date> — ce qu'on y a trouvé
## Faits établis
- <fait> — S1, S4 — confirme | source_unique | a_verifier
  (citation courte de la source, 30 mots maximum, pour preuve)
## Contradictions et doutes
## Requêtes Search Console à servir
## Lieux libertins proches absents de notre base
## Pistes sans résultat
Ce qui a été cherché sans succès (utile pour ne pas refaire).
```

## Phase 2 — Rédaction

La fiche est un fichier JSON conforme à `lib/types/club-profile.ts`, écrit dans
`data/clubs/drafts/<slug>.json` puis validé par
`node scripts/build-club-profiles.mjs --check data/clubs/drafts/<slug>.json`.

### Longueur : proportionnelle à la matière

- Matière riche (site officiel détaillé, presse, histoire) : 1 200 à 2 500 mots.
- Matière moyenne : 600 à 1 200 mots.
- Matière pauvre : 250 à 500 mots, avec une liste `unverified` concrète.

Ne jamais délayer pour atteindre une longueur. Une phrase sans fait est une
phrase à supprimer.

### Structure : libre, dictée par ce qu'on sait

Il n'y a pas de plan type. On choisit les sections selon la matière trouvée et
les requêtes à servir, dans l'ordre le plus utile au visiteur. Les titres de
section sont **propres au club** et informatifs :

- Bons : « Un ancien moulin reconverti en club en 2009 », « Couples, femmes
  seules, hommes seuls : qui entre quel soir », « Trois niveaux et un jacuzzi de
  douze places », « Pourquoi le club a fermé en 2024 », « Ce que disent les avis
  Google (4,1/5 sur 230) ».
- Interdits : « Présentation », « Ambiance », « Notre avis », « Infos
  pratiques », « Conclusion », et tout titre réutilisable tel quel pour un autre club.

Les exemples de titres ci-dessus sont des illustrations : ne pas les reprendre
tels quels. Un bon titre contient un fait du club (un jour, un prix, une date,
un équipement, un lieu) : « Le jeudi Gang Bang et l'homme seul à 50 € » plutôt
que « Qui entre quel soir ».

La partie après les deux-points d'un titre doit, elle aussi, porter un fait :
« Seize photos officielles : le sauna éclairé en vert et le deck de transats »
plutôt que « … : ce que montre la galerie ». L'audit signale les fins de titre
qui reviennent dans plusieurs fiches.

**L'ordre des sections n'est pas fixe.** L'histoire du lieu ou de la société
n'a pas de place réservée en fin de fiche, pas plus que l'adresse ; l'audit
alerte quand un lot finit trop souvent par la même paire de sections. On commence par ce qui distingue le
plus ce club ou par ce que les visiteurs cherchent le plus (une fermeture, une
soirée phare, un déménagement, un tarif) ; on ne termine pas systématiquement
par « adresse et clubs voisins ». Si deux fiches successives que tu as lues
suivent le même ordre, change-le.

Les blocs disponibles : `text` (markdown allégé : `**gras**`, `[lien](url)`,
listes `- `), `list`, `table`, `callout` (info, tip, warning), `timeline`
(idéal pour l'histoire d'un lieu).

Les horaires et tarifs vont dans les champs structurés `horaires` et `tarifs`
(rendus dans un encadré dédié), pas en double dans une section. Une section
peut les commenter (« l'entrée hommes seuls est deux fois plus chère le samedi »).

### Lisibilité : le visiteur ne lit pas, il cherche

Le visiteur arrive de Google avec une question précise (ouvert ? quand ?
combien ? qui peut entrer ? c'est comment ?). La page doit y répondre en dix
secondes, sans lecture : c'est le rôle des blocs de lecture rapide, affichés
en haut de page. Le texte détaillé vient ensuite, replié section par section.

- **`glance`** (4 à 6 tuiles, obligatoire) : un pictogramme, un libellé
  (24 caractères max) et une valeur (45 caractères max), lisibles en une
  seconde. Ex. `{"icon": "calendar", "label": "Ouvert", "value": "Tous les jours dès 14 h"}`,
  `{"icon": "euro", "label": "Entrée couple", "value": "20 € (sauna) · 60 € (samedi)"}`,
  `{"icon": "history", "label": "Depuis", "value": "2009"}`. Club fermé :
  `{"icon": "closed", "label": "Fermé", "value": "Depuis 2013"}`, la période
  d'activité, le club ouvert le plus proche. Un fait incertain porte sa `confidence`.
- **`audience`** (club ouvert : obligatoire) : qui peut entrer, une entrée par
  public (`couples`, `femmes`, `hommes`, `trans` si documenté), avec `status`
  (`oui`, `selon`, `non`, `inconnu`), un `detail` de 90 caractères max
  (« Tous les jours ; samedi soir : club privé réservé aux couples ») et un
  `price` court qui est un montant (« 20 € », « 35 à 50 € ») ; sans montant connu, pas de `price` (le dire dans `detail`). C'est la question n° 1 des visiteurs.
- **`highlights`** (3 à 5 points, obligatoire) : « À savoir avant d'y aller »,
  les conseils concrets qui évitent une mauvaise surprise (dress code refusé à
  la porte, quota d'hommes seuls, réservation obligatoire, parking, adresse
  déménagée…). 160 caractères max chacun, un fait par point.
- **Chaque section** a un `icon` et un **`summary`** : sa réponse en une phrase
  (180 caractères max), toujours visible ; le texte se déplie à la demande.
  Le summary n'est pas un teaser (« Découvrez… ») mais l'information elle-même.
- **Paragraphes courts** : 3 phrases ou 60 mots au plus. Une énumération de
  plus de deux éléments devient une liste ; des prix ou des horaires
  comparés deviennent un tableau. Une section qui dépasse 250 mots se scinde.

Pictogrammes : calendar, clock, euro, users, couple, sparkles, map, building,
history, star, shield, info, warning, camera, music, drink, food, spa, flame,
water, bed, car, lock, ticket, heart, mask, closed, ruler, phone, globe.

### Les champs

- `display` : la graphie correcte du nom et de la ville quand la base les a en
  capitales ou sans accents (`{"nom": "Le Lib", "ville": "Alès"}`), telle que le
  club l'écrit lui-même. Affichée dans les titres, le fil d'Ariane et les listes.
  Le vérificateur l'ajoute s'il manque.
- `seo.title` : 60 caractères visés, 70 maximum. Nom + ville + l'angle des
  requêtes du club (avis, tarifs, photos, horaires, soirées). Formulations
  variées d'un club à l'autre. Club fermé : le dire (« Le Lib à Alès : fermé,
  ce qu'il faut savoir »).
- `seo.metaDescription` : 120 à 160 caractères, des faits concrets et une raison
  de cliquer. Pas de formule creuse.
- `seo.subtitle` : précis (« Club libertin et sauna sur trois niveaux à Lisses (91) »).
- `seo.targetQueries` : les requêtes GSC visées.
- `lead` : 2 à 4 phrases, les faits les plus distinctifs et le statut.
- `keyFacts` : 4 à 10 faits courts (Ouverture, Société, Public admis, Jours
  d'ouverture, Entrée couple, Surface…), chacun avec confiance et sources.
- `faq` : 4 à 8 questions, prioritairement celles des requêtes GSC et les
  questions pratiques réelles. Réponses avec des faits sourcés uniquement ; si
  on ne sait pas, le dire et indiquer comment savoir.
- `externalRatings` : seulement une note vue de ses yeux sur la plateforme
  elle-même, avec nombre d'avis et date. Une note relayée par un agrégateur
  (Restaurant Guru, Wanderlog, annuaire…) reste dans le texte, avec sa
  réserve ; le validateur la refuse dans ce champ.
- Section sur les avis : courte, sans bilan qui répète les autres sections, et
  jamais en tête de fiche, même quand « avis » est la première requête : le
  `summary` et la FAQ suffisent à servir cette requête.
- Dates : jamais « il y a environ 3 ans » (recopié d'un affichage Google ou
  YouTube, faux dès la publication) ; écrire « vers 2023 » ou « affiché comme
  datant d'environ 3 ans au 16/10/2026 ».
- `officialLinks` : site, réseaux, galerie photo officielle, agenda. La requête
  « <club> photos » est fréquente : si une galerie officielle existe, la mettre
  en `galerie` et dire ce qu'elle montre, uniquement si on l'a consultée.
- `equipements` : uniquement ceux confirmés par une source (idéalement officielle).
- `corrections` : uniquement si une source officielle récente contredit la base
  (nouveau téléphone, nouvelle adresse, nouveau site).
- `unverified` : les questions concrètes restées sans réponse.
- `sources` : toutes les sources citées, `s1`, `s2`… ; chaque section cite les siennes.

### Le style

- Journalistique, précis, au vouvoiement. Des dates explicites (« en mars
  2024 »), jamais « récemment ». Des chiffres quand on en a.
- Les points forts **et** les limites. Pas de superlatif sans source.
- Les réserves sont formulées clairement : « selon le site officiel »,
  « d'après un annuaire de 2023, non confirmé depuis ».
- Club fermé : on garde toute l'information (concept, histoire, équipements,
  adresse), au passé, on explique la fermeture, et on oriente vers les clubs
  ouverts à proximité avec des liens internes. **Pas de moule de fiche
  fermée** : la page affiche déjà un bandeau de fermeture et les lieux
  proches, donc la première section n'est pas forcément celle des preuves de
  fermeture (une fermeture ancienne et incontestée peut ouvrir sur le
  concept, le lieu ou une soirée marquante) ; le chapô ne se termine pas
  systématiquement sur l'alternative ; la meta description ne finit pas par
  « où aller à la place » ou « où sortir » ; la section histoire n'est pas
  forcément la dernière.
- Alternative à un club fermé : au moins un lieu dont l'activité est
  **vérifiée et datée**. `club-context.mjs` indique le statut des voisins qui
  ont déjà une fiche vérifiée : reprends leurs constats datés plutôt qu'un
  « actif au registre ».
- Matière pauvre (aucune source officielle sur le lieu) : 900 mots au plus.
- **Formules interdites** (elles ne disent rien d'un club en particulier) :
  cadre raffiné, accueil chaleureux, ambiance chaleureuse, incontournable,
  n'hésitez pas, adresse de choix, véritable institution, lieu idéal, cadre
  idyllique, moments inoubliables, expérience unique, dans le respect et la
  discrétion, havre de paix, ne manquez pas, que vous soyez…, pour tous les
  goûts, en toute discrétion, écrin, propice aux rencontres, nul doute, en somme.
  `node scripts/audit-club-profiles.mjs <slug>` les détecte, ainsi que les
  tournures répétées d'une fiche à l'autre.

### Maillage interne

2 à 6 liens internes dans le texte, choisis dans la sortie de
`club-context.mjs` : clubs de la même ville ou du département (`/<slug>`),
page ville (`/ville/<ville>`), page département (`/departement/<dep>`). Ancres
naturelles et variées. Pour un club fermé, les alternatives ouvertes sont
prioritaires.

### Liens partenaires (obligatoires)

Chaque fiche intègre, **dans le corps du texte** (sections ou FAQ), un lien
vers chacun des trois sites partenaires, en plus des encarts déjà prévus par la
page :

- `[ancre](aff:wyylde)`
- `[ancre](aff:carre-libertin)`
- `[ancre](aff:gleese)`

Une à deux fois chacun au maximum, jamais dans le chapô, les titres, les
`keyFacts`, le statut, les horaires ou les tarifs. Le validateur bloque une
fiche où il en manque un. Le rendu ajoute `rel="sponsored"`, compte les clics
et affiche la mention « liens partenaires » : ne rien ajouter de tel dans le texte.

**Le lien doit rendre service au lecteur à cet endroit précis de la fiche**,
pas être plaqué. Il naît de la situation propre au club :

- préparer une première soirée sans arriver seuls (repérer des couples qui y
  vont, échanger avant) ;
- un club réservé aux couples certains soirs → comment un homme seul peut
  rencontrer un couple qui l'y emmène ;
- peu ou pas de club ouvert dans le secteur, ou club fermé → rencontrer
  autrement dans le département ;
- les soirées annoncées en ligne : l'agenda des soirées de Wyylde ;
- femmes seules et couples : la gratuité de Carré Libertin ;
- tester sans payer : Gleese sans carte bancaire.

Les faits sur les partenaires viennent **uniquement** de nos avis
(`data/site_reviews/wyylde.ts`, `carre-libertin.ts`, `gleese.ts`) et de
`lib/config/affiliates.ts`, dont les mises en garde s'imposent (pas de durée
d'essai annoncée pour Gleese, pas de prix d'abonnement homme pour Carré
Libertin). Faits utilisables, entre autres :

- **Wyylde** : ex-Netéchangisme, en ligne depuis 2001, rebaptisé en 2018,
  revendique 7 millions de membres, agenda des soirées consultable avec un
  compte gratuit, compte gratuit limité (pas de réponse aux messages sans abonnement).
- **Carré Libertin** : depuis 2007, plus de 500 000 inscrits, accès complet
  gratuit pour les femmes et les couples (3 photos de profil requises).
- **Gleese** : lancé fin 2024, inscription sans carte bancaire, profils
  vérifiés par téléphone, photos modérées à la main, site français.

Interdits : prétendre qu'un club est présent, partenaire ou actif sur une
plateforme sans source ; « cliquez ici » ; ancres identiques d'une fiche à
l'autre ; ton publicitaire (« le meilleur site », « inscrivez-vous vite »).
L'ancre est un groupe de mots descriptif intégré à la phrase (au moins trois
mots, jamais le seul nom de marque).

Avant d'écrire, lancer `node scripts/audit-club-profiles.mjs --anchors` pour
voir les ancres déjà employées et en choisir d'autres. **L'emplacement varie**
selon la situation du club : pas toujours dans la dernière section, pas
toujours Gleese en fin de fiche, pas toujours la même réserve (« lancé fin
2024, encore peu de membres ») formulée de la même façon. L'audit signale les
phrases partenaires trop proches d'une autre fiche.

## Ajouter un lieu absent de la base

Objectif : que le site ne manque aucun lieu libertin ouvert. Chaque lieu en
file (`data/clubs/candidates/<clé>.json`) est qualifié par un agent.

**Dans le périmètre** : clubs libertins et échangistes, saunas libertins,
mixtes ou gays, spas libertins, bars et restaurants libertins, discothèques
libertines, cinémas libertins, clubs BDSM et fétichistes, hébergements et
campings libertins. En France (DOM compris), et à l'étranger seulement près
d'une frontière (Belgique, Suisse, Luxembourg, Espagne, Allemagne).

**Hors périmètre** : prostitution (maisons closes, FKK, « bordels »),
salons de massage érotique, sex-shops sans espace de rencontre, soirées
itinérantes sans lieu fixe, lieux de drague en plein air (section à part du site).

**Qualification** :
1. Doublon ? `node scripts/find-club.mjs "<nom>"`, puis par ville, adresse et
   téléphone. Un lieu déjà dans la base sous un autre nom → rejeté
   (`"status": "rejected"`, `"duplicateOf": "<slug>"`), avec la preuve.
2. Existence et activité établies par la recherche de la Phase 1. Seul un
   lieu `ouvert` (ou `incertain` avec une activité de moins de 12 mois) est
   ajouté. Un lieu fermé, introuvable ou hors périmètre est rejeté, avec la raison.
3. Lieu retenu : écrire la fiche de base `data/clubs/new/<slug>.json`, le
   dossier `data/clubs/research/<slug>.md` (et son `.missing.json`), puis
   passer la file à `"status": "added", "slug": "<slug>"`.

**Fiche de base** (`data/clubs/new/<slug>.json`), slug = nom et ville en
minuscules sans accents, séparés par des tirets (`l-only-us-ales`) :

```json
{
  "id": "new-<slug>",
  "nom": "L'Only-US",
  "type": "club libertin",
  "types_normalises": ["Club", "Spa & Wellness"],
  "adresse": "1115 route d'Uzès",
  "code_postal": "30100",
  "ville": "Alès",
  "departement_code": "30",
  "departement_nom": "Gard",
  "region": "Occitanie",
  "pays": "France",
  "telephone": "",
  "email": "",
  "site_web": "https://lonlyus.com/",
  "equipements": [],
  "verification": { "status": "actif" },
  "addedAt": "AAAA-MM-JJ"
}
```

`departement_nom` et `region` : reprendre exactement les libellés donnés par
`node scripts/find-club.mjs --dept <code>`. `types_normalises` : parmi Club,
Sauna, Spa & Wellness, Restaurant, Bar, Hébergement, SM / Fétish, Gay friendly,
Cinéma, Discothèque. Coordonnées : uniquement celles publiées par le lieu
lui-même. Le lieu n'apparaît sur le site qu'avec sa fiche personnalisée publiée.

## Phase 3 — Vérification

Le vérificateur est un contradicteur : il part du principe que la fiche
contient des erreurs.

1. Rouvrir les sources des faits qui comptent : statut, tarifs, horaires,
   dates, chiffres, notes. Une source qui ne dit pas ce que la fiche lui fait
   dire → corriger ou supprimer.
2. Chaque phrase factuelle doit correspondre à un fait du dossier et à une
   source. Sinon : supprimer, ou requalifier en `a_verifier` avec la réserve écrite.
3. Le statut respecte les règles de décision ci-dessus.
4. Pas de copie (comparer aux sources), pas de formule interdite, pas de
   phrase interchangeable avec une autre fiche.
5. Les liens internes existent (validateur), les requêtes GSC principales sont servies.
   Les trois liens partenaires sont présents, utiles à l'endroit où ils sont,
   et ce qu'ils affirment des partenaires est conforme à nos avis.
6. `node scripts/build-club-profiles.mjs --check …` et
   `node scripts/audit-club-profiles.mjs <slug>` sans erreur ni alerte.
7. En toute fin, enregistrer le verdict (c'est ce qui autorise la publication) :
   `node scripts/mark-verified.mjs <slug> --scores '{"exactitude":…,"specificite":…,"profondeur":…,"requetes":…,"utilite":…,"honnetete":…}' --publishable true|false`.
   Toute modification ultérieure du brouillon annule ce verdict.

## Grille de qualité (audit par lot)

Chaque fiche est notée de 1 à 5 sur :

| Critère | 5 = | 1 = |
|---|---|---|
| Exactitude | chaque fait vérifiable dans sa source | faits non sourcés ou faux |
| Spécificité | impossible à confondre avec un autre club | phrases interchangeables |
| Profondeur | toute la matière trouvée est exploitée | sources riches, fiche maigre |
| Requêtes | les requêtes GSC trouvent leur réponse | requêtes ignorées |
| Utilité | le visiteur sait s'il peut y aller, quand, pour combien | rien de pratique |
| Honnêteté | doutes et fermetures clairement signalés | incertitudes masquées |

Une fiche sous 4 de moyenne, ou sous 3 sur un critère, est reprise avant publication.
