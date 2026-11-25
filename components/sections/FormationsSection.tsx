// ============================================================
// FormationsSection — Espresso / Café Premium
// ============================================================

import SectionTitle from '@/components/ui/SectionTitle'
import FormationCard from '@/components/formations/FormationCard'
import Button from '@/components/ui/Button'
import type { Formation } from '@/types'

export default function FormationsSection({ formations }: { formations: Formation[] }) {
  return (
    <section className="py-20 md:py-24" style={{ background:'#f4eee5' }} aria-labelledby="formations-section-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-14">
          <SectionTitle
            eyebrow="Programme 2026"
            title="Choisissez votre formation."
            subtitle="Des parcours complémentaires pour maîtriser l'IA, automatiser votre travail et développer votre activité."
            id="formations-section-title"
          />
          <div className="shrink-0">
            <Button variant="outline" size="md" href="/formations" style={{ borderColor:'rgba(174,88,55,.35)', color:'#3d1f12' }}>
              Voir toutes les formations
            </Button>
          </div>
        </div>

        {/* Grille */}
        <div className="formations-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.map((f,i) => (
            <div key={f.id} className={`animate-slide-up-${Math.min(i+1,8)}`}>
              <FormationCard formation={f} featured={i===0} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
