// ============================================================
// /admin/formations — catalogue et remplissage des sessions
// ============================================================

import Link from 'next/link'
import {
  GraduationCap,
  Users,
  ArrowRight,
  Clock,
  MapPin,
  ExternalLink,
  Banknote,
} from 'lucide-react'
import { FORMATION_STATS, formatFBU } from '@/data/admin'
import { FORMATIONS, getCategorieLabel } from '@/data/formations'

const CARD: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(26,16,13,.08)',
  borderRadius: 16,
  boxShadow: '0 1px 2px rgba(26,16,13,.04)',
}

export default function AdminFormationsPage() {
  const totalInscrits = FORMATION_STATS.reduce((s, f) => s + f.inscrits, 0)
  const totalPlaces = FORMATION_STATS.reduce((s, f) => s + f.capacite, 0)
  const revenus = FORMATION_STATS.reduce((s, f) => s + f.revenus, 0)

  return (
    <div className="flex flex-col gap-4">
      {/* Résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Formations actives', valeur: String(FORMATION_STATS.length), icon: GraduationCap },
          { label: 'Taux de remplissage', valeur: `${Math.round((totalInscrits / totalPlaces) * 100)} %`, icon: Users },
          { label: 'Revenus projetés', valeur: formatFBU(revenus), icon: Banknote },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="p-5 flex items-center gap-3.5" style={CARD}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(174,88,55,.08)' }}
                aria-hidden="true"
              >
                <Icon size={17} style={{ color: 'var(--copper)' }} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: 'rgba(26,16,13,.4)' }}>
                  {item.label}
                </p>
                <p className="text-[17px] leading-none truncate" style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, color: '#1a100d' }}>
                  {item.valeur}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Cartes formations */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {FORMATIONS.map((formation, index) => {
          const stats = FORMATION_STATS[index]
          const complet = stats.remplissage >= 90

          return (
            <article key={formation.slug} className="flex flex-col overflow-hidden" style={CARD}>
              {/* En-tête */}
              <div className="p-5 pb-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-1 rounded-md"
                    style={{ background: 'rgba(239,201,140,.22)', color: '#8a5a2b' }}
                  >
                    {getCategorieLabel(formation.categorie)}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-1 rounded-md"
                    style={{
                      background: complet ? 'rgba(161,58,47,.09)' : 'rgba(15,122,82,.09)',
                      color: complet ? '#a13a2f' : '#0f7a52',
                    }}
                  >
                    {complet ? 'Presque complet' : 'Ouverte'}
                  </span>
                </div>

                <h3 className="text-[14px] leading-snug mb-2" style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, color: '#1a100d' }}>
                  {formation.titreCourt}
                </h3>
                <p className="text-[11.5px] leading-relaxed line-clamp-2" style={{ color: 'rgba(26,16,13,.5)' }}>
                  {formation.description}
                </p>
              </div>

              {/* Remplissage */}
              <div className="px-5 pb-4">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-[11px] font-semibold" style={{ color: 'rgba(26,16,13,.55)' }}>
                    {stats.inscrits} inscrits sur {stats.capacite}
                  </span>
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: complet ? '#a13a2f' : 'var(--copper)' }}
                  >
                    {stats.remplissage} %
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(26,16,13,.07)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${stats.remplissage}%`,
                      background: complet
                        ? 'linear-gradient(90deg,var(--copper),#a13a2f)'
                        : 'linear-gradient(90deg,var(--gold),var(--copper))',
                    }}
                  />
                </div>
              </div>

              {/* Méta */}
              <div className="px-5 pb-4 grid grid-cols-2 gap-2.5">
                <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(26,16,13,.5)' }}>
                  <Clock size={12} aria-hidden="true" />
                  {formation.horaire}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(26,16,13,.5)' }}>
                  <MapPin size={12} aria-hidden="true" />
                  {formation.lieu.ville}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(26,16,13,.5)' }}>
                  <Users size={12} aria-hidden="true" />
                  {formation.duree}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(26,16,13,.5)' }}>
                  <Banknote size={12} aria-hidden="true" />
                  {formation.prix}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-auto flex items-center gap-2 px-5 py-3.5" style={{ borderTop: '1px solid rgba(26,16,13,.07)' }}>
                <Link
                  href={`/formations/${formation.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-[11.5px] font-semibold transition-colors hover:bg-black/5"
                  style={{ background: 'rgba(26,16,13,.04)', color: 'rgba(26,16,13,.7)' }}
                >
                  <ExternalLink size={12} aria-hidden="true" />
                  Fiche publique
                </Link>
                <Link
                  href={`/admin/inscriptions?formation=${formation.slug}`}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-[11.5px] font-bold ml-auto transition-transform hover:-translate-y-px"
                  style={{ background: 'linear-gradient(135deg,var(--gold),var(--copper))', color: '#1a100d' }}
                >
                  Voir les inscrits
                  <ArrowRight size={12} aria-hidden="true" />
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
