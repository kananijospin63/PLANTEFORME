'use client'

// ============================================================
// /admin/participants — répertoire des participants
// ============================================================

import { useMemo, useState } from 'react'
import { Search, Mail, Phone, ChevronDown } from 'lucide-react'
import { INSCRIPTIONS, STATUT_META, formatDate, type NiveauIA } from '@/data/admin'

const CARD: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(26,16,13,.08)',
  borderRadius: 16,
  boxShadow: '0 1px 2px rgba(26,16,13,.04)',
}

const NIVEAUX: NiveauIA[] = ['Débutant', 'Intermédiaire', 'Avancé']

const NIVEAU_COULEUR: Record<NiveauIA, { bg: string; color: string }> = {
  'Débutant':      { bg: 'rgba(15,122,82,.09)',  color: '#0f7a52' },
  'Intermédiaire': { bg: 'rgba(179,118,26,.12)', color: '#b3761a' },
  'Avancé':        { bg: 'rgba(76,95,213,.09)',  color: '#4c5fd5' },
}

export default function AdminParticipantsPage() {
  const [recherche, setRecherche] = useState('')
  const [niveau, setNiveau] = useState<'TOUS' | NiveauIA>('TOUS')

  const participants = useMemo(() => {
    const q = recherche.trim().toLowerCase()

    return INSCRIPTIONS.filter((p) => {
      const matchQ =
        !q ||
        `${p.prenom} ${p.nom}`.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
      const matchNiveau = niveau === 'TOUS' || p.niveau === niveau
      return matchQ && matchNiveau
    })
  }, [recherche, niveau])

  const repartition = NIVEAUX.map((n) => ({
    niveau: n,
    total: INSCRIPTIONS.filter((p) => p.niveau === n).length,
  }))

  return (
    <div className="flex flex-col gap-4">
      {/* Répartition par niveau */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {repartition.map((r) => (
          <div key={r.niveau} className="p-5" style={CARD}>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: 'rgba(26,16,13,.4)' }}>
              Niveau {r.niveau}
            </p>
            <div className="flex items-baseline gap-2">
              <span style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, fontSize: 22, color: '#1a100d' }}>
                {r.total}
              </span>
              <span className="text-[11.5px]" style={{ color: 'rgba(26,16,13,.45)' }}>
                participants
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mt-3" style={{ background: 'rgba(26,16,13,.07)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.round((r.total / INSCRIPTIONS.length) * 100)}%`,
                  background: NIVEAU_COULEUR[r.niveau].color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recherche */}
      <div className="p-4 flex flex-col sm:flex-row gap-3" style={CARD}>
        <div className="flex items-center gap-2 h-10 px-3.5 rounded-xl flex-1" style={{ background: 'rgba(26,16,13,.04)' }}>
          <Search size={15} style={{ color: 'rgba(26,16,13,.35)' }} aria-hidden="true" />
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un participant…"
            aria-label="Rechercher un participant"
            className="flex-1 bg-transparent outline-none text-[12.5px] placeholder:text-[#9a8d82]"
            style={{ color: '#1a100d' }}
          />
        </div>

        <div className="relative shrink-0">
          <select
            value={niveau}
            onChange={(e) => setNiveau(e.target.value as 'TOUS' | NiveauIA)}
            aria-label="Filtrer par niveau"
            className="h-10 pl-3.5 pr-8 rounded-xl text-[12.5px] outline-none appearance-none cursor-pointer w-full sm:w-[190px]"
            style={{ background: 'rgba(26,16,13,.04)', color: '#1a100d', border: 'none' }}
          >
            <option value="TOUS">Tous les niveaux</option>
            {NIVEAUX.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'rgba(26,16,13,.35)' }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Grille de participants */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {participants.map((p) => {
          const meta = STATUT_META[p.statut]
          const niveauMeta = NIVEAU_COULEUR[p.niveau]

          return (
            <article key={p.id} className="p-5 flex flex-col" style={CARD}>
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-bold shrink-0"
                  style={{ background: 'linear-gradient(135deg,var(--gold),var(--copper))', color: '#1a100d' }}
                  aria-hidden="true"
                >
                  {p.prenom[0]}{p.nom[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold truncate" style={{ color: '#1a100d' }}>
                    {p.prenom} {p.nom}
                  </p>
                  <p className="text-[10.5px] truncate" style={{ color: 'rgba(26,16,13,.45)' }}>
                    {p.reference}
                  </p>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-1 rounded-md shrink-0"
                  style={{ background: niveauMeta.bg, color: niveauMeta.color }}
                >
                  {p.niveau}
                </span>
              </div>

              <p className="text-[11.5px] mb-3 line-clamp-2" style={{ color: 'rgba(26,16,13,.6)' }}>
                {p.formation}
              </p>

              <div className="flex items-center justify-between gap-2 mt-auto pt-3" style={{ borderTop: '1px solid rgba(26,16,13,.06)' }}>
                <span
                  className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold"
                  style={{ color: meta.couleur }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.point }} aria-hidden="true" />
                  {meta.label}
                </span>
                <span className="text-[10.5px]" style={{ color: 'rgba(26,16,13,.35)' }}>
                  {formatDate(p.date)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-3">
                <a
                  href={`mailto:${p.email}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-lg text-[11px] font-semibold transition-colors hover:bg-black/5"
                  style={{ background: 'rgba(26,16,13,.03)', color: 'rgba(26,16,13,.65)' }}
                >
                  <Mail size={12} aria-hidden="true" />
                  Email
                </a>
                <a
                  href={`https://wa.me/${p.telephone.replace(/[^\d]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 rounded-lg text-[11px] font-semibold transition-colors hover:bg-black/5"
                  style={{ background: 'rgba(26,16,13,.03)', color: 'rgba(26,16,13,.65)' }}
                >
                  <Phone size={12} aria-hidden="true" />
                  WhatsApp
                </a>
              </div>
            </article>
          )
        })}
      </div>

      {participants.length === 0 && (
        <div className="px-6 py-14 text-center" style={CARD}>
          <p className="text-[13px] font-semibold" style={{ color: '#1a100d' }}>
            Aucun participant trouvé
          </p>
          <p className="text-[12px] mt-1" style={{ color: 'rgba(26,16,13,.45)' }}>
            Essayez un autre nom ou changez de niveau.
          </p>
        </div>
      )}
    </div>
  )
}
