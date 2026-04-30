/**
 * Critères structurés pour les avis (cases à cocher).
 *
 * Format de stockage : tableau de chaînes "categorie:valeur".
 * Ex : ['ambiance:festive', 'clientele:couples', 'age:30-45']
 */

export interface CriterionOption {
  value: string;
  label: string;
}

export interface CriterionCategory {
  /** Slug catégorie (utilisé comme préfixe dans les tags) */
  key: string;
  /** Libellé affiché */
  label: string;
  /** Description courte (placeholder) */
  hint?: string;
  /** Options disponibles */
  options: CriterionOption[];
  /** Si true, une seule option max par utilisateur (sinon multi-select) */
  singleSelect?: boolean;
}

export const CRITERIA: CriterionCategory[] = [
  {
    key: 'ambiance',
    label: 'Ambiance',
    options: [
      { value: 'calme', label: 'Calme' },
      { value: 'festive', label: 'Festive' },
      { value: 'selective', label: 'Sélective' },
    ],
    singleSelect: true,
  },
  {
    key: 'clientele',
    label: 'Type de clientèle',
    hint: 'Multi-sélection possible',
    options: [
      { value: 'couples', label: 'Couples' },
      { value: 'hommes-seuls', label: 'Hommes seuls' },
      { value: 'femmes-seules', label: 'Femmes seules' },
      { value: 'mixte', label: 'Mixte' },
    ],
  },
  {
    key: 'age',
    label: "Tranche d'âge dominante",
    options: [
      { value: '20-30', label: '20–30' },
      { value: '30-45', label: '30–45' },
      { value: '45+', label: '45+' },
    ],
    singleSelect: true,
  },
  {
    key: 'niveau',
    label: 'Niveau',
    options: [
      { value: 'debutant', label: 'Débutant' },
      { value: 'experimente', label: 'Expérimenté' },
    ],
    singleSelect: true,
  },
  {
    key: 'discretion',
    label: 'Discrétion',
    options: [
      { value: 'faible', label: 'Faible' },
      { value: 'moyenne', label: 'Moyenne' },
      { value: 'elevee', label: 'Élevée' },
    ],
    singleSelect: true,
  },
  {
    key: 'frequentation',
    label: 'Fréquentation',
    options: [
      { value: 'faible', label: 'Faible' },
      { value: 'moyenne', label: 'Moyenne' },
      { value: 'forte', label: 'Forte' },
    ],
    singleSelect: true,
  },
];

/** Set des paires "categorie:valeur" valides, pour la validation côté serveur. */
export const VALID_TAGS = new Set<string>(
  CRITERIA.flatMap((c) => c.options.map((o) => `${c.key}:${o.value}`))
);

export const CRITERIA_BY_KEY: Record<string, CriterionCategory> = Object.fromEntries(
  CRITERIA.map((c) => [c.key, c])
);

/** Filtre côté serveur : ne garde que les tags reconnus, déduplique, max 12. */
export function sanitizeTags(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const out = new Set<string>();
  for (const v of input) {
    if (typeof v !== 'string') continue;
    if (VALID_TAGS.has(v)) out.add(v);
    if (out.size >= 12) break;
  }
  return Array.from(out);
}

/** Extrait le label lisible d'un tag "categorie:valeur". */
export function getTagLabel(tag: string): { category: string; option: string } | null {
  const idx = tag.indexOf(':');
  if (idx === -1) return null;
  const key = tag.slice(0, idx);
  const value = tag.slice(idx + 1);
  const cat = CRITERIA_BY_KEY[key];
  if (!cat) return null;
  const opt = cat.options.find((o) => o.value === value);
  if (!opt) return null;
  return { category: cat.label, option: opt.label };
}
