// ============================================================
// FormationHero — Hero détail formation — Navy & Gold
// ============================================================

import React from 'react'
import Link from 'next/link'
import { Calendar, Clock, MapPin, ChevronRight, BookOpen, Users } from 'lucide-react'
import type { Formation } from '@/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { getCategorieLabel, getMomentLabel } from '@/data/formations'

export default function FormationHero({ formation }: { formation: Formation }) {
  return (
    <section
      className="bg-navy pt-28 pb-16 md:pt-32 md:pb-20 overflow-hidden relative"
      aria-labelledby="formation-hero-title"
    >
      {/* Grille fond */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />
      {/* Dégradé Gold */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 90% 20%, rgba(239,201,140,.07) 0%, transparent 60%)' }}
        aria-hidden="true"
      />
      {/* Bordure Gold gauche */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-gold"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-xs text-white/40 mb-8 flex-wrap">
          <Link href="/"           className="hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded">Accueil</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link href="/formations" className="hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded">Formations</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span className="text-white/60 truncate max-w-[200px]">{formation.titreCourt}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Contenu principal */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold" size="sm">{getCategorieLabel(formation.categorie)}</Badge>
              <Badge variant="neutral" size="sm">{formation.modules.length} modules</Badge>
              <Badge variant="neutral" size="sm">{formation.duree}</Badge>
            </div>

            <div>
              <h1
                id="formation-hero-title"
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight"
              >
                {formation.titre}
              </h1>
              <div className="w-12 h-0.5 bg-gold mt-4 rounded-full" aria-hidden="true" />
            </div>

            <p className="text-base md:text-lg text-white/65 leading-relaxed max-w-xl">
              {formation.objectif}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="gold" size="lg" href={`/inscription?formation=${formation.slug}`}>
                S&apos;inscrire à cette formation
              </Button>
              <Button
                variant="outline" size="lg" href="/formations"
                style={{
                  color:       '#fff4e8',
                  borderColor: 'rgba(255,244,232,.25)',
                  background:  'rgba(255,244,232,.05)',
                }}
              >
                Toutes les formations
              </Button>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-9 h-9 rounded-xl bg-white/[0.08] flex items-center justify-center shrink-0">
                <Users size={15} className="text-white/60" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] text-white/35 font-bold tracking-[0.1em] uppercase">Formateur</p>
                <p className="text-sm text-white font-semibold">{formation.formateur}</p>
              </div>
            </div>
          </div>

          {/* Encadré infos */}
          <div className="lg:col-span-5">
            <div
              className="rounded-2xl p-6"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
            >
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/35 mb-5">
                Informations pratiques
              </p>
              <div className="flex flex-col gap-5">
                {[
                  { icon: Calendar, label: 'Période', value: formation.periode ?? formation.date },
                  { icon: Clock,    label: 'Horaire', value: `${formation.horaire}${formation.moment ? ` · ${getMomentLabel(formation.moment)}` : ''}` },
                  { icon: MapPin,   label: 'Lieu',    value: `${formation.lieu.nom}, ${formation.lieu.ville}` },
                  { icon: BookOpen, label: 'Modules', value: `${formation.modules.length} modules pratiques`  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 rounded-xl transition-colors duration-200">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(239,201,140,.1)' }}>
                      <Icon size={14} className="text-gold" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-white/35 mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-white leading-snug">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-white/[0.08]">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-white/35">Prix</p>
                    <p className="text-2xl font-black text-white tracking-tight mt-0.5">{formation.prix}</p>
                  </div>
                  <Button variant="gold" size="sm" href={`/inscription?formation=${formation.slug}`}>
                    S&apos;inscrire
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
