'use client'

// ============================================================
// Header — Espresso / Café Premium — glassmorphism
// ============================================================

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Zap, Lock } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Accueil',    href: '/'          },
  { label: 'Formations', href: '/formations' },
  { label: 'Contact',    href: '/contact'   },
]

export default function Header() {
  const pathname  = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled]  = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => { setMenuOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const toggle   = useCallback(() => setMenuOpen(v => !v), [])
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  /* ── Styles scrolled / glass ── */
  const headerStyle: React.CSSProperties = scrolled
    ? {
        background:   '#1c1310',
        borderBottom: '1px solid rgba(239,201,140,.14)',
        boxShadow:    '0 4px 32px rgba(28,19,16,.45)',
      }
    : {
        background:   '#1c1310',
        borderBottom: '1px solid rgba(239,201,140,.1)',
      }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={headerStyle}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px] md:h-20">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] rounded"
            aria-label="CLUB AI — Retour à l'accueil"
          >
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--gold), var(--copper))',
                boxShadow:  '0 2px 12px rgba(174,88,55,.5)',
              }}
              aria-hidden="true"
            >
              <Zap size={16} className="fill-current" style={{ color: '#1a100d' }} strokeWidth={2.5} />
            </div>

            <div className="flex flex-col leading-none">
              <span
                className="text-[15px] tracking-tight"
                style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, color: '#fff4e8' }}
              >
                CLUB <span style={{ color: 'var(--gold)' }}>AI</span>
              </span>
              <span style={{ fontSize: 9, color: 'rgba(239,201,140,.5)', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', marginTop: 2 }}>
                Intelligence Artificielle
              </span>
            </div>
          </Link>

          {/* ── Nav desktop ── */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
            {NAV_ITEMS.map(item => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                  style={{
                    color:      active ? 'var(--gold)' : 'rgba(255,244,232,.65)',
                    background: active ? 'rgba(239,201,140,.1)' : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = '#fff4e8'
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,244,232,.65)'
                  }}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{ background: 'linear-gradient(90deg,var(--gold),var(--copper))' }}
                      aria-hidden="true"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* ── CTA desktop — accès réservé à l'administration ── */}
          <div className="hidden md:flex items-center">
            <Link
              href="/connexion"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-[220ms] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              style={{
                fontFamily: 'var(--font-unbounded)',
                fontWeight: 700,
                fontSize:   12.5,
                background: 'linear-gradient(135deg,var(--gold),var(--copper))',
                color:      '#1a100d',
                boxShadow:  '0 2px 12px rgba(174,88,55,.45)',
              }}
            >
              <Lock size={13} aria-hidden="true" />
              Espace admin
            </Link>
          </div>

          {/* ── Hamburger ── */}
          <button
            type="button"
            onClick={toggle}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
            style={{ color: 'rgba(255,244,232,.7)', background: 'rgba(255,244,232,.05)' }}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Menu mobile ── */}
      <div
        role="dialog" aria-modal="true" aria-label="Menu"
        className="md:hidden fixed inset-0 top-[68px] z-40 transition-all duration-300"
        style={{
          background: '#1c1310',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          opacity:    menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          pointerEvents: menuOpen ? 'auto' : 'none',
          transform:  menuOpen ? 'translateY(0)' : 'translateY(-6px)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
        <div className="px-4 pt-5 pb-10 flex flex-col gap-2 h-full overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(item => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium"
                  style={{
                    color:      active ? 'var(--gold)' : 'rgba(255,244,232,.7)',
                    background: active ? 'rgba(239,201,140,.08)' : 'transparent',
                    border:     active ? '1px solid rgba(239,201,140,.18)' : '1px solid transparent',
                  }}
                >
                  {item.label}
                  {active && <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />}
                </Link>
              )
            })}
          </nav>

          <div className="mt-4 pt-5" style={{ borderTop: '1px solid rgba(255,244,232,.08)' }}>
            <Link
              href="/connexion"
              className="flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold transition-all hover:-translate-y-px"
              style={{
                fontFamily: 'var(--font-unbounded)',
                background: 'linear-gradient(135deg,var(--gold),var(--copper))',
                color:      '#1a100d',
                boxShadow:  '0 4px 20px rgba(174,88,55,.5)',
              }}
            >
              <Lock size={16} aria-hidden="true" />
              Espace admin
            </Link>
          </div>

          <div className="mt-auto pt-6" style={{ borderTop: '1px solid rgba(255,244,232,.08)' }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(255,244,232,.3)' }}>
              Contact rapide
            </p>
            {['+257 77 165741', '+257 79 49 08 06'].map(num => (
              <a
                key={num}
                href={`https://wa.me/${num.replace(/\s+/g,'').replace('+','')}`}
                target="_blank" rel="noopener noreferrer"
                className="block text-sm font-semibold mb-1 hover:underline"
                style={{ color: 'var(--gold)' }}
              >
                WhatsApp : {num}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
