// ============================================================
// Page Inscription — Navy & Gold
// ============================================================

import React from 'react'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { MessageCircle, CheckCircle, ArrowRight } from 'lucide-react'
import RegistrationForm from '@/components/forms/RegistrationForm'
import LoadingState from '@/components/ui/LoadingState'
import { DATE_COMMUNE, CONTACTS } from '@/data/formations'

export const metadata: Metadata = {
  title: 'Inscription aux formations IA',
  description: `Inscrivez-vous aux formations en intelligence artificielle de CLUB AI à Bujumbura. Session du ${DATE_COMMUNE}.`,
  robots: { index: true, follow: true },
}

export default function InscriptionPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy pt-28 pb-16 md:pt-32 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
          aria-hidden="true"
        />
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 90% 20%, rgba(245,158,11,0.08) 0%, transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="hero-pill mb-6 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
              Inscription
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
              Réservez votre place<br />
              <span style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                avant qu&apos;elles soient prises.
              </span>
            </h1>
            <div className="w-12 h-0.5 bg-gold rounded-full mb-6" aria-hidden="true" />
            <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl mb-8">
              Remplissez le formulaire en moins de 3 minutes. Votre inscription est confirmée instantanément.
            </p>
            <div className="flex flex-wrap gap-4">
              {['Confirmation immédiate', 'Places limitées', DATE_COMMUNE].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-gold shrink-0" />
                  <span className="text-sm text-white/65 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <div className="bg-surface py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">

            {/* Formulaire */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <Suspense fallback={<LoadingState message="Chargement du formulaire..." />}>
                <RegistrationForm />
              </Suspense>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24 flex flex-col gap-5" aria-label="Informations pratiques">

              {/* Carte récapitulatif */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-card" style={{ border: '1px solid rgba(15,23,42,0.08)' }}>
                <div className="bg-navy px-6 py-5">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-1">Récapitulatif</p>
                  <p className="text-xl font-bold text-white">150 000 FBU</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,.45)' }}>
                    par formation · places limitées
                  </p>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  {[
                    'Inscription confirmée immédiatement',
                    'Paiement sur place le jour de la session',
                    'Attestation remise en fin de formation',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(5,150,105,.1)' }}>
                        <CheckCircle size={12} style={{ color: '#059669' }} aria-hidden="true" />
                      </div>
                      <p className="text-sm leading-snug" style={{ color: 'rgba(26,16,13,.7)' }}>{item}</p>
                    </div>
                  ))}
                </div>

                <div className="px-6 pb-6">
                  <a
                    href="#inscription-form"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-navy transition-all duration-[220ms] ease-premium hover:-translate-y-px"
                    style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 2px 8px rgba(245,158,11,0.25)' }}
                  >
                    Remplir le formulaire
                    <ArrowRight size={15} />
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="bg-white rounded-2xl p-6 shadow-card" style={{ border: '1px solid rgba(15,23,42,0.07)' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.1)' }}>
                    <MessageCircle size={18} className="text-gold" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">Une question ?</p>
                    <p className="text-xs text-surface-400">Réponse rapide sur WhatsApp</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  {CONTACTS.whatsapp.map((num) => (
                    <a
                      key={num}
                      href={`https://wa.me/${num.replace(/\s+/g, '').replace('+', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-navy hover:text-gold transition-all duration-[220ms] group"
                      style={{ border: '1px solid rgba(15,23,42,0.1)' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      {num}
                    </a>
                  ))}
                </div>
              </div>

              <p className="text-xs text-center text-surface-400">
                Les champs marqués d&apos;un{' '}
                <span className="text-danger font-bold">*</span> sont obligatoires.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
