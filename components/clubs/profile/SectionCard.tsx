/**
 * Section rédactionnelle d'une fiche club, en lecture progressive : titre,
 * réponse en une phrase et début du texte toujours visibles, la suite se
 * déplie à la demande. Le texte replié reste dans le HTML (balise
 * <details>), donc lu et indexé par les moteurs.
 */

import Image from 'next/image';
import type { ProfileBlock, ProfileSection } from '@/lib/types/club-profile';
import { RichText, parseTextWithFormatting } from '@/lib/utils/rich-text';
import Icon from './Icon';
import { ConfidenceTag } from './SkimBlocks';
import { countWords, readingMinutes } from './format';

const CALLOUT = {
  info: { className: 'bg-sky-500/10 ring-sky-500/25', icon: 'info' as const, iconClass: 'text-sky-300' },
  tip: { className: 'bg-emerald-500/10 ring-emerald-500/25', icon: 'sparkles' as const, iconClass: 'text-emerald-300' },
  warning: { className: 'bg-amber-500/10 ring-amber-500/25', icon: 'warning' as const, iconClass: 'text-amber-300' },
};

function Block({ block }: { block: ProfileBlock }) {
  switch (block.kind) {
    case 'text':
      return <RichText body={block.body} className="text-[15px] sm:text-base [&_p]:leading-7 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-2" />;
    case 'list':
      return (
        <div className="mb-4">
          {block.title && <h3 className="text-text-primary font-semibold mb-2">{block.title}</h3>}
          <ul className="space-y-2">
            {block.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-text-secondary">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-accent-primary flex-shrink-0" />
                <span>{parseTextWithFormatting(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'table':
      return (
        <div className="mb-4 -mx-1 overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-0 rounded-xl ring-1 ring-border overflow-hidden">
            {block.caption && <caption className="caption-bottom text-left text-text-muted text-xs pt-2">{block.caption}</caption>}
            <thead className="bg-white/5">
              <tr>
                {block.headers.map((h) => (
                  <th key={h} className="text-left text-text-primary font-semibold px-3 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="even:bg-white/[0.02]">
                  {row.map((cell, j) => (
                    <td key={j} className={`px-3 py-2.5 align-top border-t border-border ${j === 0 ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                      {parseTextWithFormatting(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'callout': {
      const c = CALLOUT[block.tone];
      return (
        <div className={`mb-4 flex gap-3 p-4 rounded-xl ring-1 ring-inset ${c.className}`}>
          <Icon name={c.icon} className={`w-5 h-5 flex-shrink-0 mt-0.5 ${c.iconClass}`} />
          <div className="min-w-0">
            {block.title && <p className="text-text-primary font-semibold mb-1">{block.title}</p>}
            <RichText body={block.body} className="text-[15px] [&_p:last-child]:mb-0 [&_p]:leading-relaxed" />
          </div>
        </div>
      );
    }
    case 'timeline':
      return (
        <ol className="mb-4 relative border-l border-accent-primary/30 ml-1.5 space-y-5">
          {block.items.map((item, i) => (
            <li key={i} className="pl-5 relative">
              <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent-primary ring-4 ring-bg-secondary" />
              <p className="text-accent-primary text-sm font-semibold">{item.date}</p>
              <p className="text-[15px] leading-relaxed text-text-secondary">{parseTextWithFormatting(item.text)}</p>
            </li>
          ))}
        </ol>
      );
  }
}

/** Découpe les blocs de texte en paragraphes pour pouvoir replier au bon endroit. */
function units(blocks: ProfileBlock[]): ProfileBlock[] {
  return blocks.flatMap((b): ProfileBlock[] =>
    b.kind === 'text' ? b.body.split('\n\n').filter(Boolean).map((body) => ({ kind: 'text', body })) : [b]);
}

function blockWords(b: ProfileBlock): number {
  switch (b.kind) {
    case 'text':
    case 'callout':
      return countWords(b.body);
    case 'list':
      return countWords(b.items.join(' '));
    case 'table':
      return countWords(b.rows.flat().join(' '));
    case 'timeline':
      return countWords(b.items.map((x) => x.text).join(' '));
  }
}

/** Au-delà de ce volume, la suite de la section est repliée. */
const VISIBLE_WORDS = 45;

export default function SectionCard({ section, sourceIndex, image, imageLabel }: {
  section: ProfileSection;
  sourceIndex: Map<string, number>;
  /** Illustration d'ambiance en bandeau (jamais une photo du lieu). */
  image?: string | null;
  imageLabel?: string;
}) {
  const parts = units(section.blocks);
  const total = parts.reduce((n, b) => n + blockWords(b), 0);

  // On montre au moins un bloc, puis on replie si le reste est conséquent.
  let cut = parts.length;
  if (total > VISIBLE_WORDS * 1.6) {
    let seen = 0;
    cut = 0;
    // Seul du texte s'ajoute au premier bloc : un tableau ou une liste passe dans la partie repliée.
    while (cut < parts.length && (cut === 0 || (seen < VISIBLE_WORDS && parts[cut].kind === 'text'))) seen += blockWords(parts[cut++]);
  }
  const visible = parts.slice(0, cut);
  const hidden = parts.slice(cut);
  const hiddenWords = hidden.reduce((n, b) => n + blockWords(b), 0);

  const nums = section.sources.map((id) => sourceIndex.get(id)).filter((n): n is number => !!n).sort((a, b) => a - b);

  return (
    <section id={section.id} className="scroll-mt-32 rounded-2xl bg-bg-secondary ring-1 ring-border p-5 sm:p-6">
      {image && (
        <div className="relative -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 mb-5 h-36 sm:h-48 overflow-hidden rounded-t-2xl">
          <Image src={image} alt="" fill sizes="(max-width: 1024px) 100vw, 820px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-bg-secondary/20 to-transparent" />
          <span className="absolute top-2.5 right-3 px-2 py-0.5 rounded-full bg-black/40 text-[10px] text-white/70">Illustration{imageLabel ? ` · ${imageLabel}` : ''}</span>
        </div>
      )}
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="w-10 h-10 flex-shrink-0 rounded-xl bg-accent-primary/10 text-accent-primary grid place-items-center">
          <Icon name={section.icon || 'info'} className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold leading-snug text-text-primary">
            {section.title}
            <ConfidenceTag value={section.confidence} />
          </h2>
          {section.summary && <p className="mt-1.5 text-[15px] leading-relaxed text-text-primary/80">{parseTextWithFormatting(section.summary)}</p>}
        </div>
      </div>

      <div className="mt-4 sm:pl-14">
        {visible.map((b, i) => <Block key={i} block={b} />)}

        {hidden.length > 0 && (
          <details className="group">
            <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer inline-flex items-center gap-1.5 text-sm font-semibold text-accent-primary hover:text-accent-hover select-none">
              <span className="group-open:hidden">Lire la suite · {readingMinutes(hiddenWords)} min</span>
              <span className="hidden group-open:inline">Réduire</span>
              <Icon name="chevron" className="w-4 h-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-4">
              {hidden.map((b, i) => <Block key={i} block={b} />)}
            </div>
          </details>
        )}

        {nums.length > 0 && (
          <p className="mt-3 text-xs text-text-muted">
            Sources{' '}
            {nums.map((n, i) => (
              <span key={n}>
                {i > 0 && ' '}
                <a href={`#source-${n}`} className="hover:text-accent-primary">[{n}]</a>
              </span>
            ))}
          </p>
        )}
      </div>
    </section>
  );
}
