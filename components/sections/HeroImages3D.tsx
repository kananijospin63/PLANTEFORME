'use client'

// ============================================================
// HeroImages3D — Orbites 3D par calcul mathématique (RAF)
// Chaque icône suit une ellipse inclinée calculée par JS
// ============================================================

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface OrbitDef {
  src:      string
  alt:      string
  label:    string
  iconSize: number
  rx:       number    // rayon x (largeur ellipse)
  ry:       number    // rayon y (hauteur ellipse — donne l'inclinaison 3D)
  speed:    number    // rad/s (vitesse angulaire)
  phase:    number    // angle initial en radians
  zScale:   number    // amplitude du déplacement Z simulé
  bg:       string
  glow:     string
}

const ORBITS: OrbitDef[] = [
  {
    src: '/images/chatgpt.png', alt: 'ChatGPT', label: 'ChatGPT',
    iconSize: 70, rx: 240, ry: 145, speed: 0.45, phase: 0,
    zScale: 60,
    bg:   'rgba(16,163,127,0.18)',
    glow: '0 0 40px rgba(16,163,127,0.6)',
  },
  {
    src: '/images/gemini.png', alt: 'Gemini', label: 'Gemini',
    iconSize: 62, rx: 228, ry: 132, speed: 0.32, phase: 1.2566,
    zScale: 50,
    bg:   'rgba(234,88,12,0.18)',
    glow: '0 0 40px rgba(234,88,12,0.6)',
  },
  {
    src: '/images/player.png', alt: 'Cours vidéo', label: 'Cours vidéo',
    iconSize: 68, rx: 232, ry: 140, speed: 0.40, phase: 2.5133,
    zScale: 65,
    bg:   'rgba(99,102,241,0.18)',
    glow: '0 0 40px rgba(99,102,241,0.65)',
  },
  {
    src: '/images/automation.png', alt: 'n8n & Make', label: 'n8n & Make',
    iconSize: 64, rx: 238, ry: 134, speed: 0.27, phase: 3.7699,
    zScale: 45,
    bg:   'rgba(236,72,153,0.18)',
    glow: '0 0 40px rgba(236,72,153,0.6)',
  },
  {
    src: '/images/claude.png', alt: 'Claude', label: 'Claude',
    iconSize: 70, rx: 226, ry: 142, speed: 0.37, phase: 5.0265,
    zScale: 55,
    bg:   'rgba(139,92,246,0.18)',
    glow: '0 0 40px rgba(139,92,246,0.65)',
  },
]

// Calcule la position x,y,z d'une icône à l'angle theta
function calcPos(o: OrbitDef, theta: number) {
  const x = Math.cos(theta) * o.rx
  const y = Math.sin(theta) * o.ry
  const z = Math.sin(theta) * o.zScale  // profondeur simulée
  // scale selon z pour donner l'illusion de profondeur
  const scale = 0.75 + 0.35 * ((z + o.zScale) / (2 * o.zScale))
  return { x, y, z, scale }
}

const W  = 640
const H  = 580
const CX = W / 2
const CY = H / 2 - 5   // légèrement au-dessus du centre

