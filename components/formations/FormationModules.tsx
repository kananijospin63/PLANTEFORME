// ============================================================
// FormationModules — Modules + planning — Espresso & Crème
// ============================================================

import type { Module, SessionFormation } from '@/types'
import SectionTitle from '@/components/ui/SectionTitle'
import { Calendar, Clock } from 'lucide-react'

interface FormationModulesProps {
  modules: Module[]
  projetFinal: string
  sessions?: SessionFormation[]
  /** Phrase d'intro du planning, ex. « 6 sessions, du 14 au 19 décembre 2026 — 15H30 – 18H30. » */
  planningNote?: string
}

export default function FormationModules({ modules, projetFinal, sessions, planningNote }: FormationModulesProps) {
  return (
    <section className="py-16 md:py-20" style={{ background: '#f4eee5' }} aria-labelledby="modules-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Modules */}
          <div className="lg:col-span-7">
            <SectionTitle
              eyebrow="Programme"
              title="Contenu de la formation"
              subtitle="Chaque module est conçu pour être directement applicable à votre travail."
              className="mb-10"
            />

            <ol className="flex flex-col gap-0" aria-label="Modules de la formation">
              {modules.map((module, index) => (
                <li key={module.id} className="group relative flex gap-5 pb-8 last:pb-0">
                  {/* Ligne verticale */}
                  {index < modules.length - 1 && (
                    <div
                      className="absolute left-[18px] top-9 bottom-0 w-px"
                      style={{ background: 'rgba(26,16,13,.1)' }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Numéro */}
                  <div
                    className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all duration-200 border-2 group-hover:scale-110"
                    style={{ background: '#ffffff', borderColor: 'rgba(174,88,55,.25)', color: 'var(--copper)' }}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Contenu */}
                  <div className="pt-1.5 flex-1 min-w-0">
                    <h3
                      className="text-base font-bold leading-snug mb-1 transition-colors duration-200 group-hover:text-[var(--copper)]"
                      style={{ color: '#1a100d' }}
                    >
                      {module.titre}
                    </h3>
                    {module.description && (
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(26,16,13,.6)' }}>
                        {module.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Projet final + approche */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 flex flex-col gap-4">

              {/* Carte projet final */}
              <div
                className="rounded-2xl p-7 transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(26,16,13,.08)',
                  boxShadow: '0 1px 3px rgba(26,16,13,.04)',
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--gold), var(--copper))' }}
                  >
                    <span className="text-sm font-black" style={{ color: '#1a100d' }} aria-hidden="true">★</span>
                  </div>
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--copper)' }}>
                    Projet final
                  </p>
                </div>

                <h3 className="text-base font-bold mb-3 leading-snug" style={{ color: '#1a100d' }}>
                  Un projet concret à la fin de la formation
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(26,16,13,.6)' }}>{projetFinal}</p>

                <div className="flex items-center gap-3 mt-6 pt-5" style={{ borderTop: '1px solid rgba(26,16,13,.08)' }}>
                  <div className="flex gap-1.5" aria-hidden="true">
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--gold)' }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--copper)' }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: '#1a100d' }} />
                  </div>
                  <p className="text-xs font-medium" style={{ color: 'rgba(26,16,13,.5)' }}>
                    Directement réutilisable dans votre activité
                  </p>
                </div>
              </div>

              {/* Carte approche 20/80 */}
              <div
                className="rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1"
                style={{ background: '#1a100d', border: '1px solid rgba(239,201,140,.14)' }}
              >
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-4" style={{ color: 'rgba(255,244,232,.35)' }}>
                  Approche pédagogique
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,244,232,.05)', border: '1px solid rgba(255,244,232,.08)' }}>
                    <p className="text-2xl font-black" style={{ color: '#fff4e8' }}>20%</p>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: 'rgba(255,244,232,.4)' }}>Théorie</p>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(239,201,140,.1)', border: '1px solid rgba(239,201,140,.2)' }}>
                    <p className="text-2xl font-black text-gold">80%</p>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: 'rgba(255,244,232,.4)' }}>Pratique</p>
                  </div>
                </div>
                <p className="text-xs text-center leading-relaxed" style={{ color: 'rgba(255,244,232,.35)' }}>
                  Orientée résultats concrets, pas de théorie abstraite.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Planning des sessions (si disponible) ── */}
      {sessions && sessions.length > 0 && (
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-16"
          style={{ borderTop: '1px solid rgba(26,16,13,.08)' }}
        >
          <div className="mb-10">
            <SectionTitle
              eyebrow="Planning de la formation"
              title="Programme jour par jour"
              subtitle={planningNote ?? 'Le détail des sessions, jour par jour.'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <div
                key={session.numero}
                className="stat-card group relative rounded-2xl p-5"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(26,16,13,.08)',
                  boxShadow: '0 1px 3px rgba(26,16,13,.04)',
                }}
              >
                {/* Numéro */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, var(--gold), var(--copper))',
                      color: '#1a100d',
                      boxShadow: '0 2px 8px rgba(174,88,55,.28)',
                    }}
                  >
                    {String(session.numero).padStart(2, '0')}
                  </div>
                  <span
                    className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded-full"
                    style={{ background: 'rgba(26,16,13,.06)', color: 'rgba(26,16,13,.4)' }}
                  >
                    Module {session.numero}
                  </span>
                </div>

                {/* Titre */}
                <h3 className="text-sm font-bold leading-snug mb-4" style={{ color: '#1a100d' }}>
                  {session.titre}
                </h3>

                {/* Date & Horaire */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} style={{ color: 'var(--copper)' }} className="shrink-0" />
                    <span className="text-xs font-medium" style={{ color: 'rgba(26,16,13,.5)' }}>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} style={{ color: 'var(--copper)' }} className="shrink-0" />
                    <span className="text-xs font-medium" style={{ color: 'rgba(26,16,13,.5)' }}>{session.horaire}</span>
                  </div>
                </div>

                {/* Bordure or gauche */}
                <div
                  className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full transition-all duration-200 group-hover:top-2 group-hover:bottom-2"
                  style={{ background: 'linear-gradient(to bottom, var(--gold), rgba(239,201,140,.3))' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
