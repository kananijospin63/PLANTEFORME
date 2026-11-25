// ============================================================
// Layout /formations — porte les métadonnées de la page
// (app/formations/page.tsx est un Client Component et ne peut
//  pas exporter `metadata` : d'où ce layout dédié)
// ============================================================

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Formations en Intelligence Artificielle',
  description:
    "Découvrez les formations en IA de CLUB AI à Bujumbura : ChatGPT/Gemini/Claude, Automatisation n8n & Make, IA pour Entrepreneurs, Développement web avec l'IA.",
  openGraph: {
    title: 'Formations en Intelligence Artificielle | CLUB AI',
    description:
      'Formations pratiques en IA à Bujumbura. Places limitées.',
  },
  alternates: {
    canonical: 'https://club-ai.com/formations',
  },
}

export default function FormationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
