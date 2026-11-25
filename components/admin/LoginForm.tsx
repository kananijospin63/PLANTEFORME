'use client'

// ============================================================
// LoginForm — formulaire de connexion de l'espace admin
// ============================================================

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  Zap,
} from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Le paramètre `next` vient de l'URL : on n'accepte QUE des chemins
  // internes de l'espace admin (sinon redirection ouverte possible).
  const rawNext = searchParams.get('next') ?? ''
  const nextUrl = rawNext.startsWith('/admin') ? rawNext : '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        setError(json.message ?? 'Connexion impossible. Réessayez.')
        setLoading(false)
        return
      }

      router.replace(nextUrl)
      router.refresh()
    } catch {
      setError('Le serveur ne répond pas. Vérifiez votre connexion.')
      setLoading(false)
    }
  }

  const inputBase =
    'w-full h-12 rounded-xl text-sm transition-all outline-none placeholder:text-[#a89b90]'

  return (
    <div className="w-full max-w-[420px]">
      {/* Retour au site */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold mb-8 transition-colors hover:opacity-70"
        style={{ color: '#8a7a6d' }}
      >
        <ArrowLeft size={13} />
        Retour au site
      </Link>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
          style={{
            background: 'linear-gradient(135deg, #efc98c, #ae5837)',
            boxShadow: '0 4px 16px rgba(174,88,55,.35)',
          }}
          aria-hidden="true"
        >
          <Zap size={18} className="fill-current" style={{ color: '#1a100d' }} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col leading-none">
          <span
            className="text-[17px] tracking-tight"
            style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, color: '#1a100d' }}
          >
            CLUB <span style={{ color: '#ae5837' }}>AI</span>
          </span>
          <span
            className="mt-1"
            style={{
              fontSize: 9,
              color: 'rgba(26,16,13,.45)',
              fontWeight: 700,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
            }}
          >
            Espace administration
          </span>
        </div>
      </div>

      <h1
        className="text-[26px] leading-tight tracking-tight mb-2"
        style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, color: '#1a100d' }}
      >
        Se connecter
      </h1>
      <p className="text-sm mb-8" style={{ color: 'rgba(26,16,13,.55)' }}>
        Accédez au tableau de bord pour gérer les inscriptions, les
        formations et les participants.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-[11px] font-bold uppercase tracking-wider mb-2"
            style={{ color: 'rgba(26,16,13,.55)' }}
          >
            Adresse email
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'rgba(26,16,13,.3)' }}
              aria-hidden="true"
            />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@club-ai.com"
              className={inputBase}
              style={{
                paddingLeft: 44,
                paddingRight: 16,
                background: '#fff',
                border: '1px solid rgba(26,16,13,.12)',
                color: '#1a100d',
              }}
            />
          </div>
        </div>

        {/* Mot de passe */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="password"
              className="block text-[11px] font-bold uppercase tracking-wider"
              style={{ color: 'rgba(26,16,13,.55)' }}
            >
              Mot de passe
            </label>
            <span className="text-[11px]" style={{ color: 'rgba(26,16,13,.35)' }}>
              Oublié ? Contactez l’administrateur
            </span>
          </div>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'rgba(26,16,13,.3)' }}
              aria-hidden="true"
            />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputBase}
              style={{
                paddingLeft: 44,
                paddingRight: 48,
                background: '#fff',
                border: '1px solid rgba(26,16,13,.12)',
                color: '#1a100d',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors hover:bg-black/5"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? (
                <EyeOff size={16} style={{ color: 'rgba(26,16,13,.4)' }} />
              ) : (
                <Eye size={16} style={{ color: 'rgba(26,16,13,.4)' }} />
              )}
            </button>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 px-3.5 py-3 rounded-xl text-[13px]"
            style={{ background: 'rgba(161,58,47,.08)', border: '1px solid rgba(161,58,47,.2)', color: '#a13a2f' }}
          >
            <AlertCircle size={15} className="shrink-0 mt-0.5" aria-hidden="true" />
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold transition-all hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-1"
          style={{
            fontFamily: 'var(--font-unbounded)',
            background: 'linear-gradient(135deg,#efc98c,#ae5837)',
            color: '#1a100d',
            boxShadow: '0 4px 18px rgba(174,88,55,.35)',
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              Connexion…
            </>
          ) : (
            <>
              Accéder au tableau de bord
              <ArrowRight size={15} aria-hidden="true" />
            </>
          )}
        </button>
      </form>

      {/* Note de sécurité */}
      <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(26,16,13,.1)' }}>
        <p className="flex items-start gap-2 text-[11px] leading-relaxed" style={{ color: 'rgba(26,16,13,.42)' }}>
          <ShieldCheck size={13} className="shrink-0 mt-0.5" aria-hidden="true" />
          Accès strictement réservé à l’équipe CLUB AI. Les identifiants sont
          fournis par l’administrateur.
        </p>
      </div>
    </div>
  )
}
