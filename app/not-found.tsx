// ============================================================
// Page 404 — Espresso / Crème
// ============================================================

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Page introuvable',
}

export default function NotFound() {
  return (
    <>
      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className="relative flex items-center justify-center overflow-hidden px-4"
        style={{ background: '#f4eee5', minHeight: 'calc(100vh - 80px)', paddingTop: 120, paddingBottom: 80 }}
      >
        {/* Halo d'accent */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[420px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(174,88,55,.08) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="relative text-center max-w-lg">
          {/* 404 */}
          <p
            className="font-black leading-none select-none mb-2"
            style={{
              fontFamily: 'var(--font-unbounded)',
              fontSize: 'clamp(90px, 18vw, 140px)',
              background: 'linear-gradient(135deg, var(--copper) 0%, var(--gold) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-.04em',
            }}
            aria-hidden="true"
          >
            404
          </p>

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(174,88,55,.08)', border: '1px solid rgba(174,88,55,.2)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--copper)' }} />
            <span
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: 'var(--copper)' }}
            >
              Page introuvable
            </span>
          </div>

          <h1
            className="text-2xl sm:text-3xl tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, color: '#1a100d' }}
          >
            Cette page n&apos;existe pas.
          </h1>

          <div className="w-10 h-0.5 rounded-full mx-auto mb-5" style={{ background: 'var(--copper)' }} aria-hidden="true" />

          <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(26,16,13,.55)' }}>
            La page que vous cherchez est introuvable ou a été déplacée.
            Retournez à l&apos;accueil pour continuer.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="gold" size="lg" href="/">
              <ArrowLeft size={15} />
              Retour à l&apos;accueil
            </Button>
            <Button
              variant="outline"
              size="lg"
              href="/formations"
              style={{
                color:       '#3d1f12',
                borderColor: 'rgba(174,88,55,.35)',
                background:  'transparent',
              }}
            >
              Voir les formations
              <ArrowRight size={15} />
            </Button>
          </div>

          <p className="text-xs mt-8" style={{ color: 'rgba(26,16,13,.35)' }}>
            Besoin d&apos;aide ?{' '}
            <Link href="/contact" className="font-semibold underline underline-offset-2" style={{ color: 'var(--copper)' }}>
              Contactez-nous
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}
