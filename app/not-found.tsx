/**
 * Page 404 - Server Component
 *
 * Page d'erreur personnalisée avec un design séduisant
 * dans l'esprit libertin du site.
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center py-16 relative overflow-hidden">
      {/* Background décoratif */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-hover/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-hover/10 rounded-full blur-3xl" />

      <div className="container-custom text-center relative z-10">
        {/* Illustration suggestive avec le 404 */}
        <div className="relative inline-block mb-8">
          {/* Le 404 stylisé */}
          <div className="flex items-center justify-center gap-4">
            <span className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-br from-accent-primary to-accent-hover leading-none">
              4
            </span>
            <div className="relative">
              {/* Le 0 devient un symbole évocateur */}
              <div className="w-24 h-24 md:w-36 md:h-36 rounded-full border-[8px] md:border-[12px] border-accent-primary/80 flex items-center justify-center">
                <span className="text-4xl md:text-5xl">🔥</span>
              </div>
            </div>
            <span className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-br from-accent-primary to-accent-hover leading-none">
              4
            </span>
          </div>
        </div>

        {/* Message principal */}
        <h1 className="text-2xl md:text-4xl font-bold text-text-primary mb-4">
          Oups... Cette page s'est éclipsée
        </h1>
        <p className="text-text-secondary text-lg md:text-xl max-w-xl mx-auto mb-4">
          Comme une rencontre qui ne se fait pas, cette page n'existe pas ou a été déplacée.
        </p>
        <p className="text-text-muted text-base max-w-md mx-auto mb-10">
          Mais ne partez pas si vite...
          <span className="text-accent-primary"> l'aventure continue ailleurs</span>
        </p>

        {/* Actions principales */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/" className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Retour à l'accueil
          </Link>
          <Link href="/#regions" className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4 text-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Explorer les clubs
          </Link>
        </div>

        {/* Suggestions de navigation */}
        <div className="bg-bg-secondary/50 backdrop-blur-sm rounded-2xl border border-border p-8 max-w-3xl mx-auto">
          <p className="text-text-primary font-semibold mb-6">
            Peut-être cherchiez-vous...
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link
              href="/club-libertin"
              className="group flex flex-col items-center p-4 bg-bg-tertiary rounded-xl hover:bg-accent-primary/10 transition-all hover:scale-105"
            >
              <span className="text-2xl mb-2">🏠</span>
              <span className="text-sm text-text-secondary group-hover:text-accent-primary">Clubs</span>
            </Link>
            <Link
              href="/sauna-libertin"
              className="group flex flex-col items-center p-4 bg-bg-tertiary rounded-xl hover:bg-accent-primary/10 transition-all hover:scale-105"
            >
              <span className="text-2xl mb-2">🧖</span>
              <span className="text-sm text-text-secondary group-hover:text-accent-primary">Saunas</span>
            </Link>
            <Link
              href="/spa-libertin"
              className="group flex flex-col items-center p-4 bg-bg-tertiary rounded-xl hover:bg-accent-primary/10 transition-all hover:scale-105"
            >
              <span className="text-2xl mb-2">💆</span>
              <span className="text-sm text-text-secondary group-hover:text-accent-primary">Spas</span>
            </Link>
            <Link
              href="/conseils"
              className="group flex flex-col items-center p-4 bg-bg-tertiary rounded-xl hover:bg-accent-primary/10 transition-all hover:scale-105"
            >
              <span className="text-2xl mb-2">💡</span>
              <span className="text-sm text-text-secondary group-hover:text-accent-primary">Conseils</span>
            </Link>
          </div>

          {/* Régions populaires */}
          <p className="text-text-muted text-sm mb-4">Régions populaires</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/region/ile-de-france"
              className="px-4 py-2 bg-bg-tertiary text-text-secondary text-sm rounded-full hover:text-accent-primary hover:bg-accent-primary/10 transition-colors"
            >
              Île-de-France
            </Link>
            <Link
              href="/region/auvergne-rhone-alpes"
              className="px-4 py-2 bg-bg-tertiary text-text-secondary text-sm rounded-full hover:text-accent-primary hover:bg-accent-primary/10 transition-colors"
            >
              Rhône-Alpes
            </Link>
            <Link
              href="/region/provence-alpes-cote-dazur"
              className="px-4 py-2 bg-bg-tertiary text-text-secondary text-sm rounded-full hover:text-accent-primary hover:bg-accent-primary/10 transition-colors"
            >
              PACA
            </Link>
            <Link
              href="/region/nouvelle-aquitaine"
              className="px-4 py-2 bg-bg-tertiary text-text-secondary text-sm rounded-full hover:text-accent-primary hover:bg-accent-primary/10 transition-colors"
            >
              Nouvelle-Aquitaine
            </Link>
            <Link
              href="/region/occitanie"
              className="px-4 py-2 bg-bg-tertiary text-text-secondary text-sm rounded-full hover:text-accent-primary hover:bg-accent-primary/10 transition-colors"
            >
              Occitanie
            </Link>
          </div>
        </div>

        {/* Message final */}
        <p className="mt-10 text-text-muted text-sm">
          Si vous pensez qu'il s'agit d'une erreur, <Link href="/contact" className="text-accent-primary hover:underline">contactez-nous</Link>
        </p>
      </div>
    </main>
  );
}
