# Travail de nuit — fiches clubs

Consigne de l'éditeur (2026-10-19) : travailler **tous les jours entre 20 h et
4 h** (heure locale), relancer automatiquement quand la limite d'utilisation
est atteinte, publier **par paquets de 20 fiches** (commit + push sur main),
et créer au fur et à mesure les fiches des lieux absents de la base : le site
ne doit manquer aucun club. Fiches sans trafic Search Console : recherche
allégée. Une fois les clubs terminés, passer aux autres pages du site.

Standard rédactionnel : `data/clubs/PLAYBOOK.md`. Tout l'état vit dans les
fichiers ; ne jamais relancer un ancien workflow avec `resumeFromRunId` (la
reprise rejoue les agents dans le désordre et écrase des fiches vérifiées).

## Déclencheurs (CronCreate, session VS Code)

- `13 20-23,0-3 * * *` : « Travail de nuit fiches clubs : suis data/clubs/NIGHTLY.md »
- `7 4 * * *` : « Clôture du travail de nuit fiches clubs : suis data/clubs/NIGHTLY.md, section Clôture »

Les tâches CronCreate expirent au bout de 7 jours : à chaque déclenchement,
`CronList` ; s'il reste moins de 2 jours, les recréer à l'identique.

## À chaque déclenchement horaire

1. **Fenêtre** : hors de 20 h – 4 h, ne rien faire.
2. **Lots en cours** : lire `data/clubs/night-state.json`
   (`{"running": [{"taskId", "kind", "items": [...], "startedAt"}]}`). Une entrée
   de plus de 4 h est périmée : `TaskStop` sur son taskId, puis la retirer.
3. **Publier** (voir ci-dessous) si 20 fiches sont prêtes.
4. **Lancer** si l'heure est avant 1 h 30 et que moins de 2 lots tournent (entre 1 h 30 et 2 h 45, seulement un petit lot de 8 éléments au plus, qui finit avant 4 h) :
   - `node scripts/collect-candidates.mjs` (nouveaux lieux repérés) ;
   - `node scripts/club-queue.mjs --next 15` → si non vide, `Workflow` avec
     `scriptPath: scripts/workflows/fiches-clubs.workflow.js` et
     `args: {"items": <sortie>, "today": "<AAAA-MM-JJ>", "gold": [3 à 5 slugs de data/clubs/profiles/, variés, ouverts et fermés]}` ;
   - si moins de 5 nouveaux lieux sont à qualifier (`--summary`) et qu'aucun
     balayage ne tourne : `node scripts/discovery-next.mjs 8` →
     `Workflow` avec `scripts/workflows/decouverte-clubs.workflow.js`,
     `args: {"departements": <sortie>, "today": …}` ;
   - noter chaque lancement dans `night-state.json` (taskId, kind
     `fiches` ou `decouverte`, slugs/clés ou codes de département, heure).
5. Si la limite d'utilisation est atteinte, les lots s'arrêtent d'eux-mêmes :
   rien n'est perdu, le déclenchement suivant relance.

## À la fin d'un lot (notification de workflow)

- Le retirer de `night-state.json`.
- Lot `decouverte` : `node scripts/discovery-next.mjs --done <codes balayés>`, puis
  `node scripts/collect-candidates.mjs`.
- Lot `fiches` : lire `done[].duplicates`. Un doublon prouvé (même lieu,
  ancien nom ou double saisie) → ajouter à `data/clubs/merged.json` (`from` =
  la fiche la moins visible dans `data/clubs/priority.json`, `to` = l'autre, `reason` avec la preuve, `date`).
  Une succession d'établissements différents au même local n'est PAS un doublon.
  Lire `audit.drift` et `audit.suggestions` : une dérive confirmée sur
  plusieurs lots → amender le playbook.
- Publier si 20 fiches sont prêtes, puis relancer (étape 4) si la fenêtre le permet.

## Publier un paquet

1. `node scripts/club-queue.mjs --publishable` → prendre les 20 premiers.
2. `node scripts/audit-club-profiles.mjs <slugs>` : une alerte → renvoyer la
   fiche en reprise plutôt que de la publier.
3. `node scripts/promote-club-drafts.mjs <slugs>` (refuse toute fiche non
   vérifiée dans son état actuel).
4. `node scripts/geocode-clubs.mjs` (carte des nouvelles fiches et des adresses
   corrigées), puis `npx next build` : en cas d'échec, ne rien pousser, corriger d'abord.
5. `git pull --rebase --autostash`, puis ajouter **uniquement**
   `data/clubs/profiles/`, `data/clubs/profiles.generated.json`,
   `data/clubs/new-clubs.generated.json`, `data/clubs/new/`,
   `data/clubs/merged.json`, `data/clubs/geo.json` (et tout script ou composant modifié pour le
   chantier), commit en français décrivant les fiches publiées (clubs ouverts
   et fermés, nouveaux lieux ajoutés), `git push`.
6. Ajouter une ligne à `data/clubs/night-log.md` : date, slugs publiés, commit.

## Clôture (4 h 07)

- `TaskStop` sur les lots encore en cours, vider `night-state.json`.
- Publier les paquets complets de 20 ; un reliquat d'au moins 10 fiches
  prêtes est publié aussi.
- Ajouter le bilan de la nuit à `data/clubs/night-log.md` :
  `node scripts/club-queue.mjs --summary`, fiches publiées, nouveaux lieux,
  doublons fusionnés, problèmes rencontrés.

## Quand la file des clubs est vide

Tous les clubs publiés (ou bloqués / en attente), plus aucun lieu à
qualifier et tous les départements balayés depuis moins de 90 jours :
passer aux autres pages du site (pages ville, département, région et type,
qui peuvent désormais s'appuyer sur les fiches vérifiées). Concevoir cette
phase avant de la lancer, en suivant la même exigence.

## Recherche complémentaire (dossiers faits sans recherche web)

Le 16/10/2026, le quota WebSearch a été épuisé par 4 lots en parallèle : 63
dossiers ont été faits sans recherche web. `club-queue.mjs` les remet en
étape `complement` (brouillons) ; `mark-verified.mjs` refuse de les déclarer
publiables tant que le dossier n'a pas sa section « ## Recherche
complémentaire ». Les fiches déjà publiées concernées
(`node scripts/club-queue.mjs --published-complement`) passent dans le même
workflow avec `"from": "complement-published"`, puis sont recommitées.

Quota de recherche : ne jamais faire tourner plus de 2 lots à la fois.
