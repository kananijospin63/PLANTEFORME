// ============================================================
// lib/reference.ts — Générateur de référence d'inscription
// ============================================================
// Format : CLUBAI-AAAA-XXXX
// Exemple : CLUBAI-2026-0001
//
// La référence est unique. Le numéro séquentiel est calculé
// en comptant les inscriptions existantes + 1.
// Un retry est effectué en cas de collision (race condition).
// ============================================================

import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// Le préfixe ne doit contenir NI espace NI caractère spécial :
// il est utilisé dans le `startsWith` de comptage, dans la validation
// `isValidReference` et dans la regex du webhook Make.
const PREFIX = 'CLUBAI'
const MAX_RETRIES = 5

/**
 * Génère la prochaine référence disponible.
 * Format : CLUBAI-2026-0001
 */
export async function generateReference(): Promise<string> {
  const year = new Date().getFullYear()

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Compter les inscriptions de l'année en cours
      const count = await prisma.inscription.count({
        where: {
          reference: {
            startsWith: `${PREFIX}-${year}-`,
          },
        },
      })

      // Numéro séquentiel (1-indexed, padded sur 4 digits)
      const sequence = String(count + 1 + attempt).padStart(4, '0')
      const reference = `${PREFIX}-${year}-${sequence}`

      // Vérifier que cette référence n'existe pas déjà
      const existing = await prisma.inscription.findUnique({
        where: { reference },
        select: { id: true },
      })

      if (!existing) {
        return reference
      }

      logger.warn('Collision de référence, nouvel essai', {
        reference,
        attempt: attempt + 1,
      })
    } catch (error) {
      logger.server.error('generateReference', error)
      throw error
    }
  }

  // Fallback avec timestamp pour garantir l'unicité
  const ts = Date.now().toString().slice(-6)
  const year2 = new Date().getFullYear()
  return `${PREFIX}-${year2}-${ts}`
}

/**
 * Valide qu'une référence est au bon format.
 */
export function isValidReference(ref: string): boolean {
  return new RegExp(`^${PREFIX}-\\d{4}-\\d{4}$`).test(ref)
}

/**
 * Extrait l'année d'une référence.
 */
export function getYearFromReference(ref: string): number | null {
  const match = ref.match(new RegExp(`^${PREFIX}-(\\d{4})-`))
  return match ? parseInt(match[1], 10) : null
}
