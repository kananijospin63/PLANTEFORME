// ============================================================
// /admin — Vue d'ensemble du tableau de bord
// ============================================================

import Link from 'next/link'
import {
  ArrowUpRight,
  ArrowRight,
  Users,
  CheckCircle2,
  Banknote,
  Armchair,
  CalendarDays,
  MessageSquare,
  TrendingUp,
} from 'lucide-react'
import {
  KPI,
  INSCRIPTIONS,
  INSCRIPTIONS_PAR_JOUR,
  REPARTITION_FORMATIONS,
  MESSAGES,
  STATUT_META,
  TOTAL_INSCRITS_ACTIFS,
  TOTAL_PLACES,
  formatDate,
  formatFBU,
  formatHeure,
} from '@/data/admin'

const CARD: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(26,16,13,.08)',
  borderRadius: 16,
  boxShadow: '0 1px 2px rgba(26,16,13,.04)',
}

interface KpiDef {
  label: string
  valeur: string
  suffixe?: string
  detail: string
  icon: React.ElementType
  accent: string
  fond: string
}

const KPIS: KpiDef[] = [
  {
    label: 'Inscriptions',
    valeur: String(KPI.total),
    detail: `${INSCRIPTIONS.filter((i) => i.date >= '2026-11-20').length} sur les 3 derniers jours`,
    icon: Users,
    accent: 'var(--copper)',
    fond: 'rgba(174,88,55,.08)',
  },
  {
    label: 'Confirmées',
    valeur: String(KPI.confirmees),
    detail: `${KPI.tauxConfirmation} % du total`,
    icon: CheckCircle2,
    accent: '#0f7a52',
    fond: 'rgba(15,122,82,.08)',
  },
  {
    label: 'Revenus confirmés',
    valeur: formatFBU(KPI.revenus).replace(' FBU', ''),
    suffixe: 'FBU',
    detail: `${KPI.enAttente} paiements en attente`,
    icon: Banknote,
    accent: '#b3761a',
    fond: 'rgba(179,118,26,.1)',
  },
  {
    label: 'Places restantes',
    valeur: String(KPI.placesRestantes),
    detail: `Sur ${TOTAL_PLACES} places ouvertes`,
    icon: Armchair,
    accent: '#4c5fd5',
    fond: 'rgba(76,95,213,.08)',
  },
]

