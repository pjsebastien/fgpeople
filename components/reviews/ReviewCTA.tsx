/**
 * Bloc d'incitation à laisser un avis anonyme (server component).
 * À placer en évidence dans la section avis.
 */

interface ReviewCTAProps {
  totalReviews: number;
  /** ID de l'élément vers lequel scroller / focus pour ouvrir le formulaire */
  formId: string;
  /** Étiquette personnalisée (lieu / club) */
  entityLabel?: string;
}

export default function ReviewCTA({ totalReviews, formId, entityLabel = 'cet établissement' }: ReviewCTAProps) {
  const isFirst = totalReviews === 0;

  return (
    <div className="relative overflow-hidden rounded-xl border border-accent-primary/30 bg-gradient-to-br from-accent-primary/10 via-bg-secondary to-bg-secondary p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex w-12 h-12 rounded-full bg-accent-primary/20 items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-text-primary font-bold text-lg mb-1">
            {isFirst ? `Sois le premier à donner ton avis sur ${entityLabel} !` : 'Tu as visité ce lieu ?'}
          </h4>
          <p className="text-text-secondary text-sm mb-3">
            Partage ton expérience pour aider les autres visiteurs.{' '}
            <span className="text-text-primary font-medium">100 % anonyme</span>, aucun compte ni email requis.
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted mb-4">
            <li className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Pas d&apos;inscription
            </li>
            <li className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Pseudo libre ou anonyme
            </li>
            <li className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Modération avant publication
            </li>
            <li className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              30 secondes
            </li>
          </ul>
          <a
            href={`#${formId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-primary text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m-1-1v2m6 6h-2m1-1v2m-7 6H6a2 2 0 01-2-2v-7a2 2 0 012-2h7a2 2 0 012 2v1" />
            </svg>
            {isFirst ? 'Écrire le premier avis' : 'Laisser mon avis'}
          </a>
        </div>
      </div>
    </div>
  );
}
