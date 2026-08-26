/**
 * Rendu du markdown allégé utilisé dans les contenus rédactionnels.
 *
 * Extrait de components/blog/ArticlePage.tsx pour être partagé entre les
 * articles de blog et les avis sur les sites. Gère :
 *   **gras**, [lien](url), sous-titres "**Titre**\n…", listes "- ".
 */

import Link from 'next/link';

/** Transforme **gras** et [liens](url) en ReactNode. */
export function parseTextWithFormatting(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  const combinedRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*)/g;

  let lastIndex = 0;
  let match;
  let keyIndex = 0;

  while ((match = combinedRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      const linkText = match[2];
      const url = match[3];
      const isExternal = url.startsWith('http');

      if (isExternal) {
        result.push(
          <a
            key={`link-${keyIndex++}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary hover:text-accent-hover underline"
          >
            {linkText}
          </a>
        );
      } else {
        result.push(
          <Link
            key={`link-${keyIndex++}`}
            href={url}
            className="text-accent-primary hover:text-accent-hover underline"
          >
            {linkText}
          </Link>
        );
      }
    } else if (match[4]) {
      result.push(
        <strong key={`bold-${keyIndex++}`} className="text-text-primary font-semibold">
          {match[4]}
        </strong>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}

/**
 * Rend un bloc de texte multi-paragraphes.
 * Même découpage que les articles de blog : les paragraphes sont séparés par
 * une ligne vide, un paragraphe commençant par **Titre** devient un sous-titre,
 * et les lignes "- " forment une liste.
 */
export function RichText({ body, className = '' }: { body: string; className?: string }) {
  const paragraphs = body.split('\n\n');

  return (
    <div className={className}>
      {paragraphs.map((paragraph, pIndex) => {
        // Sous-titre : "**Titre**\nsuite du paragraphe"
        if (paragraph.startsWith('**') && paragraph.includes('**\n')) {
          const [title, ...rest] = paragraph.split('\n');
          const cleanTitle = title.replace(/\*\*/g, '');
          return (
            <div key={pIndex} className="mb-4">
              <h3 className="text-xl font-semibold text-text-primary mb-2">{cleanTitle}</h3>
              <p className="text-text-secondary leading-relaxed">
                {parseTextWithFormatting(rest.join('\n'))}
              </p>
            </div>
          );
        }

        // Liste à puces, avec éventuellement une phrase d'introduction
        if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
          const lines = paragraph.split('\n');
          const intro = lines[0].startsWith('- ') ? '' : lines[0];
          const items = lines.filter((l) => l.startsWith('- '));
          return (
            <div key={pIndex} className="mb-4">
              {intro && (
                <p className="text-text-secondary leading-relaxed mb-2">
                  {parseTextWithFormatting(intro)}
                </p>
              )}
              <ul className="list-disc list-inside space-y-1 text-text-secondary">
                {items.map((item, iIndex) => (
                  <li key={iIndex}>{parseTextWithFormatting(item.replace('- ', ''))}</li>
                ))}
              </ul>
            </div>
          );
        }

        return (
          <p key={pIndex} className="text-text-secondary leading-relaxed mb-4">
            {parseTextWithFormatting(paragraph)}
          </p>
        );
      })}
    </div>
  );
}
