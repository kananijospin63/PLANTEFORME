// ============================================================
// StatsSection — Espresso / Café Premium
// ============================================================

import SectionTitle from '@/components/ui/SectionTitle'
import { getAllFormations } from '@/data/formations'

const STATS = [
  { value:'20 %', label:'Théorie',      description:"Seulement le minimum nécessaire pour comprendre les concepts fondamentaux.",              accent:false, progress:20   },
  { value:'80 %', label:'Pratique',     description:"La majorité du temps est consacrée à la mise en application directe.",                   accent:true,  progress:80   },
  { value:String(getAllFormations().length), label:'Formations', description:"Des parcours complémentaires adaptés à différents profils et besoins.",     accent:false, progress:null },
  { value:'1',    label:'Projet final', description:"Chaque formation se conclut par un projet concret directement réutilisable.",             accent:false, progress:null },
  { value:'3–4h', label:'Par jour',     description:"Chaque journée dure entre 3 et 4 heures, en matinée ou en après-midi.",                  accent:false, progress:null },
]

export default function StatsSection() {
  return (
    <section className="py-20 md:py-24 overflow-hidden relative" style={{ background:'#f4eee5' }} aria-labelledby="stats-title">
      {/* Aurora flottante */}
      <div
        className="absolute rounded-full pointer-events-none animate-aurora"
        style={{
          width:600, height:400,
          top:'50%', left:'50%',
          transform:'translate(-50%,-50%)',
          background:'radial-gradient(ellipse, rgba(174,88,55,.1) 0%, transparent 70%)',
          filter:'blur(50px)',
        }}
        aria-hidden="true"
      />
      {/* Points */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage:'radial-gradient(circle, rgba(174,88,55,.5) 1px, transparent 1px)', backgroundSize:'36px 36px' }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-14 md:mb-16">
          <SectionTitle
            eyebrow="L'approche CLUB AI"
            title="Des chiffres qui reflètent notre philosophie."
            id="stats-title"
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {STATS.map((s,i) => (
            <div
              key={s.label}
              className="stat-card rounded-2xl p-6 animate-slide-up"
              style={{
                background:  s.accent ? 'rgba(239,201,140,.22)' : '#ffffff',
                border:      s.accent ? '1px solid rgba(174,88,55,.22)' : '1px solid rgba(26,16,13,.08)',
                animationDelay: `${i*.07}s`,
                cursor:'default',
                boxShadow: s.accent ? '0 8px 24px rgba(174,88,55,.12)' : '0 1px 2px rgba(26,16,13,.04)',
              }}
            >
              <div className="mb-3">
                <span
                  className="font-black tracking-tight leading-none"
                  style={{
                    fontFamily: 'var(--font-unbounded)',
                    fontSize:   'clamp(2rem,4vw,3rem)',
                    color:      s.accent ? 'var(--copper)' : '#1a100d',
                  }}
                  aria-label={`${s.value} ${s.label}`}
                >
                  {s.value}
                </span>
              </div>

              <p
                className="text-[10px] font-bold tracking-widest uppercase mb-2.5"
                style={{ color: s.accent ? 'rgba(174,88,55,.75)' : 'rgba(26,16,13,.45)' }}
              >
                {s.label}
              </p>

              {/* Barre de progression */}
              {s.progress !== null && (
                <div className="h-0.5 rounded-full mb-2.5" style={{ background:'rgba(26,16,13,.08)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width:`${s.progress}%`, background: s.accent ? 'linear-gradient(90deg,var(--gold),var(--copper))' : 'rgba(26,16,13,.25)' }}
                  />
                </div>
              )}

              <p className="text-xs leading-relaxed hidden md:block" style={{ color:'rgba(26,16,13,.5)' }}>
                {s.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-center" style={{ color:'rgba(26,16,13,.35)' }}>
          Une approche pédagogique conçue pour produire des résultats immédiats.
        </p>
      </div>
    </section>
  )
}
