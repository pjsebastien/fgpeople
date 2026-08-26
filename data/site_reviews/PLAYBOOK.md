# Playbook rédactionnel — Avis sur les sites de rencontre

Standard à respecter pour **chaque** avis publié dans `data/site_reviews/`.
Objectif : ne pas produire un avis de plus qui ressemble à tous les autres.

## Le positionnement

FG People n'est pas un site d'affiliation qui parle de sites de rencontre.
C'est **l'annuaire de référence des clubs libertins en France** (523 clubs, 762
lieux, 300+ villes) qui, accessoirement, teste les plateformes en ligne.

Cette asymétrie est notre seul avantage défendable et doit transparaître dans
chaque avis :

- on connaît le terrain réel, pas seulement les interfaces web ;
- on peut relier une soirée annoncée sur une plateforme au club qui l'organise ;
- on peut dire « dans ton département il y a 4 clubs, un abonnement à 99 € n'est
  peut-être pas la priorité » — aucun concurrent affilié ne dira jamais ça ;
- nos avis visiteurs sont réels et modérés, pas fabriqués.

## Avant d'écrire

1. `npm run brief:pull <slug>` — récupérer le brief et les assets.
2. **Analyser chaque capture** pour identifier ce qu'elle montre réellement
   (page tarifs, messagerie, recherche, certification…), même quand elle est
   annotée : l'annotation oriente, l'image fait foi.
3. **Rechercher la concurrence** sur les requêtes visées : lire les 3–5 pages
   qui se positionnent déjà. Relever :
   - ce qu'elles couvrent toutes (à couvrir aussi, sinon on paraît incomplet) ;
   - ce qu'aucune ne couvre (c'est là que se gagne la position) ;
   - la longueur, la structure, les CTA employés.
4. **Rechercher les faits** : tarifs à jour, ancienneté, société éditrice,
   note Trustpilot, nombre de membres annoncé vs réel, changements récents.
   Aucune affirmation chiffrée ne doit être inventée.

## Couverture des requêtes

La page doit répondre à **tout** ce que quelqu'un peut chercher sur ce site.
Traiter systématiquement, chacune dans un bloc identifiable :

- `avis <site>` — le test lui-même
- `<site> tarif` / `prix` / `abonnement` — tableau chiffré, pas du texte vague
- `<site> gratuit` — ce qui est réellement possible sans payer
- `<site> arnaque` / `fiable` / `avis négatifs` — traiter frontalement
- `<site> résilier` / `désabonner` / `reconduction` — la procédure exacte
- `<site> avis femme` / `homme seul` / `couple` — le rendement par profil
- `comment ça marche` / `s'inscrire` — le pas-à-pas
- `<site> vs <concurrent>` — la comparaison
- `<site> application` / `mobile`
- Le maillage : depuis l'avis vers les pages clubs, et inversement.

Les mots-clés secondaires s'intègrent dans les `heading` des blocs et dans les
questions de FAQ — jamais en bourrage.

## Rétention

Le temps passé sur la page est le levier SEO le plus sous-exploité par la
concurrence, qui empile des paragraphes. Ce qui retient :

- **Le verdict en haut**, sans scroll — on ne fait pas mendier l'information.
- **Un tableau de tarifs** plutôt qu'un paragraphe : on le scanne, on le relit.
- **Des captures légendées** placées au moment où la question se pose.
- **Des blocs `callout`** qui donnent une astuce actionnable (tester la densité
  locale avant de payer, couper la reconduction…).
- **Un pas-à-pas `steps`** : le lecteur suit en faisant.
- **La FAQ en `<details>`** : chaque ouverture est du temps gagné.
- **Les avis visiteurs** en bas : contenu frais, et raison de revenir.

## CTA

- Un CTA dans l'en-tête, un au milieu (`type: 'cta'`), un sous le tableau des
  tarifs, un dans le verdict final, un dans la colonne sticky.
- Toujours `rel="sponsored nofollow noopener"` — c'est géré par
  `AffiliateButton`, ne jamais poser un `<a>` d'affiliation à la main.
- Formuler l'action, pas l'injonction : « Voir combien de profils sont actifs
  près de chez vous » convertit mieux que « Inscrivez-vous ».
- Ne jamais promettre ce que le site ne tient pas : la déception fait rebondir.

## Honnêteté

C'est ce qui nous différencie et ce qui convertit le mieux sur la durée.

- Des `cons` réels et précis, pas des faux défauts décoratifs.
- Une note qui peut être médiocre. `editorScore` doit rester cohérent avec la
  moyenne des `scores` par critère.
- Citer les avis négatifs existants (Trustpilot…) et expliquer ce qu'ils valent.
- Le bloc de transparence sur l'affiliation reste en bas de page.

## Contrôles avant publication

- [ ] Plus aucun média `PLACEHOLDER`
- [ ] `affiliateUrl` renseigné et testé
- [ ] Chiffres datés (« relevé en <mois année> »)
- [ ] `editorScore` ≈ moyenne des `scores`
- [ ] 6 à 8 questions de FAQ couvrant les requêtes listées plus haut
- [ ] Au moins 3 liens internes vers l'annuaire de clubs
- [ ] `npx tsc --noEmit` puis `npx next build`
