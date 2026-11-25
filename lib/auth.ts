// ============================================================
// CLUB AI — Authentification (démo locale)
// ============================================================
// Ce module gère la session administrateur côté frontend.
// Il est volontairement simple : la session est un cookie signé
// « à la main » (base64url) contenant l'utilisateur et sa date
// d'expiration.
//
// ⚠️ À remplacer par une vraie authentification serveur
//    (NextAuth / JWT signé avec un secret + base de données)
//    avant toute mise en production.
// ============================================================

export const SESSION_COOKIE = 'clubai_session'

/** Durée de vie d'une session : 8 heures. */
export const SESSION_MAX_AGE = 60 * 60 * 8

export type Role = 'ADMIN' | 'FORMATEUR'

export interface SessionUser {
  sub: string
  name: string
  email: string
  role: Role
  poste: string
  /** Timestamp d'expiration (ms) */
  exp: number
}

export interface DemoAccount {
  email: string
  password: string
  name: string
  role: Role
  poste: string
}

/** Comptes de démonstration — affichés sur la page de connexion. */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'jovimcode@gmail.com',
    password: "c'estjovim+",
    name: 'CLUB AI',
    role: 'ADMIN',
    poste: 'Administrateur CLUB AI',
  },
  {
    email: 'formateur@club-ai.com',
    password: 'clubai2026',
    name: 'Kevin Nsengiyumva',
    role: 'FORMATEUR',
    poste: 'Formateur IA',
  },
]

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: 'Administrateur',
  FORMATEUR: 'Formateur',
}

// ------------------------------------------------------------
// Encodage / décodage du cookie de session (base64url + HMAC)
// ------------------------------------------------------------
// Le cookie est SIGNÉ (HMAC-SHA256) : un cookie fabriqué côté client
// est rejeté. On utilise l'API Web Crypto, disponible à la fois dans
// le runtime Node et dans le middleware (Edge).

const SESSION_SECRET =
  process.env.AUTH_SECRET?.trim() || 'club-ai-dev-only-secret'

function secretBytes(): Uint8Array {
  if (!process.env.AUTH_SECRET?.trim() && process.env.NODE_ENV === 'production') {
    console.warn(
      '[auth] AUTH_SECRET non défini : les sessions utilisent un secret de développement. ' +
        'Définissez AUTH_SECRET dans les variables d\'environnement.'
    )
  }
  return new TextEncoder().encode(SESSION_SECRET)
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return binary.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function toBase64Url(value: string): string {
  return bytesToBase64Url(new TextEncoder().encode(value))
}

function fromBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/** Signature HMAC-SHA256 du payload, encodée en base64url. */
async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    secretBytes(),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payload)
  )
  return bytesToBase64Url(new Uint8Array(signature))
}

/** Comparaison à temps constant (évite les attaques temporelles). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

/** Sérialise la session : `<payload>.<signature>` */
export async function encodeSession(user: SessionUser): Promise<string> {
  const payload = toBase64Url(JSON.stringify(user))
  const signature = await sign(payload)
  return `${payload}.${signature}`
}

/**
 * Vérifie la signature puis l'expiration.
 * Retourne null pour tout cookie absent, forgé, altéré ou expiré.
 */
export async function decodeSession(
  token: string | undefined | null
): Promise<SessionUser | null> {
  if (!token) return null

  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null

  try {
    const expected = await sign(payload)
    if (!safeEqual(signature, expected)) return null

    const parsed = JSON.parse(fromBase64Url(payload)) as SessionUser

    if (!parsed?.email || !parsed?.exp) return null
    if (parsed.exp < Date.now()) return null

    return parsed
  } catch {
    return null
  }
}

/** Vérifie les identifiants et renvoie la session correspondante. */
export function authenticate(email: string, password: string): SessionUser | null {
  const normalized = email.trim().toLowerCase()
  const account = DEMO_ACCOUNTS.find((a) => a.email === normalized)

  if (!account || account.password !== password) return null

  return {
    sub: account.email,
    name: account.name,
    email: account.email,
    role: account.role,
    poste: account.poste,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  }
}
