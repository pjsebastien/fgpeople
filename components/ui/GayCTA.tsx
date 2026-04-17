/**
 * GayCTA - Composant CTA affilié orienté rencontres gay
 * Utilisé sur les pages "Lieu de drague"
 */

interface GayCTAProps {
  location: string;
  variant?: 'default' | 'compact';
}

const GAY_AFFILIATE_URL = 'https://k.related-dating.com/?abc=b9653873036f3fd1&xa=n&acme=wid.94576&media=seo&tpls=1';

export default function GayCTA({ location, variant = 'default' }: GayCTAProps) {
  if (variant === 'compact') {
    return (
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-purple-500/20 rounded-xl border-2 border-purple-500/40 p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
              <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary">
                Rencontres gay près de {location}
              </h3>
              <p className="text-text-secondary mt-1">
                Discutez avec des hommes gay et bi près de chez vous, en toute discrétion
              </p>
            </div>
          </div>

          <a
            href={GAY_AFFILIATE_URL}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-500 rounded-xl hover:bg-purple-600 transition-all hover:scale-105 shadow-lg shadow-purple-500/25 text-lg whitespace-nowrap"
          >
            <span className="text-white font-bold">Voir les profils</span>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-500/25 via-pink-500/15 to-bg-secondary rounded-xl border-2 border-purple-500/50 p-8 md:p-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/20 rounded-full border border-purple-500/30 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-400"></span>
          </span>
          <span className="text-purple-300 text-sm font-medium">Profils actifs près de {location}</span>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Rencontrez des hommes gay et bi à {location}
            </h3>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              <strong className="text-text-primary">Avant de vous déplacer, faites connaissance en ligne.</strong> Échangez avec des hommes près de chez vous, vérifiez vos affinités et organisez une rencontre en toute discrétion.
            </p>
            <ul className="grid sm:grid-cols-3 gap-3 text-text-secondary">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Profils géolocalisés
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                100% discret
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Inscription gratuite
              </li>
            </ul>
          </div>

          <a
            href={GAY_AFFILIATE_URL}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="group inline-flex items-center justify-center gap-3 w-full px-10 py-4 bg-purple-500 rounded-xl hover:bg-purple-600 transition-all hover:scale-[1.02] shadow-xl shadow-purple-500/30"
          >
            <span className="text-xl text-white font-bold">Voir les profils près de {location}</span>
            <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
