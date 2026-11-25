'use client'

// ============================================================
// Button — Espresso / Café Premium
// Hover : translateY(-1px) + ombre portée
// ============================================================

import React from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import type { ButtonVariant, ButtonSize } from '@/types'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  children: React.ReactNode
  className?: string
  ariaLabel?: string
  /** Styles inline optionnels — prioritaires sur les styles de variante */
  style?: React.CSSProperties
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: '#1a100d',
    color:      '#fff4e8',
    border:     '1px solid #2e130a',
  },
  secondary: {
    background: 'transparent',
    color:      '#1a100d',
    border:     '1px solid #1a100d',
  },
  outline: {
    background: 'transparent',
    color:      '#3d1f12',
    border:     '1px solid rgba(174,88,55,.35)',
  },
  ghost: {
    background: 'transparent',
    color:      'var(--copper)',
    border:     '1px solid transparent',
  },
  gold: {
    background: 'linear-gradient(135deg, var(--gold), var(--copper))',
    color:      '#1a100d',
    border:     '1px solid transparent',
    boxShadow:  '0 2px 10px rgba(174,88,55,.4)',
  },
}

const hoverStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary:   { background: '#2e130a', boxShadow: '0 6px 20px rgba(26,16,13,.4)' },
  secondary: { background: '#1a100d', color: '#fff4e8', boxShadow: '0 6px 20px rgba(26,16,13,.25)' },
  outline:   { background: 'rgba(174,88,55,.06)', borderColor: 'rgba(174,88,55,.5)', boxShadow: '0 4px 14px rgba(174,88,55,.15)' },
  ghost:     { background: 'rgba(174,88,55,.08)' },
  gold:      { background: 'linear-gradient(135deg, #f7e4c0, #c97a52)', boxShadow: '0 6px 24px rgba(174,88,55,.55)' },
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9  px-4   text-sm  gap-1.5 rounded-lg',
  md: 'h-11 px-6   text-sm  gap-2   rounded-xl',
  lg: 'h-12 px-8   text-base gap-2.5 rounded-xl',
}

export default function Button({
  variant  = 'primary',
  size     = 'md',
  disabled = false,
  loading  = false,
  fullWidth = false,
  href,
  onClick,
  type    = 'button',
  children,
  className = '',
  ariaLabel,
  style: customStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading

  const [hovered, setHovered] = React.useState(false)

  const baseClass = [
    'inline-flex items-center justify-center',
    'font-semibold tracking-wide whitespace-nowrap',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2',
    'select-none cursor-pointer',
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
    className,
  ].filter(Boolean).join(' ')

  const style: React.CSSProperties = {
    ...(variantStyles[variant] as React.CSSProperties),
    ...(customStyle ?? {}),
    ...(hovered && !isDisabled ? { ...(hoverStyles[variant] as React.CSSProperties), transform: 'translateY(-1px)' } : {}),
    ...(variant === 'gold' ? { fontFamily: 'var(--font-unbounded)', fontWeight: 700, fontSize: size === 'lg' ? 14 : 13 } : {}),
  }

  const content = (
    <>
      {loading && <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} className="animate-spin shrink-0" aria-hidden="true" />}
      {children}
    </>
  )

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onMouseDown:  (e: React.MouseEvent) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' },
    onMouseUp:    (e: React.MouseEvent) => { if (!isDisabled) (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' },
  }

  if (href && !isDisabled) {
    return (
      <Link href={href} className={baseClass} style={style} aria-label={ariaLabel} {...handlers}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={baseClass}
      style={style}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...handlers}
    >
      {content}
    </button>
  )
}
