'use client'

// ============================================================
// /admin/acces — gestion des accès (réservé aux administrateurs)
// ============================================================

import { useState } from 'react'
import { ShieldCheck, UserPlus, Crown, GraduationCap, LifeBuoy, Check } from 'lucide-react'
import { TEAM, type TeamMember } from '@/data/admin'

const CARD: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(26,16,13,.08)',
  borderRadius: 16,
  boxShadow: '0 1px 2px rgba(26,16,13,.04)',
}

const ROLE_ICON: Record<TeamMember['role'], React.ElementType> = {
  Administrateur: Crown,
  Formateur: GraduationCap,
  Support: LifeBuoy,
}

const ROLE_DESC: Record<TeamMember['role'], string> = {
  Administrateur: 'Accès complet : inscriptions, formations, accès et paramètres.',
  Formateur: 'Accès au catalogue, aux participants et aux messages.',
  Support: 'Accès aux inscriptions et aux messages uniquement.',
}

export default function AdminAccesPage() {
  const [membres, setMembres] = useState<TeamMember[]>(TEAM)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<TeamMember['role']>('Formateur')
  const [invite, setInvite] = useState(false)

  function basculer(id: string) {
    setMembres((prev) => prev.map((m) => (m.id === id ? { ...m, actif: !m.actif } : m)))
  }

  function inviter(event: React.FormEvent) {
    event.preventDefault()
    if (!email.trim()) return

    const initiales = email.trim().slice(0, 2).toUpperCase()
    setMembres((prev) => [
      ...prev,
      {
        id: `usr-${prev.length + 1}`,
        nom: email.split('@')[0],
        email: email.trim(),
        role,
        actif: true,
        initiales,
      },
    ])
    setEmail('')
    setInvite(true)
    window.setTimeout(() => setInvite(false), 2600)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Bandeau */}
      <div
        className="rounded-2xl p-5 sm:p-6 flex items-start gap-4"
        style={{ background: 'rgba(239,201,140,.16)', border: '1px solid rgba(174,88,55,.16)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(174,88,55,.14)' }}
          aria-hidden="true"
        >
          <ShieldCheck size={18} style={{ color: 'var(--copper)' }} />
        </div>
        <div>
          <p className="text-[13px] font-bold mb-1" style={{ color: '#1a100d' }}>
            Espace réservé aux administrateurs
          </p>
          <p className="text-[12px] leading-relaxed max-w-[560px]" style={{ color: 'rgba(26,16,13,.55)' }}>
            Seuls les comptes avec le rôle « Administrateur » voient ce menu.
            Les autres rôles accèdent au tableau de bord avec des droits réduits.
          </p>
        </div>
      </div>

      {/* Équipe */}
      <div className="overflow-hidden" style={CARD}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(26,16,13,.07)' }}>
          <h2 className="text-[14px] font-bold" style={{ color: '#1a100d' }}>
            Membres de l’équipe
          </h2>
          <span className="text-[11px]" style={{ color: 'rgba(26,16,13,.4)' }}>
            {membres.filter((m) => m.actif).length} actifs / {membres.length}
          </span>
        </div>

        <ul>
          {membres.map((membre) => {
            const Icon = ROLE_ICON[membre.role]
            return (
              <li
                key={membre.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4"
                style={{ borderTop: '1px solid rgba(26,16,13,.055)' }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={{
                      background: membre.actif ? 'linear-gradient(135deg,var(--gold),var(--copper))' : 'rgba(26,16,13,.07)',
                      color: membre.actif ? '#1a100d' : 'rgba(26,16,13,.4)',
                    }}
                    aria-hidden="true"
                  >
                    {membre.initiales}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold truncate" style={{ color: '#1a100d' }}>
                      {membre.nom}
                    </p>
                    <p className="text-[11px] truncate" style={{ color: 'rgba(26,16,13,.45)' }}>
                      {membre.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10.5px] font-semibold whitespace-nowrap"
                    style={{ background: 'rgba(26,16,13,.04)', color: 'rgba(26,16,13,.6)' }}
                  >
                    <Icon size={11} aria-hidden="true" />
                    {membre.role}
                  </span>

                  <button
                    type="button"
                    onClick={() => basculer(membre.id)}
                    role="switch"
                    aria-checked={membre.actif}
                    aria-label={`Activer ou désactiver le compte de ${membre.nom}`}
                    className="relative w-9 h-5 rounded-full transition-colors shrink-0"
                    style={{ background: membre.actif ? '#0f7a52' : 'rgba(26,16,13,.16)' }}
                  >
                    <span
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                      style={{ left: membre.actif ? 18 : 2 }}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Invitation + rôles */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
        <form onSubmit={inviter} className="p-5 sm:p-6" style={CARD}>
          <h2 className="text-[14px] font-bold mb-1" style={{ color: '#1a100d' }}>
            Inviter un membre
          </h2>
          <p className="text-[11.5px] mb-4" style={{ color: 'rgba(26,16,13,.45)' }}>
            Un email d’invitation sera envoyé avec un lien d’activation.
          </p>

          <label htmlFor="invite-email" className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(26,16,13,.45)' }}>
            Adresse email
          </label>
          <input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="prenom@club-ai.com"
            className="w-full h-10 px-3.5 rounded-xl text-[12.5px] outline-none mb-3"
            style={{ background: 'rgba(26,16,13,.04)', color: '#1a100d', border: '1px solid transparent' }}
          />

          <label htmlFor="invite-role" className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(26,16,13,.45)' }}>
            Rôle
          </label>
          <select
            id="invite-role"
            value={role}
            onChange={(e) => setRole(e.target.value as TeamMember['role'])}
            className="w-full h-10 px-3 rounded-xl text-[12.5px] outline-none mb-4 cursor-pointer"
            style={{ background: 'rgba(26,16,13,.04)', color: '#1a100d', border: '1px solid transparent' }}
          >
            <option value="Administrateur">Administrateur</option>
            <option value="Formateur">Formateur</option>
            <option value="Support">Support</option>
          </select>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 w-full h-10 rounded-xl text-[12.5px] font-bold transition-transform hover:-translate-y-px"
            style={{ background: '#1a100d', color: '#fff4e8' }}
          >
            {invite ? (
              <>
                <Check size={14} aria-hidden="true" />
                Invitation envoyée
              </>
            ) : (
              <>
                <UserPlus size={14} aria-hidden="true" />
                Envoyer l’invitation
              </>
            )}
          </button>
        </form>

        <div className="p-5 sm:p-6" style={CARD}>
          <h2 className="text-[14px] font-bold mb-4" style={{ color: '#1a100d' }}>
            Rôles et permissions
          </h2>
          <ul className="flex flex-col gap-4">
            {(Object.keys(ROLE_DESC) as TeamMember['role'][]).map((r) => {
              const Icon = ROLE_ICON[r]
              return (
                <li key={r} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(174,88,55,.08)' }}
                    aria-hidden="true"
                  >
                    <Icon size={14} style={{ color: 'var(--copper)' }} />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold mb-0.5" style={{ color: '#1a100d' }}>{r}</p>
                    <p className="text-[11.5px] leading-relaxed" style={{ color: 'rgba(26,16,13,.5)' }}>
                      {ROLE_DESC[r]}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
