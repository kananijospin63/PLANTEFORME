// ============================================================
// Footer — Espresso pur / Café Premium
// ============================================================

import Link from 'next/link'
import { MapPin, MessageCircle, Calendar, Clock, Zap, ArrowRight } from 'lucide-react'
import { DATE_COMMUNE, PERIODE_GLOBALE, HORAIRE_COMMUN, LIEU_COMMUN, CONTACTS } from '@/data/formations'

const NAV = {
  formations: [
    { label: 'ChatGPT, Gemini & Claude',      href: '/formations/maitriser-chatgpt-gemini-claude'       },
    { label: 'Automatisation n8n & Make',      href: '/formations/automatiser-son-travail-n8n-make'      },
    { label: "IA pour Entrepreneurs",          href: '/formations/ia-pour-entrepreneurs-professionnels'  },
    { label: "Dev Web avec l'IA",              href: '/formations/dev-applications-web-ia'               },
  ],
  links: [
    { label: 'Accueil',    href: '/'          },
    { label: 'Formations', href: '/formations' },
    { label: 'Inscription',href: '/inscription'},
    { label: 'Contact',    href: '/contact'   },
  ],
}

const S = {
  espresso:   '#1c1310',
  espressoL:  '#2e130a',
  gold:       'var(--gold)',
  copper:     'var(--copper)',
  cream:      '#fff4e8',
  creamMuted: 'rgba(255,244,232,.45)',
  creamSubtle:'rgba(255,244,232,.2)',
  divider:    'rgba(255,244,232,.07)',
  goldBorder: 'rgba(239,201,140,.15)',
}

export default function Footer() {
  return (
    <footer style={{ background: S.espresso, color: S.cream }} role="contentinfo">

      {/* ── Bandeau session ── */}
      <div style={{ background: `linear-gradient(90deg, ${S.espresso}, ${S.espressoL}, ${S.espresso})`, borderBottom: `1px solid ${S.goldBorder}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: S.gold, animation: 'pulseGold 2s ease-in-out infinite' }} />
              <span className="text-sm font-semibold" style={{ color: 'rgba(255,244,232,.8)' }}>
                Prochaine session — <span style={{ color: S.gold, fontFamily: 'var(--font-unbounded)', fontSize: 13 }}>{DATE_COMMUNE}</span>
              </span>
            </div>
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:-translate-y-px"
              style={{ fontFamily: 'var(--font-unbounded)', background: `linear-gradient(135deg,${S.gold},${S.copper})`, color: S.espresso, boxShadow: `0 2px 10px rgba(174,88,55,.4)` }}
            >
              Réserver ma place
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Infos pratiques ── */}
      <div style={{ borderBottom: `1px solid ${S.divider}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Calendar,       label: 'Période', value: PERIODE_GLOBALE },
              { icon: Clock,          label: 'Horaire', value: HORAIRE_COMMUN   },
              { icon: MapPin,         label: 'Lieu',    value: LIEU_COMMUN.nom  },
              { icon: MessageCircle,  label: 'Contact', value: CONTACTS.whatsapp[0] },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="group flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 group-hover:scale-110 group-hover:border-[rgba(239,201,140,.4)]"
                  style={{ background: `rgba(239,201,140,.1)`, border: `1px solid ${S.goldBorder}` }}
                >
                  <Icon size={14} style={{ color: S.gold }} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color: S.creamMuted }}>
                    {label}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: S.cream }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Corps ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">

          {/* Branding */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]" aria-label="CLUB AI">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg,${S.gold},${S.copper})` }}>
                <Zap size={18} className="fill-current" style={{ color: S.espresso }} strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, fontSize: 15, color: S.cream, letterSpacing: '-.01em' }}>
                  CLUB <span style={{ color: S.gold }}>AI</span>
                </p>
                <p className="text-[10px] font-semibold tracking-widest uppercase mt-0.5" style={{ color: S.creamMuted }}>
                  Bujumbura, Burundi
                </p>
              </div>
            </Link>

            <p className="text-sm leading-relaxed max-w-xs" style={{ color: S.creamMuted }}>
              Des formations pratiques en intelligence artificielle pour les professionnels
              et entrepreneurs de Bujumbura.
            </p>
          </div>

          {/* Formations */}
          <div className="md:col-span-4" style={{ borderLeft: `1px solid ${S.divider}`, paddingLeft: '2.5rem' }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-5" style={{ color: S.creamMuted }}>Nos formations</p>
            <ul className="flex flex-col gap-3">
              {NAV.formations.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="group flex items-center gap-2 text-sm transition-colors duration-200" style={{ color: S.creamMuted }}>
                    <span className="w-1 h-1 rounded-full transition-colors" style={{ background: 'rgba(255,244,232,.2)' }} />
                    <span className="group-hover:text-[var(--gold)] transition-colors">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link
                href="/inscription"
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                style={{ color: S.gold }}
              >
                S&apos;inscrire maintenant <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-4" style={{ borderLeft: `1px solid ${S.divider}`, paddingLeft: '2.5rem' }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-5" style={{ color: S.creamMuted }}>Navigation</p>
            <ul className="flex flex-col gap-3">
              {NAV.links.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="group flex items-center gap-2 text-sm transition-colors duration-200" style={{ color: S.creamMuted }}>
                    <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,244,232,.2)' }} />
                    <span className="group-hover:text-white transition-colors">{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bas ── */}
      <div style={{ borderTop: `1px solid ${S.divider}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,244,232,.2)' }}>
            © {new Date().getFullYear()} CLUB AI. Tous droits réservés. Bujumbura, Burundi.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,244,232,.15)' }}>Fait avec ❤️ au Burundi</p>
        </div>
      </div>
    </footer>
  )
}
