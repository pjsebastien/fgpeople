# Système d'avis utilisateurs — Setup

Ce système permet aux visiteurs de laisser un avis (note 1-5 + commentaire) sur chaque lieu, de manière anonyme, avec modération avant publication. 100 % serverless (Supabase + Resend), aucune VM à maintenir.

## Architecture

| Élément | Service | Coût |
|---|---|---|
| Front + Server Actions | Vercel | gratuit |
| Base de données (avis) | Supabase Postgres | gratuit jusqu'à ~500 Mo |
| Notifications email | Resend | gratuit jusqu'à 100/jour |

## Étapes d'installation

### 1. Créer le projet Supabase

1. Va sur [supabase.com](https://supabase.com) → **New project**
2. Choisis une région proche (ex : `eu-west-3` Paris)
3. Note le mot de passe de la base (tu n'en auras pas besoin pour ce projet, juste pour info)
4. Une fois le projet créé, ouvre **SQL Editor** → **New query**
5. Colle le contenu de [`scripts/supabase-reviews-schema.sql`](./supabase-reviews-schema.sql) et clique **Run**
6. **Migration** (étend les avis aux clubs + critères structurés) : ouvre une nouvelle query, colle [`scripts/supabase-reviews-add-entity-type.sql`](./supabase-reviews-add-entity-type.sql) et clique **Run**
7. Vérifie dans **Table Editor** que la table `reviews` est bien créée et qu'elle contient les colonnes `entity_type` et `tags`

### 2. Récupérer les clés Supabase

Dans ton projet Supabase :

- **Settings → API**
- Copie :
  - `Project URL` → `SUPABASE_URL`
  - `service_role` key (secret, ne jamais exposer côté client) → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configurer Resend (email de modération)

1. Crée un compte sur [resend.com](https://resend.com) (gratuit)
2. **API Keys** → **Create API Key** → copie la clé → `RESEND_API_KEY`
3. (Optionnel mais recommandé) **Domains** → ajoute `fgpeople.com` et configure les DNS pour pouvoir envoyer depuis `avis@fgpeople.com`. Sinon, tu peux utiliser `onboarding@resend.dev` comme expéditeur de test (mais les emails iront probablement en spam).

### 4. Variables d'environnement Vercel

Dans **Vercel → Settings → Environment Variables**, ajoute :

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_USER=admin
ADMIN_PASSWORD=<mot-de-passe-long-aléatoire>
ADMIN_EMAIL=souslesetoiles974@gmail.com
RESEND_API_KEY=re_xxxxx
RESEND_FROM=avis@fgpeople.com
REVIEW_IP_SALT=<chaîne-aléatoire-32+-caractères>
```

> **Important** :
> - `SUPABASE_SERVICE_ROLE_KEY` ne doit JAMAIS être préfixé par `NEXT_PUBLIC_`. Cette clé bypass les RLS.
> - `REVIEW_IP_SALT` doit être un secret stable — change-le invaliderait tous les rate-limits en cours, ce n'est pas grave mais à savoir.

### 5. Redeploy

Pousse un commit, ou clique **Redeploy** dans Vercel. Le système est actif.

## Utilisation

### Côté visiteur

1. Sur n'importe quelle page **ville** ou **département** lieu-de-drague, chaque carte de lieu affiche :
   - Sa note moyenne + nombre d'avis (visible même quand la carte est repliée)
   - La liste des avis approuvés (rendue côté serveur, indexable Google)
   - Un bouton **"Laisser un avis"** qui ouvre le formulaire
2. Le visiteur peut choisir un pseudo (optionnel) ou rester anonyme.
3. À la soumission : l'avis est en statut `pending` et un email de notification est envoyé à `ADMIN_EMAIL`.

### Côté modérateur

1. Va sur `https://www.fgpeople.com/admin/avis`
2. Le navigateur demande tes identifiants (`ADMIN_USER` / `ADMIN_PASSWORD`)
3. Tu vois 3 sections : **En attente**, **Approuvés récents**, **Rejetés**
4. Pour chaque avis, 3 actions : **Approuver**, **Rejeter**, **Supprimer**
5. À l'approbation, la page ville correspondante est revalidée automatiquement (cache invalidé) et l'avis apparaît publiquement en quelques secondes

## Sécurité & anti-spam

| Couche | Mécanisme |
|---|---|
| Bot basique | Honeypot (champ caché qui doit rester vide) |
| Soumission instantanée | Délai mini de 3 secondes entre chargement et envoi du formulaire |
| Spam IP | Max 1 avis par IP par lieu / 24h, max 5 avis par IP / 24h, tous lieux confondus |
| Trop de liens | Refus si plus d'1 lien dans le commentaire |
| Pseudo anonyme | Aucun email, aucun compte requis |
| IP traçable | Stockée en hash SHA-256 salé (impossible à reverser) |
| Modération | Rien n'est publié sans approbation manuelle |
| RLS Supabase | Table inaccessible depuis le navigateur, seul le serveur peut lire/écrire |

## SEO

- Les avis sont rendus dans le HTML initial (server components) → lisibles par Googlebot sans JS
- `AggregateRating` ajouté au schema.org `Place` dans le JSON-LD existant (`DraguePlaceListJsonLd`)
- Microdata `itemprop="aggregateRating"` aussi ajouté en HTML autour de la note
- Chaque avis individuel est balisé `Review` / `Rating` / `Person` (microdata)
- ISR `revalidate: 300` + `revalidatePath` à la modération → fraîcheur sans rebuild complet

## Diagnostic

| Symptôme | Solution |
|---|---|
| `/admin/avis` retourne 503 | `ADMIN_PASSWORD` non défini dans Vercel |
| `/admin/avis` affiche "Système d'avis non configuré" | `SUPABASE_URL` ou `SUPABASE_SERVICE_ROLE_KEY` manquant |
| Le formulaire répond "Erreur de soumission" tout de suite | Honeypot rempli (probablement bot) ou submit < 3s |
| L'email de notif n'arrive pas | Vérifie `RESEND_API_KEY` + `RESEND_FROM` (domaine validé dans Resend) |
| L'avis approuvé n'apparaît pas immédiatement | Hard-refresh la page, ou attends 30s — la revalidation est asynchrone sur Vercel |
| `tsc` erreurs après modif | `npx tsc --noEmit` doit retourner exit 0 |

## Changements de niveaux

Pour changer la limite anti-spam, édite `lib/utils/review-validation.ts` → `REVIEW_LIMITS`.
