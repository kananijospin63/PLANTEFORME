// ============================================================
// Divider — Séparateur visuel simple
// ============================================================

interface DividerProps {
  className?: string
  light?: boolean
}

export default function Divider({ className = '', light = false }: DividerProps) {
  return (
    <hr
      className={`border-0 border-t ${
        light ? 'border-white/15' : 'border-[#1A1A1A]/8'
      } ${className}`}
      aria-hidden="true"
    />
  )
}
