// ============================================================
// SuccessMessage — Confirmation inscription — Navy & Gold
// ============================================================

import React from 'react'
import Link from 'next/link'
import { CheckCircle2, Calendar, Clock, MapPin, Tag, Hash, Mail } from 'lucide-react'
import type { SuccessPageData } from '@/types'
import Button from '@/components/ui/Button'
import SocialLinks from '@/components/ui/SocialLinks'
import { WHATSAPP_CONTACT } from '@/data/socials'

export default function SuccessMessage({ data }: { data: SuccessPageData }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">

      {/* Hero Navy */}
      <div className="bg-navy pt-28 pb-16 md:pt-32 md:pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(5,150,105,0.1) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold" aria-hidden="true" />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          {/* Icône succès */}
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ background: 'rgba(5,150,105,0.15)', border: '2px solid rgba(5,150,105,0.3)' }}
            aria-hidden="true"
          >
            <CheckCircle2 size={32} className="text-success" />
          </div>

          <div className="hero-pill mb-4 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
            Inscription confirmée
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
            Merci pour votre inscription !
          </h1>

          <div className="w-12 h-0.5 bg-gold rounded-full mx-auto mb-5" aria-hidden="true" />

          {/* Référence */}
          <div
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 mb-4"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
          >
            <Hash size={13} className="text-gold" aria-hidden="true" />
            <span className="text-xs font-medium text-white/60">Référence :</span>
            <span className="text-sm font-bold text-gold tracking-wider font-mono">{data.reference}</span>
          </div>

          <p className="text-sm text-white/50 leading-relaxed">
            Conservez cette référence pour tout suivi de votre inscription.
          </p>
        </div>
      </div>

      {/* Corps */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-12">

        {/* Récapitulatif */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-card mb-5" style={{ border: '1px solid rgba(15,23,42,0.08)' }}>
          <div className="px-6 py-4 border-b border-surface-100 bg-surface flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-surface-500">
              Récapitulatif de votre inscription
            </h2>
            <div className="flex gap-1" aria-hidden="true">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <div className="w-2 h-2 rounded-full bg-navy/20" />
            </div>
          </div>

          <div className="divide-y divide-surface-100">
            {[
              { icon: null,     label: 'Participant', value: `${data.prenom} ${data.nom}`,     bold: true,  gold: false },
              { icon: null,     label: 'Formation',   value: data.formationTitre,               bold: true,  gold: true  },
              { icon: Calendar, label: 'Date',        value: data.date,                         bold: false, gold: false },
              { icon: Clock,    label: 'Horaire',     value: data.horaire,                      bold: false, gold: false },
              { icon: MapPin,   label: 'Lieu',        value: data.lieu,                         bold: false, gold: false },
              { icon: Tag,      label: 'Prix',        value: data.prix,                         bold: true,  gold: false },
            ].map(({ icon: Icon, label, value, bold, gold }) => (
              <div key={label} className="flex items-start gap-3 px-6 py-4">
                <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                  {Icon
                    ? <Icon size={14} className="text-gold" />
                    : <div className="w-1.5 h-1.5 rounded-full bg-gold mt-0.5" />
                  }
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-1 gap-1 sm:gap-4 min-w-0">
                  <span className="text-xs font-bold tracking-[0.08em] uppercase text-surface-400 shrink-0">{label}</span>
                  <span className={`text-sm sm:text-right leading-snug ${bold ? 'font-bold' : 'font-medium'} ${gold ? 'text-gold-dark' : 'text-navy'}`}>
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email */}
        <div
          className="flex items-start gap-3 rounded-xl px-5 py-4 mb-8"
          style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.15)' }}
        >
          <Mail size={16} className="text-success shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-navy leading-relaxed">
            <span className="font-bold">Un email de confirmation</span> vous sera envoyé à l&apos;adresse indiquée lors de votre inscription.
          </p>
        </div>

        {/* Communauté — WhatsApp + réseaux sociaux */}
        <div
          className="bg-white rounded-2xl px-6 py-6 mb-5"
          style={{ border: '1px solid rgba(15,23,42,0.08)' }}
        >
          <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-surface-500 mb-2">
            Rejoignez la communauté
          </h2>
          <p className="text-sm text-surface-500 leading-relaxed mb-5">
            Rappels, supports et échanges avec le formateur : tout se passe dans le
            groupe WhatsApp de votre formation.
          </p>

          <a
            href={data.whatsappGroupUrl || WHATSAPP_CONTACT}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl text-sm font-bold text-white mb-5 transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
            style={{ background: '#25D366' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.09c-.24.68-1.42 1.3-1.96 1.35-.54.05-1.05.24-3.53-.73-2.98-1.17-4.86-4.24-5.01-4.44-.15-.2-1.19-1.58-1.19-3.01s.75-2.14 1.02-2.43c.27-.29.59-.37.79-.37h.57c.18.01.42-.07.66.5.24.58.83 2.01.9 2.16.07.15.12.32.02.52-.1.2-.15.32-.29.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.61.17.29.75 1.23 1.6 1.99 1.1.98 2.03 1.29 2.32 1.43.29.15.46.12.63-.07.17-.2.73-.85.93-1.14.2-.29.39-.24.66-.15.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.13.07.73-.17 1.41z" />
            </svg>
            Rejoindre le groupe WhatsApp
          </a>

          <div className="flex items-center justify-between gap-3 pt-5 border-t border-surface-100">
            <span className="text-xs font-semibold tracking-wide text-surface-400">
              Suivez-nous
            </span>
            <SocialLinks />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="primary" size="lg" href="/"           fullWidth>Retour à l&apos;accueil</Button>
          <Button variant="secondary" size="lg" href="/formations" fullWidth>Voir les formations</Button>
        </div>

        {/* Contact */}
        <p className="text-center text-xs text-surface-400 mt-8 leading-relaxed">
          Pour toute question :{' '}
          <a href="https://wa.me/25777165741" target="_blank" rel="noopener noreferrer"
            className="text-gold font-semibold hover:text-gold-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded">
            +257 77 165741
          </a>
        </p>
      </div>
    </div>
  )
}
