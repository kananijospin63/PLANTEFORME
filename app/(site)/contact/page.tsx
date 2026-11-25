// ============================================================
// Page Contact — Espresso / Café Premium
// ============================================================

import type { Metadata } from 'next'
import { MessageCircle, MapPin, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import { CONTACTS, LIEU_COMMUN } from '@/data/formations'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez CLUB AI pour toute question sur nos formations en intelligence artificielle à Bujumbura.',
}

const S = { espresso:'#1a100d', gold:'var(--gold)', copper:'var(--copper)', cream:'#fff4e8', creamDark:'#f4eee5' }

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background:S.espresso, paddingTop:'7rem', paddingBottom:'4rem', position:'relative', overflow:'hidden' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage:'radial-gradient(circle, rgba(239,201,140,.8) 1px, transparent 1px)', backgroundSize:'28px 28px' }} aria-hidden="true" />
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none" style={{ background:'radial-gradient(ellipse at 90% 20%, rgba(174,88,55,.15) 0%, transparent 60%)' }} aria-hidden="true" />
        <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background:`linear-gradient(to bottom, transparent, ${S.gold}, transparent)` }} aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="hero-pill mb-6 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:S.gold }} />
              Contact
            </div>
            <h1 style={{ fontFamily:'var(--font-unbounded)', fontWeight:700, fontSize:'clamp(2.2rem,5vw,4rem)', lineHeight:1.08, letterSpacing:'-.02em', color:S.cream, marginBottom:'1.25rem' }}>
              Nous contacter.
            </h1>
            <div style={{ width:'3rem', height:2, background:`linear-gradient(90deg,${S.gold},${S.copper})`, borderRadius:999, marginBottom:'1.25rem' }} aria-hidden="true" />
            <p style={{ fontSize:'1.0625rem', lineHeight:1.7, color:'rgba(255,244,232,.6)', maxWidth:'36rem' }}>
              Pour toute question sur nos formations, inscriptions ou informations complémentaires,
              contactez-nous directement sur WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-16 md:py-20" style={{ background:S.creamDark }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-5">

          {/* WhatsApp */}
          <div className="stat-card rounded-2xl p-7" style={{ background:'#ffffff', border:'1px solid rgba(26,16,13,.07)', boxShadow:'0 1px 4px rgba(26,16,13,.05)' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(239,201,140,.12)' }}>
                <MessageCircle size={20} style={{ color:S.copper }} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold mb-1" style={{ fontFamily:'var(--font-unbounded)', color:S.espresso, fontSize:14 }}>WhatsApp</h2>
                <p className="text-sm mb-5 leading-relaxed" style={{ color:'rgba(26,16,13,.55)' }}>
                  Le moyen le plus rapide pour nous joindre. Nous répondons généralement dans la journée.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {CONTACTS.whatsapp.map(num => (
                    <a
                      key={num}
                      href={`https://wa.me/${num.replace(/\s+/g,'').replace('+','')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-px"
                      style={{ fontFamily:'var(--font-unbounded)', fontSize:12, background:`linear-gradient(135deg,${S.gold},${S.copper})`, color:S.espresso, boxShadow:'0 2px 10px rgba(174,88,55,.35)' }}
                    >
                      <MessageCircle size={15} aria-hidden="true" />
                      {num}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Localisation */}
          <div className="stat-card rounded-2xl p-7" style={{ background:'#ffffff', border:'1px solid rgba(26,16,13,.07)' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(239,201,140,.12)' }}>
                <MapPin size={20} style={{ color:S.copper }} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-bold mb-1" style={{ fontFamily:'var(--font-unbounded)', color:S.espresso, fontSize:14 }}>Lieu des formations</h2>
                <p className="text-sm font-bold" style={{ color:S.espresso }}>{LIEU_COMMUN.nom}</p>
                <p className="text-sm" style={{ color:'rgba(26,16,13,.55)' }}>{LIEU_COMMUN.adresse}, {LIEU_COMMUN.ville}, {LIEU_COMMUN.pays}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="stat-card rounded-2xl p-7" style={{ background:S.espresso, border:'1px solid rgba(239,201,140,.15)' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(239,201,140,.12)', border:'1px solid rgba(239,201,140,.2)' }}>
                <ArrowRight size={20} style={{ color:S.gold }} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold mb-1" style={{ fontFamily:'var(--font-unbounded)', color:S.cream, fontSize:14 }}>Prêt à vous inscrire ?</h2>
                <p className="text-sm mb-5 leading-relaxed" style={{ color:'rgba(255,244,232,.5)' }}>
                  Choisissez votre formation et réservez votre place en quelques minutes.
                </p>
                <Button variant="gold" size="sm" href="/formations">
                  Choisir ma formation
                  <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
