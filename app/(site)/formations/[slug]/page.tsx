// ============================================================
// Page Détail Formation — CLUB AI
// URL : /formations/[slug]
// ============================================================

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import FormationHero from '@/components/formations/FormationHero'
import FormationModules from '@/components/formations/FormationModules'
import FormationInfo from '@/components/formations/FormationInfo'
import CTASection from '@/components/sections/CTASection'
import {
  getAllFormationSlugs,
  getFormationBySlug,
} from '@/data/formations'

// ── Génération statique des slugs ──
export async function generateStaticParams() {
  const slugs = getAllFormationSlugs()
  return slugs.map((slug) => ({ slug }))
}

// ── Métadonnées dynamiques ──
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const formation = getFormationBySlug(params.slug)

  if (!formation) {
    return {
      title: 'Formation introuvable',
    }
  }

  return {
    // `absolute` évite la double suffixaison : le template racine
    // ne s'applique qu'aux segments enfants directs.
    title: { absolute: `${formation.titre} | CLUB AI` },
    description: formation.objectif,
    openGraph: {
      title: `${formation.titre} | CLUB AI`,
      description: formation.objectif,
      type: 'article',
      url: `https://club-ai.com/formations/${formation.slug}`,
    },
    alternates: {
      canonical: `https://club-ai.com/formations/${formation.slug}`,
    },
  }
}

// ── Page ──
export default function FormationDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const formation = getFormationBySlug(params.slug)

  // Redirige vers 404 si la formation n'existe pas
  if (!formation) {
    notFound()
  }

  return (
    <>
      {/* ── Hero avec infos pratiques ── */}
      <FormationHero formation={formation} />

      {/* ── Bande infos ── */}
      <FormationInfo formation={formation} variant="band" />

      {/* ── Modules + sessions + projet final ── */}
      <FormationModules
        modules={formation.modules}
        projetFinal={formation.projetFinal}
        sessions={formation.sessions}
        planningNote={
          formation.sessions
            ? `${formation.sessions.length} sessions${formation.periode ? `, ${formation.periode.toLowerCase()}` : ''} — ${formation.horaire}.`
            : undefined
        }
      />

      {/* ── Sidebar sticky version mobile — carte infos répétée ── */}
      <section className="py-12 bg-[#f4eee5] lg:hidden">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <FormationInfo formation={formation} variant="card" />
        </div>
      </section>

      {/* ── CTA ── */}
      <CTASection
        title="Prêt à vous inscrire ?"
        subtitle={`« ${formation.titreCourt} » — places limitées. Inscrivez-vous dès maintenant pour garantir votre participation.`}
        ctaLabel="S'inscrire à cette formation"
        ctaHref={`/inscription?formation=${formation.slug}`}
        secondaryLabel="Voir toutes les formations"
        secondaryHref="/formations"
        variant="dark"
        showContact
      />
    </>
  )
}
