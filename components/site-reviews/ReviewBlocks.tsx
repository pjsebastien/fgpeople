/**
 * Rendu du corps d'un avis.
 *
 * Le contenu est une liste ordonnée de blocs : c'est ce qui permet de poser
 * une capture d'écran, une vidéo ou le tableau des tarifs exactement là où le
 * lecteur en a besoin, au lieu de tout empiler en fin d'article.
 */

import { RichText } from '@/lib/utils/rich-text';
import CloudImage from './CloudImage';
import YouTubeEmbed from './YouTubeEmbed';
import AffiliateButton from './AffiliateButton';
import PricingTable from './PricingTable';
import ProsCons from './ProsCons';
import { ScoreBreakdown } from './Scores';
import { cloudinaryVideoPoster } from '@/lib/utils/cloudinary';
import { siteReviewTarget } from '@/lib/data/site-reviews';
import AffiliateMediaLink from './AffiliateMediaLink';
import type { ReviewBlock, SiteReview, TocEntry } from '@/lib/types/site-review';

/** Sommaire : uniquement les blocs qui portent à la fois un id et un titre. */
export function buildToc(blocks: ReviewBlock[]): TocEntry[] {
  return blocks
    .filter((b): b is ReviewBlock & { id: string; heading: string } =>
      Boolean(b.id && b.heading)
    )
    .map((b) => ({ id: b.id, label: b.heading }));
}

const CALLOUT_STYLES = {
  tip: { box: 'bg-green-500/5 border-green-500/25', title: 'text-green-400', icon: '💡' },
  warning: { box: 'bg-orange-500/10 border-orange-500/30', title: 'text-orange-400', icon: '⚠' },
  info: { box: 'bg-blue-500/5 border-blue-500/25', title: 'text-blue-300', icon: 'ℹ' },
};

export default function ReviewBlocks({ review }: { review: SiteReview }) {
  return (
    <>
      {review.blocks.map((block, i) => (
        <Block key={block.id || i} block={block} review={review} />
      ))}
    </>
  );
}

