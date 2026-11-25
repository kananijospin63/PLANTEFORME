// ============================================================
// HeroSection — Espresso / Café Premium + Aurora + TypeWriter
// ============================================================

import { ArrowRight, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import HeroImages3D from '@/components/sections/HeroImages3D'
import { DATE_COMMUNE, LIEU_COMMUN, getAllFormations } from '@/data/formations'

const STATS = [
  { value:String(getAllFormations().length), label:'formations'  },
  { value:'80%',      label:'pratique'    },
  { value:'4h',       label:'par session' },
  { value:'150K FBU', label:'prix unique' },
]

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop:'80px', background:'#1a100d' }}
      aria-labelledby="hero-title"
    >
      {/* ── Background image cerveau ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:    'url(/images/background2.jpg)',
          backgroundSize:     'cover',
          backgroundPosition: 'center',
          backgroundRepeat:   'no-repeat',
        }}
        aria-hidden="true"
      />

      {/* ── Overlay espresso semi-transparent ── */}
      <div className="absolute inset-0 z-[1]" style={{ background:'rgba(16,8,5,.75)' }} aria-hidden="true" />
      <div
        className="absolute inset-0 z-[2]"
        style={{ background:'linear-gradient(90deg, rgba(16,8,5,.95) 0%, rgba(16,8,5,.7) 45%, rgba(16,8,5,.3) 100%)' }}
        aria-hidden="true"
      />

      {/* ── Aurora flottante ── */}
      <div
        className="absolute z-[3] pointer-events-none animate-aurora"
        style={{
          width:800, height:600,
          top:'50%', left:'30%',
          transform:'translate(-50%,-50%)',
          background:'radial-gradient(ellipse, rgba(174,88,55,.2) 0%, transparent 60%)',
          filter:'blur(60px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute z-[3] pointer-events-none"
        style={{
          width:400, height:300,
          top:'20%', right:'20%',
          background:'radial-gradient(ellipse, rgba(239,201,140,.1) 0%, transparent 70%)',
          filter:'blur(40px)',
        }}
        aria-hidden="true"
      />

      {/* ── Bordure or gauche ── */}
      <div
        className="absolute left-0 top-[15%] bottom-[15%] w-0.5 z-[4] rounded-full"
        style={{ background:'linear-gradient(to bottom, transparent, var(--gold), transparent)' }}
        aria-hidden="true"
      />

      {/* ── Contenu ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 w-full z-[10]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8 items-center">

          {/* ── Colonne gauche ── */}
          <div className="flex flex-col">

            {/* Pill date */}
            <div className="hero-pill mb-7 inline-flex w-fit animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:'var(--gold)' }} />
              {DATE_COMMUNE} · {LIEU_COMMUN.ville}
            </div>

            {/* Label */}
            <p className="label-upper mb-4 animate-slide-up-1">
              Formations en Intelligence Artificielle
            </p>

            {/* Titre — statique avec dégradé, sans TypeWriter pour éviter les coupures */}
            <h1
              id="hero-title"
              className="font-bold leading-[1.1] tracking-tight mb-6 animate-slide-up-2"
              style={{
                fontFamily: 'var(--font-unbounded)',
                fontSize:   'clamp(2rem, 4.5vw, 3.8rem)',
                color:      '#fff4e8',
              }}
            >
              Transformez l&apos;IA en{' '}
              <span style={{
                background: 'linear-gradient(135deg,var(--gold),var(--copper))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                avantage concret.
              </span>
            </h1>

            {/* Sous-titre */}
            <p
              className="text-base md:text-lg leading-relaxed max-w-lg mb-8 animate-slide-up-3"
              style={{ color:'rgba(255,244,232,.62)' }}
            >
              Des formations pratiques pour maîtriser l&apos;intelligence artificielle,
              automatiser votre travail et développer votre activité — à Bujumbura.
            </p>

            {/* Garanties */}
            <div className="flex flex-wrap gap-4 mb-10 animate-slide-up-4">
              {['Aucune technicité requise','Projet final concret','Places limitées'].map(g => (
                <div key={g} className="flex items-center gap-2">
                  <CheckCircle size={14} style={{ color:'var(--gold)', flexShrink:0 }} />
                  <span className="text-sm font-medium" style={{ color:'rgba(255,244,232,.6)' }}>{g}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start gap-3 mb-12 animate-slide-up-5">
              <Button variant="gold" size="lg" href="/formations">
                Découvrir les formations
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="/inscription"
                style={{ borderColor:'rgba(239,201,140,.4)', color:'#fff4e8', background:'rgba(255,244,232,.05)' }}
              >
                Je m&apos;inscris
              </Button>
            </div>

            {/* Stats */}
            <div className="animate-slide-up-6">
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color:'rgba(255,244,232,.22)' }}>
                En un coup d&apos;œil
              </p>
              <div className="flex flex-wrap gap-3">
                {STATS.map(s => (
                  <div
                    key={s.label}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                    style={{ background:'rgba(255,244,232,.05)', border:'1px solid rgba(255,244,232,.08)' }}
                  >
                    <span
                      className="text-lg font-bold leading-none"
                      style={{ fontFamily:'var(--font-unbounded)', color:'#fff4e8' }}
                    >
                      {s.value}
                    </span>
                    <span className="text-xs" style={{ color:'rgba(255,244,232,.4)' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Colonne droite : orbite 3D ── */}
          <div className="hidden lg:flex items-center justify-center animate-fade-in lg:scale-90 xl:scale-100" style={{ minHeight:560 }}>
            <HeroImages3D />
          </div>
        </div>
      </div>

      {/* Dégradé bas */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[10]"
        style={{ background:'linear-gradient(to bottom, transparent, rgba(16,8,5,.7))' }}
        aria-hidden="true"
      />
    </section>
  )
}
