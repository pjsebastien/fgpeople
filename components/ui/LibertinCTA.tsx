/**
 * LibertinCTA - Composant CTA affilié
 * Bloc d'incitation pour rencontres libertines
 */

interface LibertinCTAProps {
  location: string;
  variant?: 'default' | 'compact';
}

const AFFILIATE_URL = 'https://k.related-dating.com/?abc=7338b1b95caf2acd&xa=n&acme=wid.94576&media=seo&tpls=3';

export default function LibertinCTA({ location, variant = 'default' }: LibertinCTAProps) {
  if (variant === 'compact') {
    return (
      <section className="relative overflow-hidden bg-gradient-to-r from-accent-primary/20 via-accent-primary/10 to-accent-primary/20 rounded-xl border-2 border-accent-primary/40 p-6 md:p-8">
        {/* Effet de glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 to-transparent pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Icône */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-14 h-14 bg-accent-primary/20 rounded-full flex items-center justify-center border border-accent-primary/30">
              <svg className="w-7 h-7 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary">
                Des libertins près de {location} vous attendent
              </h3>
              <p className="text-text-secondary mt-1">
                Couples et célibataires disponibles maintenant dans votre secteur
              </p>
            </div>
          </div>

          {/* Bouton */}
          <a
            href={AFFILIATE_URL}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-primary rounded-xl hover:brightness-110 transition-all hover:scale-105 shadow-lg shadow-accent-primary/25 text-lg whitespace-nowrap"
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
    <section className="relative overflow-hidden bg-gradient-to-br from-accent-primary/25 via-accent-primary/15 to-bg-secondary rounded-xl border-2 border-accent-primary/50 p-8 md:p-10">
      {/* Effet décoratif */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-primary/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-primary/20 rounded-full border border-accent-primary/30 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-accent-primary text-sm font-medium">Profils actifs près de {location}</span>
        </div>

        <div className="flex flex-col gap-6">
          {/* Contenu */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Rencontrez des libertins à {location} avant votre soirée
            </h3>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              <strong className="text-text-primary">Ne partez pas seul(e) au club.</strong> Des centaines de couples et célibataires libertins cherchent à faire connaissance près de chez vous. Échangez en toute discrétion, vérifiez vos affinités et organisez une rencontre avant votre venue.
            </p>
            <ul className="grid sm:grid-cols-3 gap-3 text-text-secondary">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Profils vérifiés
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                100% discret
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Inscription gratuite
              </li>
            </ul>
          </div>

          {/* Bouton */}
          <a
            href={AFFILIATE_URL}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="group inline-flex items-center justify-center gap-3 w-full px-10 py-4 bg-accent-primary rounded-xl hover:brightness-110 transition-all hover:scale-[1.02] shadow-xl shadow-accent-primary/30"
          >
            <span className="text-xl text-white font-bold">Voir les profils à {location}</span>
            <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