function Block({ block, review }: { block: ReviewBlock; review: SiteReview }) {
  // scroll-mt-24 : compense le header collant quand on arrive par une ancre
  const wrapperProps = {
    id: block.id,
    className: 'mb-10 scroll-mt-24',
  };

  const Heading = block.heading ? (
    <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-5">{block.heading}</h2>
  ) : null;

  switch (block.type) {
    case 'text':
      return (
        <section {...wrapperProps}>
          {Heading}
          <RichText body={block.body} />
        </section>
      );

    case 'screenshot': {
      const img = (
        <CloudImage
          media={block.media}
          className="w-full rounded-xl border border-border"
          sizes="(max-width: 1024px) 100vw, 720px"
        />
      );
      return (
        <section {...wrapperProps}>
          {Heading}
          {block.body && <RichText body={block.body} />}
          <figure className="mt-4">
            {block.clickable ? (
              <AffiliateMediaLink
                href={review.affiliateUrl}
                target={siteReviewTarget(review)}
                block={`avis-capture-${block.id || 'sans-id'}`}
                label={`Voir sur ${review.siteName} →`}
              >
                {img}
              </AffiliateMediaLink>
            ) : (
              img
            )}
            {block.caption && (
              <figcaption className="text-text-muted text-sm mt-2.5 text-center italic">
                {block.caption}
              </figcaption>
            )}
          </figure>
        </section>
      );
    }

    case 'gallery':
      return (
        <section {...wrapperProps}>
          {Heading}
          {block.body && <RichText body={block.body} />}
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {block.items.map((item, i) => {
              const img = (
                <CloudImage
                  media={item}
                  className="w-full rounded-xl border border-border"
                  sizes="(max-width: 640px) 100vw, 360px"
                />
              );
              return (
                <figure key={i}>
                  {block.clickable ? (
                    <AffiliateMediaLink
                      href={review.affiliateUrl}
                      target={siteReviewTarget(review)}
                      block={`avis-galerie-${block.id || 'sans-id'}`}
                      label={`Voir sur ${review.siteName} →`}
                    >
                      {img}
                    </AffiliateMediaLink>
                  ) : (
                    img
                  )}
                  {item.caption && (
                    <figcaption className="text-text-muted text-xs mt-2 text-center italic">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        </section>
      );

    case 'youtube':
      return (
        <section {...wrapperProps}>
          {Heading}
          {block.body && <RichText body={block.body} />}
          <figure className="mt-4">
            <YouTubeEmbed videoId={block.videoId} title={block.title} />
            {block.caption && (
              <figcaption className="text-text-muted text-sm mt-2.5 text-center italic">
                {block.caption}
              </figcaption>
            )}
          </figure>
        </section>
      );

    case 'video':
      return (
        <section {...wrapperProps}>
          {Heading}
          {block.body && <RichText body={block.body} />}
          <figure className="mt-4">
            <video
              src={block.src}
              poster={block.poster || cloudinaryVideoPoster(block.src)}
              controls
              muted
              loop
              playsInline
              preload="none"
              className="w-full rounded-xl border border-border"
            />
            {block.caption && (
              <figcaption className="text-text-muted text-sm mt-2.5 text-center italic">
                {block.caption}
              </figcaption>
            )}
          </figure>
        </section>
      );

    case 'callout': {
      const style = CALLOUT_STYLES[block.variant];
      return (
        <section {...wrapperProps}>
          <div className={`border rounded-xl p-5 ${style.box}`}>
            <h3 className={`font-bold mb-2 flex items-center gap-2 ${style.title}`}>
              <span aria-hidden="true">{style.icon}</span>
              {block.title}
            </h3>
            <RichText body={block.body} />
          </div>
        </section>
      );
    }

    case 'steps':
      return (
        <section {...wrapperProps}>
          {Heading}
          <ol className="space-y-6">
            {block.items.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-accent-primary/20 border border-accent-primary/40 text-accent-primary font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-text-primary font-semibold mb-1.5">{step.title}</h3>
                  <RichText body={step.body} />
                  {step.media && (
                    <CloudImage
                      media={step.media}
                      className="w-full rounded-lg border border-border mt-3"
                      sizes="(max-width: 1024px) 100vw, 640px"
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      );

    case 'pricing':
      return (
        <section {...wrapperProps}>
          {Heading}
          <PricingTable
            pricing={review.pricing}
            siteName={review.siteName}
            affiliateUrl={review.affiliateUrl}
            target={siteReviewTarget(review)}
          />
        </section>
      );

    case 'proscons':
      return (
        <section {...wrapperProps}>
          {Heading}
          <ProsCons pros={review.pros} cons={review.cons} />
        </section>
      );

    case 'scores':
      return (
        <section {...wrapperProps}>
          {Heading}
          <div className="bg-bg-secondary border border-border rounded-xl p-6">
            <ScoreBreakdown scores={review.scores} />
          </div>
        </section>
      );

    case 'cta':
      return (
        <section {...wrapperProps}>
          <div className="bg-gradient-to-r from-accent-primary/15 to-accent-hover/10 border border-accent-primary/30 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-2">{block.title}</h3>
            {block.body && <p className="text-text-secondary mb-5 max-w-xl mx-auto">{block.body}</p>}
            <AffiliateButton
              href={review.affiliateUrl}
              target={siteReviewTarget(review)}
              block="avis-milieu"
              size="lg"
            >
              {block.label || `Découvrir ${review.siteName}`}
            </AffiliateButton>
          </div>
        </section>
      );

    case 'quote':
      return (
        <section {...wrapperProps}>
          {Heading}
          <blockquote className="border-l-4 border-accent-primary/50 pl-5 py-1">
            <p className="text-text-secondary italic leading-relaxed">« {block.text} »</p>
            {(block.author || block.source) && (
              <footer className="text-text-muted text-sm mt-2">
                {block.author}
                {block.source && <cite className="not-italic">, {block.source}</cite>}
              </footer>
            )}
          </blockquote>
        </section>
      );

    case 'table':
      return (
        <section {...wrapperProps}>
          {Heading}
          {block.body && <RichText body={block.body} />}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mt-4">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  {block.columns.map((col, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="text-left py-3 pr-4 text-text-muted text-xs font-medium uppercase tracking-wide"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`py-3 pr-4 ${j === 0 ? 'text-text-primary font-medium' : 'text-text-secondary'}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
  }
}
