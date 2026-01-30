/**
 * Page Mentions Légales - Server Component
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Mentions Légales | FG People',
  description: 'Mentions légales du site FG People, annuaire des clubs libertins en France. Informations sur l\'éditeur, l\'hébergeur et les conditions d\'utilisation.',
  alternates: { canonical: '/mentions-legales' },
};

export default function MentionsLegalesPage() {
  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: 'Mentions légales', url: '/mentions-legales' },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <main className="py-8 md:py-12">
        <div className="container-custom max-w-4xl">
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Mentions légales
            </h1>
            <p className="text-text-secondary">
              Informations légales concernant le site FG People
            </p>
          </header>

          {/* Contenu */}
          <div className="prose prose-invert max-w-none space-y-10">

            {/* Éditeur */}
            <section className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center text-accent-primary text-sm font-bold">1</span>
                Éditeur du site
              </h2>
              <div className="text-text-secondary space-y-2">
                <p><strong className="text-text-primary">Nom :</strong> Sébastien P.</p>
                <p><strong className="text-text-primary">Statut :</strong> Particulier</p>
                <p><strong className="text-text-primary">Email :</strong> <a href="mailto:contact@fgpeople.com" className="text-accent-primary hover:underline">contact@fgpeople.com</a></p>
                <p><strong className="text-text-primary">Site web :</strong> <a href="https://www.fgpeople.com" className="text-accent-primary hover:underline">www.fgpeople.com</a></p>
              </div>
            </section>

            {/* Hébergeur */}
            <section className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center text-accent-primary text-sm font-bold">2</span>
                Hébergement
              </h2>
              <div className="text-text-secondary space-y-2">
                <p><strong className="text-text-primary">Hébergeur :</strong> Vercel Inc.</p>
                <p><strong className="text-text-primary">Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
                <p><strong className="text-text-primary">Site web :</strong> <a href="https://vercel.com" className="text-accent-primary hover:underline" target="_blank" rel="noopener noreferrer">vercel.com</a></p>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center text-accent-primary text-sm font-bold">3</span>
                Propriété intellectuelle
              </h2>
              <div className="text-text-secondary space-y-4">
                <p>
                  L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, etc.) est la propriété exclusive de FG People, à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs.
                </p>
                <p>
                  Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces éléments est strictement interdite sans l'accord exprès par écrit de FG People.
                </p>
                <p>
                  Les images utilisées sur ce site sont soit libres de droits, soit utilisées avec l'autorisation de leurs propriétaires respectifs.
                </p>
              </div>
            </section>

            {/* Limitation de responsabilité */}
            <section className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center text-accent-primary text-sm font-bold">4</span>
                Limitation de responsabilité
              </h2>
              <div className="text-text-secondary space-y-4">
                <p>
                  FG People s'efforce de fournir des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
                </p>
                <p>
                  Les informations présentes sur ce site sont données à titre indicatif et sont susceptibles d'évoluer. FG People ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation des informations contenues sur ce site.
                </p>
                <p>
                  FG People n'est pas responsable du contenu des sites tiers vers lesquels des liens hypertextes peuvent renvoyer depuis ce site.
                </p>
              </div>
            </section>

            {/* Contenu adulte */}
            <section className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center text-accent-primary text-sm font-bold">5</span>
                Avertissement - Contenu adulte
              </h2>
              <div className="text-text-secondary space-y-4">
                <p>
                  Ce site est destiné à un public majeur (18 ans et plus). En accédant à ce site, vous certifiez avoir l'âge légal requis dans votre pays de résidence pour consulter du contenu à caractère adulte.
                </p>
                <p>
                  FG People référence des établissements pour adultes consentants. Nous encourageons des pratiques responsables, respectueuses et consensuelles.
                </p>
              </div>
            </section>

            {/* Données personnelles */}
            <section className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center text-accent-primary text-sm font-bold">6</span>
                Protection des données personnelles
              </h2>
              <div className="text-text-secondary space-y-4">
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles.
                </p>
                <p>
                  Pour plus d'informations sur la gestion de vos données personnelles, consultez notre{' '}
                  <Link href="/confidentialite" className="text-accent-primary hover:underline">
                    politique de confidentialité
                  </Link>.
                </p>
                <p>
                  Pour exercer vos droits, contactez-nous à : <a href="mailto:contact@fgpeople.com" className="text-accent-primary hover:underline">contact@fgpeople.com</a>
                </p>
              </div>
            </section>

            {/* Droit applicable */}
            <section className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center text-accent-primary text-sm font-bold">7</span>
                Droit applicable
              </h2>
              <div className="text-text-secondary">
                <p>
                  Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
                </p>
              </div>
            </section>

          </div>

          {/* Lien retour */}
          <div className="mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