export default function AdminDashboardPage() {
  const maxJour = Math.max(...INSCRIPTIONS_PAR_JOUR.map((j) => j.total), 1)
  const recentes = [...INSCRIPTIONS]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 6)
  const nonLus = MESSAGES.filter((m) => !m.lu)

  return (
    <div className="flex flex-col gap-5">
      {/* ── Bandeau de bienvenue ── */}
      <section
        className="relative overflow-hidden rounded-2xl px-6 py-6 sm:px-8"
        style={{ background: '#1a100d' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 120% at 88% 10%, rgba(174,88,55,.45) 0%, transparent 62%), radial-gradient(ellipse 40% 80% at 60% 100%, rgba(239,201,140,.12) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(239,201,140,.6)' }}>
              Session du 14 – 19 décembre 2026
            </p>
            <h2
              className="text-[22px] sm:text-[26px] leading-tight tracking-tight mb-2"
              style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, color: '#fff4e8' }}
            >
              {KPI.enAttente} inscriptions à confirmer
            </h2>
            <p className="text-[13px] max-w-[440px] leading-relaxed" style={{ color: 'rgba(255,244,232,.5)' }}>
              Les demandes en attente depuis plus de 48 heures risquent
              d’annuler leur place. Traitez-les en priorité.
            </p>
          </div>
          <Link
            href="/admin/inscriptions"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-[13px] font-bold shrink-0 transition-transform hover:-translate-y-px"
            style={{
              fontFamily: 'var(--font-unbounded)',
              background: 'linear-gradient(135deg,var(--gold),var(--copper))',
              color: '#1a100d',
              boxShadow: '0 4px 18px rgba(174,88,55,.4)',
            }}
          >
            Traiter les demandes
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ── KPIs ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" aria-label="Indicateurs clés">
        {KPIS.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="p-5" style={CARD}>
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: kpi.fond }}
                  aria-hidden="true"
                >
                  <Icon size={16} style={{ color: kpi.accent }} />
                </div>
                <ArrowUpRight size={14} style={{ color: 'rgba(26,16,13,.2)' }} aria-hidden="true" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: 'rgba(26,16,13,.4)' }}>
                {kpi.label}
              </p>
              <p className="flex items-baseline gap-1.5 leading-none">
                <span style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, fontSize: 24, color: '#1a100d' }}>
                  {kpi.valeur}
                </span>
                {kpi.suffixe && (
                  <span className="text-[11px] font-bold" style={{ color: 'rgba(26,16,13,.4)' }}>
                    {kpi.suffixe}
                  </span>
                )}
              </p>
              <p className="text-[11px] mt-2" style={{ color: 'rgba(26,16,13,.42)' }}>
                {kpi.detail}
              </p>
            </div>
          )
        })}
      </section>

      {/* ── Graphique + répartition ── */}
      <section className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-4">
        {/* Histogramme */}
        <div className="p-5 sm:p-6" style={CARD}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-[14px] font-bold mb-1" style={{ color: '#1a100d' }}>
                Inscriptions par jour
              </h3>
              <p className="text-[11.5px]" style={{ color: 'rgba(26,16,13,.45)' }}>
                12 derniers jours · {INSCRIPTIONS_PAR_JOUR.reduce((s, j) => s + j.total, 0)} demandes
              </p>
            </div>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold"
              style={{ background: 'rgba(15,122,82,.09)', color: '#0f7a52' }}
            >
              <TrendingUp size={12} aria-hidden="true" />
              +18 %
            </span>
          </div>

          <div className="flex items-end gap-1.5 sm:gap-2.5 h-[168px]" role="img" aria-label="Histogramme des inscriptions quotidiennes">
            {INSCRIPTIONS_PAR_JOUR.map((jour, index) => {
              const hauteur = Math.max((jour.total / maxJour) * 100, 4)
              const dernier = index === INSCRIPTIONS_PAR_JOUR.length - 1
              return (
                <div key={jour.date} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
                  <span className="text-[10px] font-bold" style={{ color: dernier ? 'var(--copper)' : 'rgba(26,16,13,.35)' }}>
                    {jour.total}
                  </span>
                  <div
                    className="w-full rounded-t-md transition-all hover:opacity-80"
                    style={{
                      height: `${hauteur}%`,
                      background: dernier
                        ? 'linear-gradient(180deg,var(--gold),var(--copper))'
                        : 'rgba(174,88,55,.22)',
                      minHeight: 6,
                    }}
                    title={`${jour.label} : ${jour.total} inscription(s)`}
                  />
                </div>
              )
            })}
          </div>

          <div className="flex gap-1.5 sm:gap-2.5 mt-2 pt-2" style={{ borderTop: '1px solid rgba(26,16,13,.06)' }}>
            {INSCRIPTIONS_PAR_JOUR.map((jour) => (
              <span key={jour.date} className="flex-1 text-center text-[9.5px]" style={{ color: 'rgba(26,16,13,.35)' }}>
                {jour.label}
              </span>
            ))}
          </div>
        </div>

        {/* Répartition */}
        <div className="p-5 sm:p-6 flex flex-col" style={CARD}>
          <h3 className="text-[14px] font-bold mb-1" style={{ color: '#1a100d' }}>
            Remplissage par formation
          </h3>
          <p className="text-[11.5px] mb-5" style={{ color: 'rgba(26,16,13,.45)' }}>
            {TOTAL_INSCRITS_ACTIFS} inscrits sur {TOTAL_PLACES} places
          </p>

          <div className="flex flex-col gap-4">
            {REPARTITION_FORMATIONS.map((f) => (
              <div key={f.slug}>
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <p className="text-[12.5px] font-semibold truncate" style={{ color: '#1a100d' }}>
                    {f.titre}
                  </p>
                  <p className="text-[11.5px] font-bold shrink-0" style={{ color: f.remplissage >= 80 ? '#a13a2f' : 'rgba(26,16,13,.5)' }}>
                    {f.inscrits}/{f.capacite}
                  </p>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(26,16,13,.07)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${f.remplissage}%`,
                      background:
                        f.remplissage >= 80
                          ? 'linear-gradient(90deg,var(--copper),#a13a2f)'
                          : 'linear-gradient(90deg,var(--gold),var(--copper))',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/admin/formations"
            className="mt-auto pt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold transition-colors hover:opacity-70"
            style={{ color: 'var(--copper)' }}
          >
            Voir le catalogue
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ── Dernières inscriptions + messages ── */}
      <section className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-4">
        {/* Tableau */}
        <div style={CARD} className="overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4" style={{ borderBottom: '1px solid rgba(26,16,13,.07)' }}>
            <h3 className="text-[14px] font-bold" style={{ color: '#1a100d' }}>
              Dernières inscriptions
            </h3>
            <Link
              href="/admin/inscriptions"
              className="inline-flex items-center gap-1 text-[11.5px] font-semibold transition-colors hover:opacity-70"
              style={{ color: 'var(--copper)' }}
            >
              Tout voir
              <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 520 }}>
              <thead>
                <tr style={{ background: 'rgba(26,16,13,.02)' }}>
                  {['Participant', 'Formation', 'Date', 'Statut'].map((th) => (
                    <th
                      key={th}
                      className="px-5 sm:px-6 py-2.5 text-[9.5px] font-bold uppercase tracking-[0.12em] whitespace-nowrap"
                      style={{ color: 'rgba(26,16,13,.4)' }}
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentes.map((ins) => {
                  const meta = STATUT_META[ins.statut]
                  return (
                    <tr key={ins.id} style={{ borderTop: '1px solid rgba(26,16,13,.055)' }}>
                      <td className="px-5 sm:px-6 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{ background: 'rgba(174,88,55,.1)', color: 'var(--copper)' }}
                            aria-hidden="true"
                          >
                            {ins.prenom[0]}{ins.nom[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12.5px] font-semibold truncate" style={{ color: '#1a100d' }}>
                              {ins.prenom} {ins.nom}
                            </p>
                            <p className="text-[10.5px] truncate" style={{ color: 'rgba(26,16,13,.42)' }}>
                              {ins.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 sm:px-6 py-3">
                        <span className="text-[11.5px]" style={{ color: 'rgba(26,16,13,.65)' }}>
                          {ins.formation}
                        </span>
                      </td>
                      <td className="px-5 sm:px-6 py-3">
                        <span className="text-[11.5px] whitespace-nowrap" style={{ color: 'rgba(26,16,13,.5)' }}>
                          {formatDate(ins.date)}
                        </span>
                      </td>
                      <td className="px-5 sm:px-6 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10.5px] font-semibold whitespace-nowrap"
                          style={{ background: meta.fond, color: meta.couleur }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.point }} aria-hidden="true" />
                          {meta.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Messages */}
        <div style={CARD} className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(26,16,13,.07)' }}>
            <h3 className="text-[14px] font-bold" style={{ color: '#1a100d' }}>
              Messages
            </h3>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-md"
              style={{ background: 'rgba(174,88,55,.1)', color: 'var(--copper)' }}
            >
              {nonLus.length} non lus
            </span>
          </div>

          <ul className="flex flex-col">
            {MESSAGES.slice(0, 4).map((msg) => (
              <li key={msg.id} style={{ borderTop: '1px solid rgba(26,16,13,.055)' }}>
                <Link
                  href="/admin/messages"
                  className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-black/[0.02]"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: msg.lu ? 'rgba(26,16,13,.05)' : 'rgba(239,201,140,.28)',
                      color: msg.lu ? 'rgba(26,16,13,.4)' : '#8a5a2b',
                    }}
                    aria-hidden="true"
                  >
                    <MessageSquare size={13} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold truncate" style={{ color: '#1a100d' }}>
                      {msg.sujet}
                    </p>
                    <p className="text-[11px] truncate" style={{ color: 'rgba(26,16,13,.45)' }}>
                      {msg.auteur}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(26,16,13,.32)' }}>
                      {formatHeure(msg.date)}
                    </p>
                  </div>
                  {!msg.lu && (
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: 'var(--copper)' }} aria-hidden="true" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto p-4" style={{ borderTop: '1px solid rgba(26,16,13,.07)' }}>
            <Link
              href="/admin/messages"
              className="flex items-center justify-center gap-2 h-9 rounded-xl text-[12px] font-semibold transition-colors"
              style={{ background: 'rgba(26,16,13,.04)', color: 'rgba(26,16,13,.7)' }}
            >
              Ouvrir la messagerie
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Prochaine session ── */}
      <section className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between" style={CARD}>
        <div className="flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(239,201,140,.2)' }}
            aria-hidden="true"
          >
            <CalendarDays size={18} style={{ color: '#8a5a2b' }} />
          </div>
          <div>
            <p className="text-[13px] font-bold mb-0.5" style={{ color: '#1a100d' }}>
              Prochaine session — 14 au 19 décembre 2026
            </p>
            <p className="text-[11.5px]" style={{ color: 'rgba(26,16,13,.45)' }}>
              Centre CEPRODILUC, Bujumbura · 15h00 – 19h00 · 4 formations
            </p>
          </div>
        </div>
        <Link
          href="/admin/formations"
          className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl text-[12px] font-semibold shrink-0"
          style={{ background: 'rgba(26,16,13,.04)', color: 'rgba(26,16,13,.7)' }}
        >
          Détail des sessions
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}
