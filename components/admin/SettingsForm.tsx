'use client'

// ============================================================
// SettingsForm — paramètres du compte et de la session
// ============================================================

import { useState } from 'react'
import { Check, Save, Mail, Bell, CalendarDays, ShieldCheck } from 'lucide-react'
import type { SessionUser } from '@/lib/auth'
import { ROLE_LABEL } from '@/lib/auth'

const CARD: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(26,16,13,.08)',
  borderRadius: 16,
  boxShadow: '0 1px 2px rgba(26,16,13,.04)',
}

const NOTIFICATIONS = [
  { id: 'inscription', titre: 'Nouvelle inscription', desc: 'Recevoir un email à chaque nouvelle demande.' },
  { id: 'paiement',    titre: 'Paiement confirmé',    desc: 'Être notifié dès qu’un paiement est validé.' },
  { id: 'annulation',  titre: 'Annulation',           desc: 'Alerte lorsqu’un participant annule sa place.' },
  { id: 'digest',      titre: 'Résumé hebdomadaire',  desc: 'Un récapitulatif chaque lundi à 8h00.' },
]

export default function SettingsForm({ user }: { user: SessionUser }) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    inscription: true,
    paiement: true,
    annulation: true,
    digest: false,
  })
  const [lieu, setLieu] = useState('Centre CEPRODILUC')
  const [horaires, setHoraires] = useState('15H00 – 19H00')
  const [saved, setSaved] = useState(false)

  function enregistrer(event: React.FormEvent) {
    event.preventDefault()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2600)
  }

  return (
    <form onSubmit={enregistrer} className="flex flex-col gap-4">
      {/* Compte */}
      <section className="p-5 sm:p-6" style={CARD}>
        <h2 className="text-[14px] font-bold mb-1" style={{ color: '#1a100d' }}>
          Compte
        </h2>
        <p className="text-[11.5px] mb-5" style={{ color: 'rgba(26,16,13,.45)' }}>
          Informations liées à votre session administrateur.
        </p>

        <div className="flex items-center gap-3.5 mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-[14px] font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg,#efc98c,#ae5837)', color: '#1a100d' }}
            aria-hidden="true"
          >
            {user.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
          </div>
          <div className="min-w-0">
            <p className="text-[13.5px] font-bold truncate" style={{ color: '#1a100d' }}>{user.name}</p>
            <p className="text-[11.5px] truncate" style={{ color: 'rgba(26,16,13,.45)' }}>
              {user.poste} · {ROLE_LABEL[user.role]}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="param-email" className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(26,16,13,.45)' }}>
              Adresse email
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(26,16,13,.3)' }} aria-hidden="true" />
              <input
                id="param-email"
                type="email"
                defaultValue={user.email}
                className="w-full h-10 pl-10 pr-3.5 rounded-xl text-[12.5px] outline-none"
                style={{ background: 'rgba(26,16,13,.04)', color: '#1a100d', border: '1px solid transparent' }}
              />
            </div>
          </div>
          <div>
            <label htmlFor="param-role" className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(26,16,13,.45)' }}>
              Rôle
            </label>
            <div className="relative">
              <ShieldCheck size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(26,16,13,.3)' }} aria-hidden="true" />
              <input
                id="param-role"
                type="text"
                value={ROLE_LABEL[user.role]}
                readOnly
                className="w-full h-10 pl-10 pr-3.5 rounded-xl text-[12.5px] outline-none cursor-not-allowed"
                style={{ background: 'rgba(26,16,13,.02)', color: 'rgba(26,16,13,.55)', border: '1px solid rgba(26,16,13,.06)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Session */}
      <section className="p-5 sm:p-6" style={CARD}>
        <h2 className="text-[14px] font-bold mb-1" style={{ color: '#1a100d' }}>
          Session de formation
        </h2>
        <p className="text-[11.5px] mb-5" style={{ color: 'rgba(26,16,13,.45)' }}>
          Ces informations apparaissent sur le site public et dans les emails.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="param-lieu" className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(26,16,13,.45)' }}>
              Lieu
            </label>
            <div className="relative">
              <CalendarDays size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(26,16,13,.3)' }} aria-hidden="true" />
              <input
                id="param-lieu"
                type="text"
                value={lieu}
                onChange={(e) => setLieu(e.target.value)}
                className="w-full h-10 pl-10 pr-3.5 rounded-xl text-[12.5px] outline-none"
                style={{ background: 'rgba(26,16,13,.04)', color: '#1a100d', border: '1px solid transparent' }}
              />
            </div>
          </div>
          <div>
            <label htmlFor="param-horaires" className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(26,16,13,.45)' }}>
              Horaires
            </label>
            <input
              id="param-horaires"
              type="text"
              value={horaires}
              onChange={(e) => setHoraires(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl text-[12.5px] outline-none"
              style={{ background: 'rgba(26,16,13,.04)', color: '#1a100d', border: '1px solid transparent' }}
            />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="p-5 sm:p-6" style={CARD}>
        <h2 className="text-[14px] font-bold mb-1 flex items-center gap-2" style={{ color: '#1a100d' }}>
          <Bell size={14} aria-hidden="true" />
          Notifications
        </h2>
        <p className="text-[11.5px] mb-4" style={{ color: 'rgba(26,16,13,.45)' }}>
          Choisissez les alertes que vous souhaitez recevoir par email.
        </p>

        <ul className="flex flex-col">
          {NOTIFICATIONS.map((n, i) => {
            const actif = toggles[n.id]
            return (
              <li
                key={n.id}
                className="flex items-center justify-between gap-4 py-3.5"
                style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(26,16,13,.06)' }}
              >
                <div className="min-w-0">
                  <p className="text-[12.5px] font-semibold" style={{ color: '#1a100d' }}>{n.titre}</p>
                  <p className="text-[11.5px]" style={{ color: 'rgba(26,16,13,.45)' }}>{n.desc}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={actif}
                  aria-label={n.titre}
                  onClick={() => setToggles((prev) => ({ ...prev, [n.id]: !prev[n.id] }))}
                  className="relative w-9 h-5 rounded-full transition-colors shrink-0"
                  style={{ background: actif ? '#0f7a52' : 'rgba(26,16,13,.16)' }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                    style={{ left: actif ? 18 : 2 }}
                    aria-hidden="true"
                  />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Enregistrement */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl text-[12.5px] font-bold transition-transform hover:-translate-y-px"
          style={{ background: 'linear-gradient(135deg,#efc98c,#ae5837)', color: '#1a100d', boxShadow: '0 4px 14px rgba(174,88,55,.28)' }}
        >
          {saved ? <Check size={14} aria-hidden="true" /> : <Save size={14} aria-hidden="true" />}
          {saved ? 'Modifications enregistrées' : 'Enregistrer les modifications'}
        </button>
        <p className="text-[11px]" style={{ color: 'rgba(26,16,13,.4)' }}>
          Démonstration : les changements ne sont pas persistés.
        </p>
      </div>
    </form>
  )
}
