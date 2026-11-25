'use client'

// ============================================================
// FormationCard — Espresso uniforme (toutes les cartes idem)
// Infos épurées : on garde titre, description, niveaux, date, prix
// ============================================================

import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Brain, Workflow, TrendingUp, Code2 } from 'lucide-react'
import type { Formation } from '@/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { getCategorieLabel, getMomentLabel } from '@/data/formations'

interface FormationCardProps {
  formation: Formation
  featured?: boolean   // gardé pour compatibilité mais n'impacte plus le fond
}

const categorieIcon: Record<Formation['categorie'], React.ElementType> = {
  'outils-ia':      Brain,
  'automatisation': Workflow,
  'entrepreneuriat': TrendingUp,
}

const FORMATION_INDEX: Record<string, number> = {
  'maitriser-chatgpt-gemini-claude':      1,
  'automatiser-son-travail-n8n-make':     2,
  'ia-pour-entrepreneurs-professionnels': 3,
  'dev-applications-web-ia':              4,
}

const niveauDot: Record<string, string> = {
  debutant:      '#059669',
  intermediaire: 'var(--gold)',
  avance:        'var(--copper)',
}

export default function FormationCard({ formation }: FormationCardProps) {
  const index = FORMATION_INDEX[formation.slug] ?? 1
  const Icon  = categorieIcon[formation.categorie] ?? Code2

  return (
    <article
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-[220ms]"
      style={{
        background:  '#1a100d',
        border:      '1px solid rgba(239,201,140,.15)',
        boxShadow:   '0 2px 8px rgba(26,16,13,.4)',
        cursor:      'default',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform   = 'translateY(-5px) perspective(600px) rotateX(1.5deg) rotateY(-1deg)'
        el.style.boxShadow   = '0 20px 60px rgba(26,16,13,.6), 0 4px 16px rgba(239,201,140,.18)'
        el.style.borderColor = 'rgba(239,201,140,.35)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform   = 'translateY(0) perspective(600px) rotateX(0) rotateY(0)'
        el.style.boxShadow   = '0 2px 8px rgba(26,16,13,.4)'
        el.style.borderColor = 'rgba(239,201,140,.15)'
      }}
    >
      {/* Motif diagonal subtil */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage:'repeating-linear-gradient(45deg,var(--gold) 0,var(--gold) 1px,transparent 1px,transparent 20px)' }}
        aria-hidden="true"
      />
      {/* Bordure or gauche */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 pointer-events-none"
        style={{ background:'linear-gradient(to bottom, transparent, rgba(239,201,140,.5), transparent)' }}
        aria-hidden="true"
      />

      {/* ── En-tête ── */}
      <div className="relative px-6 pt-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex flex-col gap-2">
            {/* Numéro */}
            <span
              className="leading-none transition-colors duration-200 group-hover:text-[var(--gold)]"
              style={{ fontFamily:'var(--font-unbounded)', fontWeight:900, fontSize:28, color:'rgba(239,201,140,.6)' }}
              aria-label={`Formation ${index}`}
            >
              {String(index).padStart(2,'0')}
            </span>
            <Badge variant="gold" size="sm">{getCategorieLabel(formation.categorie)}</Badge>
          </div>

          {/* Icône */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110 group-hover:rotate-3 group-hover:border-[rgba(239,201,140,.4)]"
            style={{ background:'rgba(239,201,140,.1)', border:'1px solid rgba(239,201,140,.15)' }}
            aria-hidden="true"
          >
            <Icon size={20} style={{ color:'var(--gold)' }} />
          </div>
        </div>

        {/* Titre */}
        <h3
          className="leading-tight tracking-tight"
          style={{ fontFamily:'var(--font-unbounded)', fontWeight:700, fontSize:14, color:'#fff4e8', letterSpacing:'-.01em' }}
        >
          {formation.titre}
        </h3>
      </div>

      {/* ── Corps ── */}
      <div className="flex flex-col flex-1 px-6 pb-6 gap-5">

        {/* Description */}
        <p className="text-sm leading-relaxed" style={{ color:'rgba(255,244,232,.55)' }}>
          {formation.description}
        </p>

        {/* Niveaux */}
        {formation.niveau?.length > 0 && (
          <div className="flex items-center gap-1.5">
            {formation.niveau.map(n => (
              <span key={n} className="w-2 h-2 rounded-full" style={{ background:niveauDot[n] ?? 'var(--copper)' }} title={n} />
            ))}
            <span className="text-[10px] ml-1 tracking-wide" style={{ color:'rgba(255,244,232,.35)' }}>
              {formation.niveau.map(n => n.charAt(0).toUpperCase()+n.slice(1)).join(' · ')}
            </span>
          </div>
        )}

        {/* Période + horaire */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs" style={{ color:'rgba(255,244,232,.45)' }}>
            <Calendar size={12} style={{ color:'var(--copper)', flexShrink:0 }} aria-hidden="true" />
            <span className="truncate">{formation.date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs flex-wrap" style={{ color:'rgba(255,244,232,.45)' }}>
            <Clock size={12} style={{ color:'var(--copper)', flexShrink:0 }} aria-hidden="true" />
            <span className="whitespace-nowrap">{formation.horaire}</span>
            {formation.moment && (
              <span
                className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded transition-colors duration-200 group-hover:bg-[rgba(239,201,140,.18)]"
                style={{ background:'rgba(239,201,140,.1)', color:'rgba(239,201,140,.75)' }}
              >
                {getMomentLabel(formation.moment)}
              </span>
            )}
          </div>
        </div>

        {/* Séparateur */}
        <div style={{ borderTop:'1px solid rgba(255,244,232,.07)' }} aria-hidden="true" />

        {/* Prix */}
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color:'rgba(255,244,232,.3)' }}>Prix</p>
            <p
              className="font-black tracking-tight whitespace-nowrap"
              style={{ fontFamily:'var(--font-unbounded)', fontSize:19, color:'#fff4e8', lineHeight:1.15 }}
            >
              {formation.prix}
            </p>
            <p className="text-[9px] font-bold tracking-wide uppercase mt-1.5" style={{ color:'rgba(174,88,55,.9)' }}>
              Places limitées
            </p>
          </div>
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 mb-0.5"
            style={{ background:'rgba(239,201,140,.08)', color:'rgba(239,201,140,.7)' }}
          >
            {formation.duree}
          </span>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-2.5 mt-auto">
          <Button
            variant="gold"
            size="md"
            href={`/inscription?formation=${formation.slug}`}
            fullWidth
          >
            S&apos;inscrire
          </Button>
          <Link
            href={`/formations/${formation.slug}`}
            className="group/link inline-flex items-center justify-center gap-1.5 text-sm font-medium py-1.5 rounded transition-colors duration-200"
            style={{ color:'rgba(255,244,232,.4)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,244,232,.4)' }}
          >
            Voir la formation
            <ArrowRight size={14} className="transition-transform duration-200 group-hover/link:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
