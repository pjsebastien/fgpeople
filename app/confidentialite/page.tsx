/**
 * Page Politique de Confidentialité - Server Component
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | FG People',
  description: 'Politique de confidentialité de FG People. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles conformément au RGPD.',
  alternates: { canonical: '/confidentialite' },
};

export default function ConfidentialitePage() {
  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: 'Politique de confidentialité', url: '/confidentialite' },
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
              Politique de confidentialité
            </h1>
            <p className="text-text-secondary">
              Comment nous protégeons vos données personnelles
            </p>
          </header>

          {/* Contenu */}
          <div className="prose prose-invert max-w-none space-y-10">

            {/* Introduction */}
            <section className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">
                Introduction
              </h2>
              <div className="text-text-secondary space-y-4">
                <p>
                  FG People accorde une grande importance à la protection de votre vie privée et de vos données personnelles. Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre site.
                </p>
                <p>
                  En utilisant le site fgpeople.com, vous acceptez les pratiques décrites dans la présente politique.
                </p>
              </div>
            </section>

            {/* Données collectées */}
            <section className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center text-accent-primary text-sm font-bold">1</span>
                Données collectées
              </h2>
              <div className="text-text-secondary space-y-4">
                <p><strong className="text-text-primary">Données de navigation</strong></p>
                <p>
                  Lors de votre visite sur notre site, nous pouvons collecter automatiquement certaines informations techniques :
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Adresse IP (anonymisée)</li>
                  <li>Type de navigateur et version</li>
                  <li>Système d'exploitation</li>
                  <li>Pages visitées et temps passé</li>
                  <li>Source de trafic (d'où vous venez)</li>
                </ul>

                <p className="mt-4"><strong className="text-text-primary">Données fournies volontairement</strong></p>
                <p>
                  Si vous nous contactez par email, nous collectons :
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Votre adresse email</li>
                  <li>Le contenu de votre message</li>
                  <li>Toute information que vous choisissez de partager</li>
                </ul>
              </div>
            </section>

            {/* Utilisation des données */}
            <section className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center text-accent-primary text-sm font-bold">2</span>
                Utilisation des données
              </h2>
              <div className="text-text-secondary space-y-4">
                <p>Vos données sont utilisées pour :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-text-primary">Améliorer le site :</strong> comprendre comment les visiteurs utilisent notre site pour l'optimiser</li>
                  <li><strong className="text-text-primary">Répondre à vos demandes :</strong> traiter vos emails et questions</li>
                  <li><strong className="text-text-primary">Assurer la sécurité :</strong> détecter et prévenir les activités frauduleuses</li>
                  <li><strong className="text-text-primary">Statistiques :</strong> analyser le trafic de manière anonyme</li>
                </ul>
                <p className="mt-4">
                  <strong className="text-text-primary">Nous ne vendons jamais vos données personnelles à des tiers.</strong>
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center text-accent-primary text-sm font-bold">3</span>
                Cookies
              </h2>
              <div className="text-text-secondary space-y-4">
                <p>
                  Notre site utilise des cookies pour améliorer votre expérience de navigation. Les cookies sont de petits fichiers stockés sur votre appareil.
                </p>

                <p><strong className="text-text-primary">Types de cookies utilisés :</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-text-primary">Cookies essentiels :</strong> nécessaires au fonctionnement du site</li>
                  <li><strong className="text-text-primary">Cookies analytiques :</strong> nous aident à comprendre l'utilisation du site (anonymisés)</li>
                </ul>

                <p className="mt-4">
                  Vous pouvez configurer votre navigateur pour refuser les cookies ou être alerté lorsqu'un cookie est envoyé. Notez que certaines fonctionnalités du site peuvent ne pas fonctionner correctement sans cookies.
                </p>
              </div>
            </section>

            {/* Conservation des données */}
            <section className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center text-accent-primary text-sm font-bold">4</span>
                Conservation des données
              </h2>
              <div className="text-text-secondary space-y-4">
                <p>
                  Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-text-primary">Données de navigation :</strong> 13 mois maximum</li>
                  <li><strong className="text-text-primary">Emails de contact :</strong> 3 ans après le dernier échange</li>
                </ul>
              </div>
            </section>

            {/* Vos droits */}
            <section className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center text-accent-primary text-sm font-bold">5</span>
                Vos droits (RGPD)
              </h2>
              <div className="text-text-secondary space-y-4">
                <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-text-primary">Droit d'accès :</strong> obtenir une copie de vos données</li>
                  <li><strong className="text-text-primary">Droit de rectification :</strong> corriger vos données inexactes</li>
                  <li><strong className="text-text-primary">Droit à l'effacement :</strong> demander la suppression de vos données</li>
                  <li><strong className="text-text-primary">Droit à la limitation :</strong> restreindre le traitement de vos données</li>
                  <li><strong className="text-text-primary">Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                  <li><strong className="text-text-primary">Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                </ul>
                <p className="mt-4">
                  Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@fgpeople.com" className="text-accent-primary hover:underline">contact@fgpeople.com</a>
                </p>
                <p>
                  Vous avez également le droit de déposer une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés).
                </p>
              </div>
            </section>

            {/* Sécurité */}
            <section className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center text-accent-primary text-sm font-bold">6</span>
                Sécurité des données
              </h2>
              <div className="text-text-secondary space-y-4">
                <p>
                  Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Connexion sécurisée (HTTPS)</li>
                  <li>Hébergement sur des serveurs sécurisés (Vercel)</li>
                  <li>Accès restreint aux données</li>
                </ul>
              </div>
            </section>

            {/* Liens externes */}
            <section className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center text-accent-primary text-sm font-bold">7</span>
                Liens vers des sites tiers
              </h2>
              <div className="text-text-secondary">
                <p>
                  Notre site peut contenir des liens vers des sites tiers (clubs libertins, etc.). Nous ne sommes pas responsables des pratiques de confidentialité de ces sites. Nous vous encourageons à consulter leurs politiques de confidentialité respectives.
                </p>
              </div>
            </section>

            {/* Modifications */}
            <section className="bg-bg-secondary rounded-xl border border-border p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center text-accent-primary text-sm font-bold">8</span>
                Modifications de cette politique
              </h2>
              <div className="text-text-secondary">
                <p>
                  Nous pouvons mettre à jour cette politique de confidentialité périodiquement. La date de dernière mise à jour sera indiquée en haut de cette page. Nous vous encourageons à consulter régulièrement cette politique.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-accent-primary/10 rounded-xl border border-accent-primary/30 p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">
                Contact
              </h2>
              <div className="text-text-secondary">
                <p>
                  Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, contactez-nous :
                </p>
                <p className="mt-4">
                  <a href="mailto:contact@fgpeople.com" className="inline-flex items-center gap-2 text-accent-primary hover:underline font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    contact@fgpeople.com
                  </a>
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
