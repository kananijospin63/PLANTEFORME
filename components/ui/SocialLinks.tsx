'use client'

// ============================================================
// SocialLinks — Icônes Facebook / Instagram / YouTube / TikTok
// ============================================================
// lucide-react ne fournit pas les logos de marque : les tracés sont
// dessinés ici, en `currentColor`, pour hériter de la couleur du parent.
// ============================================================

import React from 'react'
import { SOCIAL_LINKS, type SocialLink } from '@/data/socials'

function Icone({ id }: { id: SocialLink['id'] }) {
  const commun = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    'aria-hidden': true as const,
    focusable: 'false' as const,
  }

  switch (id) {
    case 'facebook':
      return (
        <svg {...commun} fill="currentColor">
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1.1 15.9v-5.2h1.8l.3-2.1h-2.1V9.2c0-.6.2-1 1-1h1.1V6.3c-.2 0-.9-.1-1.7-.1-1.7 0-2.9 1-2.9 2.9v1.6H8.9v2.1h1.7v5.2h2.5z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg {...commun} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'youtube':
      return (
        <svg {...commun} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
          <path d="M10.4 9.7l5.2 2.3-5.2 2.3z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg {...commun} fill="currentColor">
          <path d="M16.6 3c.3 2.1 1.6 3.6 3.7 3.9v2.6c-1.4 0-2.7-.4-3.8-1.2v5.9c0 3.1-2.5 5.6-5.6 5.6S5.3 17.3 5.3 14.2s2.5-5.6 5.6-5.6c.3 0 .6 0 .9.1v2.7c-.3-.1-.6-.2-.9-.2-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9 2.9-1.3 2.9-2.9V3h2.8z" />
        </svg>
      )
  }
}

interface SocialLinksProps {
  /** Couleur des icônes. */
  couleur?: string
  /** Couleur de fond des pastilles. */
  fond?: string
  /** Bordure des pastilles. */
  bordure?: string
  className?: string
}

export default function SocialLinks({
  couleur = 'var(--gold)',
  fond = 'rgba(245,158,11,0.08)',
  bordure = 'rgba(245,158,11,0.22)',
  className = '',
}: SocialLinksProps) {
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {SOCIAL_LINKS.map((reseau) => (
        <li key={reseau.id}>
          <a
            href={reseau.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`CLUB AI sur ${reseau.label}`}
            title={reseau.label}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            style={{ background: fond, border: `1px solid ${bordure}`, color: couleur }}
          >
            <Icone id={reseau.id} />
          </a>
        </li>
      ))}
    </ul>
  )
}
