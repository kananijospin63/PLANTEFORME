// ============================================================
// lib/logger.ts — Système de logging centralisé
// ============================================================
// RÈGLE : Ne jamais logger de données sensibles
//         (mots de passe, tokens, données bancaires).
// Les emails et noms sont loggés sous forme tronquée.
// ============================================================

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  timestamp: string
}

// ── Helpers de masquage ──────────────────────────────────────

/**
 * Masque partiellement un email pour les logs.
 * "jean.dupont@gmail.com" → "je***@gmail.com"
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return '***@***'
  return `${local.slice(0, 2)}***@${domain}`
}

/**
 * Masque partiellement un téléphone.
 * "+257771657" → "+257***657"
 */
export function maskPhone(phone: string): string {
  if (phone.length < 6) return '***'
  return `${phone.slice(0, 4)}***${phone.slice(-3)}`
}

// ── Formatage ────────────────────────────────────────────────

function format(entry: LogEntry): string {
  const ctx = entry.context
    ? ` | ${JSON.stringify(entry.context)}`
    : ''
  return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${ctx}`
}

function createEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>
): LogEntry {
  return {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  }
}

// ── Logger public ────────────────────────────────────────────

export const logger = {
  info(message: string, context?: Record<string, unknown>) {
    const entry = createEntry('info', message, context)
    console.log(format(entry))
  },

  warn(message: string, context?: Record<string, unknown>) {
    const entry = createEntry('warn', message, context)
    console.warn(format(entry))
  },

  error(message: string, context?: Record<string, unknown>) {
    const entry = createEntry('error', message, context)
    console.error(format(entry))
  },

  debug(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'development') {
      const entry = createEntry('debug', message, context)
      console.debug(format(entry))
    }
  },

  // ── Événements métier ──────────────────────────────────────

  inscription: {
    created(reference: string, formationSlug: string, emailMasked: string) {
      logger.info('Nouvelle inscription créée', {
        reference,
        formation: formationSlug,
        email: emailMasked,
      })
    },
    duplicate(formationSlug: string, emailMasked: string) {
      logger.warn('Tentative d\'inscription en doublon', {
        formation: formationSlug,
        email: emailMasked,
      })
    },
    makeError(reference: string, error: string) {
      logger.error('Échec envoi Make webhook', { reference, error })
    },
    makeSent(reference: string) {
      logger.info('Make webhook envoyé avec succès', { reference })
    },
  },

  validation: {
    error(path: string, message: string) {
      logger.warn('Erreur de validation', { path, message })
    },
  },

  server: {
    error(route: string, error: unknown) {
      const message =
        error instanceof Error ? error.message : String(error)
      logger.error('Erreur serveur interne', { route, error: message })
    },
  },
}

export default logger
