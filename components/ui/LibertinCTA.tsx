/**
 * LibertinCTA - Composant CTA partenaire Wyylde
 * Bloc d'incitation pour inscription sur Wyylde
 */

interface LibertinCTAProps {
  location: string;
  variant?: 'default' | 'compact';
}

const WYYLDE_URL = 'https://lb.affilae.com/r/?p=63072a4ce188f131d6d1c7fe&af=530&lp=https%3A%2F%2Fapp.wyylde.com%2Ffr-fr%2Fregister%3Futm_source%3Daffiliation%26utm_medium%3DaffilaeFR%26utm_campaign%3Dfg-people';

export default function LibertinCTA({ location, variant = 'default' }: LibertinCTAProps) {
  if (variant === 'compact') {
    return (
      <section className="relative overflow-hidden bg-gradient-to-r from-[#e63946]/20 via-[#e63946]/10 to-[#e63946]/20 rounded-xl border-2 border-[#e63946]/40 p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#e63946]/5 to-transparent pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-14 h-14 bg-[#e63946]/20 rounded-full flex items-center justify-center border border-[#e63946]/30">
              <span className="text-[#e63946] text-[9px] font-bold uppercase tracking-wide text-center leading-tight">Notre<br />partenaire</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary">
                Rejoignez 7 millions de libertins sur Wyylde
              </h3>
              <p className="text-text-secondary mt-1">
                Notre partenaire — <span className="text-yellow-400 font-medium">1 mois d&apos;abonnement offert</span> pour toute nouvelle inscription
              </p>
            </div>
          </div>

          <a
            href={WYYLDE_URL}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#e63946] rounded-xl hover:bg-[#c1121f] transition-all hover:scale-105 shadow-lg shadow-[#e63946]/25 text-lg whitespace-nowrap"
          >
            <span className="text-white font-bold">S&apos;inscrire gratuitement</span>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#e63946]/25 via-[#e63946]/15 to-bg-secondary rounded-xl border-2 border-[#e63946]/50 p-8 md:p-10">
      {/* Effets décoratifs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#e63946]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#e63946]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative">
        {/* Badge partenaire */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#e63946]/20 rounded-full border border-[#e63946]/30 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
          </span>
          <span className="text-[#e63946] text-sm font-medium">Notre partenaire officiel</span>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Rencontrez des libertins sur Wyylde avant votre soirée à {location}
            </h3>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              <strong className="text-text-primary">Wyylde, c&apos;est la 1<sup>re</sup> communauté libertine de France</strong> avec plus de 7 millions de membres inscrits. Échangez en toute discrétion, vérifiez vos affinités et organisez une rencontre avant votre venue.
            </p>
            <ul className="grid sm:grid-cols-3 gap-3 text-text-secondary">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                7 millions de membres
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                1 mois offert
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                N°1 en France
              </li>
            </ul>
          </div>

          <a
            href={WYYLDE_URL}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="group inline-flex items-center justify-center gap-3 w-full px-10 py-4 bg-[#e63946] rounded-xl hover:bg-[#c1121f] transition-all hover:scale-[1.02] shadow-xl shadow-[#e63946]/30"
          >
            <span className="text-xl text-white font-bold">Découvrir Wyylde — 1 mois offert</span>
            <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
