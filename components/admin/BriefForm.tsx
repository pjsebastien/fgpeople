'use client';

/**
 * Formulaire de brief — la matière première que je transforme en avis rédigé.
 * Tout est optionnel sauf le nom du site : ce qui manque, je le complète en
 * recherchant, ce que tu remplis fait autorité sur ce que je trouve.
 */

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveBriefAction, deleteBriefAction } from '@/app/actions/briefs';
import { BRIEF_STATUS_LABELS, type SiteBrief, type BriefStatus } from '@/lib/types/brief';

interface BriefFormProps {
  brief: SiteBrief | null;
}

const STATUSES: BriefStatus[] = ['draft', 'ready', 'generated', 'published'];

export default function BriefForm({ brief }: BriefFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = await saveBriefAction(formData);
      if (!res.ok) {
        setError(res.error || 'Erreur');
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      // Création : on bascule sur l'URL définitive pour débloquer les uploads
      if (!brief && res.data?.slug) router.replace(`/admin/sites/${res.data.slug}`);
      else router.refresh();
    });
  }

  function remove() {
    if (!brief) return;
    if (!window.confirm(`Supprimer le brief « ${brief.site_name} » et tous ses médias ?`)) return;
    startTransition(async () => {
      const res = await deleteBriefAction(brief.id);
      if (res.ok) router.push('/admin/sites');
      else setError(res.error || 'Erreur');
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {brief && <input type="hidden" name="id" value={brief.id} />}

      {/* Identité */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nom du site" required hint="Ex : Wyylde">
          <input
            name="site_name"
            defaultValue={brief?.site_name || ''}
            required
            className={inputClass}
            placeholder="Wyylde"
          />
        </Field>
        <Field label="Slug de la page" hint="Laisse vide pour le déduire du nom">
          <input
            name="slug"
            defaultValue={brief?.slug || ''}
            className={inputClass}
            placeholder="avis-wyylde"
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
          />
        </Field>
        <Field label="URL officielle du site">
          <input
            name="site_url"
            type="url"
            defaultValue={brief?.site_url || ''}
            className={inputClass}
            placeholder="https://www.wyylde.com"
          />
        </Field>
        <Field label="Lien d'affiliation" hint="Tous les boutons de la page pointeront dessus">
          <input
            name="affiliate_url"
            type="url"
            defaultValue={brief?.affiliate_url || ''}
            className={inputClass}
            placeholder="https://k.related-dating.com/?abc=..."
          />
        </Field>
        <Field label="Statut">
          <select name="status" defaultValue={brief?.status || 'draft'} className={inputClass}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {BRIEF_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Mots-clés SEO visés" hint="Séparés par des virgules">
          <input
            name="target_keywords"
            defaultValue={brief?.target_keywords || ''}
            className={inputClass}
            placeholder="avis wyylde, wyylde tarif, wyylde arnaque"
          />
        </Field>
      </div>

      {/* Matière rédactionnelle */}
      <Field
        label="Instructions personnelles"
        hint="L'angle, le ton, ce qu'il faut marteler, ce qu'il ne faut surtout pas dire"
      >
        <textarea
          name="instructions"
          defaultValue={brief?.instructions || ''}
          rows={4}
          className={inputClass}
          placeholder="Insister sur le fait que c'est le plus gros site FR. Ne pas cacher que c'est cher. Comparer à Place Libertine…"
        />
      </Field>

      <Field
        label="Ton expérience du site"
        hint="Ce que tu as vécu en le testant — c'est ce qui rend l'avis crédible"
      >
        <textarea
          name="personal_experience"
          defaultValue={brief?.personal_experience || ''}
          rows={4}
          className={inputClass}
          placeholder="Inscription en 3 min, j'ai reçu 12 messages la 1re semaine, beaucoup d'hommes seuls le soir…"
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Points forts constatés">
          <textarea
            name="pros_notes"
            defaultValue={brief?.pros_notes || ''}
            rows={4}
            className={inputClass}
            placeholder="Un par ligne"
          />
        </Field>
        <Field label="Points faibles constatés">
          <textarea
            name="cons_notes"
            defaultValue={brief?.cons_notes || ''}
            rows={4}
            className={inputClass}
            placeholder="Un par ligne"
          />
        </Field>
      </div>

      <Field label="Tarifs relevés" hint="Formules, prix, engagement, essai gratuit, reconduction">
        <textarea
          name="pricing_notes"
          defaultValue={brief?.pricing_notes || ''}
          rows={3}
          className={inputClass}
          placeholder="1 mois 22,90 € — 3 mois 14,97 €/mois — 12 mois 8,33 €/mois (99,90 € en une fois). Reconduction auto activée par défaut."
        />
      </Field>

      <Field label="Chiffres clés" hint="Membres, trafic, ancienneté, ratio H/F…">
        <textarea
          name="key_facts"
          defaultValue={brief?.key_facts || ''}
          rows={3}
          className={inputClass}
          placeholder="7 M de membres, 700 K visites/jour, en ligne depuis 2001…"
        />
      </Field>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 bg-accent-primary text-bg-primary font-semibold rounded-lg hover:bg-accent-hover disabled:opacity-50"
        >
          {isPending ? 'Enregistrement…' : brief ? 'Enregistrer' : 'Créer le brief'}
        </button>
        {saved && <span className="text-green-400 text-sm">✓ Enregistré</span>}
        {error && <span className="text-red-400 text-sm">{error}</span>}
        {brief && (
          <button
            type="button"
            onClick={remove}
            disabled={isPending}
            className="ml-auto text-text-muted hover:text-red-400 text-sm disabled:opacity-40"
          >
            Supprimer ce brief
          </button>
        )}
      </div>
    </form>
  );
}

const inputClass =
  'w-full bg-bg-tertiary border border-border rounded px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none';

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-text-primary mb-1">
        {label}
        {required && <span className="text-accent-primary"> *</span>}
      </span>
      {hint && <span className="block text-xs text-text-muted mb-1.5">{hint}</span>}
      {children}
    </label>
  );
}
