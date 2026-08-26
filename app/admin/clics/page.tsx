/**
 * Page admin — statistiques des clics sur les liens d'affiliation.
 *
 * Répond à la question qui compte : quel emplacement, sur quelle page,
 * déclenche réellement des clics — et lesquels ne servent à rien.
 *
 * Les agrégats sont calculés côté Postgres (fonction affiliate_click_report),
 * l'admin ne rapatrie qu'un objet JSON.
 */

import Link from 'next/link';
import { getClickReport, isClickTrackingEnabled, type ClickCount } from '@/lib/data/affiliate-clicks';
import { AFFILIATE_LABELS } from '@/lib/config/affiliates';

export const dynamic = 'force-dynamic';

const PERIODS = [
  { days: 7, label: '7 jours' },
  { days: 30, label: '30 jours' },
  { days: 90, label: '90 jours' },
  { days: 365, label: '1 an' },
];

/** Libellés lisibles des emplacements de CTA. */
const BLOCK_LABELS: Record<string, string> = {
  'floating-cta': 'Barre flottante (bas de page)',
  popup: 'Popup après 20 s',
  'bloc-libertin': 'Bloc libertin (villes, clubs…)',
  'bloc-gay': 'Bloc gay (lieux de drague)',
  'avis-entete': 'Avis — en-tête',
  'avis-milieu': 'Avis — CTA intercalé',
  'avis-tarifs': 'Avis — sous le tableau des tarifs',
  'avis-verdict': 'Avis — verdict final',
  'avis-colonne': 'Avis — colonne de droite',
  'avis-alternative': 'Avis — alternatives',
  'comparatif-tableau': 'Comparatif — tableau',
  'comparatif-fiche': 'Comparatif — fiche détaillée',
};

function blockLabel(key: string): string {
  return BLOCK_LABELS[key] || key;
}

function targetLabel(key: string): string {
  return AFFILIATE_LABELS[key] || key;
}

