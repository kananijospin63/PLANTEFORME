// ============================================================
// Page Connexion — accès à l'espace administration
// URL : /connexion
// ============================================================

import { Suspense } from 'react'
import type { Metadata } from 'next'
import { BarChart3, Users, ShieldCheck } from 'lucide-react'
import LoginForm from '@/components/admin/LoginForm'
import { KPI, FORMATION_STATS } from '@/data/admin'

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Accès réservé à l’équipe CLUB AI.',
  robots: { index: false, follow: false },
}

const ARGUMENTS = [
  {
    icon: Users,
    titre: 'Toutes les inscriptions au même endroit',
    texte: 'Suivez les demandes, confirmez les places et relancez les participants en un clic.',
  },
  {
    icon: BarChart3,
    titre: 'Remplissage en temps réel',
    texte: 'Visualisez le taux de remplissage de chaque formation et anticipez les sessions complètes.',
  },
  {
    icon: ShieldCheck,
    titre: 'Accès maîtrisé',
    texte: 'Un espace dédié à l’équipe, avec des rôles distincts pour l’administration et la formation.',
  },
]

export default function ConnexionPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr]">
      {/* ── Panneau de gauche (marque) ── */}
      <aside
        className="relative hidden lg:flex flex-col justify-between overflow-hidden px-14 py-12"
        style={{ background: '#1a100d' }}
      >
        {/* Décor */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 20% 15%, rgba(174,88,55,.35) 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 85% 80%, rgba(239,201,140,.16) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--gold) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(239,201,140,.4), transparent)' }}
          aria-hidden="true"
        />

        <div className="relative">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.25em] mb-6"
            style={{ color: 'rgba(239,201,140,.55)' }}
          >
            CLUB AI · Bujumbura
          </p>
          <h2
            className="text-[34px] leading-[1.15] tracking-tight mb-5 max-w-[420px]"
            style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, color: '#fff4e8' }}
          >
            Pilotez vos formations,{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,var(--gold),var(--copper))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              pas vos tableurs.
            </span>
          </h2>
          <p className="text-[15px] leading-relaxed max-w-[400px]" style={{ color: 'rgba(255,244,232,.55)' }}>
            Le tableau de bord centralise les inscriptions, les participants et
            le suivi des sessions — pour que l’équipe se concentre sur la
            pédagogie.
          </p>
        </div>

        {/* Arguments */}
        <div className="relative flex flex-col gap-5 my-10">
          {ARGUMENTS.map(({ icon: Icon, titre, texte }) => (
            <div key={titre} className="flex items-start gap-3.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(239,201,140,.1)', border: '1px solid rgba(239,201,140,.18)' }}
                aria-hidden="true"
              >
                <Icon size={15} style={{ color: 'var(--gold)' }} />
              </div>
              <div>
                <p className="text-[13.5px] font-semibold mb-0.5" style={{ color: '#fff4e8' }}>
                  {titre}
                </p>
                <p className="text-[12.5px] leading-relaxed" style={{ color: 'rgba(255,244,232,.42)' }}>
                  {texte}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Aperçu chiffres */}
        <div className="relative">
          <div
            className="rounded-2xl p-5 flex items-center justify-between gap-4"
            style={{
              background: 'rgba(255,244,232,.04)',
              border: '1px solid rgba(255,244,232,.08)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-1.5" style={{ color: 'rgba(255,244,232,.3)' }}>
                Inscriptions en cours
              </p>
              <p
                className="text-2xl leading-none"
                style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, color: 'var(--gold)' }}
              >
                {KPI.total}
              </p>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(255,244,232,.1)' }} aria-hidden="true" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-1.5" style={{ color: 'rgba(255,244,232,.3)' }}>
                Formations actives
              </p>
              <p
                className="text-2xl leading-none"
                style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, color: '#fff4e8' }}
              >
                {FORMATION_STATS.length}
              </p>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(255,244,232,.1)' }} aria-hidden="true" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-1.5" style={{ color: 'rgba(255,244,232,.3)' }}>
                Confirmées
              </p>
              <p
                className="text-2xl leading-none"
                style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, color: '#fff4e8' }}
              >
                {KPI.confirmees}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Formulaire ── */}
      <main className="flex items-center justify-center px-6 py-14 sm:px-10" style={{ background: '#f4eee5' }}>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  )
}
