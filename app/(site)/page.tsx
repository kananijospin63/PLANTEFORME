// ============================================================
// Page d'Accueil — CLUB AI
// URL : /
// ============================================================

import type { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import FormationsSection from '@/components/sections/FormationsSection'
import StatsSection from '@/components/sections/StatsSection'
import CTASection from '@/components/sections/CTASection'
import { getAllFormations, DATE_COMMUNE_LONG } from '@/data/formations'

export const metadata: Metadata = {
  // `absolute` court-circuite le template "%s | CLUB AI" du layout racine
  title: {
    absolute: 'CLUB AI — Formations en Intelligence Artificielle | Bujumbura',
  },
  description:
    `Apprenez à utiliser l'intelligence artificielle concrètement à Bujumbura. Des formations pratiques : ChatGPT/Gemini/Claude, Automatisation n8n & Make, IA pour Entrepreneurs. Session du ${DATE_COMMUNE_LONG}.`,
  openGraph: {
    title: 'CLUB AI — Formations en Intelligence Artificielle | Bujumbura',
    description:
      `Formations pratiques en IA à Bujumbura, du ${DATE_COMMUNE_LONG}. Inscrivez-vous maintenant.`,
  },
}

export default function HomePage() {
  const formations = getAllFormations()

  return (
    <>
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Formations ── */}
      <FormationsSection formations={formations} />

      {/* ── Chiffres clés ── */}
      <StatsSection />

      {/* ── CTA final ── */}
      <CTASection
        title="Prêt à passer à l'action avec l'IA ?"
        subtitle="Rejoignez la prochaine session et repartez avec des compétences directement applicables à votre travail."
        ctaLabel="Choisir ma formation"
        ctaHref="/formations"
        secondaryLabel="Je m'inscris"
        secondaryHref="/inscription"
        variant="light"
        showContact
      />
    </>
  )
}