export default async function AdminClicsPage({
  searchParams,
}: {
  searchParams: Promise<{ j?: string }>;
}) {
  const { j } = await searchParams;
  const days = PERIODS.some((p) => String(p.days) === j) ? Number(j) : 30;

  if (!isClickTrackingEnabled()) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <p className="text-yellow-300 font-semibold mb-1">Supabase non configuré</p>
        <p className="text-text-secondary text-sm">
          Définis <code>SUPABASE_URL</code> et <code>SUPABASE_SERVICE_ROLE_KEY</code>, puis exécute{' '}
          <code>scripts/supabase-affiliate-clicks-schema.sql</code> dans le SQL Editor Supabase.
        </p>
      </div>
    );
  }

  const report = await getClickReport(days);
  const maxDay = Math.max(1, ...report.by_day.map((d) => d.clicks));

  return (
    <>
      <header className="mb-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Clics sur les liens partenaires</h1>
            <p className="text-text-secondary text-sm">
              {report.total.toLocaleString('fr-FR')} clic{report.total > 1 ? 's' : ''} sur les{' '}
              {days === 365 ? '12 derniers mois' : `${days} derniers jours`}
            </p>
          </div>
          <nav className="flex gap-1.5">
            {PERIODS.map((p) => (
              <Link
                key={p.days}
                href={`/admin/clics?j=${p.days}`}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  p.days === days
                    ? 'bg-accent-primary text-bg-primary border-accent-primary font-semibold'
                    : 'bg-bg-secondary text-text-secondary border-border hover:border-accent-primary'
                }`}
              >
                {p.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {report.total === 0 ? (
        <div className="bg-bg-secondary border border-border rounded-xl p-8 text-center">
          <p className="text-text-secondary mb-2">Aucun clic enregistré sur cette période.</p>
          <p className="text-text-muted text-sm">
            Si le site est en ligne depuis peu, c&apos;est normal. Vérifie sinon que la table{' '}
            <code>affiliate_clicks</code> a bien été créée dans Supabase.
          </p>
        </div>
      ) : (
        <>
          {/* ============ PAR PARTENAIRE ============ */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-text-primary mb-4">Par partenaire</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {report.by_target.map((t) => (
                <div key={t.key} className="bg-bg-secondary border border-border rounded-xl p-4">
                  <p className="text-text-muted text-xs uppercase tracking-wide mb-1">
                    {targetLabel(t.key)}
                  </p>
                  <p className="text-text-primary text-2xl font-bold tabular-nums">
                    {t.clicks.toLocaleString('fr-FR')}
                  </p>
                  <p className="text-text-muted text-xs mt-1">
                    {((t.clicks / report.total) * 100).toFixed(1).replace('.', ',')} % du total
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ============ CLASSEMENT DES EMPLACEMENTS ============ */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-text-primary mb-1">Classement des emplacements</h2>
            <p className="text-text-secondary text-sm mb-4">
              Quel type de CTA déclenche les clics, tous emplacements confondus.
            </p>
            <Ranking rows={report.by_block} total={report.total} labelFn={blockLabel} />
          </section>

          {/* ============ CLASSEMENT DES PAGES ============ */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-text-primary mb-1">Classement des pages</h2>
            <p className="text-text-secondary text-sm mb-4">
              D&apos;où partent les clics. Les 50 premières pages.
            </p>
            <Ranking
              rows={report.by_page}
              total={report.total}
              labelFn={(k) => k}
              linkFn={(k) => k}
            />
          </section>

          {/* ============ DÉTAIL PAGE × EMPLACEMENT ============ */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-text-primary mb-1">Détail page × emplacement</h2>
            <p className="text-text-secondary text-sm mb-4">
              Le croisement des deux : quel bloc, sur quelle page précise.
            </p>
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <table className="w-full min-w-[560px] border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="text-left py-2.5 pr-4 text-text-muted text-xs font-medium uppercase tracking-wide w-10">
                      #
                    </th>
                    <th scope="col" className="text-left py-2.5 pr-4 text-text-muted text-xs font-medium uppercase tracking-wide">
                      Page
                    </th>
                    <th scope="col" className="text-left py-2.5 pr-4 text-text-muted text-xs font-medium uppercase tracking-wide">
                      Emplacement
                    </th>
                    <th scope="col" className="text-right py-2.5 text-text-muted text-xs font-medium uppercase tracking-wide">
                      Clics
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.by_page_block.map((row, i) => (
                    <tr key={`${row.page}-${row.block}`} className="border-b border-border last:border-0">
                      <td className="py-2.5 pr-4 text-text-muted text-sm tabular-nums">{i + 1}</td>
                      <td className="py-2.5 pr-4">
                        <a
                          href={row.page}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-primary hover:underline text-sm break-all"
                        >
                          {row.page}
                        </a>
                      </td>
                      <td className="py-2.5 pr-4 text-text-secondary text-sm">
                        {blockLabel(row.block)}
                      </td>
                      <td className="py-2.5 text-right text-text-primary font-semibold tabular-nums">
                        {row.clicks.toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ============ ÉVOLUTION ============ */}
          {report.by_day.length > 1 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-text-primary mb-4">Évolution quotidienne</h2>
              <div className="bg-bg-secondary border border-border rounded-xl p-5">
                <div className="flex items-end gap-1 h-32">
                  {report.by_day.map((d) => (
                    <div
                      key={d.key}
                      className="flex-1 bg-accent-primary/70 hover:bg-accent-primary rounded-t transition-colors min-w-[2px]"
                      style={{ height: `${Math.max(2, (d.clicks / maxDay) * 100)}%` }}
                      title={`${d.key} : ${d.clicks} clic${d.clicks > 1 ? 's' : ''}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-text-muted text-xs mt-2">
                  <span>{report.by_day[0]?.key}</span>
                  <span>{report.by_day[report.by_day.length - 1]?.key}</span>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <p className="text-text-muted text-xs mt-8 pt-4 border-t border-border leading-relaxed">
        Les clics sont comptés via <code>navigator.sendBeacon</code> au moment du clic. Le visiteur
        est envoyé directement chez le partenaire, sans redirection intermédiaire : c&apos;est ce
        qui garantit l&apos;attribution de la commission, au prix de quelques clics non comptés
        chez les visiteurs équipés d&apos;un bloqueur. Les chiffres sont donc un plancher, fiable
        pour comparer les emplacements entre eux.
      </p>
    </>
  );
}

/** Classement générique avec barre de proportion. */
function Ranking({
  rows,
  total,
  labelFn,
  linkFn,
}: {
  rows: ClickCount[];
  total: number;
  labelFn: (key: string) => string;
  linkFn?: (key: string) => string;
}) {
  if (rows.length === 0) {
    return <p className="text-text-muted text-sm italic">Aucune donnée.</p>;
  }
  const max = Math.max(1, ...rows.map((r) => r.clicks));

  return (
    <ol className="space-y-2">
      {rows.map((row, i) => {
        const href = linkFn?.(row.key);
        return (
          <li key={row.key} className="bg-bg-secondary border border-border rounded-lg p-3">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-text-muted text-sm tabular-nums w-6 shrink-0">{i + 1}.</span>
              <span className="flex-1 min-w-0 text-text-primary text-sm truncate">
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent-primary"
                  >
                    {labelFn(row.key)}
                  </a>
                ) : (
                  labelFn(row.key)
                )}
              </span>
              <span className="text-text-primary font-semibold tabular-nums shrink-0">
                {row.clicks.toLocaleString('fr-FR')}
              </span>
              <span className="text-text-muted text-xs tabular-nums w-14 text-right shrink-0">
                {((row.clicks / total) * 100).toFixed(1).replace('.', ',')} %
              </span>
            </div>
            <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-primary rounded-full"
                style={{ width: `${(row.clicks / max) * 100}%` }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
