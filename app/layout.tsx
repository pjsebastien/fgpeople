/**
 * Layout Racine - Server Component
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AgeVerification from '@/components/ui/AgeVerification';
import CookieBanner from '@/components/ui/CookieBanner';
import FloatingCTA from '@/components/ui/FloatingCTA';
import DelayedPopup from '@/components/ui/DelayedPopup';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.fgpeople.com'),
  title: {
    default: 'Clubs libertins et échangistes en France - Annuaire complet | FG People',
    template: '%s | FG People',
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  description:
    'Annuaire complet des clubs libertins, saunas et spas échangistes en France. Horaires, tarifs, équipements et avis pour trouver l\'établissement idéal.',
  alternates: {
    canonical: '/',
  },
  authors: [{ name: 'FG People' }],
  creator: 'FG People',
  publisher: 'FG People',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.fgpeople.com',
    siteName: 'FG People',
    title: 'Clubs libertins et échangistes en France - Annuaire complet | FG People',
    description:
      'Annuaire complet des clubs libertins, saunas et spas échangistes en France avec horaires, tarifs et équipements.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FG People - Annuaire des clubs libertins en France',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary font-sans antialiased">
        <AgeVerification />
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieBanner />
        <FloatingCTA />
        <DelayedPopup />
      </body>
    </html>
  );
}
