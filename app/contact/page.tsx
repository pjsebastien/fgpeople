/**
 * Page Contact - Server Component
 * Page de contact simple avec email
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Contact | FG People - Annuaire des Clubs Libertins',
  description: 'Contactez l\'équipe FG People pour toute question concernant notre annuaire des clubs libertins en France. Nous répondons sous 48h.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: 'Contact', url: '/contact' },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <main className="py-8 md:py-12">
        <div className="container-custom max-w-4xl">
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Contactez-nous
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Une question, une suggestion ou un établissement à nous signaler ?
              Notre équipe est à votre écoute.
            </p>
          </header>

          {/* Contact Card */}
          <div className="bg-bg-secondary rounded-2xl border border-border p-8 md:p-12 text-center mb-12">
            <div className="w-20 h-20 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Écrivez-nous par email
            </h2>
            <p className="text-text-secondary mb-6">
              Nous répondons généralement sous 48 heures ouvrées.
            </p>

            <a
              href="mailto:contact@fgpeople.com"
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent-primary hover:bg-accent-hover text-white font-semibold rounded-xl transition-colors text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              contact@fgpeople.com
            </a>
          </div>

          {/* Motifs de contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-bg-secondary rounded-xl border border-border p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Ajouter un établissement
              </h3>
              <p className="text-text-secondary text-sm">
                Votre club n'est pas référencé ? Envoyez-nous les informations et nous l'ajouterons.
              </p>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Modifier une fiche
              </h3>
              <p className="text-text-secondary text-sm">
                Informations erronées ou obsolètes ? Signalez-nous les corrections à apporter.
              </p>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Question générale
              </h3>
              <p className="text-text-secondary text-sm">
                Toute autre question concernant le site ou le milieu libertin en général.
              </p>
            </div>
          </div>

          {/* Note RGPD */}
          <div className="bg-bg-tertiary rounded-xl p-6 text-center">
            <p className="text-text-muted text-sm">
              Vos données personnelles sont traitées conformément à notre{' '}
              <Link href="/confidentialite" className="text-accent-primary hover:underline">
                politique de confidentialité
              </Link>
              . Nous ne partageons jamais vos informations avec des tiers.
            </p>
          </div>

          {/* Lien retour */}
          <div className="mt-8">
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
