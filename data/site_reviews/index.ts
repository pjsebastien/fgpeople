/**
 * Registre des avis sur les sites de rencontre libertins.
 *
 * Chaque avis vit dans son propre fichier et est rédigé à partir du brief
 * saisi dans /admin/sites (récupéré via `npm run brief:pull <slug>`).
 *
 * Pour ajouter un site : créer ./<slug>.ts puis l'ajouter au tableau.
 */

import type { SiteReview } from '@/lib/types/site-review';
import { gleese } from './gleese';
import { wyylde } from './wyylde';

export const siteReviews: SiteReview[] = [gleese, wyylde];
