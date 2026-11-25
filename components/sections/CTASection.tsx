// ============================================================
// CTASection — Espresso / Café Premium
// ============================================================

import { ArrowRight, MessageCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { CONTACTS } from '@/data/formations'

interface CTASectionProps {
  title?: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  showContact?: boolean
  variant?: 'dark' | 'emerald' | 'light'
}

const S = {
  espresso: '#1a100d',
  gold:     'var(--gold)',
  copper:   'var(--copper)',
  cream:    '#fff4e8',
  creamDark:'#f4eee5',
}

export default function CTASection({
  title        = "Prêt à passer à l'action avec l'IA ?",
  subtitle     = "Rejoignez la prochaine session et repartez avec des compétences directement applicables.",
  ctaLabel     = 'Choisir ma formation',
  ctaHref      = '/formations',
  secondaryLabel,
  secondaryHref,
  showContact  = true,
  variant      = 'dark',
}: CTASectionProps) {
  const isLight = variant === 'light'

  return (
    <section
      className="py-20 md:py-24 overflow-hidden relative"
      style={{ background: isLight ? S.creamDark : S.espresso }}
      aria-labelledby="cta-title"
    >
      {/* Aurora flottante */}
      {!isLight && (
        <>
          <div
            className="absolute w-[600px] h-[400px] rounded-full pointer-events-none animate-aurora"
            style={{
              top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              background: 'radial-gradient(ellipse, rgba(174,88,55,.15) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            aria-hidden="true"
          />
          <div
            className="absolute w-[400px] h-[300px] rounded-full pointer-events-none"
            style={{
              top: '30%', right: '10%',
              background: 'radial-gradient(ellipse, rgba(239,201,140,.08) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Grille de points */}
      {!isLight && (
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(239,201,140,.8) 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Titre */}
        <h2
          id="cta-title"
          className="mb-5"
          style={{
            fontFamily:    'var(--font-unbounded)',
            fontWeight:    700,
            fontSize:      'clamp(1.75rem,4vw,3rem)',
            lineHeight:    1.1,
            letterSpacing: '-.02em',
            color:         isLight ? S.espresso : S.cream,
          }}
        >
          {title}
        </h2>

        {/* Ligne or */}
        <div className="flex justify-center mb-6" aria-hidden="true">
          <div style={{ width: '3rem', height: 2, background: `linear-gradient(90deg,${S.gold},${S.copper})`, borderRadius: 999 }} />
        </div>

        {subtitle && (
          <p
            className="text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10"
            style={{ color: isLight ? 'rgba(26,16,13,.65)' : 'rgba(255,244,232,.6)' }}
          >
            {subtitle}
          </p>
        )}

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Button variant="gold" size="lg" href={ctaHref}>
            {ctaLabel}
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
          {secondaryLabel && secondaryHref && (
            <Button
              variant={isLight ? 'secondary' : 'outline'}
              size="lg"
              href={secondaryHref}
              className={isLight ? '' : ''}
              style={isLight ? {} : { borderColor: 'rgba(255,244,232,.2)', color: 'rgba(255,244,232,.75)' }}
            >
              {secondaryLabel}
            </Button>
          )}
        </div>

        {/* Garanties */}
        <p className="text-xs mb-6" style={{ color: isLight ? 'rgba(26,16,13,.4)' : 'rgba(255,244,232,.25)' }}>
          ✓ Pas de frais cachés · ✓ Confirmation immédiate · ✓ Places limitées
        </p>

        {/* WhatsApp */}
        {showContact && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
            <span className="text-xs font-medium" style={{ color: isLight ? 'rgba(26,16,13,.5)' : 'rgba(255,244,232,.35)' }}>
              Une question ?
            </span>
            {CONTACTS.whatsapp.map(num => (
              <a
                key={num}
                href={`https://wa.me/${num.replace(/\s+/g,'').replace('+','')}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full transition-all hover:-translate-y-px"
                style={{
                  background: isLight ? 'rgba(174,88,55,.08)' : 'rgba(239,201,140,.1)',
                  border:     `1px solid ${isLight ? 'rgba(174,88,55,.2)' : 'rgba(239,201,140,.2)'}`,
                  color:      isLight ? S.copper : S.gold,
                }}
              >
                <MessageCircle size={13} aria-hidden="true" />
                {num}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
