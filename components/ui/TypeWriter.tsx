'use client'

// ============================================================
// TypeWriter — Animation texte lettre par lettre
// ============================================================

import { useEffect, useState, useRef } from 'react'

interface TypeWriterProps {
  segments: Array<{
    text: string
    className?: string
    style?: React.CSSProperties
  }>
  speed?: number
  startDelay?: number
  cursor?: boolean
  className?: string
}

export default function TypeWriter({
  segments,
  speed = 55,
  startDelay = 400,
  cursor = true,
  className = '',
}: TypeWriterProps) {
  // Aplatir tous les segments en un tableau de { char, className }
  const chars = segments.flatMap((seg) =>
    seg.text.split('').map((char) => ({ char, className: seg.className ?? '', style: seg.style }))
  )

  const [displayed, setDisplayed] = useState(0) // nb de chars affichés
  const [done, setDone]           = useState(false)
  const [blink, setBlink]         = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Animation de frappe
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayed(chars.length)
      setDone(true)
      return
    }

    timerRef.current = setTimeout(() => {
      let i = 0
      const type = () => {
        i++
        setDisplayed(i)
        if (i < chars.length) {
          // Légère variation de vitesse pour un effet naturel
          const jitter = speed + Math.random() * 20 - 10
          timerRef.current = setTimeout(type, Math.max(20, jitter))
        } else {
          setDone(true)
        }
      }
      type()
    }, startDelay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [chars.length, speed, startDelay])

  // Curseur : clignote pendant la frappe, puis s'arrête 1.5s après
  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setBlink(false), 1500)
    return () => clearTimeout(t)
  }, [done])

  // Regrouper les chars affichés par segment pour le rendu
  const renderedSegments: Array<{ text: string; className: string; style?: React.CSSProperties }> = []
  let charIdx = 0
  for (const seg of segments) {
    const segLen = seg.text.length
    const visible = Math.max(0, Math.min(displayed - charIdx, segLen))
    if (visible > 0) {
      renderedSegments.push({
        text:      seg.text.slice(0, visible),
        className: seg.className ?? '',
        style:     seg.style,
      })
    }
    charIdx += segLen
    if (displayed <= charIdx && visible < segLen) break
  }

  return (
    <span className={className} aria-label={segments.map((s) => s.text).join('')}>
      {renderedSegments.map((seg, i) => (
        <span key={i} className={seg.className} style={seg.style}>
          {seg.text}
        </span>
      ))}
      {/* Curseur clignotant */}
      {cursor && !done && (
        <span
          className="inline-block w-[3px] h-[0.85em] ml-1 align-middle rounded-sm bg-gold"
          style={{
            animation: blink ? 'cursorBlink 0.6s step-end infinite' : 'none',
            opacity:   blink ? undefined : 0,
          }}
          aria-hidden="true"
        />
      )}
      {cursor && done && blink && (
        <span
          className="inline-block w-[3px] h-[0.85em] ml-1 align-middle rounded-sm bg-gold"
          style={{ animation: 'cursorBlink 0.6s step-end infinite' }}
          aria-hidden="true"
        />
      )}
    </span>
  )
}