export default function HeroImages3D() {
  // Angles courants de chaque orbite
  const anglesRef = useRef<number[]>(ORBITS.map((o) => o.phase))
  const rafRef    = useRef<number>(0)
  const lastRef   = useRef<number>(0)

  // Positions calculées stockées en state pour le rendu
  const [positions, setPositions] = useState<
    { x: number; y: number; z: number; scale: number }[]
  >(ORBITS.map((o) => calcPos(o, o.phase)))

  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    // Respect de la préférence système : pas d'animation continue.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const FRAME_MS = 1000 / 30 // ~30 fps : suffisant et bien plus léger

    const animate = (ts: number) => {
      // Throttle : on ne recalcule (et ne re-render) qu'à ~30 fps.
      // `lastRef` n'est mis à jour que lors d'un rendu, ce qui laisse
      // s'accumuler le delta de temps jusqu'au prochain rendu utile.
      if (ts - lastRef.current < FRAME_MS) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      const dt = lastRef.current ? Math.min((ts - lastRef.current) / 1000, 0.05) : 0
      lastRef.current = ts

      anglesRef.current = anglesRef.current.map((a, i) =>
        a + ORBITS[i].speed * dt
      )

      setPositions(
        ORBITS.map((o, i) => calcPos(o, anglesRef.current[i]))
      )

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Trier par z pour le z-index (les plus proches devant)
  const sorted = positions
    .map((p, i) => ({ ...p, i }))
    .sort((a, b) => a.z - b.z)

  return (
    <div
      className="relative select-none"
      style={{
        width:  W,
        height: H,
        transform: hovered
          ? 'rotateX(5deg) rotateY(8deg)'
          : 'rotateX(12deg) rotateY(-6deg)',
        transition: 'transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
        perspective: '800px',
      }}
      aria-hidden="true"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Anneaux de fond ── */}
      <Ring cx={CX} cy={CY} rx={240} ry={145} />
      <Ring cx={CX} cy={CY} rx={228} ry={132} opacity={0.04} />
      <Ring cx={CX} cy={CY} rx={232} ry={140} opacity={0.03} />
      <Ring cx={CX} cy={CY} rx={292} ry={186} opacity={0.015} />

      {/* ── Centre pulsant ── */}
      <div
        className="absolute"
        style={{
          width:  140,
          height: 140,
          left:   CX - 70,
          top:    CY - 70,
          zIndex: 50,
        }}
      >
        <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(245,158,11,0.1)', animationDuration: '3s' }} />
        <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'rgba(245,158,11,0.06)', animationDuration: '2s' }} />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)',
            border:     '2px solid rgba(245,158,11,0.35)',
            boxShadow:  '0 0 60px rgba(245,158,11,0.3), 0 0 120px rgba(245,158,11,0.1)',
            backdropFilter: 'blur(10px)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-[#0F172A] text-2xl tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              boxShadow: '0 6px 30px rgba(245,158,11,0.7)',
            }}
          >
            AI
          </div>
        </div>
      </div>

      {/* ── Icônes en orbite ── */}
      {sorted.map(({ x, y, z, scale, i }) => {
        const o = ORBITS[i]
        const cardW = o.iconSize + 40
        const cardH = o.iconSize + 54
        const left  = CX + x - cardW / 2
        const top   = CY + y - cardH / 2
        // zIndex basé sur profondeur
        const zIdx  = Math.round(10 + z)

        return (
          <div
            key={o.src}
            className="absolute"
            style={{
              width:    cardW,
              height:   cardH,
              left,
              top,
              zIndex:   zIdx,
              transform: `scale(${scale.toFixed(3)})`,
              transformOrigin: 'center center',
              transition: 'none',  // le RAF gère l'animation
            }}
          >
            <div
              className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-1 group"
              style={{
                background:     o.bg,
                border:         '1px solid rgba(255,255,255,0.14)',
                backdropFilter: 'blur(14px)',
                boxShadow:      `${o.glow}, 0 4px 18px rgba(0,0,0,0.35)`,
                transition:     'transform 0.25s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.14)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
              }}
            >
              <Image
                src={o.src}
                alt={o.alt}
                width={o.iconSize}
                height={o.iconSize}
                className="object-contain"
                style={{
                  filter:    'drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
                  maxWidth:  o.iconSize,
                  maxHeight: o.iconSize,
                  // Gemini (étoile) est surdimensionnée, on la réduit davantage
                  padding: o.src.includes('gemini') ? 4 : 0,
                }}
              />
              <span
                style={{
                  fontSize:      11,
                  fontWeight:    700,
                  color:         'rgba(255,255,255,0.75)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  whiteSpace:    'nowrap',
                }}
              >
                {o.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── SVG ellipse décorative de fond ── */
function Ring({
  cx, cy, rx, ry, opacity = 0.06,
}: {
  cx: number; cy: number; rx: number; ry: number; opacity?: number
}) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width="100%"
      height="100%"
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <ellipse
        cx={cx} cy={cy} rx={rx} ry={ry}
        fill="none"
        stroke={`rgba(245,158,11,${opacity})`}
        strokeWidth="1"
      />
    </svg>
  )
}
