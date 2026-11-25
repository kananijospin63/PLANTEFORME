'use client'

// ============================================================
// SelectField — Champ select — Navy & Gold
// ============================================================

import React, { useId } from 'react'
import { AlertCircle, ChevronDown } from 'lucide-react'

interface SelectOption { value: string; label: string }

interface SelectFieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void
  options: SelectOption[]
  error?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
  hint?: string
  className?: string
}

export default function SelectField({
  label, name, value, onChange, onBlur, options, error,
  required = false, placeholder = 'Sélectionnez une option',
  disabled = false, hint, className = '',
}: SelectFieldProps) {
  const uid      = useId()
  const selectId = `select-${uid}-${name}`
  const errorId  = `${selectId}-error`
  const hintId   = `${selectId}-hint`
  const hasError = Boolean(error)
  const describedBy = [hasError ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ')

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={selectId} className="text-sm font-semibold text-navy select-none">
        {label}
        {required && <span className="text-danger ml-0.5" aria-hidden="true"> *</span>}
      </label>

      {hint && (
        <p id={hintId} className="text-xs text-surface-500 -mt-0.5">{hint}</p>
      )}

      <div className="relative">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={describedBy || undefined}
          className={[
            'w-full h-11 pl-4 pr-10 rounded-md text-sm bg-white appearance-none',
            // Pas de transition : sur un <select> natif, elle anime aussi
            // l'ouverture de la liste et rend le choix visuellement instable.
            'border',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            value === '' ? 'text-surface-400' : 'text-navy',
            disabled ? 'bg-surface-100 text-surface-400 cursor-not-allowed' : 'cursor-pointer',
            hasError
              ? 'border-danger focus:border-danger focus:ring-danger/20'
              : 'border-surface-200 hover:border-navy/30 focus:border-gold focus:ring-gold/20',
          ].filter(Boolean).join(' ')}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-navy">{opt.label}</option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
          {hasError
            ? <AlertCircle size={15} className="text-danger" />
            : <ChevronDown size={15} className="text-surface-400" />}
        </div>
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
