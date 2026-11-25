// ============================================================
// FormationInfo — Bande / carte infos pratiques — Espresso & Crème
// ============================================================

import React from 'react'
import { Calendar, Clock, MapPin, MessageCircle, Tag } from 'lucide-react'
import type { Formation } from '@/types'
import { CONTACTS, getMomentLabel } from '@/data/formations'
import Button from '@/components/ui/Button'

interface FormationInfoProps {
  formation: Formation
  variant?: 'band' | 'card'
}

export default function FormationInfo({ formation, variant = 'band' }: FormationInfoProps) {
  const horaire = `${formation.horaire}${formation.moment ? ` · ${getMomentLabel(formation.moment)}` : ''}`

  if (variant === 'band') {
    return (
      <section
        className="py-7"
        style={{ background: '#1a100d', borderTop: '1px solid rgba(239,201,140,.12)', borderBottom: '1px solid rgba(239,201,140,.12)' }}
        aria-label="Informations pratiques"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Calendar, label: 'Période', value: formation.periode ?? formation.date, highlight: false },
              { icon: Clock,    label: 'Horaire', value: horaire,                            highlight: false },
              { icon: MapPin,   label: 'Lieu',    value: `${formation.lieu.nom}, ${formation.lieu.ville}`, highlight: false },
              { icon: Tag,      label: 'Prix',    value: formation.prix,                     highlight: true  },
            ].map(({ icon: Icon, label, value, highlight }) => (
              <div key={label} className="group flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 group-hover:scale-110 group-hover:border-[rgba(239,201,140,.4)]"
                  style={{ background: 'rgba(239,201,140,.1)', border: '1px solid rgba(239,201,140,.14)' }}
                >
                  <Icon size={14} className="text-gold" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold tracking-[0.12em] uppercase mb-0.5" style={{ color: 'rgba(255,244,232,.35)' }}>
                    {label}
                  </p>
                  <p
                    className={`text-sm font-semibold leading-snug ${highlight ? 'text-gold' : ''}`}
                    style={highlight ? undefined : { color: '#fff4e8' }}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: '#ffffff', border: '1px solid rgba(26,16,13,.08)', boxShadow: '0 1px 3px rgba(26,16,13,.05)' }}
    >
      <div className="px-5 py-4" style={{ background: '#1a100d' }}>
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: 'rgba(255,244,232,.4)' }}>
          Informations pratiques
        </p>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {[
          { icon: Calendar, label: 'Période', value: formation.periode ?? formation.date, highlight: false },
          { icon: Clock,    label: 'Horaire', value: horaire,                            highlight: false },
          { icon: MapPin,   label: 'Lieu',    value: (
              <>
                <span className="font-bold" style={{ color: '#1a100d' }}>{formation.lieu.nom}</span>
                <span className="block text-xs mt-0.5 font-normal" style={{ color: 'rgba(26,16,13,.5)' }}>
                  {formation.lieu.adresse}, {formation.lieu.ville}
                </span>
              </>
            ), highlight: false },
          { icon: Tag,      label: 'Prix',    value: formation.prix,                     highlight: true  },
        ].map(({ icon: Icon, label, value, highlight }) => (
          <div key={label} className="group flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 group-hover:scale-110"
              style={{ background: 'rgba(174,88,55,.08)', border: '1px solid rgba(174,88,55,.14)' }}
            >
              <Icon size={14} style={{ color: 'var(--copper)' }} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-[0.1em] uppercase mb-0.5" style={{ color: 'rgba(26,16,13,.4)' }}>
                {label}
              </p>
              <div
                className={highlight ? 'text-base font-black leading-snug' : 'text-sm font-semibold leading-snug'}
                style={highlight ? { color: 'var(--copper)', fontFamily: 'var(--font-unbounded)' } : { color: '#1a100d' }}
              >
                {value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 pb-5">
        <Button variant="gold" size="md" href={`/inscription?formation=${formation.slug}`} fullWidth>
          S&apos;inscrire maintenant
        </Button>
      </div>

      <div className="px-5 pb-5 pt-4" style={{ borderTop: '1px solid rgba(26,16,13,.08)' }}>
        <p className="text-[10px] font-bold tracking-[0.1em] uppercase mb-2.5" style={{ color: 'rgba(26,16,13,.4)' }}>
          Une question ?
        </p>
        <div className="flex flex-col gap-2">
          {CONTACTS.whatsapp.map((num) => (
            <a
              key={num}
              href={`https://wa.me/${num.replace(/\s+/g, '').replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200 hover:underline hover:underline-offset-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              style={{ color: '#1a100d' }}
            >
              <MessageCircle size={13} style={{ color: 'var(--copper)' }} aria-hidden="true" />
              {num}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
