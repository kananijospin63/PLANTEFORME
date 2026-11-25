// ============================================================
// ErrorMessage — Affichage d'erreurs API ou système
// ============================================================

import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  inline?: boolean // version compacte inline dans un formulaire
}

export default function ErrorMessage({
  title = 'Une erreur est survenue',
  message,
  onRetry,
  inline = false,
}: ErrorMessageProps) {
  if (inline) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2.5"
      >
        <AlertCircle size={15} className="shrink-0 mt-0.5" aria-hidden="true" />
        <span>{message}</span>
      </div>
    )
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center"
    >
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
        <AlertCircle size={24} className="text-red-600" aria-hidden="true" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-semibold text-[#1A1A1A] text-base">{title}</h3>
        <p className="text-[#404040] text-sm leading-relaxed max-w-sm">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0E5A4A] hover:text-[#0a4337] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E5A4A] focus-visible:ring-offset-2 rounded"
        >
          <RefreshCw size={14} aria-hidden="true" />
          Réessayer
        </button>
      )}
    </div>
  )
}
