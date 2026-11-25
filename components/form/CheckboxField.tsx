'use client'

// ============================================================
// CheckboxField — Case à cocher — Navy & Gold
// ============================================================

import React, { useId } from 'react'
import { AlertCircle, Check } from 'lucide-react'

interface CheckboxFieldProps {
  label: React.ReactNode
  name: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export default function CheckboxField({
  label, name, checked, onChange, error,
  required = false, disabled = false, className = '',
}: CheckboxFieldProps) {
  const uid        = useId()
  const checkboxId = `checkbox-${uid}-${name}`
  const errorId    = `${checkboxId}-error`
  const hasError   = Boolean(error)

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            id={checkboxId}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            aria-required={required}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
            className="sr-only peer"
          />
          <label
            htmlFor={checkboxId}
            className={[
              'flex items-center justify-center w-5 h-5 rounded cursor-pointer',
              'transition-all duration-[220ms] ease-premium border-2',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-gold',
              disabled ? 'cursor-not-allowed opacity-50' : '',
              hasError
                ? 'border-danger bg-white'
                : checked
                  ? 'bg-navy border-navy'
                  : 'bg-white border-surface-300 hover:border-gold',
            ].filter(Boolean).join(' ')}
            aria-hidden="true"
          >
            {checked && <Check size={12} className="text-white stroke-[3]" />}
          </label>
        </div>

        <label
          htmlFor={checkboxId}
          className={`text-sm leading-relaxed cursor-pointer select-none ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'text-navy'
          }`}
        >
          {label}
          {required && <span className="text-danger ml-0.5" aria-hidden="true">*</span>}
        </label>
      </div>

      {hasError && (
        <p id={errorId} role="alert" className="flex items-center gap-1.5 text-xs text-danger font-medium ml-8">
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}
