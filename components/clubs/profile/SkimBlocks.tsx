/**
 * Blocs de lecture rapide de la fiche club : ils répondent en quelques
 * secondes aux questions qui amènent les visiteurs (ouvert ? quand ?
 * combien ? qui peut entrer ?), avant tout texte suivi.
 */

import type { AudienceItem, ClubProfile, Confidence, GlanceItem } from '@/lib/types/club-profile';
import { parseTextWithFormatting } from '@/lib/utils/rich-text';
import Icon from './Icon';

export function ConfidenceTag({ value }: { value?: Confidence }) {
  if (value === 'a_verifier') {
    return <span className="ml-1.5 inline-block px-1.5 py-0.5 text-[10px] font-medium rounded bg-amber-500/15 text-amber-300 align-middle whitespace-nowrap">à vérifier</span>;
  }
  if (value === 'source_unique') {
    return <span className="ml-1.5 inline-block px-1.5 py-0.5 text-[10px] font-medium rounded bg-white/5 text-text-muted align-middle whitespace-nowrap">source unique</span>;
  }
  return null;
}

export function SectionHeading({ id, kicker, title }: { id?: string; kicker?: string; title: string }) {
  return (
    <div id={id} className="scroll-mt-32 mb-4">
      {kicker && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-primary mb-1">{kicker}</p>}
      <h2 className="text-xl sm:text-2xl font-bold text-text-primary">{title}</h2>
    </div>
  );
}

export function GlanceGrid({ items }: { items: GlanceItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map((g) => (
        <div key={g.label} className="rounded-2xl bg-bg-secondary ring-1 ring-border p-4 flex flex-col gap-3">
          <span className="w-9 h-9 rounded-xl bg-accent-primary/10 text-accent-primary grid place-items-center">
            <Icon name={g.icon} className="w-5 h-5" />
          </span>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">{g.label}</p>
            <p className="mt-0.5 text-[15px] font-semibold leading-snug text-text-primary">
              {g.value}
              <ConfidenceTag value={g.confidence} />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

const WHO: Record<AudienceItem['who'], { label: string; icon: 'couple' | 'woman' | 'user' | 'users' }> = {
  couples: { label: 'Couples', icon: 'couple' },
  femmes: { label: 'Femmes seules', icon: 'woman' },
  hommes: { label: 'Hommes seuls', icon: 'user' },
  trans: { label: 'Personnes trans', icon: 'users' },
};

const ADMISSION: Record<AudienceItem['status'], { label: string; icon: 'check' | 'x' | 'minus' | 'question'; className: string }> = {
  oui: { label: 'Admis', icon: 'check', className: 'text-emerald-300 bg-emerald-500/15' },
  selon: { label: 'Selon les soirs', icon: 'minus', className: 'text-amber-300 bg-amber-500/15' },
  non: { label: 'Non admis', icon: 'x', className: 'text-rose-300 bg-rose-500/15' },
  inconnu: { label: 'Non précisé', icon: 'question', className: 'text-text-muted bg-white/5' },
};

export function AudienceCards({ items, past }: { items: AudienceItem[]; past?: boolean }) {
  const order: AudienceItem['who'][] = ['couples', 'femmes', 'hommes', 'trans'];
  const sorted = [...items].sort((a, b) => order.indexOf(a.who) - order.indexOf(b.who));
  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${sorted.length === 3 ? 'xl:grid-cols-3' : ''}`}>
      {sorted.map((a) => {
        const who = WHO[a.who];
        const adm = ADMISSION[a.status];
        return (
          <div key={a.who} className="rounded-2xl bg-bg-secondary ring-1 ring-border p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 font-semibold text-text-primary">
                <Icon name={who.icon} className="w-5 h-5 text-text-secondary" />
                {who.label}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${adm.className}`}>
                <Icon name={adm.icon} className="w-3.5 h-3.5" />
                {past ? `${adm.label} (à l'époque)` : adm.label}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {/* Un vrai montant ressort en or ; une mention (« non affiché ») reste en texte courant. */}
              {a.price && (/\d/.test(a.price)
                ? <span className="mr-1.5 text-lg font-bold text-accent-primary">{a.price}</span>
                : <span className="mr-1 font-medium text-text-primary">{a.price} ·</span>)}
              {parseTextWithFormatting(a.detail)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function Highlights({ items, closed }: { items: string[]; closed?: boolean }) {
  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-br from-accent-primary/50 via-accent-primary/10 to-transparent">
      <div className="rounded-2xl bg-bg-secondary p-5 sm:p-6">
        <p className="flex items-center gap-2 font-semibold text-text-primary mb-4">
          <Icon name="sparkles" className="w-5 h-5 text-accent-primary" />
          {closed ? 'Ce qu\'il faut retenir' : 'À savoir avant d\'y aller'}
        </p>
        <ul className="space-y-3">
          {items.map((h, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-text-primary/90">
              <span className="mt-0.5 w-5 h-5 flex-shrink-0 rounded-full bg-accent-primary/15 text-accent-primary grid place-items-center text-[11px] font-bold">
                {i + 1}
              </span>
              <span>{parseTextWithFormatting(h)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Rows({ rows, highlightValue }: { rows: Record<string, string>; highlightValue?: boolean }) {
  return (
    <dl className="divide-y divide-border">
      {Object.entries(rows).map(([k, v]) => {
        const tone = /^ferm/i.test(v) ? 'text-rose-300' : highlightValue ? 'text-accent-primary' : 'text-text-primary';
        // Une valeur longue passe sous son libellé : sur mobile, deux colonnes étroites se lisent mal.
        return v.length > 28 ? (
          <div key={k} className="py-2.5">
            <dt className="text-xs font-medium uppercase tracking-wider text-text-muted first-letter:uppercase">{k}</dt>
            <dd className={`mt-1 text-sm font-medium leading-relaxed ${tone}`}>{v}</dd>
          </div>
        ) : (
          <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
            <dt className="text-sm text-text-secondary first-letter:uppercase">{k}</dt>
            <dd className={`text-right font-semibold ${highlightValue ? 'text-base' : 'text-sm'} ${tone}`}>{v}</dd>
          </div>
        );
      })}
    </dl>
  );
}

export function PracticalInfo({ profile }: { profile: ClubProfile }) {
  const { horaires, tarifs } = profile;
  return (
    <div className={`grid gap-3 ${horaires && tarifs ? 'md:grid-cols-2' : ''}`}>
      {horaires && (
        <div className="rounded-2xl bg-bg-secondary ring-1 ring-border p-5">
          <p className="flex items-center gap-2 font-semibold text-text-primary mb-2">
            <Icon name="clock" className="w-5 h-5 text-accent-primary" /> Horaires
            <ConfidenceTag value={horaires.confidence} />
          </p>
          <Rows rows={horaires.rows} />
          {horaires.note && <p className="mt-3 text-xs leading-relaxed text-text-muted">{parseTextWithFormatting(horaires.note)}</p>}
        </div>
      )}
      {tarifs && (
        <div className="rounded-2xl bg-bg-secondary ring-1 ring-border p-5">
          <p className="flex items-center gap-2 font-semibold text-text-primary mb-2">
            <Icon name="euro" className="w-5 h-5 text-accent-primary" /> Tarifs
            <ConfidenceTag value={tarifs.confidence} />
          </p>
          <Rows rows={tarifs.rows} highlightValue />
          {tarifs.note && <p className="mt-3 text-xs leading-relaxed text-text-muted">{parseTextWithFormatting(tarifs.note)}</p>}
        </div>
      )}
    </div>
  );
}

export function ClosedNotice({ profile }: { profile: ClubProfile }) {
  const sure = profile.status.value === 'ferme';
  return (
    <div className="rounded-2xl ring-1 ring-rose-500/30 bg-gradient-to-br from-rose-500/15 to-rose-500/5 p-5 sm:p-6">
      <p className="flex items-center gap-2 text-rose-300 font-semibold">
        <Icon name="closed" className="w-5 h-5" />
        {sure ? 'Ce club a fermé' : 'Ce club semble avoir fermé'}
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-text-primary/85">{parseTextWithFormatting(profile.status.summary)}</p>
    </div>
  );
}
