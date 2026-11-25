'use client'

// ============================================================
// FormField — Champ texte/email/tel/date — Navy & Gold
// ============================================================

import React, { useId } from 'react'
import { AlertCircle } from 'lucide-react'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'date' | 'number'
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  placeholder?: string
  autoComplete?: string
  disabled?: boolean
  hint?: string
  /** Borne haute (format AAAA-MM-JJ), utile pour un champ date. */
  max?: string
  className?: string
}

export default function FormField({
  label, name, type = 'text', value, onChange, onBlur,
  error, required = false, placeholder, autoComplete,
  disabled = false, hint, max, className = '',
}: FormFieldProps) {
  const uid      = useId()
  const inputId  = `field-${uid}-${name}`
  const errorId  = `${inputId}-error`
  const hintId   = `${inputId}-hint`
  const hasError = Boolean(error)
  const describedBy = [hasError ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ')

  // Le sélecteur de date natif n'anime pas ses couleurs : une transition
  // sur ce champ donne une impression de clignotement à l'ouverture du
  // calendrier. On la réserve donc aux champs texte.
  const animer = type !== 'date'

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label */}
      <label htmlFor={inputId} className="text-sm font-semibold text-navy select-none">
        {label}
        {required && <span className="text-danger ml-0.5" aria-hidden="true"> *</span>}
      </label>

      {hint && (
        <p id={hintId} className="text-xs text-surface-500 -mt-0.5">{hint}</p>
      )}

      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          max={max}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={describedBy || undefined}
          className={[
            'w-full h-11 px-4 rounded-md text-sm text-navy bg-white',
            'border',
            animer ? 'transition-all duration-[220ms] ease-premium' : '',
            'placeholder:text-surface-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            disabled ? 'bg-surface-100 text-surface-400 cursor-not-allowed' : '',
            hasError
              ? 'border-danger focus:border-danger focus:ring-danger/20'
              : 'border-surface-200 hover:border-navy/30 focus:border-gold focus:ring-gold/20',
          ].filter(Boolean).join(' ')}
        />
        {hasError && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
            <AlertCircle size={15} className="text-danger" />
          </div>
        )}
      </div>

      {hasError && (
        <p id={errorId} role="alert" className="flex items-center gap-1.5 text-xs text-danger font-medium">
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}
