// ============================================================
// SectionTitle — Unbounded pour les titres, Espresso/Or
// ============================================================

interface SectionTitleProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  light?: boolean
  className?: string
  id?: string
}

export default function SectionTitle({
  eyebrow, title, subtitle,
  align = 'left', light = false, className = '', id,
}: SectionTitleProps) {
  const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' }[align]
  const itemsClass = { left: 'items-start', center: 'items-center', right: 'items-end' }[align]

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${itemsClass} ${className}`}>
      {eyebrow && (
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--copper)' }}>
          {eyebrow}
        </span>
      )}

      <h2
        id={id}
        style={{
          fontFamily:    'var(--font-unbounded)',
          fontWeight:    700,
          lineHeight:    1.1,
          letterSpacing: '-.02em',
          fontSize:      'clamp(1.6rem, 3vw, 2.5rem)',
          color:         light ? '#fff4e8' : '#1a100d',
        }}
      >
        {title}
      </h2>

      {/* Ligne or */}
      <div
        style={{
          width: '3rem', height: 2,
          background: 'linear-gradient(90deg,var(--gold),var(--copper))',
          borderRadius: 999,
        }}
        aria-hidden="true"
      />

      {subtitle && (
        <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, maxWidth: '36rem', color: light ? 'rgba(255,244,232,.7)' : '#3d1f12' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
