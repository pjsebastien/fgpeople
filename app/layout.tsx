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

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.fgpeople.com'),
  title: {
    default: 'Tous les clubs libertins et échangistes en France - 523 établissements',
    template: '%s | FG People',
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  description:
    'Découvrez 523 clubs libertins, saunas et spas en France. Annuaire complet avec horaires, tarifs, équipements et avis pour trouver l\'établissement idéal.',
  keywords: [
    'club libertin',
    'clubs libertins',
    'club échangiste',
    'échangisme',
    'libertin France',
    'soirées libertines',
    'sauna libertin',
    'clubs libertins France',
  ],
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
    title: 'Tous les clubs libertins et échangistes en France - 523 établissements',
    description:
      'Découvrez 523 clubs libertins, saunas et spas en France avec horaires, tarifs et équipements.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FG People - Clubs Libertins de France',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tous les clubs libertins et échangistes en France - 523 établissements',
    description: 'Découvrez 523 clubs libertins et échangistes, saunas et spas en France. Annuaire complet.',
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
      </body>
    </html>
  );
}
