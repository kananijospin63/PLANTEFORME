// ============================================================
// Badge — Navy & Gold
// ============================================================

interface BadgeProps {
  children: React.ReactNode
  variant?: 'navy' | 'gold' | 'success' | 'danger' | 'info' | 'neutral' | 'emerald' | 'burgundy'
  size?: 'sm' | 'md'
  className?: string
}

const variantStyles = {
  navy:      'bg-navy/10    text-navy          border border-navy/20',
  gold:      'bg-gold/15    text-gold-dark     border border-gold/30',
  success:   'bg-success/10 text-success-dark  border border-success/20',
  danger:    'bg-danger/10  text-danger-dark   border border-danger/20',
  info:      'bg-info/10    text-info-dark     border border-info/20',
  neutral:   'bg-surface-200 text-surface-600  border border-surface-300',
  // Rétrocompatibilité
  emerald:   'bg-navy/10    text-navy          border border-navy/20',
  burgundy:  'bg-danger/10  text-danger-dark   border border-danger/20',
}

const sizeStyles = {
  sm: 'text-[10px] px-2   py-0.5',
  md: 'text-[11px] px-2.5 py-1',
}

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-bold tracking-[0.08em] uppercase rounded-sm ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  )
}
