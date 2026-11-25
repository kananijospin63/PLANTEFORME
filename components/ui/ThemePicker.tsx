'use client'

// ============================================================
// ThemePicker — Sélecteur de couleur d'accent flottant
// Stocke le choix dans localStorage et l'applique via CSS var
// ============================================================

import { useState, useEffect } from 'react'
import { Palette, X } from 'lucide-react'

const THEMES = [
  { id: 'espresso', label: 'Espresso',   accent: '#efc98c', copper: '#ae5837', bg: '#1a100d' },
  { id: 'ocean',    label: 'Océan',      accent: '#38bdf8', copper: '#0284c7', bg: '#0c1a2e' },
  { id: 'forest',   label: 'Forêt',      accent: '#86efac', copper: '#16a34a', bg: '#0d1f12' },
  { id: 'violet',   label: 'Violet',     accent: '#c4b5fd', copper: '#7c3aed', bg: '#13091f' },
  { id: 'rose',     label: 'Rose',       accent: '#fda4af', copper: '#e11d48', bg: '#1f0d12' },
  { id: 'slate',    label: 'Ardoise',    accent: '#94a3b8', copper: '#475569', bg: '#0f172a' },
]

// Convertit un hex en triplet "r g b" (utilisé par les variables Tailwind)
function toRgbTriplet(hex: string): string {
  const num = parseInt(hex.replace('#', ''), 16)
  return `${(num >> 16) & 0xff} ${(num >> 8) & 0xff} ${num & 0xff}`
}

// Applique un thème en modifiant les variables CSS racine
function applyTheme(id: string) {
  const theme = THEMES.find(t => t.id === id) ?? THEMES[0]
  const root  = document.documentElement

  // Couleurs d'accent (styles inline)
  root.style.setProperty('--gold',      theme.accent)
  root.style.setProperty('--gold-dark', theme.copper)
  root.style.setProperty('--copper',    theme.copper)

  // Mêmes couleurs au format "r g b" pour les classes Tailwind (bg-gold, text-gold/40…)
  root.style.setProperty('--gold-rgb',   toRgbTriplet(theme.accent))
  root.style.setProperty('--copper-rgb', toRgbTriplet(theme.copper))

  root.setAttribute('data-theme', id)
  localStorage.setItem('club-ai-theme', id)
}

export default function ThemePicker() {
  const [open,     setOpen]    = useState(false)
  const [current,  setCurrent] = useState('espresso')

  // Appliquer le thème sauvegardé au chargement
  useEffect(() => {
    const saved = localStorage.getItem('club-ai-theme') ?? 'espresso'
    setCurrent(saved)
    applyTheme(saved)
  }, [])

  // Fermer le panneau avec la touche Échap
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  function select(id: string) {
    setCurrent(id)
    applyTheme(id)
  }

  const activeTheme = THEMES.find(t => t.id === current) ?? THEMES[0]

  return (
    <>
      {/* Bouton flottant */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label="Changer le thème de couleur"
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-[220ms] hover:-translate-y-1"
        style={{
          background:  `linear-gradient(135deg, ${activeTheme.accent}, ${activeTheme.copper})`,
          boxShadow:   `0 4px 20px ${activeTheme.copper}55`,
          color:       '#1a100d',
        }}
      >
        {open ? <X size={18} strokeWidth={2.5} /> : <Palette size={18} strokeWidth={2.5} />}
      </button>

      {/* Panneau */}
      {open && (
        <div
          className="fixed bottom-20 right-6 z-50 rounded-2xl p-4 w-56 transition-all duration-[220ms]"
          style={{
            background:   'rgba(26,16,13,.95)',
            backdropFilter:'blur(20px)',
            border:       `1px solid rgba(239,201,140,.2)`,
            boxShadow:    '0 12px 40px rgba(0,0,0,.5)',
          }}
          role="dialog"
          aria-label="Sélecteur de thème"
        >
          <p
            className="text-[10px] font-bold tracking-widest uppercase mb-3"
            style={{ color:'rgba(255,244,232,.4)' }}
          >
            Thème de couleur
          </p>

          <div className="flex flex-col gap-2">
            {THEMES.map(theme => (
              <button
                key={theme.id}
                type="button"
                onClick={() => select(theme.id)}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                style={{
                  background:  current === theme.id ? 'rgba(255,244,232,.08)' : 'transparent',
                  border:      current === theme.id ? '1px solid rgba(255,244,232,.12)' : '1px solid transparent',
                }}
              >
                {/* Aperçu couleur */}
                <div
                  className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center"
                  style={{ background:`linear-gradient(135deg,${theme.accent},${theme.copper})` }}
                >
                  {current === theme.id && (
                    <span className="text-[8px] font-black text-[#1a100d]">✓</span>
                  )}
                </div>

                {/* Nom */}
                <span
                  className="text-sm font-medium"
                  style={{ color: current === theme.id ? '#fff4e8' : 'rgba(255,244,232,.55)' }}
                >
                  {theme.label}
                </span>

                {/* Pastilles */}
                <div className="ml-auto flex gap-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background:theme.accent }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background:theme.copper }} />
                </div>
              </button>
            ))}
          </div>

          {/* Note */}
          <p className="text-[9px] mt-3 text-center" style={{ color:'rgba(255,244,232,.2)' }}>
            Le choix est sauvegardé automatiquement
          </p>
        </div>
      )}
    </>
  )
}
