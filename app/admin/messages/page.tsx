'use client'

// ============================================================
// /admin/messages — boîte de réception de l'équipe
// ============================================================

import { useState } from 'react'
import { Mail, Reply, Search, Inbox, CheckCheck } from 'lucide-react'
import { MESSAGES, formatHeure, type AdminMessage } from '@/data/admin'

const CARD: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(26,16,13,.08)',
  borderRadius: 16,
  boxShadow: '0 1px 2px rgba(26,16,13,.04)',
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[]>(MESSAGES)
  const [selection, setSelection] = useState<string>(MESSAGES[0]?.id ?? '')
  const [recherche, setRecherche] = useState('')

  const filtres = messages.filter((m) => {
    const q = recherche.trim().toLowerCase()
    return !q || m.sujet.toLowerCase().includes(q) || m.auteur.toLowerCase().includes(q)
  })

  const actif = messages.find((m) => m.id === selection) ?? filtres[0]

  function ouvrir(id: string) {
    setSelection(id)
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, lu: true } : m)))
  }

  function toutMarquerLu() {
    setMessages((prev) => prev.map((m) => ({ ...m, lu: true })))
  }

  const nonLus = messages.filter((m) => !m.lu).length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
      {/* Liste */}
      <div className="overflow-hidden" style={CARD}>
        <div className="p-3.5" style={{ borderBottom: '1px solid rgba(26,16,13,.07)' }}>
          <div className="flex items-center gap-2 h-9 px-3 rounded-lg mb-2.5" style={{ background: 'rgba(26,16,13,.04)' }}>
            <Search size={14} style={{ color: 'rgba(26,16,13,.35)' }} aria-hidden="true" />
            <input
              type="search"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher un message…"
              aria-label="Rechercher un message"
              className="flex-1 bg-transparent outline-none text-[12px] placeholder:text-[#9a8d82]"
              style={{ color: '#1a100d' }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold" style={{ color: 'rgba(26,16,13,.45)' }}>
              {nonLus} non lu{nonLus > 1 ? 's' : ''} · {messages.length} messages
            </span>
            <button
              type="button"
              onClick={toutMarquerLu}
              className="inline-flex items-center gap-1 text-[11px] font-semibold transition-colors hover:opacity-70"
              style={{ color: 'var(--copper)' }}
            >
              <CheckCheck size={12} aria-hidden="true" />
              Tout lire
            </button>
          </div>
        </div>

        <ul className="max-h-[560px] overflow-y-auto">
          {filtres.map((msg) => {
            const estActif = actif?.id === msg.id
            return (
              <li key={msg.id}>
                <button
                  type="button"
                  onClick={() => ouvrir(msg.id)}
                  className="w-full text-left px-4 py-3.5 transition-colors"
                  style={{
                    background: estActif ? 'rgba(174,88,55,.06)' : 'transparent',
                    borderTop: '1px solid rgba(26,16,13,.055)',
                    borderLeft: `2px solid ${estActif ? 'var(--copper)' : 'transparent'}`,
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p
                      className="text-[12px] truncate"
                      style={{ color: '#1a100d', fontWeight: msg.lu ? 500 : 700 }}
                    >
                      {msg.auteur}
                    </p>
                    {!msg.lu && (
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: 'var(--copper)' }} aria-hidden="true" />
                    )}
                  </div>
                  <p
                    className="text-[11.5px] truncate mb-1"
                    style={{ color: msg.lu ? 'rgba(26,16,13,.5)' : 'rgba(26,16,13,.75)', fontWeight: msg.lu ? 400 : 600 }}
                  >
                    {msg.sujet}
                  </p>
                  <p className="text-[10.5px]" style={{ color: 'rgba(26,16,13,.32)' }}>
                    {formatHeure(msg.date)}
                  </p>
                </button>
              </li>
            )
          })}

          {filtres.length === 0 && (
            <li className="px-4 py-10 text-center">
              <Inbox size={20} className="mx-auto mb-2" style={{ color: 'rgba(26,16,13,.2)' }} aria-hidden="true" />
              <p className="text-[12px]" style={{ color: 'rgba(26,16,13,.45)' }}>
                Aucun message trouvé
              </p>
            </li>
          )}
        </ul>
      </div>

      {/* Détail */}
      <div className="flex flex-col overflow-hidden min-h-[420px]" style={CARD}>
        {actif ? (
          <>
            <div className="p-5 sm:p-6" style={{ borderBottom: '1px solid rgba(26,16,13,.07)' }}>
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-bold shrink-0"
                  style={{ background: 'linear-gradient(135deg,var(--gold),var(--copper))', color: '#1a100d' }}
                  aria-hidden="true"
                >
                  {actif.auteur.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold" style={{ color: '#1a100d' }}>{actif.auteur}</p>
                  <p className="text-[11px]" style={{ color: 'rgba(26,16,13,.45)' }}>{actif.email}</p>
                </div>
                <span className="text-[10.5px] shrink-0" style={{ color: 'rgba(26,16,13,.35)' }}>
                  {formatHeure(actif.date)}
                </span>
              </div>
              <h2 className="text-[16px] leading-snug" style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, color: '#1a100d' }}>
                {actif.sujet}
              </h2>
            </div>

            <div className="p-5 sm:p-6 flex-1">
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'rgba(26,16,13,.7)' }}>
                {actif.extrait}
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(26,16,13,.55)' }}>
                Merci de votre retour. Nous revenons vers vous avec les
                informations complètes dans les plus brefs délais.
              </p>
              <p className="text-[13px] leading-relaxed mt-4" style={{ color: 'rgba(26,16,13,.55)' }}>
                Bien à vous,
                <br />
                L’équipe CLUB AI
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 p-4" style={{ borderTop: '1px solid rgba(26,16,13,.07)' }}>
              <a
                href={`mailto:${actif.email}?subject=Re: ${encodeURIComponent(actif.sujet)}`}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-[12px] font-bold transition-transform hover:-translate-y-px"
                style={{ background: 'linear-gradient(135deg,var(--gold),var(--copper))', color: '#1a100d' }}
              >
                <Reply size={13} aria-hidden="true" />
                Répondre
              </a>
              <a
                href={`mailto:${actif.email}`}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-[12px] font-semibold transition-colors hover:bg-black/5"
                style={{ background: 'rgba(26,16,13,.04)', color: 'rgba(26,16,13,.7)' }}
              >
                <Mail size={13} aria-hidden="true" />
                Écrire à {actif.auteur.split(' ')[0]}
              </a>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <Inbox size={26} className="mb-3" style={{ color: 'rgba(26,16,13,.18)' }} aria-hidden="true" />
            <p className="text-[13px] font-semibold" style={{ color: '#1a100d' }}>
              Sélectionnez un message
            </p>
            <p className="text-[12px] mt-1" style={{ color: 'rgba(26,16,13,.45)' }}>
              Le contenu s’affichera ici.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
