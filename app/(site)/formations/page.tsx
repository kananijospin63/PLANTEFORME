'use client'

// ============================================================
// Page Formations — Navy & Gold
// ============================================================

import { useState, useMemo } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import FormationCard from '@/components/formations/FormationCard'
import CTASection from '@/components/sections/CTASection'
import SectionTitle from '@/components/ui/SectionTitle'
import { getAllFormations } from '@/data/formations'
import type { Formation } from '@/types'

const FILTRES = [
  { value: 'tous',           label: 'Toutes les formations' },
  { value: 'outils-ia',      label: 'Outils IA'            },
  { value: 'automatisation', label: 'Automatisation'        },
  { value: 'entrepreneuriat',label: 'Entrepreneuriat'       },
]

export default function FormationsPage() {
  const formations = getAllFormations()
  const [filtre, setFiltre] = useState<string>('tous')

  const formationsFiltrees = useMemo<Formation[]>(() => {
    if (filtre === 'tous') return formations
    return formations.filter((f) => f.categorie === filtre)
  }, [filtre, formations])

  return (
    <>
      <section className="bg-[#1a100d] pt-28 pb-14 md:pt-32 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`, backgroundSize: '30px 30px' }}
          aria-hidden="true"
        />
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 90% 20%, rgba(245,158,11,0.07) 0%, transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="hero-pill mb-6 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
              Programme 2026
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
              Nos formations en<br />Intelligence Artificielle.
            </h1>
            <div className="w-12 h-0.5 bg-gold rounded-full mb-5" aria-hidden="true" />
            <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl">
              {formations.length} formations complémentaires pour maîtriser les outils IA,
              automatiser votre travail et développer votre activité.
            </p>

          </div>
        </div>
      </section>

      {/* Filtres + grille */}
      <section className="py-16 md:py-20 bg-[#f4eee5]" aria-labelledby="formations-list-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[rgba(26,16,13,0.55)] tracking-[0.1em] uppercase shrink-0">
              <SlidersHorizontal size={13} aria-hidden="true" />
              Filtrer par
            </div>

            <div role="group" aria-label="Filtrer les formations par catégorie" className="flex flex-wrap gap-2">
              {FILTRES.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFiltre(f.value)}
                  aria-pressed={filtre === f.value}
                  className={[
                    'px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-[220ms] ease-premium',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
                    filtre === f.value
                      ? 'bg-[#1a100d] text-white shadow-navy'
                      : 'bg-white text-surface-600 border border-surface-200 hover:border-[var(--gold)]/40 hover:text-[var(--copper)]',
                  ].join(' ')}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-surface-400 ml-auto shrink-0 font-medium" aria-live="polite">
              {formationsFiltrees.length} {formationsFiltrees.length > 1 ? 'formations' : 'formation'}
            </span>
          </div>

          <h2 id="formations-list-title" className="sr-only">Liste des formations disponibles</h2>

          {formationsFiltrees.length > 0 ? (
            <div className="formations-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formationsFiltrees.map((formation, index) => (
                <FormationCard
                  key={formation.id}
                  formation={formation}
                  featured={index === 0 && filtre === 'tous'}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-surface-400 text-sm">Aucune formation dans cette catégorie pour le moment.</p>
            </div>
          )}

        </div>
      </section>

      {/* Approche pédagogique */}
      <section className="py-16 bg-[#f4eee5]" aria-labelledby="approche-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <SectionTitle
                eyebrow="Notre approche"
                title="20 % Théorie. 80 % Pratique."
                subtitle="Chaque formation est conçue pour que vous puissiez appliquer immédiatement ce que vous apprenez."
                id="approche-title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '20%', label: 'Théorie',     desc: 'Concepts essentiels expliqués simplement.',      gold: false },
                { value: '80%', label: 'Pratique',     desc: 'Mise en application directe sur cas réels.',    gold: true  },
                { value: String(formations.length), label: 'Formations', desc: 'Des parcours complémentaires.',        gold: false },
                { value: '1',   label: 'Projet final', desc: 'Un livrable concret par formation.',            gold: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl p-5 transition-all duration-[220ms] hover:-translate-y-0.5 hover:shadow-card"
                  style={{ background: '#F8FAFC', border: '1px solid rgba(15,23,42,0.07)' }}
                >
                  <p className={`text-3xl font-black mb-1 ${item.gold ? 'text-gold' : 'text-[#1a100d]'}`}>{item.value}</p>
                  <p className="text-xs font-bold text-[#1a100d] mb-1 uppercase tracking-wide">{item.label}</p>
                  <p className="text-xs text-[rgba(26,16,13,0.55)] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Une question sur les formations ?"
        subtitle="Contactez-nous sur WhatsApp pour toute information complémentaire."
        ctaLabel="S'inscrire maintenant"
        ctaHref="/inscription"
        secondaryLabel="Retour à l'accueil"
        secondaryHref="/"
        variant="dark"
        showContact
      />
    </>
  )
}
