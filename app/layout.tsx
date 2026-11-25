// ============================================================
// Layout racine — CLUB AI
// ============================================================

import type { Metadata, Viewport } from 'next'
import { Manrope, Unbounded } from 'next/font/google'
import { DATE_COMMUNE_LONG } from '@/data/formations'
import './globals.css'

// ── Polices ──
const manrope = Manrope({
  subsets:  ['latin'],
  variable: '--font-manrope',
  display:  'swap',
  weight:   ['300', '400', '500', '600', '700', '800'],
})

const unbounded = Unbounded({
  subsets:  ['latin'],
  variable: '--font-unbounded',
  display:  'swap',
  weight:   ['400', '500', '600', '700', '800', '900'],
})

// ── Métadonnées globales ──
export const metadata: Metadata = {
  metadataBase: new URL('https://club-ai.com'),
  title: {
    default: 'CLUB AI — Formations en Intelligence Artificielle | Bujumbura',
    template: '%s | CLUB AI',
  },
  description:
    `Des formations pratiques en intelligence artificielle à Bujumbura. Apprenez à maîtriser ChatGPT, automatiser votre travail et développer votre activité avec l'IA. Prochaine session du ${DATE_COMMUNE_LONG}.`,
  keywords: [
    'formation IA',
    'intelligence artificielle',
    'Bujumbura',
    'Burundi',
    'ChatGPT',
    'Gemini',
    'Claude',
    'automatisation',
    'n8n',
    'Make',
    'formation professionnelle',
    'CLUB AI',
    'entrepreneur',
    'productivité',
  ],
  authors: [{ name: 'CLUB AI', url: 'https://club-ai.com' }],
  creator: 'CLUB AI',
  publisher: 'CLUB AI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://club-ai.com',
    siteName: 'CLUB AI',
    title: 'CLUB AI — Formations en Intelligence Artificielle | Bujumbura',
    description:
      `Des formations pratiques en IA à Bujumbura. ChatGPT, automatisation, IA pour entrepreneurs. Inscrivez-vous pour la session du ${DATE_COMMUNE_LONG}.`,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CLUB AI — Formations en Intelligence Artificielle à Bujumbura',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CLUB AI — Formations en IA à Bujumbura',
    description:
      `Apprenez à utiliser l'intelligence artificielle concrètement. Formation pratique à Bujumbura, du ${DATE_COMMUNE_LONG}.`,
    images: ['/og-image.jpg'],
  },
  // Les icônes sont fournies par les conventions de fichiers :
  //   app/icon.svg       → favicon (tous navigateurs modernes)
  //   app/apple-icon.png → icône iOS
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://club-ai.com',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a100d',
}

// ── Layout ──
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${manrope.variable} ${unbounded.variable} grain-overlay`} suppressHydrationWarning>
      <body className="bg-[#f4eee5] text-espresso antialiased">
        {/* Skip to main content — accessibilité clavier */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-navy focus:text-gold focus:rounded focus:text-sm focus:font-semibold focus:shadow-navy"
        >
          Aller au contenu principal
        </a>

        {children}
      </body>
    </html>
  )
}
