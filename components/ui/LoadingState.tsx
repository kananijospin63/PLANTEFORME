// ============================================================
// LoadingState — Navy & Gold
// ============================================================

import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
  fullPage?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { icon: 16, text: 'text-sm'  },
  md: { icon: 24, text: 'text-base'},
  lg: { icon: 32, text: 'text-lg'  },
}

export default function LoadingState({
  message = 'Chargement...',
  fullPage = false,
  size = 'md',
}: LoadingStateProps) {
  const { icon, text } = sizeMap[size]

  const content = (
    <div className="flex flex-col items-center justify-center gap-4" role="status" aria-live="polite" aria-label={message}>
      <Loader2 size={icon} className="animate-spin text-gold" aria-hidden="true" />
      <p className={`${text} text-surface-500 font-medium`}>{message}</p>
    </div>
  )

  if (fullPage) {
    return <div className="min-h-[60vh] flex items-center justify-center bg-surface">{content}</div>
  }

  return content
}
