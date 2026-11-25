'use client'

// ============================================================
// TextareaField — Champ multiligne — Navy & Gold
// ============================================================

import React, { useId } from 'react'
import { AlertCircle } from 'lucide-react'

interface TextareaFieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  error?: string
  required?: boolean
  placeholder?: string
  rows?: number
  maxLength?: number
  disabled?: boolean
  hint?: string
  className?: string
}

export default function TextareaField({
  label, name, value, onChange, onBlur, error, required = false,
  placeholder, rows = 4, maxLength, disabled = false, hint, className = '',
}: TextareaFieldProps) {
  const uid         = useId()
  const textareaId  = `textarea-${uid}-${name}`
  const errorId     = `${textareaId}-error`
  const hintId      = `${textareaId}-hint`
  const hasError    = Boolean(error)
  const charCount   = value.length
  const describedBy = [hasError ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ')

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={textareaId} className="text-sm font-semibold text-navy select-none">
          {label}
          {required && <span className="text-danger ml-0.5" aria-hidden="true"> *</span>}
        </label>
        {maxLength && (
          <span className={`text-xs tabular-nums ${charCount >= maxLength ? 'text-danger' : 'text-surface-400'}`} aria-live="polite">
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      {hint && <p id={hintId} className="text-xs text-surface-500 -mt-0.5">{hint}</p>}

      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={describedBy || undefined}
        className={[
          'w-full px-4 py-3 rounded-md text-sm text-navy bg-white',
          'border transition-all duration-[220ms] ease-premium resize-y min-h-[100px]',
          'placeholder:text-surface-400',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          disabled ? 'bg-surface-100 text-surface-400 cursor-not-allowed' : '',
          hasError
            ? 'border-danger focus:border-danger focus:ring-danger/20'
            : 'border-surface-200 hover:border-navy/30 focus:border-gold focus:ring-gold/20',
        ].filter(Boolean).join(' ')}
      />

      {hasError && (
        <p id={errorId} role="alert" className="flex items-center gap-1.5 text-xs text-danger font-medium">
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}
